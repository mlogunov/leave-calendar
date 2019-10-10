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


export default class LeaveCalendar extends React.Component < ILeaveCalendarProps, ILeaveCalendarState > {
  private _spService: SPServices = null;
  private _leaveTypes: ILeaveType[] = [];
  constructor(props: ILeaveCalendarProps){
    super(props);
    this.state = {
        date: new Date(new Date().getFullYear(), new Date().getMonth()),
        items: [],
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
  }

  private _onDateChanged(newDate: Date): void {
    this.setState({date: newDate}, ()=>this._getData());
  }
  private _onFormDataChange(value: Date | number, field: IFormFields): void{
    switch(field){
      case IFormFields.dateFrom:
        this.setState((prevState)=>{
          return {formData: {dateFrom: value, dateTo: prevState.formData.dateTo, leaveTypeId: prevState.formData.leaveTypeId}}
        });
        break;
      case IFormFields.dateTo:
        this.setState((prevState)=>{
          return {formData: {dateFrom: prevState.formData.dateFrom, dateTo: value, leaveTypeId: prevState.formData.leaveTypeId}}
        });
        break;
      case IFormFields.leaveType:
        this.setState((prevState)=>{
          return {formData: {dateFrom: prevState.formData.dateFrom, dateTo: prevState.formData.dateTo, leaveTypeId: value}}
        });
        break;
    }
  }
  private _showPanel(): void {
    this.setState({showPanel: true})
  }
  private _hidePanel(): void {
    this.setState({showPanel: false})
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
        await this._spService.addNewItem(dateFrom, dateTo, leaveTypeId);
        this.setState(
          {
            showPanel: false, 
            isFormValid: true, 
            formData: {dateFrom: null, dateTo: null, leaveTypeId: null},
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

  private async _getData(): Promise<void> {
    this.setState({loading: true});
    try {
      let leaveCalendarItems: ILeaveCalendarItem[] = [];
      let listItems: IListItem[] = [];
      // Local environment
      if (Environment.type === EnvironmentType.Local) {
        listItems = await MockHttpClient.getItems();
        this._leaveTypes = await MockHttpClient.getLeaveTypes();

        if(listItems && listItems.length > 0){
          for(const item of listItems){
            leaveCalendarItems.push(
              {
                id: item.authorId,
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
        this._leaveTypes = await this._spService.getLeaveTypesListItems();

        if(listItems && listItems.length > 0){
          for(const item of listItems){
            leaveCalendarItems.push(
              {
                id: item.authorId,
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
  public componentDidMount() {
    this._getData();
  }
  public componentWillUnmount() {

  }
  public render(): React.ReactElement<ILeaveCalendarProps> {
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
        date={this.state.date}
        onDateChange = {this._onDateChanged}
        items = {this.state.items}
        leaveTypes = {this._leaveTypes}
        loading = {this.state.loading}
        showPanel = {this.state.showPanel}
        onShowPanel = {this._showPanel}
        onHidePanel = {this._hidePanel}
        onSubmitPanel = {this._onSubmitPanel}
        onFormDataChange = {this._onFormDataChange}
        formValue = {this.state.formData}
        isFormValid = {this.state.isFormValid}
        isFormSubmitButtonDisabled = {this.state.isFormSubmitButtonDisabled}
      />
    );
  }
}
