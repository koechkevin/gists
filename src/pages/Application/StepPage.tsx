import { ErrorBoundary } from '@aurora_app/ui-library';
import { connect } from 'dva';
import { Redirect, RouteComponentProps, Switch } from 'dva/router';
import { findLastIndex } from 'lodash';
import React, { FC } from 'react';

import { RouteConfig, RouteWithSubRoutes } from '../../routes';
import { createStepsPath } from '../../utils/utils';
import { Params, Step } from './models/interfaces';

interface Props extends RouteComponentProps<Params> {
  app?: any;
  routes: RouteConfig[];
  applicationSteps: Step[];
}

export const StepPage: FC<Props> = (props) => {
  const { app, routes, match, applicationSteps } = props;
  const { id: applicationId, companyId, step } = match.params;
  const lastIndex = findLastIndex(applicationSteps, (step: Step) => !step.disabled);
  const currentIndex = applicationSteps.findIndex((item: Step) => item.stepName === step);
  const previousStep = currentIndex > 0 ? applicationSteps[currentIndex - 1] : null;
  const currentStep = applicationSteps.find((item: Step) => item.stepName === step);

  if (applicationSteps.length === 0) {
    return null;
  }

  if (currentStep?.disabled && previousStep?.disabled) {
    return <Redirect to={createStepsPath(applicationSteps[lastIndex].stepName, companyId, applicationId)} />;
  }

  return (
    <ErrorBoundary>
      <Switch>
        {routes &&
          routes.map((route: RouteConfig) => (
            <RouteWithSubRoutes key={route.path} app={app} parentMatch={match} {...route} />
          ))}
      </Switch>
    </ErrorBoundary>
  );
};

const mapStateToProps = ({ application }: any) => ({
  applicationSteps: application.applicationSteps,
});

export default connect(mapStateToProps)(StepPage);
