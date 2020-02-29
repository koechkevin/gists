import { Switch } from 'dva/router';
import React from 'react';

import { RouteConfig, RouteWithSubRoutes } from '../../routes';

interface InternalProps {
  app: any;
  routes: RouteConfig[];
}

const Candidate: React.FC<InternalProps> = (props) => {
  const { app, routes } = props;

  return (
    <Switch>
      {routes.map((item: RouteConfig) => (
        <RouteWithSubRoutes key={item.path} app={app} {...item} />
      ))}
    </Switch>
  );
};

export default Candidate;
