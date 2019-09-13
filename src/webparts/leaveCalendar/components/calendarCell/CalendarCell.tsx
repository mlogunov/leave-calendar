import * as React from 'react';
import { ICalendarCellProps } from './ICalendarCellProps';
import { TooltipHost } from 'office-ui-fabric-react';

export const CalendarCell: React.StatelessComponent<ICalendarCellProps> = (props: ICalendarCellProps): React.ReactElement<ICalendarCellProps> => {
    return (
        <div className={props.className} style={{backgroundColor: props.weekend ? '#f5f5f5': 'none'}}>
            <TooltipHost content={props.title}>
                <span style={{backgroundColor: props.bgColor}}>{props.value}</span>
            </TooltipHost>
        </div>
            
    );
}