import { InputCard } from '@aurora_app/ui-library';
import {
  faBehance,
  faDribbble,
  faFacebookF,
  faGithub,
  faLinkedin,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';
import { faGlobeAmericas } from '@fortawesome/pro-regular-svg-icons';
import { Form, Row } from 'antd';
import { connect } from 'dva';
import { RouteComponentProps } from 'dva/router';
import { get } from 'lodash';
import React, { FC, useCallback, useEffect, useState } from 'react';

import { Dispatch } from '../../../models/dispatch';
import { FormSectionTypes, StepName } from '../../../utils/constants';
import { isEmptyForm } from '../../../utils/utils';
import { ApplicationController, ApplicationHeader } from '../components/index';
import { ApplicationForm, JobApplication, Params, Portfolio as PortfolioTyped } from '../models/interfaces';

import styles from './Portfolio.module.scss';
import PortfolioEntry from './PortfolioEntry';

interface Props extends RouteComponentProps<Params> {
  portfolio: PortfolioTyped;
  application: JobApplication;
  applicationForm: ApplicationForm;
  updateApplication: (applicationId: string, stepName: string, application: any) => void;
}

const Portfolio: FC<Props> = (props) => {
  const { application, updateApplication, match, applicationForm } = props;
  const {
    applicationId,
    resume: { portfolio },
  } = application;
  const [validating, setValidating] = useState<boolean>(false);
  const [formValid, setFormValid] = useState<boolean>(true);
  const [entries, setEntries] = useState<PortfolioTyped>({
    linkedin: '',
    github: '',
    twitter: '',
    facebook: '',
    behance: '',
    dribbble: '',
    url: '',
  });

  const updateEntries = (key: string, value: string) => {
    setEntries((entries) => ({ ...entries, [`${key}`]: value }));
  };

  const update = useCallback(() => {
    const { applicationId } = application;
    const params = {
      applicationId,
      resume: { portfolio: entries },
    };

    updateApplication(applicationId, StepName.portfolio, params);
    setValidating(false);
  }, [application, entries, updateApplication]);

  useEffect(() => {
    setEntries((entries: PortfolioTyped) => ({ ...entries, ...portfolio }));
  }, [portfolio]);

  useEffect(() => {
    if (formValid) {
      validating && update();
    }
  }, [formValid, update, validating]);

  useEffect(() => {
    if (applicationForm?.portfolio.stepType === FormSectionTypes.REQUIRED) {
      setFormValid(!isEmptyForm(entries));
    }
  }, [entries, applicationForm]);

  return (
    <>
      <ApplicationHeader title="Portfolio" match={match} />
      <Row className={styles.portfolioPage}>
        <InputCard className={styles.inputCard}>
          <Form key={applicationId} hideRequiredMark>
            <PortfolioEntry
              companyIcon={faLinkedin}
              urlLink={get(portfolio, 'linkedin', '')}
              companyName={'LinkedIn'}
              updateEntry={updateEntries}
              setFormValid={setFormValid}
              setValidating={setValidating}
            />
            <PortfolioEntry
              companyIcon={faGithub}
              urlLink={get(portfolio, 'github', '')}
              companyName={'GitHub'}
              updateEntry={updateEntries}
              setFormValid={setFormValid}
              setValidating={setValidating}
            />
            <PortfolioEntry
              companyIcon={faTwitter}
              urlLink={get(portfolio, 'twitter', '')}
              companyName={'Twitter'}
              updateEntry={updateEntries}
              setFormValid={setFormValid}
              setValidating={setValidating}
            />
            <PortfolioEntry
              companyIcon={faFacebookF}
              urlLink={get(portfolio, 'facebook', '')}
              companyName={'Facebook'}
              updateEntry={updateEntries}
              setFormValid={setFormValid}
              setValidating={setValidating}
            />
            <PortfolioEntry
              companyIcon={faBehance}
              urlLink={get(portfolio, 'behance', '')}
              companyName={'Behance'}
              updateEntry={updateEntries}
              setFormValid={setFormValid}
              setValidating={setValidating}
            />
            <PortfolioEntry
              companyIcon={faDribbble}
              urlLink={get(portfolio, 'dribbble', '')}
              companyName={'Dribbble'}
              updateEntry={updateEntries}
              setFormValid={setFormValid}
              setValidating={setValidating}
            />
            <PortfolioEntry
              companyIcon={faGlobeAmericas}
              urlLink={get(portfolio, 'url', '')}
              companyName={'URL'}
              updateEntry={updateEntries}
              setFormValid={setFormValid}
              setValidating={setValidating}
            />
          </Form>
        </InputCard>
      </Row>
      <ApplicationController match={match} disableNext={!formValid} />
    </>
  );
};

const mapStateToProps = ({ application: { application, applicationForm } }) => ({
  application,
  applicationForm,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateApplication: (applicationId: string, stepName: string, application: any) =>
    dispatch({
      type: 'application/updateApplication',
      payload: { applicationId, application, stepName },
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);
