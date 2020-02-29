import { faCommentAltSmile } from '@fortawesome/pro-regular-svg-icons';
import { Col, Row } from 'antd';
import { connect } from 'dva';
import { get } from 'lodash';
import React from 'react';

import { StepName } from '../../../../utils/constants';
import { formatPhone } from '../../../../utils/formatMessage';
import { MatchParams, Reference } from '../../models/interfaces';
import ContentWrapper from './ContentWrapper';

import styles from './References.module.scss';

interface Props {
  references: Reference[];
  match: MatchParams;
  renderCommaSeparatedText: (text?: string) => string;
}

const References: React.FC<Props> = (props) => {
  const { renderCommaSeparatedText, match, references } = props;
  const title: string = 'References';

  return (
    <ContentWrapper title={title} icon={faCommentAltSmile} match={match} stepName={StepName.references}>
      <Row className={styles.references}>
        {references &&
          references.map((reference: Reference, index: number) => (
            <Row className={styles.item} key={index}>
              <Col>
                {reference.title || reference.company ? renderCommaSeparatedText(reference.name) : reference.name}
                {`${reference.title ? reference.title : ''} ${reference.company ? 'at' : ''} ${get(
                  reference,
                  'company',
                  '',
                )}`}
              </Col>
              <Col>
                <Row className={styles.contact}> {get(reference, 'email', '')}</Row>
                <Row className={styles.contact}>
                  {reference.phone?.number ? `${formatPhone(reference.phone)} (Mobile)` : ''}
                </Row>
              </Col>
            </Row>
          ))}
      </Row>
    </ContentWrapper>
  );
};

const mapStateToProps = ({ application: { references }}: any) => ({
  references,
});

export default connect(mapStateToProps)(References);
