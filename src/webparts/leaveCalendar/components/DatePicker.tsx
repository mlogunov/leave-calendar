import * as React from 'react';
import { IDatePickerProps } from './IDatePickerProps';
import styles from './LeaveCalendar.module.scss';
import * as strings from 'LeaveCalendarWebPartStrings';

export const DatePicker: React.StatelessComponent<IDatePickerProps> = (props: IDatePickerProps) => {
    return (
        <div className={styles.cDatePicker}>
            <span>{strings.Month[props.date.getMonth()]}</span>
            <span className={styles.cPosition}>{props.date.getFullYear()}</span>
        </div> 
    );
}