import * as React from 'react';
import styles from './LeaveCalendarComponent.module.scss';
import * as strings from 'LeaveCalendarWebPartStrings';
import { escape } from '@microsoft/sp-lodash-subset';
import { ILeaveCalendarComponentProps } from './ILeaveCalendarComponentProps';
import { DatePicker } from '../datepicker/DatePicker';
import { Persona, PersonaSize, Image, IPersonaProps, Spinner, SpinnerSize, CommandBarButton } from 'office-ui-fabric-react';
import { CalendarCell } from '../calendarCell/CalendarCell';
import { ILeaveCalendarItem } from './ILeaveCalendarItem';
import * as _ from 'lodash';
import { ILeaveType } from '../../model/ILeaveType';
import { FormPanel } from '../panel/FormPanel';

export const LeaveCalendarComponent: React.StatelessComponent<ILeaveCalendarComponentProps> = (props: ILeaveCalendarComponentProps): React.ReactElement<ILeaveCalendarComponentProps> => {

    let days:JSX.Element[] = [];
    let rows: JSX.Element[] = [];
    const daysInMonth: number = new Date(props.date.getFullYear(), props.date.getMonth() + 1, 0).getDate();
    for(let i: number = 1; i <= daysInMonth; i++){
        const day: number = new Date(props.date.getFullYear(), props.date.getMonth(), i).getDay();
        const weekend: boolean = day == 6 || day == 0;
        days.push(<CalendarCell key={i} value={strings.ShortDays[day]} weekend={weekend} />);
    }  
    const groups = _.groupBy(props.items, (item: ILeaveCalendarItem) => item.id);
    if(props.loading){
        rows.push(
            <div key={1} className={styles.spinner}>
                <Spinner size={SpinnerSize.large} />
            </div>
        );
    }
    else if(props.items.length > 0) {
        rows = Object.keys(groups).map((key: string, index: number): JSX.Element=>{
            let cells:JSX.Element[] = [];
            const primaryText: string = groups[key][0].employee.title;
            const secondaryText: string = groups[key][0].employee.position;
            for(let i: number = 1; i <= daysInMonth; i++){
                const date: Date = new Date(props.date.getFullYear(), props.date.getMonth(), i);
                const day: number = date.getDay();
                const weekend: boolean = day == 6 || day == 0;
                const filter = groups[key].filter((item: ILeaveCalendarItem) => item.leave.dateFrom <= date && date <= item.leave.dateTo)  
                if(filter && filter.length > 0){
                    const leaveType: ILeaveType = props.leaveTypes.filter((type: ILeaveType) => type.id == filter[0].leave.leaveTypeId)[0];
                    cells.push(<CalendarCell key={i} value={i} weekend={weekend} leaveType={leaveType}/>);
                }
                else
                    cells.push(<CalendarCell key={i} value={i} weekend={weekend} />);
            }
    
            return (
                <div className={styles.calendarRow} key={index}>
                    <div>
                    <Persona primaryText={primaryText} secondaryText={secondaryText} size={PersonaSize.size32} showSecondaryText={true} />
                    </div>
                    {cells}
                </div>
            );
        });
    }
    else {
        rows.push(
            <div key={1} className={styles.spinner}>
                <span>{strings.NoResultsMessage}</span>
            </div>
        );
    }
    
    
    return (
        <div className={styles.leaveCalendar}>
            <div className={styles.container}>
                <div className={styles.commandBar}>
                    <CommandBarButton iconProps={{iconName: 'Add'}} text={strings.NewItemText} onClick={props.onShowPanel} />
                </div>
                <div>
                    <div className={styles.calendarRow}>
                        <DatePicker date={props.date} onDateChange={props.onDateChange} />
                        {days}
                    </div>
                    {rows}
                </div>
                <FormPanel 
                    showPanel={props.showPanel} 
                    leaveTypes={props.leaveTypes} 
                    onHidePanel={props.onHidePanel} 
                    onSubmit={props.onSubmitPanel} 
                    onDataChange={props.onFormDataChange}
                    value={props.formValue}
                    isValid={props.isFormValid}
                    isSubmitButtonDisabled={props.isFormSubmitButtonDisabled} />
            </div>
        </div >
    );
}
    