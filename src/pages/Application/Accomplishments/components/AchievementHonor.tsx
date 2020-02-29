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
  achievementHonor?: Accomplishment[];
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
    achievementHonor,
    handleInputChange,
    getActiveButtonStatus,
    determineRenderDeleteIcons,
    applicationForm,
    getErrors,
  } = props;
  const { getFieldDecorator, getFieldError, getFieldsValue, setFieldsValue, validateFields } = form;
  const [buttonActive, setButtonActive] = useState<boolean>(false);

  useEffect(() => {
    setButtonActive(getActiveButtonStatus(achievementHonor));
  }, [achievementHonor, getActiveButtonStatus]);

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
        getErrors({ achievementHonor: '' });
      } else {
        getErrors({ achievementHonor: errors });
      }
    });
  };

  const deleteFieldSection = (index: number): void => {
    deleteField(index, AccomplishmentCategories.ACHIEVEMENT_HONOR);
    setFieldsValue({ [`achievementHonor_name_${index}`]: '' });
  };

  return (
    <InputCard title="Achievements & Honors" className={styles.inputCard}>
      {(achievementHonor && get(achievementHonor, 'length') ? achievementHonor : [{ name: '' }]).map(
        (honor: Accomplishment, index: number) =>
          getFieldDecorator(`achievementHonor_name_${index}`, {
            rules: [
              {
                required:
                  applicationForm?.accomplishments.stepFieldsTypes.achievementHonor === FormSectionTypes.REQUIRED,
                message: formatErrorMessage('Achievement/Honor', ErrorType.REQUIRED),
              },
              {
                max: 512,
                message: formatErrorMessage('Achievement/Honor', ErrorType.MAX_LENGTH, 512),
              },
            ],
            initialValue: honor.name,
          })(
            <Input
              key={index}
              style={{ marginBottom: index === get(achievementHonor, 'length', 1) - 1 ? '0px' : '16px' }}
              onChange={onChange}
              label="Achievement or Honor"
              name={`achievementHonor_name_${index}`}
              onBlur={() => handleBlur(`achievementHonor_${index}`)}
              validateStatus={getFieldError(`achievementHonor_name_${index}`) ? 'error' : ''}
              suffix={
                determineRenderDeleteIcons(achievementHonor) ? (
                  <Icon icon={faTrashAlt} onClick={() => deleteFieldSection(index)} />
                ) : (
                  <span />
                )
              }
            />,
          ),
      )}
      <AddItemButton
        onClick={() => addField(AccomplishmentCategories.ACHIEVEMENT_HONOR)}
        disabled={!buttonActive || (achievementHonor && achievementHonor.length >= 30)}
        className={styles.button}
      />
    </InputCard>
  );
};

const AchievementHonor = Form.create<Props>()(FormContent);

export default AchievementHonor;
