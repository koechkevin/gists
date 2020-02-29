import { Button, FileItem, InputCard, Text, Title } from '@aurora_app/ui-library';
import { Row, Upload } from 'antd';
import React, { useState } from 'react';

import { ConfirmModal } from '../../../../components';
import { UploadFile } from '../../../../models/file';
import { ApplicationController } from '../../components';
import { JobApplication, MatchParams } from '../../models/interfaces';
import styles from './ResumeParser.module.scss';

interface Props {
  resume: any;
  visible: boolean;
  match: MatchParams;
  files: UploadFile[];
  confirmLoading?: boolean;
  application: JobApplication;
  onCancel: (file: UploadFile) => void;
  importResume: (file: UploadFile) => void;
  setFileList: (files: UploadFile[]) => void;
  removeFile: (file: UploadFile, params: object) => void;
  toShowModal: (modal: string, visible: boolean) => void;
}

const ResumeParser: React.FC<Props> = (props) => {
  const {
    files,
    match,
    resume,
    onCancel,
    visible,
    toShowModal,
    removeFile,
    setFileList,
    importResume,
    application,
    confirmLoading,
  } = props;
  const { id } = match.params;
  const { resume: { resumeFileId } } = application;
  const [file, setFile] = useState<UploadFile | null>(null);

  const onRemove = (file: UploadFile) => {
    setFile(file);
    toShowModal('showConfirmModal', true);
  };

  const onOk = () => {
    if (file) {
      const data = { resumeFileId: null };
      removeFile(file, { applicationId: id, application: data });
      setFile(null);
    }
  };

  const customRequest = (event: any) => {
    importResume(event.file);
    setFileList([event.file]);
  };

  return (
    <>
      <InputCard className={styles.resume} style={{ padding: '64px 16px' }}>
        <Title className={styles.title} level={3}>
          Success
        </Title>
        <Text className={styles.desc}>We’ve imported your resume and its ready to review.</Text>
        <Row className={styles.files}>
          {files && files.length
            ? files.map((item: UploadFile, index: number) => (
                <FileItem
                  key={index}
                  name={item.filename || item.name}
                  onRemove={() => onRemove(item)}
                  onCancel={() => onCancel(item)}
                  removable={!item.status || item.status === 'done'}
                  {...item}
                />
              ))
            : null}
        </Row>
        <Upload showUploadList={false} accept=".pdf" customRequest={customRequest}>
          <Button type="link" className={styles.link} style={{ marginTop: 0 }}>
            Upload another file
          </Button>
        </Upload>
      </InputCard>
      <ApplicationController match={match} disableNext={!(resume || resumeFileId)} />
      <ConfirmModal
        onOk={onOk}
        visible={visible}
        confirmLoading={confirmLoading}
        okButtonProps={{
          style: { minWidth: 70 },
        }}
        onCancel={() => toShowModal('showConfirmModal', false)}
      >
        <Text style={{ textAlign: 'center' }}>
          This action will remove whatever have completed so far and will automatically fill in all again with the
          information extracted from the resume you are about to upload
        </Text>
      </ConfirmModal>
    </>
  );
};

export default ResumeParser;
