import React from 'react';
import DonutChart from '../components/DonutChart';
import '../css/dashboard.css';

const Dashboard = () => {
  return (
    <section className="home-section">
      <div className="text">Dashboard</div>
      <div className="dashboard-content">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Expense Distribution</h5>
                <DonutChart />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;