import * as React from 'react';
import { ILeaveCalendarProps } from './ILeaveCalendarProps';
import { LeaveCalendarComponent } from './LeaveCalendarComponent';
import { ILeaveCalendarState } from './ILeaveCalendarState';
import { Log, Environment, EnvironmentType } from '@microsoft/sp-core-library';
import { IListItem } from '../../model/IListItem';
import MockHttpClient from '../../MockHttpClient';
import { ILeaveCalendarItem } from './ILeaveCalendarItem';
import * as _ from 'lodash';
import { IEmployee } from '../../model/IEmployee';
import { ILeaveType } from '../../model/ILeaveType';
import { IFormFields } from '../../model/IFormFields';
import { IPeriod } from '../../model/IPeriod';

export default class LeaveCalendar extends React.Component < ILeaveCalendarProps, ILeaveCalendarState > {
  private _leaveTypes: ILeaveType[] = [];
  constructor(props: ILeaveCalendarProps, state: ILeaveCalendarState){
    super(props);
    this.state = {
        date: new Date(),
        items: [],
        loading: false,
        showPanel: false,
        formData: {dateFrom: null, dateTo: null, leaveTypeId: null},
        isFormValid: true
      }
    this._onDateChanged = this._onDateChanged.bind(this);
    this._onFormDataChange = this._onFormDataChange.bind(this);
    this._showPanel = this._showPanel.bind(this);
    this._hidePanel = this._hidePanel.bind(this);
    this._onSubmitPanel = this._onSubmitPanel.bind(this);
  }

  private _onDateChanged(newDate: Date): void {
    this.setState({date: newDate});
  }
  private _onFormDataChange(value: Date | number, field: IFormFields): void{
    switch(field){
      case IFormFields.dateFrom:
        this.setState((prevState, props)=>{
          return {formData: {dateFrom: value, dateTo: prevState.formData.dateTo, leaveTypeId: prevState.formData.leaveTypeId}}
        });
        break;
      case IFormFields.dateTo:
        this.setState((prevState, props)=>{
          return {formData: {dateFrom: prevState.formData.dateFrom, dateTo: value, leaveTypeId: prevState.formData.leaveTypeId}}
        });
        break;
      case IFormFields.leaveType:
        this.setState((prevState, props)=>{
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
  private _onSubmitPanel(): void {
    const formData: IPeriod = this.state.formData;
    const isValid = Object.keys(formData).every((key: string)=>formData[key] !== null);
    this.setState({isFormValid: isValid})
  }
  private async _getMockListData(): Promise<IListItem[]> {
    let _results;
    try
    {
      _results = await MockHttpClient.getItems();
      return _results;
    }
    catch(error)
    {
      console.dir(error);
      Promise.reject(error);
    }
  }

  private async _getLeaveTypes(): Promise<ILeaveType[]> {
    let _results;
    try
    {
      _results = await MockHttpClient.getLeaveTypes();
      return _results;
    }
    catch(error)
    {
      console.dir(error);
      Promise.reject(error);
    }
  }
  /*
  private _getLeaveCalendatListData(): Promise<IListItemCollection> {
    return MockHttpClient.getItems()
      .then((data: IListItem[]) => {
        const listData: IListItemCollection = { value: data };
        return listData;
      }) as Promise<IListItemCollection>;
  }
 */
  private async _getEmployeeById(employeeId: number): Promise<IEmployee> {
    return await MockHttpClient.getEmployeeById(employeeId);
  }

  private async _getData() {
    this.setState({loading: true});
    let leaveCalendarItems: ILeaveCalendarItem[] = [];
    let listItems: IListItem[] = [];
    // Local environment
    if (Environment.type === EnvironmentType.Local) {
      listItems = await this._getMockListData();
      this._leaveTypes = await this._getLeaveTypes();
    }
    else if (Environment.type == EnvironmentType.SharePoint || 
              Environment.type == EnvironmentType.ClassicSharePoint) {
      
    }
    if(listItems && listItems.length > 0){
      for(const item of listItems){
        leaveCalendarItems.push(
          {
            id: item.authorId,
            employee: await this._getEmployeeById(item.authorId),
            leave: {dateFrom: item.dateFrom, dateTo: item.dateTo, leaveTypeId: item.leaveTypeId}
          }
        )
      }
    }
    this.setState({items: leaveCalendarItems, loading: false});

   
  }
  public componentDidMount() {
    this._getData();
  }
  public componentWillUnmount() {

  }
  public render(): React.ReactElement<ILeaveCalendarProps> {
    console.log(this.state)
    return(
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
      />
    );
  }
}
