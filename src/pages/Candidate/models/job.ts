import humps from 'humps';

import { Action } from '../../../models/dispatch';
import { JobService } from '../../../services';
import { Job } from './typed';

export interface JobState {
  jobs: Job[];
}

const initialState: JobState = {
  jobs: [],
};

export default {
  namespace: 'job',

  state: initialState,

  effects: {
    *fetchJobs(action: Action, { call, put }: any) {
      try {
        const response = yield call(JobService.fetchJobs);
        let { data } = response;

        if (data) {
          data = humps.camelizeKeys(data);
          yield put({ type: 'loadJobs', payload: data.items });
        }
      } catch (error) {
        throw error;
      }
    },
  },

  reducers: {
    loadJobs(state: JobState, { payload }: Action): JobState {
      return { ...state, jobs: payload };
    },
  },
};
