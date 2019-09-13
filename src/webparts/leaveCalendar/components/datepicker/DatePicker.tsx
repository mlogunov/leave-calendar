import * as React from 'react';
import { IDatePickerProps } from './IDatePickerProps';
//import styles from '../LeaveCalendar.module.scss';
import styles from './DatePicker.module.scss'
import * as strings from 'LeaveCalendarWebPartStrings';
import { IconButton, IIconProps } from 'office-ui-fabric-react';

export const DatePicker: React.StatelessComponent<IDatePickerProps> = (props: IDatePickerProps): React.ReactElement<IDatePickerProps> => {
    const chevronLeftIcon: IIconProps = { iconName: 'ChevronLeft' };
    const chevronRightIcon: IIconProps = { iconName: 'ChevronRight' };
    const month: number = props.date.getMonth();
    const prevDate: Date = new Date(
        month == 0 ? props.date.getFullYear() - 1 : props.date.getFullYear(),
        month == 0 ? 11 : month - 1
    )
    const nextDate: Date = new Date(
        month == 11 ? props.date.getFullYear() + 1 : props.date.getFullYear(),
        month == 11 ? 0 : month + 1
    )
    return (
        <div className={styles.calendarDatePicker}>
            <div className={styles.calendarDate}>
                <span>{strings.Month[month]}</span>
                <span className={styles.calendarDateYear}>{props.date.getFullYear()}</span>
            </div>
            <div>
                <IconButton iconProps={chevronLeftIcon} title={strings.Month[prevDate.getMonth()]} onClick={() => props.onDateChange(prevDate)} />
                <IconButton iconProps={chevronRightIcon} title={strings.Month[nextDate.getMonth()]} onClick={() => props.onDateChange(nextDate)} />
            </div>           
        </div> 
    );
}