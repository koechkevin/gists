import { Col, Row, Typography } from 'antd';
import React, { FC, ReactNode } from 'react';

import styles from './StepBanner.module.scss';

interface Props {
  title?: string;
  text?: string;
  className?: string;
  customizedText?: ReactNode;
}

interface TypographyProps {
  size?: number;
  style?: any;
  className?: string;
}

const Title: FC<TypographyProps> = (props) => {
  const { size, style, className, ...restProps } = props;

  return (
    <Typography.Text
      style={{ fontSize: size || 24, ...style }}
      className={`${styles.title} ${className || ''}`}
      {...restProps}
    />
  );
};

const Text: FC<TypographyProps> = (props) => {
  const { size, style, className, ...restProps } = props;
  return (
    <Typography.Text
      style={{ fontSize: size || 16, ...style }}
      className={`${styles.text} ${className || ''}`}
      {...restProps}
    />
  );
};

const StepBanner: FC<Props> = (props) => {
  const { title, text, children, className, customizedText } = props;

  return (
    <Row className={className}>
      <Row className={styles.card}>
        <Title className={styles.header} size={24}>
          {title}
        </Title>
        <Col className={styles.body}>
          {!customizedText ? (
            <Text className={styles.bodyText} size={16}>
              {text}
            </Text>
          ) : (
            customizedText
          )}
        </Col>
        {children}
      </Row>
    </Row>
  );
};

export default StepBanner;
