import { Route, RouteComponentProps } from 'dva/router';
import queryString from 'query-string';
import React, { FC } from 'react';
import DocumentTitle from 'react-document-title';

import { RouteConfig } from './config';

interface Props extends RouteConfig {
  app: any;
  parentMatch?: any;
}

export const RouteWithSubRoutes: FC<Props> = (route) => {
  const { path, name, app, routes, auth, parentMatch } = route;

  return (
    <Route
      key={path}
      path={path}
      render={(props: RouteComponentProps<any>) => {
        // Match location query string
        const reg = /\?\S*/g;
        const queryParams = window.location.href.match(reg);
        const { params } = props.match;
        const title = `Aurora Web App-${name}`;

        Object.keys(params).forEach((key: string) => {
          params[key] = params[key] && params[key].replace(reg, '');
        });

        props.match.params = { ...parentMatch?.params, ...params };

        const mergedProps = {
          app,
          auth,
          ...props,
          query: queryParams ? queryString.parse(queryParams[0]) : {},
        };

        return route.component ? (
          <DocumentTitle title={title}>
            <route.component {...mergedProps} routes={routes} />
          </DocumentTitle>
        ) : null;
      }}
    />
  );
};

export default RouteWithSubRoutes;
