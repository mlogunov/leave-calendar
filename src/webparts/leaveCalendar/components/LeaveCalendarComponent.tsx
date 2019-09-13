import * as React from 'react';
import styles from './LeaveCalendar.module.scss';
import * as strings from 'LeaveCalendarWebPartStrings';
import { escape } from '@microsoft/sp-lodash-subset';
import { ILeaveCalendarComponentProps } from './ILeaveCalendarComponentProps';
import { DatePicker } from './datepicker/DatePicker';
import { Persona, PersonaSize, Image, IPersonaProps } from 'office-ui-fabric-react';
import { IListItem } from './IListItem';
import { CalendarCell } from './calendarCell/CalendarCell';

export const LeaveCalendarComponent: React.StatelessComponent<ILeaveCalendarComponentProps> = (props: ILeaveCalendarComponentProps): React.ReactElement<ILeaveCalendarComponentProps> => {
    let days:JSX.Element[] = [];
    const daysInMonth: number = new Date(props.date.getFullYear(), props.date.getMonth() + 1, 0).getDate();
    for(let i: number = 1; i <= daysInMonth; i++){
        const day: number = new Date(props.date.getFullYear(), props.date.getMonth(), i).getDay();
        const weekend: boolean = day == 6 || day == 0;
        days.push(<CalendarCell key={i} value={strings.ShortDays[day]} weekend={weekend} className={styles.calendarCell}/>);
    }
    const rows: JSX.Element[] = props.items.value.map((item: IListItem): JSX.Element => {
        let cells:JSX.Element[] = [];
        for(let i: number = 1; i <= daysInMonth; i++){
            const day: number = new Date(props.date.getFullYear(), props.date.getMonth(), i).getDay();
            const weekend: boolean = day == 6 || day == 0;
            cells.push(<CalendarCell {...item.leaveType} key={i} className={styles.calendarCell} value={i} weekend={weekend} />);
        }
        return (
            <div className={styles.calendarRow} key={item.id}>
                <div>
                <Persona {...item.persona} size={PersonaSize.size32} showSecondaryText={true} />
                </div>
                
                {cells}
            </div>
        );
    });
    

    return (
        <div className={styles.leaveCalendar}>
            <div className={styles.container}>
                <div>{/* Контейнер для фильтров */}</div>
                <div>
                    <div className={styles.calendarRow}>
                        <DatePicker date={props.date} onDateChange={props.onDateChange} />
                        {days}
                    </div>
                    {rows}
                </div>
            </div>
        </div >
    );
}
    