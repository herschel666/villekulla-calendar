// tslint:disable
// this is an auto generated file. This will be overwritten

export const onCreateCalendarEntry = /* GraphQL */ `
  subscription OnCreateCalendarEntry($creator: String!) {
    onCreateCalendarEntry(creator: $creator) {
      id
      creator
      calendar
      start
      end
      title
      description
    }
  }
`;
export const onUpdateCalendarEntry = /* GraphQL */ `
  subscription OnUpdateCalendarEntry($creator: String!) {
    onUpdateCalendarEntry(creator: $creator) {
      id
      creator
      calendar
      start
      end
      title
      description
    }
  }
`;
export const onDeleteCalendarEntry = /* GraphQL */ `
  subscription OnDeleteCalendarEntry($creator: String!) {
    onDeleteCalendarEntry(creator: $creator) {
      id
      creator
      calendar
      start
      end
      title
      description
    }
  }
`;
