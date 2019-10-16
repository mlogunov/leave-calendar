import { ILeaveCalendarItem } from "./ILeaveCalendarItem";
import { ILeaveType } from "../../../../models/ILeaveType";
import { IFormFields } from "../../../../models/IFormFields";
import { IPeriod } from "../../../../models/IPeriod";

export interface ILeaveCalendarComponentProps{
    currentUserId: number;
    date: Date;
    filter: string;
    items: ILeaveCalendarItem[];
    leaveTypes: ILeaveType[];
    onDateChange(date: Date): void;
    loading: boolean;
    showPanel: boolean;
    onShowPanel(id?: number): void;
    onHidePanel(): void;
    onSubmitPanel(): void;
    onDeleteItem(id: number): void;
    onFormDataChange(value: Date | number, field: IFormFields): void;
    onFilterChange(newValue: string): void;
    formValue: IPeriod;
    isFormValid: boolean;
    isFormSubmitButtonDisabled: boolean;
}