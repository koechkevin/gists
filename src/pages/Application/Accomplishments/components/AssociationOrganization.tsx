import { Icon, Input, InputCard } from '@aurora_app/ui-library';
import { faTrashAlt } from '@fortawesome/pro-regular-svg-icons';
import { Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { get } from 'lodash';
import React, { ChangeEvent, useEffect, useState } from 'react';

import { AccomplishmentCategories, ErrorType, FormSectionTypes } from '../../../../utils/constants';
import { formatErrorMessage } from '../../../../utils/errorHandle';
import { checkAllFieldsFilled } from '../../../../utils/utils';
import { AddItemButton } from '../../components';
import { Accomplishment, ApplicationForm } from '../../models/interfaces';

import styles from '../Accomplishments.module.scss';

interface Props extends FormComponentProps {
  associationOrganization?: Accomplishment[];
  applicationForm?: ApplicationForm;
  addField: (fieldType: string) => void;
  onBlur: (fieldName: string) => void | boolean;
  deleteField: (index: number, category: string) => void;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  getActiveButtonStatus: (accomplishments?: Accomplishment[]) => boolean;
  determineRenderDeleteIcons: (accomplishments?: Accomplishment[]) => boolean;
  getErrors: (error: object) => void;
}

const FormContent: React.FC<Props> = (props) => {
  const {
    form,
    onBlur,
    addField,
    deleteField,
    handleInputChange,
    getActiveButtonStatus,
    associationOrganization,
    determineRenderDeleteIcons,
    applicationForm,
    getErrors,
  } = props;
  const { getFieldDecorator, getFieldError, getFieldsValue, validateFields, setFieldsValue } = form;
  const [buttonActive, setButtonActive] = useState<boolean>(false);

  useEffect(() => {
    setButtonActive(getActiveButtonStatus(associationOrganization));
  }, [associationOrganization, getActiveButtonStatus]);

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
        getErrors({ associationOrganization: '' });
      } else {
        getErrors({ associationOrganization: errors });
      }
    });
  };

  const deleteFieldSection = (index: number): void => {
    deleteField(index, AccomplishmentCategories.ASSOCIATION_ORGANIZATION);
    setFieldsValue({ [`associationOrganization_name_${index}`]: '' });
  };

  return (
    <InputCard title="Associations & Organizations" className={styles.inputCard}>
      {(associationOrganization && get(associationOrganization, 'length')
        ? associationOrganization
        : [{ name: '' }]
      ).map((organization: Accomplishment, index: number) =>
        getFieldDecorator(`associationOrganization_name_${index}`, {
          rules: [
            {
              required:
                applicationForm?.accomplishments.stepFieldsTypes.associationOrganization === FormSectionTypes.REQUIRED,
              message: formatErrorMessage('Association/Organization', ErrorType.REQUIRED),
            },
            {
              max: 512,
              message: formatErrorMessage('Association/Organization', ErrorType.MAX_LENGTH, 512),
            },
          ],
          initialValue: organization.name,
        })(
          <Input
            key={index}
            style={{ marginBottom: index === get(associationOrganization, 'length', 1) - 1 ? '0px' : '16px' }}
            onChange={onChange}
            label="Association or Organization"
            name={`associationOrganization_name_${index}`}
            onBlur={() => handleBlur(`associationOrganization_${index}`)}
            validateStatus={getFieldError(`associationOrganization_name_${index}`) ? 'error' : ''}
            suffix={
              determineRenderDeleteIcons(associationOrganization) ? (
                <Icon icon={faTrashAlt} onClick={() => deleteFieldSection(index)} />
              ) : (
                <span />
              )
            }
          />,
        ),
      )}
      <AddItemButton
        onClick={() => addField('associationOrganization')}
        disabled={!buttonActive || (associationOrganization && associationOrganization.length >= 30)}
        className={styles.button}
      />
    </InputCard>
  );
};

const AssociationOrganization = Form.create<Props>()(FormContent);

export default AssociationOrganization;
