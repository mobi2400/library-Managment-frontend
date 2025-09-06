import React from 'react';

const StatCards = () => (
  <div className="stat-cards">
    <div className="stat-card">
      <div className="stat-icon">👥</div>
      <div>
        <div className="stat-title">Total Students</div>
        <div className="stat-value">156</div>
      </div>
    </div>
    <div className="stat-card">
      <div className="stat-icon">💺</div>
      <div>
        <div className="stat-title">Available Seats</div>
        <div className="stat-value">24</div>
      </div>
    </div>
    <div className="stat-card">
      <div className="stat-icon">⏰</div>
      <div>
        <div className="stat-title">Expiring Soon</div>
        <div className="stat-value">8</div>
      </div>
    </div>
    <div className="stat-card">
      <div className="stat-icon">₹</div>
      <div>
        <div className="stat-title">Monthly Revenue</div>
        <div className="stat-value">₹45,600</div>
      </div>
    </div>
  </div>
);

export default StatCards;
