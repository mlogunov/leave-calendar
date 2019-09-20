import { ILeaveCalendarItem } from "./ILeaveCalendarItem";
import { ILeaveType } from "../../model/ILeaveType";

export interface ILeaveCalendarComponentProps{
    date: Date;
    items: ILeaveCalendarItem[];
    leaveTypes?: ILeaveType[];
    onDateChange(date: Date): void;
    loading: boolean;
}