import { IPersonaProps } from "office-ui-fabric-react";
import { ILeaveType } from "./ILeaveType";

export interface IListItemCollection {
    value: IListItem[];
}
export interface IListItem {
    id: number;
    persona: IPersonaProps;
    dateFrom: Date;
    dateTo: Date;
    leaveType: ILeaveType;
}