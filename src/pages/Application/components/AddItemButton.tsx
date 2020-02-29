import { Button } from '@aurora_app/ui-library';
import { faPlus } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Row } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import React from 'react';

import styles from './AddItemButton.module.scss';

interface Props extends ButtonProps {
  label?: string;
}

const AddItemButton: React.FC<Props> = (props) => {
  const { label, ...restProps } = props;

  return (
    <Button ghost {...restProps}>
      <Row type="flex" gutter={8} className={styles.addButton}>
        <Col className={styles.label}>
          <FontAwesomeIcon icon={faPlus} />
        </Col>
        <Col className={styles.label}>{props.label ? label : 'Add'}</Col>
      </Row>
    </Button>
  );
};

export default AddItemButton;
