import { ILeaveCalendarItem } from "./ILeaveCalendarItem";
import { ILeaveType } from "../../model/ILeaveType";
import { IFormFields } from "../../model/IFormFields";
import { IPeriod } from "../../model/IPeriod";

export interface ILeaveCalendarComponentProps{
    date: Date;
    items: ILeaveCalendarItem[];
    leaveTypes?: ILeaveType[];
    onDateChange(date: Date): void;
    loading: boolean;
    showPanel: boolean;
    onShowPanel(): void;
    onHidePanel(): void;
    onSubmitPanel(): void;
    onFormDataChange(value: Date | number, field: IFormFields): void;
    formValue: IPeriod;
    isFormValid: boolean;
    isFormSubmitButtonDisabled: boolean;
}