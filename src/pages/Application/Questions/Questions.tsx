import { InputCard } from '@aurora_app/ui-library';
import { Col, Row } from 'antd';
import { connect } from 'dva';
import { RouteComponentProps } from 'dva/router';
import React, { ChangeEvent, useEffect, useState } from 'react';

import { Dispatch } from '../../../models/dispatch';
import { ClosedQuestionChoices } from '../../../utils/constants';
import { allRequiredQuestionsAnswered, filterQuestions, mapAnswersToQuestions } from '../../../utils/utils';
import { ApplicationController, ApplicationHeader, ClosedQuestion, OpenQuestion } from '../components';
import { Answer, Params, Question } from '../models/interfaces';
import { ClosedAnswer } from './interfaces';

import styles from './Questions.module.scss';

interface State {
  questions: { textQuestions: Question[]; booleanQuestions: Question[] };
}

interface Props extends RouteComponentProps<Params> {
  questions: Question[];
  responses: Answer[];
  updateResponse: (responseId: string, params: any) => void;
  postResponse: (params: object) => void;
}

const Questions: React.FC<Props> = (props) => {
  const { match, questions, responses, postResponse, updateResponse } = props;
  const { id } = match.params;
  const [nextButtonDisabled, disableNextButton] = useState<boolean>(false);
  const [openQuestionResponse, setOpenQuestionResponse] = useState();

  const [state, setState] = useState<State>({
    questions: {
      textQuestions: mapAnswersToQuestions(filterQuestions(questions, 'text'), responses),
      booleanQuestions: mapAnswersToQuestions(filterQuestions(questions, 'boolean'), responses),
    },
  });

  useEffect(() => {
    setState((state: State) => ({
      ...state,
      questions: {
        textQuestions: mapAnswersToQuestions(filterQuestions(questions, 'text'), responses),
        booleanQuestions: mapAnswersToQuestions(filterQuestions(questions, 'boolean'), responses),
      },
    }));
  }, [questions, responses]);

  useEffect(() => {
    const closedRequiredAnswered: boolean = allRequiredQuestionsAnswered(state.questions.booleanQuestions);
    const openRequiredAnswered: boolean = allRequiredQuestionsAnswered(state.questions.textQuestions);
    disableNextButton(!(closedRequiredAnswered && openRequiredAnswered));
  }, [state.questions]);

  const handleClosedAnswerResponse = (questionId: string, answer: ClosedAnswer, responseId?: string): void => {
    if (responseId) {
      updateResponse(responseId, {
        value: [answer === ClosedQuestionChoices.YES],
      });
    } else {
      postResponse({
        applicationId: props.match.params.id,
        questionId,
        value: [answer === ClosedQuestionChoices.YES],
      });
    }
  };

  const handleOpenQuestionResponse = (question: Question) => (e: ChangeEvent<HTMLInputElement>): void => {
    setOpenQuestionResponse({
      questionId: question.questionId,
      value: [e.target.value],
      applicationId: props.match.params.id,
    });
  };

  const handleOnBlur = (question: Question): void => {
    const responseId: string | undefined = question.answer ? question.answer.responseId : undefined;

    if (responseId) {
      updateResponse(responseId, {
        value: openQuestionResponse.value,
      });
    } else {
      postResponse({
        ...openQuestionResponse,
      });
    }
  };

  return (
    <>
      <ApplicationHeader match={match} title="Questions" />
      <Row className={styles.questionsPage} key={id}>
        <InputCard className={styles.inputCard}>
          <Row>
            <Col>
              {state.questions.booleanQuestions.map((question: Question) => (
                <ClosedQuestion
                  key={question.questionId}
                  question={question}
                  handleNoBtnClick={() =>
                    handleClosedAnswerResponse(
                      question.questionId,
                      ClosedQuestionChoices.NO,
                      question.answer ? question.answer.responseId : undefined,
                    )
                  }
                  handleYesBtnClick={() =>
                    handleClosedAnswerResponse(
                      question.questionId,
                      ClosedQuestionChoices.YES,
                      question.answer ? question.answer.responseId : undefined,
                    )
                  }
                />
              ))}
            </Col>
            <Col>
              {state.questions.textQuestions.map((question: Question) => (
                <OpenQuestion
                  key={question.questionId}
                  question={question}
                  onChange={handleOpenQuestionResponse(question)}
                  ref={React.createRef()}
                  handleOnBlur={() => handleOnBlur(question)}
                />
              ))}
            </Col>
          </Row>
        </InputCard>
      </Row>
      <ApplicationController match={match} disableNext={nextButtonDisabled} />
    </>
  );
};

const mapStateToProps = ({ application: { questions, responses } }) => ({
  responses,
  questions,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  postResponse: (params: any) => {
    dispatch({ type: 'application/postQuestionResponse', payload: params });
  },

  updateResponse: (responseId: string, params: any) => {
    dispatch({ type: 'application/updateQuestionResponse', payload: { responseId, params } });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Questions);
