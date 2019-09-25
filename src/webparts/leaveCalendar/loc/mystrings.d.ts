declare interface ILeaveCalendarWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  Months: string[];
  ShortMonths: string[];
  ShortDays: string[];
  Days: string[];
  GoToToday: string,
  PrevMonthAriaLabel: string,
  NextMonthAriaLabel: string,
  PrevYearAriaLabel: string,
  NextYearAriaLabel: string,
  DatePickerPlaceholder: string,
  NoResultsMessage: string;
  NewItemText: string;
  FormPanelHeaderText: string;
  StartDateLabelText: string;
  EndDateLabelText: string;
  LeaveTypeLabelText: string;
  SaveButtonText: string;
  CancelButtonText:string;
  RequiredErrorMessage: string;
}

declare module 'LeaveCalendarWebPartStrings' {
  const strings: ILeaveCalendarWebPartStrings;
  export = strings;
}
