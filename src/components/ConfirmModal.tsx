import { Modal } from '@aurora_app/ui-library';
import { Row } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import React, { FC } from 'react';

export const ConfirmModal: FC<ModalProps> = (props) => {
  const { children } = props;

  return (
    <Modal centered={false} {...props}>
      <Row type="flex" justify="center">
        {children}
      </Row>
    </Modal>
  );
};

export default ConfirmModal;
