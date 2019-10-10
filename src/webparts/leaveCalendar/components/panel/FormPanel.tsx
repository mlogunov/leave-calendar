import * as React from 'react';
import { IFormPanelProps } from './IFormPanelProps';
import { Panel, PanelType, Dropdown, DefaultButton, PrimaryButton, IDropdownOption, Label, MessageBar, MessageBarType } from 'office-ui-fabric-react';
import * as strings from 'LeaveCalendarWebPartStrings';
import { DatePicker, DayOfWeek, IDatePickerStrings } from 'office-ui-fabric-react';
import { ILeaveType } from '../../../../models/ILeaveType';
import { IFormFields } from '../../../../models/IFormFields';
interface IDropdownOptions {
    text: string;
    key: number;
}
export const FormPanel: React.StatelessComponent<IFormPanelProps> = (props: IFormPanelProps): React.ReactElement<IFormPanelProps> => {
    const DayPickerStrings: IDatePickerStrings = {
        months: strings.Months,
        shortMonths: strings.ShortMonths,
        days: strings.Days,
        shortDays: strings.ShortDays,
        goToToday: strings.GoToToday,
        prevMonthAriaLabel: strings.PrevMonthAriaLabel,
        nextMonthAriaLabel: strings.NextMonthAriaLabel,
        prevYearAriaLabel: strings.PrevYearAriaLabel,
        nextYearAriaLabel: strings.NextYearAriaLabel,
        isRequiredErrorMessage: strings.RequiredErrorMessage
      };
    
    const _onFormatDate = (date: Date): string => {
        const formatDate: string = `${date.getDate() > 9 ? date.getDate().toString() : '0' + date.getDate().toString()}.${date.getMonth() > 8 ? (date.getMonth() +1).toString() : '0' + (date.getMonth() +1).toString()}.${date.getFullYear().toString()}`
        return formatDate
    };
    const leaveTypes = props.leaveTypes.map((leaveType: ILeaveType): IDropdownOptions => {
        return {text: leaveType.title, key: leaveType.id}
    });
    const _onRenderFooterContent = () => {
        return (
          <div>
            <PrimaryButton style={{ marginRight: '8px' }} onClick={props.onSubmit} disabled={props.isSubmitButtonDisabled}>
                {strings.SaveButtonText}
            </PrimaryButton>
            <DefaultButton onClick={props.onHidePanel}>
                {strings.CancelButtonText}
            </DefaultButton>
          </div>
        );
      };
    return(
            <Panel 
                isOpen = {props.showPanel} 
                type= {PanelType.smallFixedFar} 
                headerText={strings.FormPanelHeaderText}
                onRenderFooterContent={_onRenderFooterContent}
                onDismissed= {props.onHidePanel} >
                    {!props.isValid && <MessageBar messageBarType={MessageBarType.severeWarning}>{strings.RequiredErrorMessage}</MessageBar> }                
                    <Label required={true}>{strings.StartDateLabelText}</Label>
                    <DatePicker 
                        ariaLabel={strings.EndDateLabelText}
                        strings={DayPickerStrings} 
                        showMonthPickerAsOverlay={true} 
                        placeholder={strings.DatePickerPlaceholder} 
                        formatDate={_onFormatDate}
                        showGoToToday={false}
                        onSelectDate={(date: Date) =>props.onDataChange(date, IFormFields.dateFrom)}
                        value={props.value.dateFrom}
                        maxDate={props.value.dateTo} 
                        firstDayOfWeek = {DayOfWeek.Monday} />
                    <br />
                    <Label required={true}>{strings.EndDateLabelText}</Label>
                    <DatePicker 
                        ariaLabel={strings.EndDateLabelText}
                        strings={DayPickerStrings} 
                        showMonthPickerAsOverlay={true} 
                        placeholder={strings.DatePickerPlaceholder} 
                        formatDate={_onFormatDate}
                        showGoToToday={false}
                        onSelectDate={(date: Date) =>props.onDataChange(date, IFormFields.dateTo)}
                        value={props.value.dateTo}
                        minDate={props.value.dateFrom}
                        firstDayOfWeek = {DayOfWeek.Monday} />
                    <br />
                    <Label required={true}>{strings.LeaveTypeLabelText}</Label>
                    <Dropdown 
                    options={leaveTypes}
                    selectedKey={props.value.leaveTypeId}
                    onChanged={(option: IDropdownOption) => props.onDataChange(Number(option.key), IFormFields.leaveType)}/>
            </Panel>
            
    );
}