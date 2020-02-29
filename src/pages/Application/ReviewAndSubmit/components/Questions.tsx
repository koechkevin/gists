import { faQuestion } from '@fortawesome/pro-regular-svg-icons';
import { Row } from 'antd';
import { get } from 'lodash';
import React from 'react';
import FormatText from 'react-format-text';

import { ClosedQuestionChoices, StepName } from '../../../../utils/constants';
import { MatchParams, Question } from '../../models/interfaces';
import ContentWrapper from './ContentWrapper';

import styles from './Questions.module.scss';

interface Props {
  match: MatchParams;
  questions: { textQuestions: Question[]; booleanQuestions: Question[] };
}

const Questions: React.FC<Props> = (props) => {
  const { questions, match } = props;
  const title = 'Questions';

  return (
    <ContentWrapper icon={faQuestion} title={title} match={match} stepName={StepName.questions}>
      <Row className={styles.questions}>
        {questions.booleanQuestions &&
          questions.booleanQuestions.map((question: Question, index: number) => (
            <Row className={styles.question} key={index}>
              <Row className={styles.minorTitle}>{question.title}</Row>
              <Row className={styles.answer}>
                {question.answer
                  ? question.answer.value[0]
                    ? ClosedQuestionChoices.YES
                    : ClosedQuestionChoices.NO
                  : ''}
              </Row>
            </Row>
          ))}
        {questions.textQuestions &&
          questions.textQuestions.map((question: Question, index: number) => (
            <Row className={styles.question} key={index}>
              <Row className={styles.minorTitle}>{question.title}</Row>
              <Row className={styles.answer}>
                <FormatText>{get(question, 'answer.value[0]', '')}</FormatText>
              </Row>
            </Row>
          ))}
      </Row>
    </ContentWrapper>
  );
};

export default Questions;
