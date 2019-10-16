import * as React from 'react';
import { ILeaveCalendarProps } from './ILeaveCalendarProps';
import { LeaveCalendarComponent } from './LeaveCalendarComponent';
import { ILeaveCalendarState } from './ILeaveCalendarState';
import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
import { IListItem } from '../../../../models/IListItem';
import MockHttpClient from '../../../../services/MockHttpClient';
import { ILeaveCalendarItem } from './ILeaveCalendarItem';
import * as _ from 'lodash';
import { ILeaveType } from '../../../../models/ILeaveType';
import { IFormFields } from '../../../../models/IFormFields';
import { IPeriod } from '../../../../models/IPeriod';
import "@pnp/polyfill-ie11";
import SPServices from '../../../../services/SPServices';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react';
import {ErrorMessage} from 'LeaveCalendarWebPartStrings';


export default class LeaveCalendarContainer extends React.Component < ILeaveCalendarProps, ILeaveCalendarState > {
  private _currentUserId: number;
  private _spService: SPServices;
  private _leaveTypes: ILeaveType[] = [];
  constructor(props: ILeaveCalendarProps){
    super(props);
    this.state = {
        date: new Date(new Date().getFullYear(), new Date().getMonth()),
        items: [],
        filter: '',
        loading: false,
        showPanel: false,
        formData: {dateFrom: null, dateTo: null, leaveTypeId: null},
        isFormValid: true,
        isFormSubmitButtonDisabled: false,
        hasError: false,
        errorMessage: ''
      }
    this._spService = new SPServices(this.props.context);
    this._onDateChanged = this._onDateChanged.bind(this);
    this._onFormDataChange = this._onFormDataChange.bind(this);
    this._showPanel = this._showPanel.bind(this);
    this._hidePanel = this._hidePanel.bind(this);
    this._onSubmitPanel = this._onSubmitPanel.bind(this);
    this._onDeleteItem = this._onDeleteItem.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
  }

  private _onDateChanged(newDate: Date): void {
    this.setState({date: newDate}, ()=>this._getData());
  }
  private _onFormDataChange(value: Date | number, field: IFormFields): void{
    switch(field){
      case IFormFields.dateFrom:
        this.setState((prevState)=>{
          return {formData: {dateFrom: value, dateTo: prevState.formData.dateTo, leaveTypeId: prevState.formData.leaveTypeId, itemId: prevState.formData.itemId}}
        });
        break;
      case IFormFields.dateTo:
        this.setState((prevState)=>{
          return {formData: {dateFrom: prevState.formData.dateFrom, dateTo: value, leaveTypeId: prevState.formData.leaveTypeId, itemId: prevState.formData.itemId}}
        });
        break;
      case IFormFields.leaveType:
        this.setState((prevState)=>{
          return {formData: {dateFrom: prevState.formData.dateFrom, dateTo: prevState.formData.dateTo, leaveTypeId: value, itemId: prevState.formData.itemId}}
        });
        break;
    }
  }

  private _onFilterChange(newValue: string): void {
    this.setState({filter: newValue})
  }

  private _showPanel(id?: number): void {
    if(id){
      const item: ILeaveCalendarItem = {...this.state}.items.filter((item: ILeaveCalendarItem) => item.id == id)[0];
      this.setState({
        showPanel: true,
        formData: {dateFrom: item.leave.dateFrom, dateTo: item.leave.dateTo, leaveTypeId: item.leave.leaveTypeId, itemId: item.id}
      });
    }
    else{
      this.setState({showPanel: true})
    }
  }
  private _hidePanel(): void {
    this.setState({
      showPanel: false,
      isFormValid: true,
      formData: {dateFrom: null, dateTo: null, leaveTypeId: null, itemId: undefined},
    })
  }
  private async _onSubmitPanel(): Promise<void> {
    this.setState({isFormSubmitButtonDisabled: true});
    try{
      const formData: IPeriod = this.state.formData;
      const isValid = Object.keys(formData).every((key: string)=>formData[key] !== null);
      if(isValid) {
        const dateFrom: Date = this.state.formData.dateFrom;
        const dateTo: Date = this.state.formData.dateTo;
        const leaveTypeId: number = this.state.formData.leaveTypeId;
        const itemId: number = this.state.formData.itemId;
        if(itemId){
          await this._spService.updateItem(itemId, dateFrom, dateTo, leaveTypeId);
        }
        else{
          await this._spService.addNewItem(dateFrom, dateTo, leaveTypeId);
        }
        this.setState(
          {
            showPanel: false, 
            isFormValid: true, 
            formData: {dateFrom: null, dateTo: null, leaveTypeId: null, itemId: undefined},
            isFormSubmitButtonDisabled: false
          }, ()=>this._getData());
      }
      else
        this.setState({isFormValid: isValid, isFormSubmitButtonDisabled: false})
    }
    catch(error){
      this.setState({ 
        showPanel: false,
        hasError: true, 
        errorMessage: error.message,
        isFormValid: true,
        isFormSubmitButtonDisabled: false,
        formData: {dateFrom: null, dateTo: null, leaveTypeId: null},
      });
    }

  }

  private async _onDeleteItem(id: number): Promise<void> {
    try{
      await this._spService.deleteItem(id);
      this._getData();
    }
    catch(error){
      this.setState({ 
        hasError: true, 
        errorMessage: error.message
      });
    }
  }

  private async _getLeaveTypes(): Promise<ILeaveType[]> {
    try{
      if (Environment.type === EnvironmentType.Local) {
        return await MockHttpClient.getLeaveTypes();
      }
      else if (Environment.type == EnvironmentType.SharePoint || Environment.type == EnvironmentType.ClassicSharePoint) {
        return await this._spService.getLeaveTypesListItems();
      }
    }
    catch(error){
      this.setState({ hasError: true, errorMessage: error.message, loading: false });
    }
  }

  private async _getCurrentUserId(): Promise<number> {
    try{
      if (Environment.type === EnvironmentType.Local) {
        return await MockHttpClient.getCurrentUserId();
      }
      else if (Environment.type == EnvironmentType.SharePoint || Environment.type == EnvironmentType.ClassicSharePoint) {
        return await this._spService.getCurrentUserId();
      }
    }
    catch(error){
      this.setState({ hasError: true, errorMessage: error.message, loading: false });
    }
  }

  private async _getData(): Promise<void> {
    this.setState({loading: true});
    try {
      let leaveCalendarItems: ILeaveCalendarItem[] = [];
      let listItems: IListItem[] = [];
      // Local environment
      if (Environment.type === EnvironmentType.Local) {
        listItems = await MockHttpClient.getItems();

        if(listItems && listItems.length > 0){
          for(const item of listItems){
            leaveCalendarItems.push(
              {
                id: item.id,
                employee: await MockHttpClient.getEmployeeById(item.authorId),
                leave: {dateFrom: item.dateFrom, dateTo: item.dateTo, leaveTypeId: item.leaveTypeId}
              }
            )
          }
        }
      }
      //SharePoint environment
      else if (Environment.type == EnvironmentType.SharePoint || Environment.type == EnvironmentType.ClassicSharePoint) {
        const startDate: string = this.state.date.toISOString();
        const endDate: string = new Date(this.state.date.getFullYear(), this.state.date.getMonth() + 1, 0).toISOString();
        listItems = await this._spService.getLeaveCalendarListItems(startDate, endDate);

        if(listItems && listItems.length > 0){
          for(const item of listItems){
            leaveCalendarItems.push(
              {
                id: item.id,
                employee: await this._spService.getEmployeeById(item.authorId),
                leave: {dateFrom: item.dateFrom, dateTo: item.dateTo, leaveTypeId: item.leaveTypeId}
              }
            )
          }
        }
      }

      this.setState({items: leaveCalendarItems, loading: false});
    }
    catch(error){
      this.setState({ hasError: true, errorMessage: error.message, loading: false });
    }

  }
  public async componentDidMount() {
    this.setState({loading: true});
    this._leaveTypes = await this._getLeaveTypes();
    this._currentUserId = await this._getCurrentUserId();
    this._getData();
  }
  public componentWillUnmount() {

  }
  public render(): React.ReactElement<ILeaveCalendarProps> {
    const filteredItems: ILeaveCalendarItem[] = this.state.items.filter((item: ILeaveCalendarItem) => {
      return item.employee.title.toLowerCase().indexOf(this.state.filter.toLowerCase()) !== -1
    });
    return(
      // test if has errors
      this.state.hasError ?
      <MessageBar messageBarType={MessageBarType.error}>
        <h1>{ErrorMessage}</h1>
        <p>{this.state.errorMessage}</p>  
      </MessageBar>
      :
      // show Calendar
      <LeaveCalendarComponent 
        currentUserId={this._currentUserId}
        date={this.state.date}
        onDateChange = {this._onDateChanged}
        filter = {this.state.filter}
        onFilterChange = {this._onFilterChange}
        items = {filteredItems}
        leaveTypes = {this._leaveTypes}
        loading = {this.state.loading}
        showPanel = {this.state.showPanel}
        onShowPanel = {this._showPanel}
        onHidePanel = {this._hidePanel}
        onSubmitPanel = {this._onSubmitPanel}
        onDeleteItem = {this._onDeleteItem}
        onFormDataChange = {this._onFormDataChange}
        formValue = {this.state.formData}
        isFormValid = {this.state.isFormValid}
        isFormSubmitButtonDisabled = {this.state.isFormSubmitButtonDisabled}
      />
    );
  }
}
