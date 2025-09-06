import React from 'react';

const ExpiringSubscriptions = () => (
  <div className="expiring-subscriptions">
    <h3>Subscriptions Expiring in 5 Days</h3>
    <ul>
      <li>
        <div className="user-avatar"> <span role="img" aria-label="avatar">🧑</span> </div>
        <div className="user-info">
          <div className="user-name">Rahul Sharma</div>
          <div className="user-seat">Seat: A-015</div>
        </div>
        <div className="expiry-info">
          <div className="expiry-date">Jan 30, 2025</div>
          <div className="expiry-days">3 days left</div>
        </div>
      </li>
      <li>
        <div className="user-avatar"> <span role="img" aria-label="avatar">🧑</span> </div>
        <div className="user-info">
          <div className="user-name">Priya Patel</div>
          <div className="user-seat">Seat: B-008</div>
        </div>
        <div className="expiry-info">
          <div className="expiry-date">Feb 01, 2025</div>
          <div className="expiry-days">5 days left</div>
        </div>
      </li>
      <li>
        <div className="user-avatar"> <span role="img" aria-label="avatar">🧑</span> </div>
        <div className="user-info">
          <div className="user-name">Amit Kumar</div>
          <div className="user-seat">Seat: C-012</div>
        </div>
        <div className="expiry-info">
          <div className="expiry-date">Jan 29, 2025</div>
          <div className="expiry-days">2 days left</div>
        </div>
      </li>
      <li>
        <div className="user-avatar"> <span role="img" aria-label="avatar">🧑</span> </div>
        <div className="user-info">
          <div className="user-name">Sneha Singh</div>
          <div className="user-seat">Seat: A-023</div>
        </div>
        <div className="expiry-info">
          <div className="expiry-date">Jan 31, 2025</div>
          <div className="expiry-days">4 days left</div>
        </div>
      </li>
    </ul>
    <div className="view-all-expiring">
      <a href="#">View All Expiring Subscriptions</a>
    </div>
  </div>
);

export default ExpiringSubscriptions;
