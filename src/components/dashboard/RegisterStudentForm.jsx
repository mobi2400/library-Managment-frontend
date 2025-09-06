import React from 'react';

const RegisterStudentForm = () => (
  <form className="register-student-form">
    <h3>Register New Student</h3>
    <div className="form-row">
      <div className="form-group">
        <label>Full Name</label>
        <input type="text" placeholder="Enter full name" />
      </div>
      <div className="form-group">
        <label>Age</label>
        <input type="number" placeholder="Enter age" />
      </div>
    </div>
    <div className="form-row">
      <div className="form-group">
        <label>Subscription Plan</label>
        <select>
          <option>Select plan</option>
        </select>
      </div>
      <div className="form-group">
        <label>Joining Date</label>
        <input type="date" />
      </div>
    </div>
    <div className="form-group">
      <label>Address</label>
      <textarea placeholder="Enter complete address" />
    </div>
    <div className="form-row">
      <div className="form-group">
        <label>Aadhar Number</label>
        <input type="text" placeholder="Enter Aadhar number" />
      </div>
      <div className="form-group">
        <label>Seat Number</label>
        <select>
          <option>Select seat</option>
        </select>
      </div>
    </div>
    <div className="form-group checkbox-group">
      <input type="checkbox" id="feePaid" />
      <label htmlFor="feePaid">Fee Paid</label>
    </div>
    <button type="submit" className="register-btn">Register Student</button>
  </form>
);

export default RegisterStudentForm;
