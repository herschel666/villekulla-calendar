import React from 'react';

import { Modal } from '../modal/';
import { CreateEventForm } from './create-event-form';

interface Props {
  appElement: HTMLElement | undefined;
  pathToLastView: string;
}

export const CreateEventFormModal: React.SFC<Props> = ({
  appElement,
  pathToLastView,
}) => (
  <Modal appElement={appElement} pathToLastView={pathToLastView}>
    <CreateEventForm pathToLastView={pathToLastView} />
  </Modal>
);
