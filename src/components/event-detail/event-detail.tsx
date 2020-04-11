import React from 'react';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import { API, graphqlOperation as gql, GraphQLResult } from '@aws-amplify/api';
import format from 'date-fns/format';

import { GetCalendarEntryQuery } from '../../api';
import { getCalendarEntry as GetCalendarEntry } from '../../graphql/queries';
import { useUser } from '../../hooks/use-user/';
import { deleteCalendarEntry } from '../../graphql/mutations';

interface Props {
  pathToLastView?: string;
}

type DetailViewProps = GetCalendarEntryQuery['getCalendarEntry'] & {
  currentUser?: string;
  pathToLastView?: Props['pathToLastView'];
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
  pathToLastView,
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
      <hr />
      <Link to={pathToLastView || '/'}>zurück</Link>
    </div>
  );
};

export const EventDetail: React.SFC<Props> = ({ pathToLastView }) => {
  const history = useHistory();
  const match = useRouteMatch<{ eventId: string }>();
  const user = useUser();
  const [event, setEvent] = React.useState<GetCalendarEntryQuery>({
    getCalendarEntry: null,
  });
  const [deleting, setDeleting] = React.useState<boolean>(false);
  const loadEvent = React.useCallback(async () => {
    const { data } = (await API.graphql(
      gql(GetCalendarEntry, { id: match.params.eventId })
    )) as GraphQLResult<GetCalendarEntryQuery>;
    setEvent(data || { getCalendarEntry: null });
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
          gql(deleteCalendarEntry, { input: { id: match.params.eventId } })
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
      pathToLastView={pathToLastView}
      onClickDelete={handleDelete}
      deleting={deleting}
    />
  ) : (
    <>Loading event...</>
  );
};
