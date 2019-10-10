import { ILeaveCalendarItem } from "./ILeaveCalendarItem";
import { ILeaveType } from "../../../../models/ILeaveType";
import { IFormFields } from "../../../../models/IFormFields";
import { IPeriod } from "../../../../models/IPeriod";

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