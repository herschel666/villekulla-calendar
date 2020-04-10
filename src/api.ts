/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateCalendarEntryInput = {
  id?: string | null,
  clientId: string,
  creator: string,
  calendar: Calendar,
  start: string,
  end: string,
  title: string,
  description?: string | null,
};

export enum Calendar {
  COMMON_ROOM = "COMMON_ROOM",
}


export type ModelCalendarEntryConditionInput = {
  clientId?: ModelIDInput | null,
  calendar?: ModelCalendarInput | null,
  start?: ModelStringInput | null,
  end?: ModelStringInput | null,
  title?: ModelStringInput | null,
  description?: ModelStringInput | null,
  and?: Array< ModelCalendarEntryConditionInput | null > | null,
  or?: Array< ModelCalendarEntryConditionInput | null > | null,
  not?: ModelCalendarEntryConditionInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelCalendarInput = {
  eq?: Calendar | null,
  ne?: Calendar | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type UpdateCalendarEntryInput = {
  id: string,
  clientId?: string | null,
  creator?: string | null,
  calendar?: Calendar | null,
  start?: string | null,
  end?: string | null,
  title?: string | null,
  description?: string | null,
};

export type DeleteCalendarEntryInput = {
  id?: string | null,
};

export type ModelCalendarEntryFilterInput = {
  id?: ModelIDInput | null,
  clientId?: ModelIDInput | null,
  creator?: ModelIDInput | null,
  calendar?: ModelCalendarInput | null,
  start?: ModelStringInput | null,
  end?: ModelStringInput | null,
  title?: ModelStringInput | null,
  description?: ModelStringInput | null,
  and?: Array< ModelCalendarEntryFilterInput | null > | null,
  or?: Array< ModelCalendarEntryFilterInput | null > | null,
  not?: ModelCalendarEntryFilterInput | null,
};

export type CreateCalendarEntryMutationVariables = {
  input: CreateCalendarEntryInput,
  condition?: ModelCalendarEntryConditionInput | null,
};

export type CreateCalendarEntryMutation = {
  createCalendarEntry:  {
    __typename: "CalendarEntry",
    id: string,
    clientId: string,
    creator: string,
    calendar: Calendar,
    start: string,
    end: string,
    title: string,
    description: string | null,
  } | null,
};

export type UpdateCalendarEntryMutationVariables = {
  input: UpdateCalendarEntryInput,
  condition?: ModelCalendarEntryConditionInput | null,
};

export type UpdateCalendarEntryMutation = {
  updateCalendarEntry:  {
    __typename: "CalendarEntry",
    id: string,
    clientId: string,
    creator: string,
    calendar: Calendar,
    start: string,
    end: string,
    title: string,
    description: string | null,
  } | null,
};

export type DeleteCalendarEntryMutationVariables = {
  input: DeleteCalendarEntryInput,
  condition?: ModelCalendarEntryConditionInput | null,
};

export type DeleteCalendarEntryMutation = {
  deleteCalendarEntry:  {
    __typename: "CalendarEntry",
    id: string,
    clientId: string,
    creator: string,
    calendar: Calendar,
    start: string,
    end: string,
    title: string,
    description: string | null,
  } | null,
};

export type GetCalendarEntryQueryVariables = {
  id: string,
};

export type GetCalendarEntryQuery = {
  getCalendarEntry:  {
    __typename: "CalendarEntry",
    id: string,
    clientId: string,
    creator: string,
    calendar: Calendar,
    start: string,
    end: string,
    title: string,
    description: string | null,
  } | null,
};

export type ListCalendarEntrysQueryVariables = {
  filter?: ModelCalendarEntryFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListCalendarEntrysQuery = {
  listCalendarEntrys:  {
    __typename: "ModelCalendarEntryConnection",
    items:  Array< {
      __typename: "CalendarEntry",
      id: string,
      clientId: string,
      creator: string,
      calendar: Calendar,
      start: string,
      end: string,
      title: string,
      description: string | null,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type OnCreateCalendarEntrySubscriptionVariables = {
  creator: string,
};

export type OnCreateCalendarEntrySubscription = {
  onCreateCalendarEntry:  {
    __typename: "CalendarEntry",
    id: string,
    clientId: string,
    creator: string,
    calendar: Calendar,
    start: string,
    end: string,
    title: string,
    description: string | null,
  } | null,
};

export type OnUpdateCalendarEntrySubscriptionVariables = {
  creator: string,
};

export type OnUpdateCalendarEntrySubscription = {
  onUpdateCalendarEntry:  {
    __typename: "CalendarEntry",
    id: string,
    clientId: string,
    creator: string,
    calendar: Calendar,
    start: string,
    end: string,
    title: string,
    description: string | null,
  } | null,
};

export type OnDeleteCalendarEntrySubscriptionVariables = {
  creator: string,
};

export type OnDeleteCalendarEntrySubscription = {
  onDeleteCalendarEntry:  {
    __typename: "CalendarEntry",
    id: string,
    clientId: string,
    creator: string,
    calendar: Calendar,
    start: string,
    end: string,
    title: string,
    description: string | null,
  } | null,
};
