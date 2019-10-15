import { ILeaveType } from "../../../../models/ILeaveType";
import { ILeaveCalendarItem } from "../leaveCalendar/ILeaveCalendarItem";

export interface ICalendarCellProps{
    value: number | string;
    weekend: boolean;
    isButton: boolean;
    leaveType?: ILeaveType;
    item?: ILeaveCalendarItem;
    onEditClick?(): void;
    onShowDeleteDialog?(): void;
    onDeleteClick?(): void;
};