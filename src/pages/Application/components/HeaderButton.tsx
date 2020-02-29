import { Button, Icon } from '@aurora_app/ui-library';
import { faPaperPlane, faPlus } from '@fortawesome/pro-regular-svg-icons';
import { ButtonProps } from 'antd/lib/button';
import React from 'react';

import { StepName } from '../../../utils/constants';

interface Props extends ButtonProps {
  step?: string;
}

const HeaderButton: React.FC<Props> = (props) => {
  const { step, ...restProps } = props;

  const chooseHeaderText = (step: string): string => {
    switch (step) {
      case StepName.workHistory:
        return 'Add Company';
      case StepName.education:
        return 'Add Education';
      case StepName.languages:
        return 'Add Language';
      case StepName.references:
        return 'Add Reference';
      case StepName.reviewAndSubmit:
        return 'Send Application';
      default:
        return '';
    }
  };

  const shouldRenderButton = (step: string): boolean => {
    const stepsWithButtons: string[] = [
      StepName.workHistory,
      StepName.education,
      StepName.references,
      StepName.reviewAndSubmit,
      StepName.languages,
    ];

    return stepsWithButtons.includes(step);
  };

  return (
    <>
      {step && shouldRenderButton(step) && (
        <Button type="primary" {...restProps}>
          <Icon
            style={{ color: '#fff', marginLeft: -8 }}
            icon={step === StepName.reviewAndSubmit ? faPaperPlane : faPlus}
          />
          <span>{chooseHeaderText(step)}</span>
        </Button>
      )}
    </>
  );
};

export default HeaderButton;
