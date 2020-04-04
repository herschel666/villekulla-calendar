import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { API, graphqlOperation as gql } from 'aws-amplify';
import format from 'date-fns/format';

import { GetCalendarEntryQuery } from '../../api';
import { getCalendarEntry as GetCalendarEntry } from '../../graphql/queries';
import { useUser } from '../../hooks/use-user/';
import { deleteCalendarEntry } from '../../graphql/mutations';

type Props = RouteComponentProps<{ eventId: string }>;
type DetailViewProps = GetCalendarEntryQuery['getCalendarEntry'] & {
  currentUser?: string;
  deleting: boolean;
  onClickDelete: () => void;
};

const DetailView: React.SFC<DetailViewProps> = ({
  title,
  start,
  end,
  description,
  creator,
  currentUser,
  onClickDelete,
}) => {
  const startDate = new Date(start);
  const day = format(startDate, 'dd.MM.yyyy');
  const startTime = format(startDate, 'HH:mm');
  const endTime = format(new Date(end), 'HH:mm');

  return (
    <div>
      <h2>{title}</h2>
      {creator === currentUser && (
        <div>
          <button onClick={onClickDelete}>Termin löschen</button>
        </div>
      )}
      <strong>{day}</strong>
      <br />
      <span>
        {startTime} Uhr bis {endTime} Uhr
      </span>
      <br />
      {Boolean(description) && <p>{description}</p>}
    </div>
  );
};

export const EventDetail: React.SFC<Props> = ({ match, history }) => {
  const user = useUser();
  const [event, setEvent] = React.useState<GetCalendarEntryQuery>({
    getCalendarEntry: null,
  });
  const [deleting, setDeleting] = React.useState<boolean>(false);
  const loadEvent = React.useCallback(async () => {
    const { data }: { data: GetCalendarEntryQuery } = await API.graphql(
      gql(GetCalendarEntry, { id: match.params.eventId })
    );
    setEvent(data);
  }, [match.params.eventId]);
  const handleDelete = async () => {
    if (
      event.getCalendarEntry &&
      window.confirm('Soll der Termin wirklich gelöscht werden?')
    ) {
      setDeleting(true);
      const startDate = new Date(event.getCalendarEntry.start);
      try {
        await API.graphql(
          gql(deleteCalendarEntry, { input: { id: match.params.eventId + 1 } })
        );
        history.push(`/calendar/${format(startDate, 'yyyy-MM')}/`);
      } catch (err) {
        console.error(err);
        setDeleting(false);
      }
    }
  };

  React.useEffect(() => {
    loadEvent();
  }, [loadEvent]);

  return event.getCalendarEntry ? (
    <DetailView
      {...event.getCalendarEntry}
      currentUser={user?.username}
      onClickDelete={handleDelete}
      deleting={deleting}
    />
  ) : (
    <>Loading event...</>
  );
};
