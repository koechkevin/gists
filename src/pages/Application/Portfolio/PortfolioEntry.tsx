import { Icon as AuroraIcon, Input } from '@aurora_app/ui-library';
import { Form, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import { split, toLower, upperFirst } from 'lodash';
import React, { ChangeEvent, FC, useCallback, useState } from 'react';

import { Dispatch } from '../../../models/dispatch';
import { ErrorType, FormSectionTypes } from '../../../utils/constants';
import { formatErrorMessage } from '../../../utils/errorHandle';
import { UrlRegex } from '../../../utils/regTools';
import { ApplicationForm } from '../models/interfaces';

interface Props extends FormComponentProps {
  companyIcon: any;
  urlLink?: string;
  companyName: string;
  applicationForm: ApplicationForm;
  setFormValid: (linkValid: boolean) => void;
  setValidating: (validating: boolean) => void;
  updateEntry: (entryName: string, value: string) => void;
}

const PortfolioEntry: FC<Props> = (props) => {
  const { form, urlLink, companyIcon, companyName, updateEntry, setFormValid, setValidating, applicationForm } = props;
  const { getFieldDecorator, validateFields } = form;
  const [isLinkValid, setIsLinkValid] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const title: string = toLower(split(companyName, ' ')[0]);
  const entryName: string = upperFirst(split(companyName, ' ')[0]);

  enum Titles {
    GitHub = 'github',
    Twitter = 'twitter',
    Dribble = 'dribbble',
    Url = 'url',
  }

  const validateUrl = useCallback(
    (data: string) => {
      const isValidUrl = (): boolean => {
        let check: boolean = true;

        switch (title) {
          case 'github':
          case 'twitter':
          case 'dribbble':
            check = data.startsWith(`https://${title}.com`);
            break;
          case 'url':
            check = UrlRegex.test(data);
            break;
          case 'behance':
            check = data.startsWith(`https://www.${title}.net`);
            break;
          default:
            check = data.startsWith(`https://www.${title}.com`);
            break;
        }

        return check;
      };

      const result: boolean = data ? isValidUrl() : true;

      if (!result) {
        setIsLinkValid(false);
        setFormValid(false);
        setErrorMessage(formatErrorMessage(entryName, ErrorType.INVALID));
      } else {
        setIsLinkValid(true);
        setFormValid(true);
        setErrorMessage('');
        updateEntry(title, data);
      }
    },
    [title, entryName, updateEntry, setFormValid],
  );

  const handleOnBlur = (): void => {
    validateFields((errors: any, values: any) => {
      if (!errors) {
        setValidating(true);
        validateUrl(values[title]);
      } else {
        setIsLinkValid(false);
        setFormValid(false);
        setErrorMessage(errors[title].errors[0].message);
      }
    });
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsLinkValid(true);
  };

  return (
    <Row>
      {getFieldDecorator(`${title}`, {
        initialValue: urlLink ? urlLink : '',
        rules: [
          {
            required:
              applicationForm?.portfolio.stepType === FormSectionTypes.REQUIRED &&
              applicationForm?.portfolio?.stepFieldsTypes[title] === FormSectionTypes.REQUIRED,
            message: formatErrorMessage(upperFirst(title), ErrorType.REQUIRED),
          },
        ],
      })(
        <Input
          style={{ marginBottom: title === Titles.Url ? '0px' : '16px' }}
          label={`${companyName}`}
          autoComplete="off"
          onChange={onChange}
          onBlur={handleOnBlur}
          help={!isLinkValid ? errorMessage : ''}
          validateStatus={!isLinkValid ? 'error' : ''}
          prefix={<AuroraIcon icon={companyIcon} color={!isLinkValid && '#fa2d19'} />}
        />,
      )}
    </Row>
  );
};

const mapStateToProps = ({ application: { applicationForm } }) => ({ applicationForm });

const mapDispatchToProps = (dispatch: Dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create<Props>()(PortfolioEntry));
