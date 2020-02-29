import { Loading } from '@aurora_app/ui-library';
import React from 'react';
import Loadable from 'react-loadable';

import { registerModel } from '../../utils';

const Candidate = Loadable.Map({
  loader: {
    Candidate: () => import('./Candidate'),
    model: () => import('./models/job'),
  },
  loading: Loading,
  render(loaded: any, props: any) {
    const Candidate = loaded.Candidate.default;
    const model = loaded.model.default;

    registerModel(props.app, model);

    return <Candidate {...props} app={props.app} />;
  },
});

export { Candidate };
