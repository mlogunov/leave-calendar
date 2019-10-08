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
import "@pnp/polyfill-ie11";
import { sp, ItemAddResult } from "@pnp/sp";

export default class LeaveCalendar extends React.Component < ILeaveCalendarProps, ILeaveCalendarState > {
  private _leaveTypes: ILeaveType[] = [];
  constructor(props: ILeaveCalendarProps, state: ILeaveCalendarState){
    super(props);
    this.state = {
        date: new Date(new Date().getFullYear(), new Date().getMonth()),
        items: [],
        loading: false,
        showPanel: false,
        formData: {dateFrom: null, dateTo: null, leaveTypeId: null},
        isFormValid: true,
        isFormSubmitButtonDisabled: false
      }
    this._onDateChanged = this._onDateChanged.bind(this);
    this._onFormDataChange = this._onFormDataChange.bind(this);
    this._showPanel = this._showPanel.bind(this);
    this._hidePanel = this._hidePanel.bind(this);
    this._onSubmitPanel = this._onSubmitPanel.bind(this);
  }

  private _onDateChanged(newDate: Date): void {
    this.setState({date: newDate}, ()=>this._getData());
    //this._getData();
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
    this.setState({isFormSubmitButtonDisabled: true})
    const formData: IPeriod = this.state.formData;
    const isValid = Object.keys(formData).every((key: string)=>formData[key] !== null);
    if(isValid) 
      this._addNewItem();
    else
      this.setState({isFormValid: isValid, isFormSubmitButtonDisabled: false})
  }

  private _addNewItem(): void{
    const dateFrom: Date = this.state.formData.dateFrom;
    const dateTo: Date = this.state.formData.dateTo;
    const leaveTypeId: number = this.state.formData.leaveTypeId;
    sp.web.lists.getByTitle('LeaveCalendar').items.add(
      {
        DateFrom: dateFrom,
        DateTo: dateTo,
        LeaveTypeId: leaveTypeId
      }
    ).then((iar: ItemAddResult) => {
      console.log(iar)
      this.setState(
        {
          showPanel: false, 
          isFormValid: true, 
          formData: {dateFrom: null, dateTo: null, leaveTypeId: null},
          isFormSubmitButtonDisabled: false
        }, ()=>this._getData());
    })
  }

  private async _getMockLeaveTypes(): Promise<ILeaveType[]> {
    let _results: ILeaveType[];
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

  private async _getLeaveTypesListData(): Promise<ILeaveType[]> {
    let _results: ILeaveType[];
    try
    {
      _results = await sp.web.lists.getByTitle('LeaveTypes').items.getAll();
      _results = _results.map((result: any): ILeaveType => {
        return {id: result.ID, title: result.Title, bgColor: result.BgColor}
      });
      return _results;
    }
    catch(error)
    {
      console.dir(error);
      Promise.reject(error);
    }
  }
  
  private async _getMockListData(): Promise<IListItem[]> {
    let _results: IListItem[];
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

  private async _getLeaveCalendatListData(): Promise<IListItem[]> {
    let _results: IListItem[];
    try
    {
      const startDate: string = this.state.date.toISOString();
      const endDate: string = new Date(this.state.date.getFullYear(), this.state.date.getMonth() + 1, 0).toISOString();
      const filter: string = `DateFrom le datetime'${endDate}' and DateTo ge datetime'${startDate}'`;
      _results = await sp.web.lists.getByTitle('LeaveCalendar').items.filter(encodeURI(filter)).get();
      _results = _results.map((result: any): IListItem =>{
        return {id: result.ID, dateFrom: new Date(result.DateFrom), dateTo: new Date(result.DateTo), leaveTypeId:result.LeaveTypeId, authorId: result.AuthorId}
      });
      return _results;
    }
    catch(error)
    {
      console.dir(error);
      Promise.reject(error);
    }
  }
 
  private async _getEmployeeById(employeeId: number): Promise<IEmployee> {
    if (Environment.type === EnvironmentType.Local) {
      return await MockHttpClient.getEmployeeById(employeeId);
    }
    else if (Environment.type == EnvironmentType.SharePoint || Environment.type == EnvironmentType.ClassicSharePoint) {
      const user: any = await sp.web.siteUsers.getById(employeeId).get();
      const jobTitle: string = await sp.profiles.getUserProfilePropertyFor(user.LoginName, 'SPS-JobTitle')
      return {id: employeeId, title: user.Title, position: jobTitle}
    }
  }

  private async _getData() {
    this.setState({loading: true});
    let leaveCalendarItems: ILeaveCalendarItem[] = [];
    let listItems: IListItem[] = [];
    // Local environment
    if (Environment.type === EnvironmentType.Local) {
      listItems = await this._getMockListData();
      this._leaveTypes = await this._getMockLeaveTypes();
    }
    else if (Environment.type == EnvironmentType.SharePoint || Environment.type == EnvironmentType.ClassicSharePoint) {
      listItems = await this._getLeaveCalendatListData();
      this._leaveTypes = await this._getLeaveTypesListData();
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
        isFormSubmitButtonDisabled = {this.state.isFormSubmitButtonDisabled}
      />
    );
  }
}
