import { connect } from 'dva';
import { RouteComponentProps } from 'dva/router';
import React, { useEffect, useState } from 'react';

import { Dispatch } from '../../../models/dispatch';
import { UploadFile } from '../../../models/file';
import { ApplicationHeader, FileUpload } from '../components';
import { FinishedStep, JobApplication, Params } from '../models/interfaces';
import { ResumeParser } from './components';

interface Props extends RouteComponentProps<Params> {
  resume: any;
  loading: boolean;
  importing: boolean;
  files: UploadFile[];
  showConfirmModal: boolean;
  application: JobApplication;
  importResume: (file: UploadFile) => void;
  setFileList: (files: UploadFile[]) => void;
  cancelUpload: (file: UploadFile) => void;
  toShowModal: (modal: string, visible: boolean) => void;
  removeResume: (file: UploadFile, params: object) => void;
  fetchApplicationFile: (applicationId: string, fields: string) => void;
  updateApplication: (applicationId: string, application: any) => void;
  updateApplicationSteps: (currentStep: string, steps: FinishedStep[]) => void;
}

const Resume: React.FC<Props> = (props) => {
  const {
    match,
    files,
    resume,
    loading,
    importing,
    setFileList,
    toShowModal,
    application,
    removeResume,
    cancelUpload,
    importResume,
    showConfirmModal,
    updateApplication,
    fetchApplicationFile,
    updateApplicationSteps,
  } = props;
  const { id: applicationId, step } = match.params;
  const { resume: { resumeFileId }, steps } = application;
  const [file, setFile] = useState<UploadFile>();
  const uploading = file ? file.status === 'uploading' || importing : false;

  useEffect(() => {
    fetchApplicationFile(applicationId, 'resume.signedResume');
  }, [fetchApplicationFile, applicationId]);

  useEffect(() => {
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  }, [setFile, files]);

  useEffect(() => {
    if (resume && resumeFileId) {
      let { skills } = resume;
      skills = skills.map((item: any) => item.skillId);

      updateApplication(applicationId, { ...resume, skills });
    }
  }, [updateApplication, applicationId, resumeFileId, resume]);

  const customRequest = (event: any) => {
    importResume(event.file);
    setFileList([event.file]);
  };

  const updateSteps = () => {
    if (step) {
      const finishedSteps = steps || [];
      const stepsData = finishedSteps.concat([{ name: step }]);
      updateApplicationSteps(step, stepsData);
    }
  };

  return (
    <>
      <ApplicationHeader hideButton match={match} title="Resume" />
      {(!!resumeFileId && !importing) || loading ? (
        <ResumeParser
          match={match}
          files={files}
          resume={resume}
          confirmLoading={loading}
          visible={showConfirmModal}
          toShowModal={toShowModal}
          onCancel={cancelUpload}
          removeFile={removeResume}
          setFileList={setFileList}
          application={application}
          importResume={importResume}
        />
      ) : (
        <FileUpload
          file={file}
          accept=".pdf"
          uploading={uploading}
          onCreate={updateSteps}
          buttonText="Upload resume"
          title="Create a new resume"
          customRequest={customRequest}
          linkText="Manually create resume"
          desc="Upload new resume for parsing or manually create a new one."
        />
      )}
    </>
  );
};

const mapStateToProps = ({ application, fileUpload, common, loading }: any) => ({
  files: fileUpload.files,
  resume: application.resume,
  application: application.application,
  showConfirmModal: common.showConfirmModal,
  loading: loading.effects['application/removeResume'],
  importing: loading.effects['application/importResume'],
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateApplication: (applicationId: string, application: any) => {
    dispatch({
      type: 'application/updateApplication',
      payload: { applicationId, application },
    });
  },

  updateApplicationSteps: (currentStep: string, steps: FinishedStep[]) => {
    dispatch({
      type: 'application/updateApplicationSteps',
      payload: { currentStep, steps },
    });
  },

  fetchApplicationFile: (applicationId: string, fields: string) => {
    dispatch({
      type: 'application/fetchApplicationFile',
      payload: { applicationId, fields },
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

  importResume: (file: UploadFile) => {
    dispatch({
      type: 'application/importResume',
      payload: { file },
    });
  },

  removeResume: (file: UploadFile, params: object) => {
    dispatch({
      type: 'application/removeResume',
      payload: { file, params },
    });
  },

  toShowModal: (modal: string, visible: boolean) => {
    dispatch({
      type: 'common/showOrHideModal',
      modal,
      payload: visible,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Resume);
