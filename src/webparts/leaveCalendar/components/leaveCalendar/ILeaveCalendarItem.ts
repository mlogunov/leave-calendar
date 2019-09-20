import { IPeriod } from "../../model/IPeriod";
import { IEmployee } from "../../model/IEmployee";

export interface ILeaveCalendarItem{
    id: number;
    employee: IEmployee;
    leave: IPeriod;
}