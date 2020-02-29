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
  licenceCertification?: Accomplishment[];
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
    licenceCertification,
    getActiveButtonStatus,
    determineRenderDeleteIcons,
    applicationForm,
    getErrors,
  } = props;
  const { getFieldDecorator, getFieldError, getFieldsValue, validateFields, setFieldsValue } = form;
  const [buttonActive, setButtonActive] = useState<boolean>(false);

  useEffect(() => {
    setButtonActive(getActiveButtonStatus(licenceCertification));
  }, [licenceCertification, getActiveButtonStatus]);

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
        getErrors({ licenceCertification: '' });
      } else {
        getErrors({ licenceCertification: errors });
      }
    });
  };

  const deleteFieldSection = (index: number): void => {
    deleteField(index, AccomplishmentCategories.LICENCE_CERTIFICATION);
    setFieldsValue({ [`licenceCertification_name_${index}`]: '' });
  };

  return (
    <InputCard title="Licenses & Certifications">
      {(licenceCertification && get(licenceCertification, 'length') ? licenceCertification : [{ name: '' }]).map(
        (certification: Accomplishment, index: number) =>
          getFieldDecorator(`licenceCertification_name_${index}`, {
            rules: [
              {
                required:
                  applicationForm?.accomplishments.stepFieldsTypes.licenceCertification === FormSectionTypes.REQUIRED,
                message: formatErrorMessage('Licence Certification', ErrorType.REQUIRED),
              },
              {
                max: 512,
                message: formatErrorMessage('Licence Certification', ErrorType.MAX_LENGTH, 512),
              },
            ],
            initialValue: certification.name,
          })(
            <Input
              key={index}
              style={{ marginBottom: index === get(licenceCertification, 'length', 1) - 1 ? '0px' : '16px' }}
              onChange={onChange}
              label="License or Certification"
              name={`licenceCertification_name_${index}`}
              onBlur={() => handleBlur(`licenceCertification_${index}`)}
              validateStatus={getFieldError(`licenceCertification_name_${index}`) ? 'error' : ''}
              suffix={
                determineRenderDeleteIcons(licenceCertification) ? (
                  <Icon icon={faTrashAlt} onClick={() => deleteFieldSection(index)} />
                ) : (
                  <span />
                )
              }
            />,
          ),
      )}
      <AddItemButton
        onClick={() => addField(AccomplishmentCategories.LICENCE_CERTIFICATION)}
        disabled={!buttonActive || (licenceCertification && licenceCertification.length >= 30)}
        className={styles.button}
      />
    </InputCard>
  );
};

const LicenceCertification = Form.create<Props>()(FormContent);

export default LicenceCertification;
