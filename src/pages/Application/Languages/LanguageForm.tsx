import { InputCard, Select } from '@aurora_app/ui-library';
import { Col, Form, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import React, { FC, useEffect, useState } from 'react';
import { useMedia } from 'react-use';

import { ProficiencyOptions } from '../../../utils/constants';
import { proficiencyToDisplay, validProficiency } from '../../../utils/utils';
import { Language } from '../models/interfaces';

import styles from './languages.module.scss';

const { create } = Form;

interface Props extends FormComponentProps {
  languageData: Language;
  applicationId: string;
  index: number;
  languages: any[];
  validationErrors: any[];
  languageList: string[];
  onBlur: () => void;
  onDelete: (index: number) => void;
  setLanguage: (index: number, languages: Language) => void;
  selectOnChange: (index: number, newFormValue: Language) => void;
}

const LanguageForm: FC<Props> = (props) => {
  const {
    languageData: { language, proficiency },
    onDelete,
    onBlur,
    index,
    setLanguage,
    languages,
    selectOnChange,
    languageList,
  } = props;
  const isWideScreen: boolean = useMedia('(min-width:575px)');
  const isShort: boolean = useMedia('(max-height:575px)');
  const isLandscape: boolean = isWideScreen && isShort;
  const initialState: Language = {
    language: ' ',
    proficiency: ' ',
  };
  const [state, setState] = useState<Language>(initialState);
  const onChange = (name: string, value: string) => {
    const newState = { ...state, [name]: value };
    setState(newState);
    setLanguage(index, newState);
  };

  useEffect(() => {
    setState({ language, proficiency: proficiencyToDisplay(proficiency) });
  }, [language, proficiency]);

  return (
    <InputCard
      className={styles.inputCard}
      removable
      onDismiss={() => onDelete(index)}
      title={state.language || 'New Language'}
    >
      <Row gutter={12}>
        <Col style={{ maxHeight: 'max-content' }} sm={12}>
          <span id="language" />
          <Select
            options={languages.map((option) => ({
              value: option.name,
              disabled: !(!languageList.includes(option.name) || option.name === state.language),
            }))}
            value={state.language}
            name="language"
            onBlur={onBlur}
            onChange={(value: string) => onChange('language', value)}
            onSelect={(language: string) => {
              if (state.proficiency) {
                selectOnChange(index, { proficiency: validProficiency(state.proficiency), language });
              }
            }}
            label="Language"
            showArrow={false}
            showSearch={!isLandscape}
            validateStatus={''}
            getPopupContainer={() => document.getElementById('language')}
            className={styles.select}
          />
        </Col>
        <Col style={{ maxHeight: 'max-content' }} xs={24} sm={12}>
          <span id="proficiency" />
          <Select
            name="proficiency"
            label="Proficiency"
            value={state.proficiency}
            options={ProficiencyOptions}
            onBlur={onBlur}
            getPopupContainer={() => document.getElementById('proficiency')}
            onSelect={(proficiency: string) => {
              if (state.language) {
                selectOnChange(index, { ...state, proficiency: validProficiency(proficiency) });
              }
            }}
            onChange={(value: string) => onChange('proficiency', value)}
            validateStatus={''}
            className={styles.select}
            showSearch={!isLandscape}
          />
        </Col>
      </Row>
    </InputCard>
  );
};

const mapStateToProps = ({ application }) => ({
  languages: application.languages,
});

export default connect(mapStateToProps)(create<Props>()(LanguageForm));
