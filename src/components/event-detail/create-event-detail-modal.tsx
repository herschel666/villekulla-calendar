import React from 'react';

import { Modal } from '../modal';
import { EventDetail } from './event-detail';

interface Props {
  appElement: HTMLElement | undefined;
  pathToLastView: string;
}

export const EventDetailModal: React.SFC<Props> = ({
  appElement,
  pathToLastView,
}) => (
  <Modal appElement={appElement} pathToLastView={pathToLastView}>
    <EventDetail pathToLastView={pathToLastView} />
  </Modal>
);
