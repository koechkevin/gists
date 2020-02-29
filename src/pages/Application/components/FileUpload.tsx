import { Button, Icon, InputCard, Progress } from '@aurora_app/ui-library';
import { faArrowUp } from '@fortawesome/pro-solid-svg-icons';
import { Row, Typography, Upload } from 'antd';
import { RcCustomRequestOptions } from 'antd/lib/upload/interface';
import { get } from 'lodash';
import React, { FC, ReactNode } from 'react';

import { UploadFile } from '../../../models/file';
import styles from './FileUpload.module.scss';

const { Dragger } = Upload;
const { Title, Text } = Typography;
const fileTypes: string = '.jpg, .jpeg, .png, .pdf, .docx, .doc, .pdf, .tiff, .xls, .xlsx, .mp4';

interface Props {
  accept?: string;
  title?: ReactNode;
  desc?: ReactNode;
  file?: UploadFile;
  uploading?: boolean;
  linkText: string;
  buttonText: string;
  loadingText?: ReactNode;
  onCreate?: () => void;
  customRequest?: (options: RcCustomRequestOptions) => void;
}

const FileUpload: FC<Props> = (props) => {
  const { desc, accept, title, file, linkText, loadingText, uploading, buttonText, onCreate, customRequest } = props;

  return (
    <Row className={styles.fileUpload}>
      {uploading ? (
        <InputCard style={{ padding: '64px 16px' }}>
          <Title level={4} className={styles.title}>
            {loadingText || 'Importing...'}
          </Title>
          <Progress showInfo={false} style={{ maxWidth: 360, marginTop: 40 }} percent={get(file, 'percent')} />
        </InputCard>
      ) : (
        <Dragger
          accept={accept}
          showUploadList={false}
          openFileDialogOnClick={false}
          customRequest={customRequest}
          className={styles.uploadArea}
        >
          <Row type="flex" justify="center" style={{ flexDirection: 'column', marginBottom: 32 }}>
            <Title level={4} className={styles.title}>
              {title}
            </Title>
            <Text className={styles.desc}>{desc}</Text>
          </Row>
          <Upload accept={accept} showUploadList={false} customRequest={customRequest}>
            <Button type="primary">
              <Icon icon={faArrowUp} className={styles.uploadIcon} />
              <span>{buttonText}</span>
            </Button>
          </Upload>
          <Button type="link" className={styles.link} onClick={onCreate}>
            {linkText}
          </Button>
        </Dragger>
      )}
    </Row>
  );
};

FileUpload.defaultProps = {
  accept: fileTypes,
};

export default FileUpload;
