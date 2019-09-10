import * as React from 'react';
import { ILeaveCalendarProps } from './ILeaveCalendarProps';
import { LeaveCalendarComponent } from './LeaveCalendarComponent';
import { ILeaveCalendarState } from './ILeaveCalendarState';
import { Log } from '@microsoft/sp-core-library';

export default class LeaveCalendar extends React.Component < ILeaveCalendarProps, ILeaveCalendarState > {
  constructor(props: ILeaveCalendarProps, state: ILeaveCalendarState){
    super(props);
    this.state = {
      date: new Date()
        }
    this.onDateChanged = this.onDateChanged.bind(this);
  }
  private onDateChanged(newDate: Date): void {
    this.setState({date: newDate});
  }
  public render(): React.ReactElement<ILeaveCalendarProps> {
    return(
      <LeaveCalendarComponent 
        date={this.state.date}
        onDateChange = {this.onDateChanged}
      />
    );
  }
}
