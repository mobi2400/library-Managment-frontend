import React from 'react';

const Sidebar = () => (
  <aside className="sidebar">
    <div className="sidebar-header">
      <h2>NaiUdaan Library</h2>
    </div>
    <nav>
      <ul>
        <li className="active"><span role="img" aria-label="dashboard">🖥️</span> Dashboard</li>
        <li><span role="img" aria-label="register">📝</span> Register Student</li>
        <li><span role="img" aria-label="students">👥</span> All Students</li>
        <li><span role="img" aria-label="seat">💺</span> Seat Management</li>
        <li><span role="img" aria-label="fee">₹</span> Fee Management</li>
      </ul>
    </nav>
  </aside>
);

export default Sidebar;
