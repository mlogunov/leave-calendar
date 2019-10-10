import { ILeaveType } from "../../../../models/ILeaveType";

export interface ICalendarCellProps{
    value: number | string;
    weekend: boolean;
    leaveType?: ILeaveType;
};