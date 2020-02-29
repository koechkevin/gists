import { Loading } from '@aurora_app/ui-library';
import React from 'react';
import Loadable from 'react-loadable';

import { registerModel } from '../../utils';

export const ApplyAuth = Loadable.Map({
  loader: {
    ApplyAuth: () => import('./ApplyAuth'),
    model: () => import('./models/applyAuth'),
  },
  loading: Loading,
  render(loaded: any, props: any) {
    const ApplyAuth = loaded.ApplyAuth.default;
    const model = loaded.model.default;

    registerModel(props.app, model);

    return <ApplyAuth {...props} app={props.app} />;
  },
});
