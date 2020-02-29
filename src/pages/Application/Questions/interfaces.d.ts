import { ChangeEvent } from 'react';

import { ClosedQuestionChoices } from '../../../utils/constants';

export type EventHandler = (e: ChangeEvent<HTMLInputElement>) => void;

export type EventHandler = (e: ChangeEvent<HTMLInputElement>) => void;

export type ClosedAnswer = ClosedQuestionChoices.YES | ClosedQuestionChoices.NO;
