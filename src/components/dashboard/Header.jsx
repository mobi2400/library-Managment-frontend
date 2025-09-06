import React from 'react';

const Header = () => (
  <header className="dashboard-header">
    <div className="header-left"></div>
    <div className="header-right">
      <span className="admin-label">Admin</span>
      <span className="admin-avatar" role="img" aria-label="admin">🧑‍💼</span>
      <span className="logout-icon" role="img" aria-label="logout">↩️</span>
    </div>
  </header>
);

export default Header;
