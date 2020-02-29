import { InputCard } from '@aurora_app/ui-library';
import { connect } from 'dva';
import React, { FC } from 'react';

import { Dispatch } from '../../../models/dispatch';
import AddressForm from './AddressForm';
import PhoneAndEmailForm from './PhoneAndEmailForm';

import styles from './ContactDetails.module.scss';

interface Props {
  applicationId: string;
  disabledNextButton: (value: boolean) => void;
}

const ContactForm: FC<Props> = (props) => {
  const { applicationId, disabledNextButton } = props;

  return (
    <InputCard title="Address" className={styles.card}>
      <AddressForm applicationId={applicationId} disabledNextButton={disabledNextButton} />
      <PhoneAndEmailForm applicationId={applicationId} disabledNextButton={disabledNextButton} />
    </InputCard>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch: Dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ContactForm);
