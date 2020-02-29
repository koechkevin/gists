import { ChangePassword, Header as AuroraHeader } from '@aurora_app/ui-library';
import { Row } from 'antd';
import { connect } from 'dva';
import React, { FC } from 'react';

import { Dispatch } from '../../models/dispatch';
import { UserProfile } from '../../models/user';
import HeaderLeftArea from './HeaderLeftArea';
import HeaderRightArea from './HeaderRightArea';
import { ChatHeaderDetails } from './interface';

import styles from './Header.module.scss';

interface Props {
  title: string;
  header?: string;
  location: any;
  collapsed: boolean;
  profile: UserProfile;
  avatarColor?: string;
  profileId: string;
  passwordValidation: any;
  showPasswordModal: boolean;
  applicationStatus?: string;
  changePasswordLoading: boolean;
  chatHeaderDetails: ChatHeaderDetails;
  logout: () => void;
  onCollapse: () => void;
  toShowModal: (modal: string, visible: boolean) => void;
  changePassword: (profileId: string, data: any) => void;
  setPasswordValidation: (payload: any) => void;
}

export const Header: FC<Props> = (props) => {
  const {
    title,
    logout,
    profile,
    collapsed,
    profileId,
    location,
    onCollapse,
    avatarColor,
    toShowModal,
    changePassword,
    showPasswordModal,
    applicationStatus,
    chatHeaderDetails,
    passwordValidation,
    changePasswordLoading,
    setPasswordValidation,
  } = props;

  const submitData = (data: object) => {
    setPasswordValidation({ errors: [], validateStatue: '' });
    changePassword(profileId, data);
  };

  const toShowPasswordModal = (visible: boolean) => {
    setPasswordValidation({ errors: [], validateStatue: '' });
    toShowModal('showPasswordModal', visible);
  };

  const toShowRemoveModal = () => {
    toShowModal('showRemoveApplicationModal', true);
  };

  return (
    <AuroraHeader className={styles.header}>
      <Row className={styles.wrapper} type="flex" justify="space-between" align="middle">
        <HeaderLeftArea
          title={title}
          collapsed={collapsed}
          onCollapse={onCollapse}
          chatInfo={chatHeaderDetails}
          applicationStatus={applicationStatus}
        />
        <HeaderRightArea
          onLogout={logout}
          location={location}
          profile={profile.profile}
          avatarColor={avatarColor}
          onRemoveApplication={toShowRemoveModal}
          applicationStatus={applicationStatus}
          onChangePassword={() => toShowPasswordModal(true)}
        />
      </Row>
      <ChangePassword
        onOk={submitData}
        visible={showPasswordModal}
        loading={changePasswordLoading}
        errors={passwordValidation.errors}
        onCancel={() => toShowPasswordModal(false)}
        validateStatus={passwordValidation.validateStatus}
      />
    </AuroraHeader>
  );
};

const mapStateToProps = ({ global, loading, common }: any) => ({
  profile: global.profile,
  collapsed: global.collapsed,
  profileId: global.profile.profileId,
  avatarColor: global.profile.avatarColor,
  showPasswordModal: common.showPasswordModal,
  chatHeaderDetails: global.chatHeaderDetails,
  passwordValidation: global.passwordValidation,
  changePasswordLoading: loading.effects['global/changePassword'],
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  logout: () => dispatch({ type: 'global/logout' }),

  setPasswordValidation: (payload: any) => {
    dispatch({ type: 'global/setPasswordValidation', payload });
  },

  changePassword: (profileId: string, data: any) => {
    dispatch({ type: 'global/changePassword', payload: { profileId, data } });
  },

  toShowModal: (modal: string, visible: boolean) => {
    dispatch({
      type: 'common/showOrHideModal',
      modal,
      payload: visible,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
