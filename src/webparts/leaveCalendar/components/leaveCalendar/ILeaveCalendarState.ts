import { ILeaveCalendarItem } from "./ILeaveCalendarItem";

export interface ILeaveCalendarState {
    date: Date;
    items: ILeaveCalendarItem[];
    loading: boolean;
}