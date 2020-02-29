import humps from 'humps';

import { FileService } from '../services';
import { Action, Effects } from './dispatch';
import { UploadFile } from './file';

function* uploadFileSaga({ payload }: Action, { call, take, put, cancelled }: Effects) {
  // Upload the specified file
  const { name } = payload;
  const uploadChannel = yield call(FileService.createUploadChannel, payload);

  try {
    while (true) {
      const response = yield take(uploadChannel);
      const { data, percent, error } = response;

      if (percent) {
        yield put({
          type: 'uploadStatus',
          payload: { ...payload, percent, filename: name, status: 'uploading' },
        });
      }

      if (error) {
        yield put({
          type: 'uploadStatus',
          payload: { ...payload, error, filename: name, status: 'error' },
        });
      }

      if (data) {
        const fileData: any = humps.camelizeKeys(data);

        yield put({
          type: 'uploadStatus',
          payload: { ...payload, ...fileData, percent: 100, status: 'done' },
        });
      }
    }
  } finally {
    if (yield cancelled()) {
      // Close Channel
      uploadChannel.close();
      yield put({
        type: 'uploadStatus',
        payload: { ...payload, filename: name, status: 'error', statusInfo: 'Upload Canceled' },
      });
    }
  }
}

export interface FileUploadState {
  files: UploadFile[];
}

const initialState: FileUploadState = {
  files: [],
};

export default {
  namespace: 'fileUpload',

  state: initialState,

  effects: {
    // upload file action
    *uploadFile({ payload }: Action, { call, cancel, fork, put, take, cancelled }: Effects) {
      try {
        const uploadTask = yield fork(uploadFileSaga, { payload }, { call, put, take, cancelled });

        if (yield take('cancelUpload')) {
          yield cancel(uploadTask);
        }
      } catch (error) {
        throw error;
      }
    },

    // cancel upload file action
    *cancelUpload() {},

    *uploadStatus({ payload }: Action, { put }: Effects) {
      try {
        yield put({ type: 'updateUploadStatus', payload });
      } catch (error) {
        throw error;
      }
    },

    downloadFile({ payload }: Action, { call }: Effects) {
      try {
        const { signedUrl } = payload;
        const a = document.createElement('a');

        a.href = signedUrl;
        a.click();
      } catch (error) {
        throw error;
      }
    },
  },

  reducers: {
    loadFileList(state: FileUploadState, { payload }: Action): FileUploadState {
      return { files: payload };
    },

    clearFileList(state: FileUploadState, { payload }: Action): FileUploadState {
      return { files: [] };
    },

    updateUploadStatus(state: FileUploadState, { payload }: Action): FileUploadState {
      const { uid } = payload as UploadFile;
      const files = state.files.map((item: UploadFile) => {
        if (item.uid === uid) {
          return payload;
        }
        return item;
      });

      return { files };
    },

    updateFileStatus(state: FileUploadState, { payload }: Action): FileUploadState {
      const { fileId } = payload as UploadFile;
      const files = state.files.map((item: UploadFile) => {
        if (item.fileId === fileId) {
          return payload;
        }
        return item;
      });

      return { files };
    },

    removeFile(state: FileUploadState, { payload }: Action): FileUploadState {
      const { uid } = payload as UploadFile;
      const files = state.files.filter((item: UploadFile) => item.uid === uid);

      return { files };
    },
  },

  subscriptions: {
    setup({ dispatch, history }: any) {
      return history.listen(({ pathname }: Location) => {
        // When location changes, clear file list
        dispatch({ type: 'clearFileList' });
      });
    },
  },
};
