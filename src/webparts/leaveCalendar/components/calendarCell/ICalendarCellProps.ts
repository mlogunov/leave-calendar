import { ILeaveType } from "../../model/ILeaveType";

export interface ICalendarCellProps{
    value: number | string;
    weekend: boolean;
    leaveType?: ILeaveType;
};