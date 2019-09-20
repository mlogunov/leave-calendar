import * as React from 'react';
import { ICalendarCellProps } from './ICalendarCellProps';
import { TooltipHost } from 'office-ui-fabric-react';
import styles from './CalendatCell.module.scss';

export const CalendarCell: React.StatelessComponent<ICalendarCellProps> = (props: ICalendarCellProps): React.ReactElement<ICalendarCellProps> => {
    if(props.leaveType){
        return (
            <div className={styles.calendarCell} style={{backgroundColor: props.leaveType.bgColor? props.leaveType.bgColor: props.weekend ? '#f5f5f5': 'inherit'}}>           
                <TooltipHost content={props.leaveType.title}>
                    <span>{props.value}</span>
                </TooltipHost>
            </div>
                
        );
    }
    else{
        return (
            <div className={styles.calendarCell} style={{backgroundColor: props.weekend ? '#f5f5f5': 'inherit'}}>           
                <div>
                    <span>{props.value}</span>
                </div>
            </div>
                
        );
    }
    
}