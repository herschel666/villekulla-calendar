import React from 'react';
import { API, graphqlOperation as gql, GraphQLResult } from '@aws-amplify/api';
import { EventInput } from '@fullcalendar/core/structs/event';

import { listCalendarEntrys as ListCalendarEntrys } from '../../graphql/queries';
import { ListCalendarEntrysQuery } from '../../api';

type Entries = Array<unknown>;

// TODO: add error handling
export const useCalendarEntries = (month: string): Entries => {
  const [entries, setEntries] = React.useState<Entries>([]);

  React.useEffect(() => {
    const query = gql(ListCalendarEntrys, {
      filter: { start: { beginsWith: month } },
    });

    (API.graphql(query) as Promise<
      GraphQLResult<ListCalendarEntrysQuery>
    >).then(({ data }) => {
      if (data && data.listCalendarEntrys && data.listCalendarEntrys.items) {
        setEntries(
          data.listCalendarEntrys.items.filter(Boolean).map(
            (entry): EventInput => ({
              /* eslint-disable @typescript-eslint/no-non-null-assertion */
              id: entry!.id,
              title: entry!.title,
              start: entry!.start,
              end: entry!.end,
              /* eslint-enable @typescript-eslint/no-non-null-assertion */
              allDay: false,
            })
          )
        );
      }
    });
  }, [month]);

  return entries;
};
