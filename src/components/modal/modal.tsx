import React from 'react';
import ReactModal, { Props as ModalProps } from 'react-modal';
import { useHistory } from 'react-router-dom';

import styles from './modal.module.css';

type Props = Pick<ModalProps, 'appElement'> & {
  pathToLastView: string;
};

export const Modal: React.SFC<Props> = ({
  appElement,
  pathToLastView,
  children,
}) => {
  const history = useHistory();
  const overlayRef = React.useRef<HTMLDivElement | null>();
  const setOverlayRef = (instance: HTMLDivElement) => {
    overlayRef.current = instance;
  };

  React.useEffect(() => {
    const closeOverlay = (evnt: Event) => {
      if (evnt.target === overlayRef.current) {
        history.push(pathToLastView);
      }
    };

    document.addEventListener('click', closeOverlay);

    return () => document.removeEventListener('click', closeOverlay);
  }, [overlayRef, history, pathToLastView]);

  React.useEffect(() => {
    const closeOverlay = (evnt: KeyboardEvent) => {
      if (evnt.code === 'Escape') {
        history.push(pathToLastView);
      }
    };
    document.addEventListener('keyup', closeOverlay);

    return () => document.removeEventListener('keyup', closeOverlay);
  }, [history, pathToLastView]);

  return (
    <ReactModal
      isOpen={true}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
      appElement={appElement}
      overlayRef={setOverlayRef}
      className={styles.content}
      portalClassName={styles.portal}
      overlayClassName={styles.overlay}
    >
      {children}
    </ReactModal>
  );
};
