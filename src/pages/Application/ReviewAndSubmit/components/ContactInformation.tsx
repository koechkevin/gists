import { faPhone } from '@fortawesome/pro-regular-svg-icons';
import { Row } from 'antd';
import React from 'react';

import { StepName } from '../../../../utils/constants';
import { formatPhone } from '../../../../utils/formatMessage';
import { JobApplication, MatchParams } from '../../models/interfaces';
import ContentWrapper from './ContentWrapper';

import styles from './ContactInformation.module.scss';

interface Props {
  application: JobApplication;
  match: MatchParams;
  renderCommaSeparatedText: (text?: string) => string;
}

const ContactInformation: React.FC<Props> = (props) => {
  const {
    application: { resume: { contactInformation: contactInfo} },
    renderCommaSeparatedText,
    match,
  } = props;
  const title: string = 'Contact Information';

  return (
    <ContentWrapper title={title} icon={faPhone} match={match} stepName={StepName.contactInformation}>
      <Row className={styles.contactInfo}>
        <Row className={styles.header}>
          {contactInfo?.cityName || contactInfo?.region || contactInfo?.postalCode || contactInfo?.country
            ? renderCommaSeparatedText(contactInfo?.streetAddress)
            : contactInfo?.streetAddress}
          {contactInfo?.region || contactInfo?.postalCode || contactInfo?.country
            ? renderCommaSeparatedText(contactInfo?.cityName)
            : contactInfo?.cityName}
          {contactInfo?.postalCode || contactInfo?.country
            ? renderCommaSeparatedText(contactInfo?.region)
            : contactInfo?.region}
          {contactInfo?.country ? renderCommaSeparatedText(contactInfo?.postalCode) : contactInfo?.postalCode}
          {contactInfo?.country}
        </Row>
        {contactInfo?.emailAddress && <Row className={styles.item}>{contactInfo?.emailAddress}</Row>}
        {contactInfo?.phone && (
          <Row className={styles.item}>{`${formatPhone(contactInfo.phone)} ${
            contactInfo.phone.number ? '(Home)' : ''
          }`}</Row>
        )}
        {contactInfo?.mobilePhone && (
          <Row className={styles.item}>{`${formatPhone(contactInfo.mobilePhone)} ${
            contactInfo.mobilePhone.number ? '(Mobile)' : ''
          }`}</Row>
        )}
      </Row>
    </ContentWrapper>
  );
};

export default ContactInformation;
