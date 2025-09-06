import './Dashboard.css';
import React from 'react';
import Sidebar from './dashboard/Sidebar';
import Header from './dashboard/Header';
import StatCards from './dashboard/StatCards';
import RegisterStudentForm from './dashboard/RegisterStudentForm';
import ExpiringSubscriptions from './dashboard/ExpiringSubscriptions';

const Dashboard = () => (
	<div className="dashboard-container">
		<Sidebar />
		<div className="dashboard-main dashboard-main-fit">
			<Header />
			<div className="dashboard-content dashboard-content-fit">
				<div className="dashboard-left">
					<StatCards />
					<div className="dashboard-form-wrapper">
						<RegisterStudentForm />
					</div>
				</div>
				<div className="dashboard-right">
					<ExpiringSubscriptions />
				</div>
			</div>
		</div>
	</div>
);

export default Dashboard;