import { ILeaveType } from "../../../../models/ILeaveType";
import { IPeriod } from "../../../../models/IPeriod";
import { IFormFields } from "../../../../models/IFormFields";

export interface IFormPanelProps {
    showPanel: boolean;
    leaveTypes: ILeaveType[];
    onSubmit(): void;
    onHidePanel(): void;
    onDataChange(value: Date | number, field: IFormFields): void;
    value: IPeriod;
    isValid: boolean;
    isSubmitButtonDisabled: boolean;
}