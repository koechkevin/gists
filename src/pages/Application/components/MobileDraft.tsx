import { Button } from '@aurora_app/ui-library';
import { faChevronRight, faPencil } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Row, Typography } from 'antd';
import { Link } from 'dva/router';
import React from 'react';

import styles from './MobileDraft.module.scss';

interface Props {
  percentComplete: number;
  defaultStepPath: string;
}

const MobileDraft: React.FC<Props> = (props) => {
  const { Title } = Typography;
  const { percentComplete, defaultStepPath } = props;

  return (
    <Row className={styles.draft} type="flex">
      <Row className={styles.topItems} type="flex">
        <Col>
          <Row type="flex">
            <Col span={16}>
              <Title level={4}>
                <FontAwesomeIcon icon={faPencil} />
              </Title>
            </Col>
            <Col span={4}>
              <Title level={4}>Draft</Title>
            </Col>
          </Row>
        </Col>
        <Col>
          <Row type="flex">
            <Col span={10} className={styles.percentage}>{`${percentComplete}%`}</Col>
            <Col span={4}>
              <FontAwesomeIcon icon={faChevronRight} className={styles.percentage} />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row type="flex" className={styles.btn}>
        <Link to={defaultStepPath}>
          <Button type="primary">Continue with application</Button>
        </Link>
      </Row>
    </Row>
  );
};

export default MobileDraft;
