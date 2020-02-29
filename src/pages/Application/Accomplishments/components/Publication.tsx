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
import { ApplicationForm, Publication as PublicationInterface } from '../../models/interfaces';

import styles from '../Accomplishments.module.scss';

interface Props extends FormComponentProps {
  publications?: PublicationInterface[];
  applicationForm?: ApplicationForm;
  addField: (fieldType: string) => void;
  onBlur: (fieldName: string) => void | boolean;
  deleteSection: (index: number, category: string) => void;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  determineRenderDeleteIcons: (accomplishments?: PublicationInterface[]) => boolean;
  getActiveButtonStatus: (accomplishments?: PublicationInterface[], type?: string) => boolean;
  getErrors: (error: object) => void;
}

const FormContent: React.FC<Props> = (props) => {
  const {
    form,
    onBlur,
    addField,
    publications,
    deleteSection,
    handleInputChange,
    getActiveButtonStatus,
    determineRenderDeleteIcons,
    applicationForm,
    getErrors,
  } = props;
  const { getFieldDecorator, getFieldError, getFieldsValue, validateFields, setFieldsValue } = form;
  const [buttonActive, setButtonActive] = useState<boolean>(false);

  useEffect(() => {
    setButtonActive(getActiveButtonStatus(publications, AccomplishmentCategories.PUBLICATION));
  }, [publications, getActiveButtonStatus]);

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
        getErrors({ publication: '' });
      } else {
        getErrors({ publication: errors });
      }
    });
  };

  const setFieldRequired = (fieldName: string, index: number): boolean => {
    const allFieldNames: string[] = [
      `publication_title_${index}`,
      `publication_journalOrSerialName_${index}`,
      `publication_issue_${index}`,
    ];
    const otherFieldNames: string[] = allFieldNames.filter((name: string) => name !== fieldName);
    const fieldsValues: object = getFieldsValue(otherFieldNames);

    return !isEmptyForm(fieldsValues);
  };

  const deleteCard = (index: number): void => {
    deleteSection(index, AccomplishmentCategories.PUBLICATION);
    setFieldsValue({
      [`publication_title_${index}`]: '',
      [`publication_journalOrSerialName_${index}`]: '',
      [`publication_issue_${index}`]: '',
    });
  };

  return (
    <InputCard title="Publications" className={styles.inputCard}>
      {(publications && get(publications, 'length')
        ? publications
        : [{ title: '', issue: '', journalOrSerialName: '' }]
      ).map((publication: PublicationInterface, index: number) => (
        <InputCard key={index} style={{ marginTop: index !== 0 ? '32px' : '0px' }}>
          {getFieldDecorator(`publication_title_${index}`, {
            rules: [
              {
                required:
                  applicationForm?.accomplishments.stepFieldsTypes.publication === FormSectionTypes.REQUIRED ||
                  setFieldRequired(`publication_title_${index}`, index),
                message: formatErrorMessage('Publication title', ErrorType.REQUIRED),
              },
              {
                max: 512,
                message: formatErrorMessage('Publication title', ErrorType.MAX_LENGTH, 512),
              },
            ],
            initialValue: publication.title,
          })(
            <Input
              label="Title"
              onChange={onChange}
              name={`publication_title_${index}`}
              onBlur={() => handleBlur(`publication_${index}`)}
              validateStatus={getFieldError(`publication_title_${index}`) ? 'error' : ''}
            />,
          )}
          {getFieldDecorator(`publication_journalOrSerialName_${index}`, {
            rules: [
              {
                required:
                  applicationForm?.accomplishments.stepFieldsTypes.publication === FormSectionTypes.REQUIRED ||
                  setFieldRequired(`publication_journalOrSerialName_${index}`, index),
                message: formatErrorMessage('Publication Journal or Serial name', ErrorType.REQUIRED),
              },
              {
                max: 512,
                message: formatErrorMessage('Publication Journal or Serial name', ErrorType.MAX_LENGTH, 512),
              },
            ],
            initialValue: publication.journalOrSerialName,
          })(
            <Input
              onChange={onChange}
              label="Journal or Serial Name"
              name={`publication_journalOrSerialName_${index}`}
              onBlur={() => handleBlur(`publication_${index}`)}
              validateStatus={getFieldError(`publication_journalOrSerialName_${index}`) ? 'error' : ''}
            />,
          )}
          {getFieldDecorator(`publication_issue_${index}`, {
            rules: [
              {
                required:
                  applicationForm?.accomplishments.stepFieldsTypes.publication === FormSectionTypes.REQUIRED ||
                  setFieldRequired(`publication_issue_${index}`, index),
                message: formatErrorMessage('Publication issue', ErrorType.REQUIRED),
              },
              {
                max: 512,
                message: formatErrorMessage('Publication issue', ErrorType.MAX_LENGTH, 512),
              },
            ],
            initialValue: publication.issue,
          })(
            <Input
              label="Issue"
              onChange={onChange}
              name={`publication_issue_${index}`}
              onBlur={() => handleBlur(`publication_${index}`)}
              validateStatus={getFieldError(`publication_issue_${index}`) ? 'error' : ''}
            />,
          )}
          {determineRenderDeleteIcons(publications) && (
            <Row type="flex" align="middle" justify="end" id="remove">
              <Tooltip
                title="Remove"
                placement="top"
                getPopupContainer={() => document.getElementById('remove') || document.body}
              >
                <Icon hover icon={faTrashAlt} onClick={() => deleteCard(index)} />
              </Tooltip>
            </Row>
          )}
        </InputCard>
      ))}
      <AddItemButton
        onClick={() => addField(AccomplishmentCategories.PUBLICATION)}
        disabled={!buttonActive || (publications && publications.length >= 30)}
        className={styles.button}
      />
    </InputCard>
  );
};

const Publication = Form.create<Props>()(FormContent);

export default Publication;
