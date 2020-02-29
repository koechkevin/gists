import { Button, Icon, IconMenuItem } from '@aurora_app/ui-library';
import { faChevronDown, faChevronUp, faPencil, IconDefinition } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Collapse, Row } from 'antd';
import { differenceInHours } from 'date-fns';
import { connect } from 'dva';
import { Link } from 'dva/router';
import React, { useEffect, useState } from 'react';

import { Dispatch } from '../../../../models/dispatch';
import { APPLICATION_STATUS } from '../../../../utils/constants';
import { createStepsPath } from '../../../../utils/utils';
import { JobApplication, MatchParams, StatusHistories } from '../../models/interfaces';

import styles from './ContentWrapper.module.scss';

interface ContentHeader {
  icon: IconDefinition;
  title: string;
}

interface Props extends ContentHeader {
  match: MatchParams;
  stepName: string;
  statusHistories: StatusHistories;
  application: JobApplication;
}

const { Panel } = Collapse;

const ContentHeader: React.FC<ContentHeader> = (props) => (
  <Row align="middle" className={styles.header}>
    <IconMenuItem icon={<Icon icon={props.icon} />}>{props.title}</IconMenuItem>
  </Row>
);

const ContentWrapper: React.FC<Props> = (props) => {
  const { icon, title, match, stepName, statusHistories, application } = props;
  const [isActive, setActive] = useState<boolean>(false);
  const { companyId, id: applicationId } = match.params;
  const [showEditButton, setShowEditButton] = useState<boolean>(false);
  const expiryHours: number = 24;

  const handleChange = (): void => setActive(!isActive);

  useEffect(() => {
    if (application?.status !== APPLICATION_STATUS.DRAFT) {
      const hoursDifference: number = differenceInHours(
        new Date(),
        new Date(statusHistories[statusHistories.length - 1].createdAt),
      );
      const editable: boolean =
        statusHistories[statusHistories.length - 1].newStatus === APPLICATION_STATUS.SUBMITTED &&
        application?.status === APPLICATION_STATUS.SUBMITTED &&
        hoursDifference < expiryHours;

      setShowEditButton(editable);
    } else {
      setShowEditButton(true);
    }
  }, [statusHistories, application]);

  return (
    <Collapse
      bordered={false}
      onChange={handleChange}
      expandIconPosition="right"
      expandIcon={({ isActive }) => <FontAwesomeIcon icon={isActive ? faChevronUp : faChevronDown} />}
      className={styles.contentWrapper}
      defaultActiveKey={[`${title}`]}
    >
      <Panel key={title} header={<ContentHeader icon={icon} title={title} />}>
        {props.children}
        <Row className={styles.buttonSection}>
          <Link to={createStepsPath(stepName, companyId, applicationId)}>
            {showEditButton && (
              <Button type="primary" ghost>
                <Row type="flex" className={styles.content} align="middle" justify="center">
                  <Icon icon={faPencil} color="#0050c8" />
                  Edit
                </Row>
              </Button>
            )}
          </Link>
        </Row>
      </Panel>
    </Collapse>
  );
};

const mapStateToProps = ({ application: { statusHistories, application } }) => ({ statusHistories, application });
const mapDispatchToProps = (dispatch: Dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ContentWrapper);
