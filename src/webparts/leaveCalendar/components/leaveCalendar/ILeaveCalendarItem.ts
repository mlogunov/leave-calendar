import { IPeriod } from "../../../../models/IPeriod";
import { IEmployee } from "../../../../models/IEmployee";

export interface ILeaveCalendarItem{
    id: number;
    employee: IEmployee;
    leave: IPeriod;
}