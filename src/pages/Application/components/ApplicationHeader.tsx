import { Icon, Title } from '@aurora_app/ui-library';
import { faStream, faTimes } from '@fortawesome/pro-regular-svg-icons';
import { Row } from 'antd';
import { ButtonProps } from 'antd/lib/button/button';
import { connect } from 'dva';
import { Link } from 'dva/router';
import React from 'react';
import { useMedia } from 'react-use';

import { Dispatch } from '../../../models/dispatch';
import { createStepsPath } from '../../../utils/utils';
import { MatchParams } from '../models/interfaces';
import HeaderButton from './HeaderButton';

import styles from './ApplicationHeader.module.scss';

interface Props extends ButtonProps {
  match: MatchParams;
  title?: string;
  hideButton?: boolean;
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const ApplicationHeader: React.FC<Props> = (props) => {
  const { collapsed, match, onCollapse, hideButton, title, ...restProps } = props;
  const { id, companyId, step } = match.params;
  const isMobile: boolean = useMedia('(max-width: 575px)');
  const isPad: boolean = useMedia('(min-width: 575px) and (max-width: 768px)');
  const width = collapsed ? 'calc(100% - 64px)' : 'calc(100% - 264px)';
  const visible = isMobile ? !collapsed : collapsed;

  const handleCollapse = (): void => {
    if (isMobile) {
      onCollapse(true);
    } else {
      onCollapse(false);
    }
  };

  return (
    <Row
      type="flex"
      align="middle"
      justify="space-between"
      className={styles.header}
      style={{ width: isPad ? width : '100%' }}
    >
      {visible && <Icon icon={faStream} onClick={handleCollapse} className={styles.menuIcon} />}
      <Title className={styles.title} level={4}>
        {title}
      </Title>
      {!hideButton && <HeaderButton step={step} {...restProps} />}
      <Link to={createStepsPath('', companyId, id)} className={styles.closeBtn}>
        <Icon icon={faTimes} />
      </Link>
    </Row>
  );
};

const mapStateToProps = ({ global }: any) => ({
  collapsed: global.collapsed,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onCollapse: (collapsed: boolean) => {
    dispatch({
      type: 'global/changeMenuCollapsed',
      payload: collapsed,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationHeader);
