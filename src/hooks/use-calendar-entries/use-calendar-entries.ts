import React from 'react';
import { API, graphqlOperation as gql, GraphQLResult } from '@aws-amplify/api';
import { EventInput } from '@fullcalendar/core/structs/event';
import { Observable, ZenObservable } from 'zen-observable-ts';

import { listCalendarEntrys as ListCalendarEntrys } from '../../graphql/queries';
import { onCreateCalendarEntry } from '../../graphql/subscriptions';
import {
  ListCalendarEntrysQuery,
  OnCreateCalendarEntrySubscription,
} from '../../api';
import { useClientId } from '../use-client-id/';

type Entries = Array<unknown>;

// TODO: add error handling
export const useCalendarEntries = (month: string): Entries => {
  const clientId = useClientId();
  const [entries, setEntries] = React.useState<Entries>([]);

  React.useEffect(() => {
    const query = gql(ListCalendarEntrys, {
      filter: { start: { beginsWith: month } },
    });
    const subscription = API.graphql(gql(onCreateCalendarEntry)) as Observable<{
      value: GraphQLResult<OnCreateCalendarEntrySubscription>;
    }>;
    let subscriber = ({
      unsubscribe: () => undefined,
    } as unknown) as ZenObservable.Subscription;

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

    // TODO: enable this in development, when WebSockets are supported by the API mock
    if (process.env.NODE_ENV === 'production') {
      console.log('Subscribing to %s...', month);
      subscriber = subscription.subscribe({
        next: (eventData) => {
          const event = eventData.value.data?.onCreateCalendarEntry;
          if (!clientId || !event || clientId === event.clientId) {
            return;
          }
          console.log('new event', event);
        },
      });
    }

    return () => {
      if (process.env.NODE_ENV === 'production') {
        console.log('Unsubscribing from %s...', month);
      }
      subscriber.unsubscribe();
    };
  }, [month, clientId]);

  return entries;
};
