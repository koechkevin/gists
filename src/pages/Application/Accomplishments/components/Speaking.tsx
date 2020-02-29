import { Icon, Input, InputCard, Tooltip } from '@aurora_app/ui-library';

import { faTrashAlt } from '@fortawesome/pro-regular-svg-icons';
import { Form, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { get } from 'lodash';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { AccomplishmentCategories, ErrorType, FormSectionTypes } from '../../../../utils/constants';
import { formatErrorMessage } from '../../../../utils/errorHandle';
import { checkAllFieldsFilled, isEmptyForm } from '../../../../utils/utils';
import { AddItemButton } from '../../components';
import { ApplicationForm, Speaking as SpeakingInterface } from '../../models/interfaces';

import styles from '../Accomplishments.module.scss';

interface Props extends FormComponentProps {
  speakings?: SpeakingInterface[];
  applicationForm?: ApplicationForm;
  addField: (fieldType: string) => void;
  onBlur: (fieldName: string) => void | boolean;
  deleteSection: (index: number, category: string) => void;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  determineRenderDeleteIcons: (accomplishments?: SpeakingInterface[]) => boolean;
  getActiveButtonStatus: (accomplishments?: SpeakingInterface[], type?: string) => boolean;
  getErrors: (error: object) => void;
}

const FormContent: React.FC<Props> = (props) => {
  const {
    form,
    onBlur,
    addField,
    speakings,
    deleteSection,
    handleInputChange,
    getActiveButtonStatus,
    determineRenderDeleteIcons,
    applicationForm,
    getErrors,
  } = props;
  const { getFieldDecorator, getFieldError, getFieldsValue, setFieldsValue, validateFields } = form;
  const [buttonActive, setButtonActive] = useState<boolean>(false);

  useEffect(() => {
    setButtonActive(getActiveButtonStatus(speakings, AccomplishmentCategories.SPEAKING));
  }, [speakings, getActiveButtonStatus]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    let active: boolean = e.target.value ? true : false;
    active = checkAllFieldsFilled(active, getFieldsValue());
    setButtonActive(active);
    handleInputChange(e);
  };

  const handleBlur = (fieldName: string): void => {
    validateFields((errors, values) => {
      if (!errors) {
        onBlur(fieldName);
        getErrors({ speaking: '' });
      } else {
        getErrors({ speaking: errors });
      }
    });
  };

  const setFieldsRequired = (fieldName: string, index: number): boolean => {
    const allFieldNames: string[] = [
      `speaking_event_${index}`,
      `speaking_type_${index}`,
      `speaking_description_${index}`,
    ];
    const otherFieldNames: string[] = allFieldNames.filter((name: string) => name !== fieldName);
    const fieldsValues: object = getFieldsValue(otherFieldNames);

    return !isEmptyForm(fieldsValues);
  };

  const deleteCard = (index: number) => {
    deleteSection(index, AccomplishmentCategories.SPEAKING);
    setFieldsValue({
      [`speaking_event_${index}`]: '',
      [`speaking_type_${index}`]: '',
      [`speaking_description_${index}`]: '',
    });
  };

  return (
    <InputCard title="Speaking Engagements" className={styles.inputCard}>
      {(speakings && get(speakings, 'length') ? speakings : [{ type: '', event: '', description: '' }]).map(
        (speaking: SpeakingInterface, index: number) => (
          <InputCard key={index} className={index !== 0 ? styles.inputCard : ''}>
            {getFieldDecorator(`speaking_event_${index}`, {
              rules: [
                {
                  required:
                    applicationForm?.accomplishments.stepFieldsTypes.speaking === FormSectionTypes.REQUIRED ||
                    setFieldsRequired(`speaking_event_${index}`, index),
                  message: formatErrorMessage('Speaking event', ErrorType.REQUIRED),
                },
                {
                  max: 512,
                  message: formatErrorMessage('Speaking event', ErrorType.MAX_LENGTH, 512),
                },
              ],
              initialValue: speaking.event,
            })(
              <Input
                label="Event"
                onChange={onChange}
                name={`speaking_event_${index}`}
                onBlur={() => handleBlur(`speaking_${index}`)}
                validateStatus={getFieldError(`speaking_event_${index}`) ? 'error' : ''}
              />,
            )}
            {getFieldDecorator(`speaking_type_${index}`, {
              rules: [
                {
                  required:
                    applicationForm?.accomplishments.stepFieldsTypes.speaking === FormSectionTypes.REQUIRED ||
                    setFieldsRequired(`speaking_type_${index}`, index),
                  message: formatErrorMessage('Speaking type', ErrorType.REQUIRED),
                },
                {
                  max: 512,
                  message: formatErrorMessage('Speaking type', ErrorType.MAX_LENGTH, 512),
                },
              ],
              initialValue: speaking.type,
            })(
              <Input
                label="Type"
                onChange={onChange}
                name={`speaking_type_${index}`}
                onBlur={() => handleBlur(`speaking_${index}`)}
                validateStatus={getFieldError(`speaking_type_${index}`) ? 'error' : ''}
              />,
            )}
            {getFieldDecorator(`speaking_description_${index}`, {
              rules: [
                {
                  required:
                    applicationForm?.accomplishments.stepFieldsTypes.speaking === FormSectionTypes.REQUIRED ||
                    setFieldsRequired(`speaking_description_${index}`, index),
                  message: formatErrorMessage('Speaking description', ErrorType.REQUIRED),
                },
                {
                  max: 512,
                  message: formatErrorMessage('Speaking description', ErrorType.MAX_LENGTH, 512),
                },
              ],
              initialValue: speaking.description,
            })(
              <Input
                label="Description"
                onChange={onChange}
                name={`speaking_description_${index}`}
                onBlur={() => handleBlur(`speaking_${index}`)}
                validateStatus={getFieldError(`speaking_description_${index}`) ? 'error' : ''}
              />,
            )}
            {determineRenderDeleteIcons(speakings) && (
              <Row type="flex" justify="end" id="remove">
                <Tooltip
                  title="Remove"
                  placement="top"
                  getPopupContainer={() => document.getElementById('remove') || document.body}
                >
                  <Icon
                    hover
                    icon={faTrashAlt}
                    onClick={() => deleteCard(index)}
                    getPopupContainer={() => document.getElementById('remove') || document.body}
                  />
                </Tooltip>
              </Row>
            )}
          </InputCard>
        ),
      )}
      <AddItemButton
        onClick={() => addField(AccomplishmentCategories.SPEAKING)}
        disabled={!buttonActive || (speakings && speakings.length >= 30)}
        className={styles.button}
      />
    </InputCard>
  );
};

const Speaking = Form.create<Props>()(FormContent);

export default Speaking;
