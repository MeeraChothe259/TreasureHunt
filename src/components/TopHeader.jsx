import React from 'react';
import './TopHeader.css';
import csiLogo from '../assets/headerImages/csi-logo.png';
import dmceLogo from '../assets/headerImages/image.png';

const TopHeader = () => {
  return (
    <div className="top-header">
      <div className="header-logo-left">
        <img src={dmceLogo} alt="DMCE Logo" className="logo-img" />
      </div>

      <div className="header-text-center">
        <h1 className="college-name">
          DATTA MEGHE COLLEGE OF ENGINEERING AIROLI
        </h1>
        <h2 className="department-name">
          Department of Computer Engineering
        </h2>
        <h3 className="society-name">CSI-CATT</h3>
      </div>

      <div className="header-logo-right">
        <img src={csiLogo} alt="CSI Logo" className="logo-img" />
      </div>
    </div>
  );
};

export default TopHeader;