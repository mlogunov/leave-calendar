import { ILeaveCalendarItem } from "./ILeaveCalendarItem";
import { IPeriod } from "../../model/IPeriod";

export interface ILeaveCalendarState {
    date: Date;
    items: ILeaveCalendarItem[];
    loading: boolean;
    showPanel: boolean;
    formData: IPeriod;
    isFormValid: boolean;
    isFormSubmitButtonDisabled: boolean;
}