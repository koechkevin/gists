import { CompanyModal, SideNav } from '@aurora_app/ui-library';
import { Drawer } from 'antd';
import React, { CSSProperties, useEffect, useState } from 'react';
import { useMedia, useOrientation, useWindowSize } from 'react-use';

import { Company } from '../../models/company';

import SideBar from './SideBar';

const style: CSSProperties = {
  padding: 0,
  display: 'flex',
  height: '100vh',
};

interface InternalProps {
  match: any;
  location: any;
  name?: string;
  avatarUrl?: string;
  companyId: string;
  loading?: boolean;
  collapsed: boolean;
  companies: Company[];
  currentCompany?: Company;
  avatarColor?: string;
  companiesMenu: any[];
  onSelect?: (company: Company) => void;
  handleCollapse: (collapsed: boolean) => void;
}

const SideMenu: React.FC<InternalProps> = (props) => {
  const { currentCompany, collapsed, onSelect, companiesMenu, handleCollapse, location, ...otherProps } = props;

  const { width } = useWindowSize();
  const orientation = useOrientation();
  const isMobile = useMedia('(max-width: 575px)');
  const [visible, setVisible] = useState<boolean>(false);
  const isMidScreen: boolean = useMedia('(min-width: 769px) and (max-width: 1024px)');
  const activePath = `/app/candidate/${currentCompany?.companyId}`;

  const companies = props.companies.map((company: Company) => {
    return {
      name: company.name,
      companyId: company.companyId,
      avatarUrl: company.signedLogo?.thumbnails[0].signedUrl,
      avatarColor: company.avatarColor,
    };
  });

  useEffect(() => {
    if (isMidScreen) {
      handleCollapse(true);
    }

    if (!isMobile && !isMidScreen) {
      handleCollapse(false);
    }
  }, [handleCollapse, isMidScreen, isMobile]);

  useEffect(() => {
    if (isMobile) {
      setVisible(false);
      handleCollapse(false);
    }
  }, [orientation, isMobile, handleCollapse]);

  if (isMobile) {
    return (
      <Drawer
        width={width}
        placement="left"
        closable={false}
        bodyStyle={style}
        visible={isMobile ? collapsed : !collapsed}
        onClose={() => handleCollapse(true)}
      >
        <SideBar
          {...otherProps}
          width={width}
          isMobile={isMobile}
          location={location}
          company={currentCompany}
          onCollapse={handleCollapse}
          onOpen={() => setVisible(true)}
          collapsed={isMobile ? false : collapsed}
        />
        <CompanyModal
          list={companies}
          visible={visible}
          onSelect={onSelect}
          companyId={currentCompany?.companyId}
          onClose={() => setVisible(false)}
        />
      </Drawer>
    );
  }

  return (
    <>
      <SideNav menu={companiesMenu} activePath={activePath} lightTooltip={!collapsed} />
      <SideBar
        {...otherProps}
        isMobile={isMobile}
        location={location}
        collapsed={collapsed}
        company={currentCompany}
        onCollapse={handleCollapse}
      />
    </>
  );
};

export default SideMenu;
