import { TextArea } from '@aurora_app/ui-library';
import { Col, Form, Row } from 'antd';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';

import { ErrorType } from '../../../utils/constants';
import { formatErrorMessage } from '../../../utils/errorHandle';
import { Question } from '../models/interfaces';

import styles from './OpenQuestion.module.scss';

interface Props {
  form: any;
  question: Question;
  handleOnBlur: any;
  onChange?: (e: any) => void;
}

const OpenQuestion: FC<Props> = (props) => {
  const {
    question,
    onChange,
    form,
    handleOnBlur,
    question: { questionId },
  } = props;
  const { getFieldDecorator, setFieldsValue, validateFields, getFieldError } = form;
  const [answer, setAnswer] = useState<string | undefined | boolean>(
    question.answer ? question.answer.value[0] : undefined,
  );
  const [showLabel, setShowLabel] = useState<boolean>(question.answer?.value[0] ? false : true);

  const maxLength: number = 5000;

  useEffect(() => {
    setFieldsValue({
      [`question-${questionId}`]: answer,
    });
  }, [setFieldsValue, questionId, answer]);

  useEffect(() => {
    if (question.answer) {
      setAnswer(question.answer.value[0]);
      question.answer.value[0] && setShowLabel(false);
    }
  }, [question.answer]);

  const onBlur = (): void => {
    validateFields((errors: any, values: any) => {
      !errors && handleOnBlur();
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    onChange && onChange(e);
    setShowLabel(e.target.value ? false : true);
  };

  return (
    <Row key={question.questionId} className={styles.openQuestion}>
      <Col className={styles.title}>
        <Row type="flex" gutter={8} className={styles.content}>
          <Col>{question.title}</Col>
          <Col>{question.required && <span className={styles.requiredLabel}>Required</span>}</Col>
        </Row>
      </Col>
      <Col>
        {getFieldDecorator(`question-${questionId}`, {
          rules: [{ max: maxLength, message: formatErrorMessage('Answer', ErrorType.MAX_LENGTH, maxLength) }],
        })(
          <TextArea
            style={{ marginBottom: '16px' }}
            validateStatus={getFieldError(`question-${questionId}`) ? 'error' : ''}
            label={showLabel ? 'Answer' : ''}
            onChange={handleChange}
            onBlur={onBlur}
            autoSize
          />,
        )}
      </Col>
    </Row>
  );
};

export default Form.create<Props>()(OpenQuestion);
