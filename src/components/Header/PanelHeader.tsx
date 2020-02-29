import { IconDefinition } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC } from 'react';

import styles from './PanelHeader.module.scss';

interface Props {
  title: string;
  icon: IconDefinition;
}

export const PanelHeader: FC<Props> = (props) => (
  <>
    <span className={styles.panelHeader}>
      <FontAwesomeIcon icon={props.icon} />
    </span>
    <span style={{ marginLeft: 12 }}>{props.title}</span>
  </>
);

export default PanelHeader;
