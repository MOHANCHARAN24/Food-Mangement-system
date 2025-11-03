import React from 'react';

const SectionHeader = ({ title, subtitle, action }) => (
  <div className="section-header">
    <div>
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
    {action && <div className="section-header__action">{action}</div>}
  </div>
);

export default SectionHeader;
