import * as React from 'react';
import { ICalendarCellProps } from './ICalendarCellProps';
import { TooltipHost, IContextualMenuProps, ActionButton, Dialog, DialogFooter, PrimaryButton, DefaultButton, DialogType } from 'office-ui-fabric-react';
import * as strings from 'LeaveCalendarWebPartStrings';
import styles from './CalendatCell.module.scss';
import { ICalendarCellState } from './ICalendarCellState';
import { formatDate } from '../../../../utils/dateUtils';

export class CalendarCell extends React.Component<ICalendarCellProps, ICalendarCellState> {
    constructor(props: ICalendarCellProps) {
        super(props);
        this.state = {hideDialog: true}
    }
    private menuProps: IContextualMenuProps = {
        items: [
          {
            key: 'editItem',
            name: strings.ButtonNames.Edit,
            iconProps: { iconName: 'Edit' },
            onClick: ()=>this.props.onEditClick()
          },
          {
            key: 'deleteItem',
            name: strings.ButtonNames.Delete,
            iconProps: { iconName: 'Delete' },
            onClick: ()=>this._showDialog()
          }
        ]
    };

    private _showDialog = (): void => {
        this.setState({ hideDialog: false });
    };
    
    private _closeDialog = (): void => {
        this.setState({ hideDialog: true });
    };

    private _onDeleteClick = () => {
        this.setState({hideDialog: true}, ()=>this.props.onDeleteClick())
    }

    public render() {
        if(this.props.leaveType){
            const style = {backgroundColor: this.props.leaveType.bgColor? this.props.leaveType.bgColor: this.props.weekend ? styles.weekendBgColor: 'inherit'};
            return (
                <div className={styles.calendarCell} style={style}>           
                    <TooltipHost content={this.props.leaveType.title}>
                        {this.props.isButton ? <ActionButton menuProps={this.menuProps} className={styles.actionButton} style={style}>{this.props.value}</ActionButton> : <span>{this.props.value}</span>}
                    </TooltipHost>
                    <Dialog hidden={this.state.hideDialog}
                            onDismiss={this._closeDialog}
                            dialogContentProps={{
                                type: DialogType.normal,
                                title: `${strings.ButtonNames.Delete}?`
                              }}>
                        <div>
                            {strings.StartDateLabelText}: {formatDate(this.props.item.leave.dateFrom)}<br />
                            {strings.EndDateLabelText}: {formatDate(this.props.item.leave.dateTo)}<br />
                            {strings.LeaveTypeLabelText}: {this.props.leaveType.title}
                        </div>
                        <DialogFooter>
                            <PrimaryButton text={strings.ButtonNames.Delete} onClick={this._onDeleteClick} />
                            <DefaultButton onClick={this._closeDialog} text={strings.ButtonNames.Cancel} />
                        </DialogFooter>
                    </Dialog>
                </div>
                    
            );
        }
        else{
            return (
                <div className={styles.calendarCell} style={{backgroundColor: this.props.weekend ? '#f5f5f5': 'inherit'}}>           
                    <div>
                        <span>{this.props.value}</span>
                    </div>
                </div>
                    
            );
        }
    }
}