import * as React from 'react';
import { ILeaveCalendarProps } from './ILeaveCalendarProps';
import { LeaveCalendarComponent } from './LeaveCalendarComponent';
import { ILeaveCalendarState } from './ILeaveCalendarState';

export default class LeaveCalendar extends React.Component < ILeaveCalendarProps, ILeaveCalendarState > {
  constructor(props: ILeaveCalendarProps, state: ILeaveCalendarState){
    super(props);
    this.state = {
      date: new Date()
        }
  }
  public render(): React.ReactElement<ILeaveCalendarProps> {
    return(
      <LeaveCalendarComponent 
        date={this.state.date}
      />
    );
  }
}
