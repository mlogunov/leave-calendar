import * as React from 'react';
import styles from './LeaveCalendar.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';
import { ILeaveCalendarComponentProps } from './ILeaveCalendarComponentProps';
import { DatePicker } from './DatePicker';

export const LeaveCalendarComponent: React.StatelessComponent<ILeaveCalendarComponentProps> = (props: ILeaveCalendarComponentProps) => {
    let days:JSX.Element[] = [];
    let cells:JSX.Element[] = [];
    const daysInMonth: number = new Date(props.date.getFullYear(), props.date.getMonth() + 1, 0).getDate();
    for(let i: number = 1; i <= daysInMonth; i++){
        days.push(<div className={[styles.cCell, styles.cHeader].join(' ')}>{i == props.date.getDate() ? <span><b>{i}</b></span>:<span>{i}</span>}</div>);
        cells.push(<div className={styles.cCell}></div>);
    }

    return (
        <div className = { styles.leaveCalendar } >
            <div className={styles.container}>
                <div>{/* Контейнер для фильтров */}</div>
                <div className={styles.calendar}>
                    <div className={styles.cRow}>
                        <div className={[styles.cHeader, styles.cTitle].join(' ')}>
                            <DatePicker date={props.date} />
                        </div>
                        {days}
                    </div>
                    <div className={styles.cRow}>
                        <div className={styles.cTitle}>Марушев Валерий Вячеславович<br /><span className={styles.cPosition}>Начальник управления</span></div>
                        {cells}
                    </div>
                    <div className={styles.cRow}>
                        <div className={styles.cTitle}>Орешин Антон Сергеевич<br /><span className={styles.cPosition}>Заместитель начальника управления</span></div>
                        {cells}
                    </div>
                    <div className={styles.cRow}>
                        <div className={styles.cTitle}>Логунов Максим Владимирович<br /><span className={styles.cPosition}>Старший разработчик</span></div>
                        {cells}
                    </div>
                </div>
            </div>
        </div >
    );
}
    