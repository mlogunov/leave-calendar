import { ILeaveType } from "../ILeaveType";

export interface ICalendarCellProps extends ILeaveType {
    className?: string;
    value: number | string;
    weekend: boolean;
};