import { ILeaveCalendarItem } from "./ILeaveCalendarItem";
import { IPeriod } from "../../../../models/IPeriod";

export interface ILeaveCalendarState {
    date: Date;
    items: ILeaveCalendarItem[];
    loading: boolean;
    showPanel: boolean;
    formData: IPeriod;
    isFormValid: boolean;
    isFormSubmitButtonDisabled: boolean;
    hasError: boolean;
    errorMessage: string;
}