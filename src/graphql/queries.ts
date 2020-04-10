// tslint:disable
// eslint-disable
// this is an auto generated file. This will be overwritten

export const getCalendarEntry = /* GraphQL */ `
  query GetCalendarEntry($id: ID!) {
    getCalendarEntry(id: $id) {
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
export const listCalendarEntrys = /* GraphQL */ `
  query ListCalendarEntrys(
    $filter: ModelCalendarEntryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCalendarEntrys(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        creator
        calendar
        start
        end
        title
        description
      }
      nextToken
    }
  }
`;
