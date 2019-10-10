import * as React from 'react';
import { IMonthPickerProps } from './IMonthPickerProps';
import styles from './MonthPicker.module.scss';
import * as strings from 'LeaveCalendarWebPartStrings';
import { IconButton, IIconProps } from 'office-ui-fabric-react';

export const MonthPicker: React.StatelessComponent<IMonthPickerProps> = (props: IMonthPickerProps): React.ReactElement<IMonthPickerProps> => {
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
                <span>{strings.Months[month]}</span>
                <span className={styles.calendarDateYear}>{props.date.getFullYear()}</span>
            </div>
            <div>
                <IconButton iconProps={chevronLeftIcon} title={strings.Months[prevDate.getMonth()]} onClick={() => props.onDateChange(prevDate)} />
                <IconButton iconProps={chevronRightIcon} title={strings.Months[nextDate.getMonth()]} onClick={() => props.onDateChange(nextDate)} />
            </div>           
        </div> 
    );
}