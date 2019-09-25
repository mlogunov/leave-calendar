import { ILeaveType } from "../../model/ILeaveType";
import { FormEvent } from "react";
import { IPeriod } from "../../model/IPeriod";
import { IFormFields } from "../../model/IFormFields";

export interface IFormPanelProps {
    showPanel: boolean;
    leaveTypes: ILeaveType[];
    onSubmit(): void;
    onHidePanel(): void;
    onDataChange(value: Date | number, field: IFormFields): void;
    value: IPeriod;
    isValid: boolean;
}