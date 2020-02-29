import { BaseMenu } from '@aurora_app/ui-library';
import { getFlatMenuKeys } from '@aurora_app/ui-library/lib/utils';
import { faFileAlt } from '@fortawesome/pro-regular-svg-icons';
import { connect } from 'dva';
import { matchPath, RouteComponentProps } from 'dva/router';
import React, { FC, useEffect, useState } from 'react';
import { useMedia } from 'react-use';

import { UserProfile } from '../../../models/user';
import { Routes } from '../../../routes';
import { APPLICATION_STATUS, StepName } from '../../../utils/constants';
import { JobApplication } from '../models/interfaces';

interface Props extends RouteComponentProps {
  applications: JobApplication[];
  profile: UserProfile;
}

const JobApplicationMenu: FC<Props> = (props) => {
  const { profile, location, applications } = props;
  const currentUrl: string = window.location.href;

  const [currentPath, setCurrentPath] = useState<string>('');
  const isMobile = useMedia('(max-width: 1024px)');

  const { pathname } = location;
  const match = matchPath<any>(pathname, {
    path: `${Routes.Candidate}/:id`,
  });
  const companyId = match ? match.params.id : null;

  useEffect(() => {
    const pathArray: string[] = currentUrl.split('/');
    const steps: string[] = Object.values(StepName);
    const stepName: string = pathArray[pathArray.length - 1];

    if (pathArray.includes('application') && steps.includes(stepName)) {
      setCurrentPath(pathArray[pathArray.length - 1]);
    }
  }, [currentUrl, setCurrentPath]);

  const filterJobs = () => {
    const applicationDetails = applications
      .filter(
        (jobApplication: JobApplication) =>
          jobApplication.candidateId === profile.profileId && jobApplication.status !== APPLICATION_STATUS.WITHDRAWN,
      )
      .filter((application: JobApplication) => application.companyId === companyId)
      .map((item: any) => ({
        icon: faFileAlt,
        name: item.job.jobTitle,
        tooltip: item.job.jobTitle,
        path: isMobile
          ? `${Routes.Candidate}/${item.companyId}/application/${item.applicationId}`
          : currentPath
          ? `${Routes.Candidate}/${item.companyId}/application/${item.applicationId}/${currentPath}`
          : `${Routes.Candidate}/${item.companyId}/application/${item.applicationId}/resume`,
      }));

    return applicationDetails;
  };

  const menu = [
    {
      name: 'Job Applications',
      path: `${Routes.Candidate}/${companyId}`,
      routes: filterJobs(),
    },
  ];
  const flatMenuKeys = getFlatMenuKeys(menu);
  const defaultOpenKeys = [`${Routes.Candidate}/${companyId}`];

  return <BaseMenu menu={menu} location={location} flatMenuKeys={flatMenuKeys} defaultOpenKeys={defaultOpenKeys} />;
};

const mapStateToProps = ({ application: { applications }, global: { profile } }: any) => ({
  applications,
  profile,
});

export default connect(mapStateToProps)(JobApplicationMenu);
