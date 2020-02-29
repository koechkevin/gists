import { FileDropZone, FileItem, InputCard, TextArea } from '@aurora_app/ui-library';
import { Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { RcFile } from 'antd/lib/upload';
import { connect } from 'dva';
import { RouteComponentProps } from 'dva/router';
import React, { FC, useEffect, useState } from 'react';

import { ConfirmModal } from '../../../components';
import { Dispatch } from '../../../models/dispatch';
import { UploadFile } from '../../../models/file';
import { ErrorType } from '../../../utils/constants';
import { formatErrorMessage } from '../../../utils/errorHandle';
import { ApplicationController, ApplicationHeader } from '../components';
import { JobApplication, Params } from '../models/interfaces';

const { create } = Form;

interface Props extends FormComponentProps, RouteComponentProps<Params> {
  files: UploadFile[];
  loading: boolean;
  loadingFile: boolean;
  showModal: boolean;
  application: JobApplication;
  uploadFile: (file: UploadFile) => void;
  setFileList: (files: UploadFile[]) => void;
  setShowModal: (showModal: boolean) => void;
  removeFile: (file: UploadFile, params: object) => void;
  updateApplication: (id: string, params: object) => void;
  fetchApplicationFile: (applicationId: string, fields: string) => void;
}

const CoverLetter: FC<Props> = (props) => {
  const {
    form,
    match,
    files,
    loading,
    setFileList,
    application,
    uploadFile,
    removeFile,
    showModal,
    setShowModal,
    updateApplication,
    fetchApplicationFile,
  } = props;
  const { getFieldDecorator, getFieldError, validateFields } = form;
  const { id: applicationId } = match.params;
  const { coverLetterText } = application;

  const [fileIndex, setFileIndex] = useState<number>(0);

  useEffect(() => {
    fetchApplicationFile(applicationId, 'signedCoverLetter');
  }, [fetchApplicationFile, applicationId]);

  const beforeUpload = (file: RcFile): boolean => {
    setFileList([file]);
    uploadFile(file);
    return false;
  };

  const onBlur = () => {
    validateFields((errors: any, values: any) => {
      if (!errors) {
        updateApplication(applicationId, values);
      }
    });
  };

  const onRemove = (index: number) => {
    const file: UploadFile = files[index];
    const data = { coverLetterFileId: null };
    removeFile(file, { applicationId, application: data });
  };

  const openModal = (index: number): void => {
    setFileIndex(index);
    setShowModal(true);
  };

  return (
    <>
      <ApplicationHeader title="Cover Letter" match={match} />
      <InputCard key={applicationId}>
        {getFieldDecorator('coverLetterText', {
          initialValue: coverLetterText,
          rules: [{ max: 5000, message: formatErrorMessage('Cover letter', ErrorType.MAX_LENGTH, 5000) }],
        })(
          <TextArea
            autoSize
            onBlur={onBlur}
            maxLength="25000"
            style={{ marginBottom: 32 }}
            label="Your message to company"
            help={getFieldError('coverLetterText') || ''}
            validateStatus={getFieldError('coverLetterText') ? 'error' : ''}
          />,
        )}
        {files && files.length ? (
          files.map((item: UploadFile, index: number) => (
            <FileItem
              key={index}
              name={item.filename || item.name}
              onRemove={() => openModal(index)}
              removable={!item.status || item.status === 'done'}
              {...item}
            />
          ))
        ) : (
          <FileDropZone accept=".pdf" beforeUpload={beforeUpload} buttonText="Drag and drop or Upload" />
        )}
      </InputCard>
      <ApplicationController match={match} disableNext={!(coverLetterText || application.coverLetterFileId)} />
      <ConfirmModal
        centered={false}
        okText="Delete"
        visible={showModal}
        confirmLoading={loading}
        title="Delete this cover letter"
        onOk={() => onRemove(fileIndex)}
        onCancel={() => setShowModal(false)}
        okButtonProps={{ type: 'danger', style: { minWidth: 83 } }}
      >
        Are you sure you want to delete this cover letter?
      </ConfirmModal>
    </>
  );
};

const mapStateToProps = ({ application, fileUpload, common, loading }: any) => ({
  files: fileUpload.files,
  application: application.application,
  showModal: common.coverLetterModal,
  loading: loading.effects['application/removeFile'],
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateApplication: (applicationId: string, application: any) => {
    dispatch({
      type: 'application/updateApplication',
      payload: { applicationId, application },
    });
  },

  setFileList: (files: UploadFile[]) => {
    return dispatch({
      type: 'fileUpload/loadFileList',
      payload: files,
    });
  },

  cancelUpload: (file: UploadFile) => {
    dispatch({
      type: 'fileUpload/cancelUpload',
      payload: file,
    });
  },

  uploadFile: (file: UploadFile) => {
    dispatch({
      type: 'application/uploadFile',
      payload: { file, field: 'coverLetterFileId' },
    });
  },

  fetchApplicationFile: (applicationId: string, fields: string) => {
    dispatch({
      type: 'application/fetchApplicationFile',
      payload: { applicationId, fields },
    });
  },

  removeFile: (file: UploadFile, params: object) => {
    dispatch({
      type: 'application/removeFile',
      payload: { file, params },
    });
  },

  setShowModal: (showModal: boolean) => {
    dispatch({ type: 'common/showOrHideModal', modal: 'coverLetterModal', payload: showModal });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(create()(CoverLetter));
