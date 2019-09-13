import * as React from 'react';
import { ILeaveCalendarProps } from './ILeaveCalendarProps';
import { LeaveCalendarComponent } from './LeaveCalendarComponent';
import { ILeaveCalendarState } from './ILeaveCalendarState';
import { Log, Environment, EnvironmentType } from '@microsoft/sp-core-library';
import { IListItemCollection, IListItem } from './IListItem';
import MockHttpClient from '../MockHttpClient';

export default class LeaveCalendar extends React.Component < ILeaveCalendarProps, ILeaveCalendarState > {
  constructor(props: ILeaveCalendarProps, state: ILeaveCalendarState){
    super(props);
    this.state = {
        date: new Date(),
        items: {value: []}
      }
    this.onDateChanged = this.onDateChanged.bind(this);
  }
  private onDateChanged(newDate: Date): void {
    this.setState({date: newDate});
  }
  private getMockListData(): Promise<IListItemCollection> {
    return MockHttpClient.get()
      .then((data: IListItem[]) => {
        var listData: IListItemCollection = { value: data };
        return listData;
      }) as Promise<IListItemCollection>;
  }
  private getLeaveCalendatListData(): Promise<IListItemCollection> {
    return MockHttpClient.get()
      .then((data: IListItem[]) => {
        var listData: IListItemCollection = { value: data };
        return listData;
      }) as Promise<IListItemCollection>;
  }
  private getData(): void {
    // Local environment
    if (Environment.type === EnvironmentType.Local) {
      this.getMockListData().then((response) => {
        this.setState({items: response});
      });
    }
    else if (Environment.type == EnvironmentType.SharePoint || 
              Environment.type == EnvironmentType.ClassicSharePoint) {
      this.getLeaveCalendatListData()
        .then((response) => {
          console.log(response);
        });
    }
  }
  public componentDidMount() {
    this.getData();
  }
  public componentWillUnmount() {

  }
  public render(): React.ReactElement<ILeaveCalendarProps> {
    return(
      <LeaveCalendarComponent 
        date={this.state.date}
        onDateChange = {this.onDateChanged}
        items = {this.state.items}
      />
    );
  }
}
