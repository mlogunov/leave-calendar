declare interface ILeaveCalendarWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  Month: string[];
  ShortDays: string[];
}

declare module 'LeaveCalendarWebPartStrings' {
  const strings: ILeaveCalendarWebPartStrings;
  export = strings;
}
