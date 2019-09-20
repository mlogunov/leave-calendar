declare interface ILeaveCalendarWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  Months: string[];
  ShortDays: string[];
  Days: string[];
  NoResultsMessage: string;
}

declare module 'LeaveCalendarWebPartStrings' {
  const strings: ILeaveCalendarWebPartStrings;
  export = strings;
}
