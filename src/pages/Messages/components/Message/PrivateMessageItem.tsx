import { Avatar } from '@aurora_app/ui-library';
import { Icon, List, Row } from 'antd';
import { format } from 'date-fns';
import { Link } from 'dva/router';
import React, { FC, ReactNode } from 'react';

import { Message } from '../../models/typed.d';

import styles from './PrivateMessageItem.module.scss';

interface PrivateMessageProps extends Message {
  handleCall?: () => void;
  handleMessage?: () => void;
}

const { Item } = List;
const logo: string = `${process.env.PUBLIC_URL}/images/icons/logo-mark.svg`;

export const PrivateMessageItem: FC<PrivateMessageProps> = (props) => {
  const { updatedAt, text, author } = props;
  const description: ReactNode =
    author && author.isRobot ? (
      <span className={styles.template} dangerouslySetInnerHTML={{ __html: text || '' }} />
    ) : (
      text
    );

  return (
    <Item className={styles.privateMessageItem}>
      <Row className={styles.private}>
        <Icon type="eye" /> Only visible to me
      </Row>
      <Item.Meta
        avatar={<Avatar src={logo} />}
        title={
          <Row>
            <Link to="/" className={styles.name}>
              {author && author.name}
            </Link>
            <span className={styles.createdAt}>{updatedAt && format(new Date(updatedAt), 'hh:mm b')}</span>
          </Row>
        }
        description={description}
      />
    </Item>
  );
};

export default PrivateMessageItem;
