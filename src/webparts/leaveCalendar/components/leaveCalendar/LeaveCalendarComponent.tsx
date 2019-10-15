import * as React from 'react';
import styles from './LeaveCalendarComponent.module.scss';
import * as strings from 'LeaveCalendarWebPartStrings';
import { escape } from '@microsoft/sp-lodash-subset';
import { ILeaveCalendarComponentProps } from './ILeaveCalendarComponentProps';
import { MonthPicker } from '../monthPicker/MonthPicker';
import { Persona, PersonaSize, Image, IPersonaProps, Spinner, SpinnerSize, CommandBarButton } from 'office-ui-fabric-react';
import { CalendarCell } from '../calendarCell/CalendarCell';
import { ILeaveCalendarItem } from './ILeaveCalendarItem';
import * as _ from 'lodash';
import { ILeaveType } from '../../../../models/ILeaveType';
import { FormPanel } from '../panel/FormPanel';

export const LeaveCalendarComponent: React.StatelessComponent<ILeaveCalendarComponentProps> = (props: ILeaveCalendarComponentProps): React.ReactElement<ILeaveCalendarComponentProps> => {

    let days:JSX.Element[] = [];
    let rows: JSX.Element[] = [];
    const daysInMonth: number = new Date(props.date.getFullYear(), props.date.getMonth() + 1, 0).getDate();
    for(let i: number = 1; i <= daysInMonth; i++){
        const day: number = new Date(props.date.getFullYear(), props.date.getMonth(), i).getDay();
        const weekend: boolean = day == 6 || day == 0;
        days.push(<CalendarCell key={i} value={strings.ShortDays[day]} weekend={weekend} isButton={false} />);
    }  
    const groups: any = _.groupBy(props.items, (item: ILeaveCalendarItem) => item.employee.id);
    const groupsArray: ILeaveCalendarItem[][] = Object.keys(groups).map((key: string) => {return groups[key]}).sort(
        (a: ILeaveCalendarItem[], b: ILeaveCalendarItem[]) => 
        (a[0].employee.title > b[0].employee.title) ? 1 : ((b[0].employee.title > a[0].employee.title) ? -1:0));
    if(props.loading){
        rows.push(
            <div key={1} className={styles.spinner}>
                <Spinner size={SpinnerSize.large} />
            </div>
        );
    }
    else if(props.items.length > 0) {
        rows = groupsArray.map((group: ILeaveCalendarItem[]): JSX.Element=>{
            let cells:JSX.Element[] = [];
            const emplId: number = group[0].employee.id;
            const primaryText: string = group[0].employee.title;
            const secondaryText: string = group[0].employee.position;
            for(let i: number = 1; i <= daysInMonth; i++){
                const date: Date = new Date(props.date.getFullYear(), props.date.getMonth(), i);
                const day: number = date.getDay();
                const weekend: boolean = day == 6 || day == 0;
                const filter: ILeaveCalendarItem[] = group.filter((item: ILeaveCalendarItem) => item.leave.dateFrom <= date && date <= item.leave.dateTo);
                if(filter && filter.length > 0){
                    const item = filter[0];
                    const leaveType: ILeaveType = props.leaveTypes.filter((type: ILeaveType) => type.id == filter[0].leave.leaveTypeId)[0];
                    cells.push(<CalendarCell key={i} 
                                             value={i} 
                                             weekend={weekend} 
                                             item={item} 
                                             leaveType={leaveType}
                                             isButton={emplId == props.currentUserId} 
                                             onEditClick={()=>props.onShowPanel(item.id)}
                                             onDeleteClick={()=>props.onDeleteItem(item.id)} />);
                }
                else
                    cells.push(<CalendarCell key={i} value={i} weekend={weekend} isButton={false} />);
            }
    
            return (
                <div className={styles.calendarRow} key={emplId}>
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
                    <CommandBarButton iconProps={{iconName: 'Add'}} text={strings.ButtonNames.NewItem} onClick={()=>props.onShowPanel()} />
                </div>
                <div className={styles.calendarBody}>
                    <div className={styles.calendarRow}>
                        <MonthPicker date={props.date} onDateChange={props.onDateChange} />
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
    