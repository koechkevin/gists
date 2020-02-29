import { RadioButton } from '@aurora_app/ui-library';
import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { Question } from '../models/interfaces';

import { ClosedQuestionChoices } from '../../../utils/constants';
import styles from './ClosedQuestion.module.scss';

interface Props {
  question: Question;
  handleYesBtnClick: () => void;
  handleNoBtnClick: () => void;
}

const ClosedQuestion: React.FC<Props> = (props) => {
  const { question, handleYesBtnClick, handleNoBtnClick } = props;
  const [response, setResponse] = useState<string>(
    question.answer?.value[0]
      ? ClosedQuestionChoices.YES
      : question.answer?.value[0] === false
      ? ClosedQuestionChoices.NO
      : '',
  );

  useEffect(() => {
    setResponse(
      question.answer?.value[0]
        ? ClosedQuestionChoices.YES
        : question.answer?.value[0] === false
        ? ClosedQuestionChoices.NO
        : '',
    );
  }, [question.answer]);

  const giveResponse = (choice: string): void => {
    setResponse(choice);

    if (choice === ClosedQuestionChoices.YES) {
      return handleYesBtnClick();
    }

    return handleNoBtnClick();
  };

  return (
    <Row gutter={8} justify="space-between" className={styles.closedQuestion} key={question.questionId} align="middle">
      <Col className={styles.question}>
        <Row type="flex" gutter={8} className={styles.title}>
          <Col>{question.title}</Col>
          <Col>{question.required && <span className={styles.label}>Required</span>}</Col>
        </Row>
      </Col>
      <Col className={styles.answer}>
        <Row type="flex" gutter={24}>
          <RadioButton
            style={{ paddingLeft: '16px' }}
            checked={response === ClosedQuestionChoices.YES}
            onClick={() => giveResponse(ClosedQuestionChoices.YES)}
          >
            <span style={{ marginLeft: '16px' }}>Yes</span>
          </RadioButton>
          <RadioButton
            style={{ paddingLeft: '16px' }}
            checked={response === ClosedQuestionChoices.NO}
            onClick={() => giveResponse(ClosedQuestionChoices.NO)}
          >
            <span style={{ marginLeft: '16px' }}>No</span>
          </RadioButton>
        </Row>
      </Col>
    </Row>
  );
};

export default ClosedQuestion;
