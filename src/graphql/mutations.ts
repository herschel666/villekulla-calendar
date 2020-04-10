// tslint:disable
// eslint-disable
// this is an auto generated file. This will be overwritten

export const createCalendarEntry = /* GraphQL */ `
  mutation CreateCalendarEntry(
    $input: CreateCalendarEntryInput!
    $condition: ModelCalendarEntryConditionInput
  ) {
    createCalendarEntry(input: $input, condition: $condition) {
      id
      clientId
      creator
      calendar
      start
      end
      title
      description
    }
  }
`;
export const updateCalendarEntry = /* GraphQL */ `
  mutation UpdateCalendarEntry(
    $input: UpdateCalendarEntryInput!
    $condition: ModelCalendarEntryConditionInput
  ) {
    updateCalendarEntry(input: $input, condition: $condition) {
      id
      clientId
      creator
      calendar
      start
      end
      title
      description
    }
  }
`;
export const deleteCalendarEntry = /* GraphQL */ `
  mutation DeleteCalendarEntry(
    $input: DeleteCalendarEntryInput!
    $condition: ModelCalendarEntryConditionInput
  ) {
    deleteCalendarEntry(input: $input, condition: $condition) {
      id
      clientId
      creator
      calendar
      start
      end
      title
      description
    }
  }
`;
