import { IListItemCollection } from "./IListItem";

export interface ILeaveCalendarComponentProps{
    date: Date;
    items: IListItemCollection;
    onDateChange(date: Date): void;
}