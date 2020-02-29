import { faLanguage } from '@fortawesome/pro-regular-svg-icons';
import { Row } from 'antd';
import React from 'react';

import { ProficiencyOptions, StepName } from '../../../../utils/constants';
import { JobApplication, Language, MatchParams } from '../../models/interfaces';
import ContentWrapper from './ContentWrapper';

import styles from './Languages.module.scss';

interface Props {
  application: JobApplication;
  match: MatchParams;
  capitalizeInfo: (response?: string) => string;
}

const Languages: React.FC<Props> = (props) => {
  const { application: { resume: { languages } }, capitalizeInfo, match } = props;
  const nativeOrBilingual = 'native-or-bi-lingual';
  const title: string = 'Languages';

  return (
    <ContentWrapper title={title} icon={faLanguage} match={match} stepName={StepName.languages}>
      <Row className={styles.languages}>
        <Row className={styles.language}>
          {languages &&
            languages.map((language: Language, index: number) => {
              const proficiency: string | undefined | number =
                language.proficiency === nativeOrBilingual
                  ? ProficiencyOptions[ProficiencyOptions.length - 1].value
                  : capitalizeInfo(language.proficiency);

              return (
                <Row className={styles.item} key={index}>
                  {`${language.language} (${proficiency})`}
                </Row>
              );
            })}
        </Row>
      </Row>
    </ContentWrapper>
  );
};

export default Languages;
