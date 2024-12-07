import React, { useState } from 'react';
import { FaTractor, FaChartLine, FaTools, FaMapMarked } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './TractorDashboard.css';

const TractorDashboard = ({ equipmentPositions, paths, tracking, onToggleTracking }) => {
  const navigate = useNavigate();
  
  // Calculate statistics
  const totalAreaCovered = equipmentPositions.reduce((sum, equipment) => 
    sum + (paths[equipment.id]?.length || 0) * 0.5, 0);
  
  const activeEquipment = equipmentPositions.filter(e => 
    paths[e.id]?.length > 0).length;

  const totalPaths = Object.values(paths).reduce((sum, path) => 
    sum + path.length, 0);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Farm Equipment Dashboard</h1>
      <div className="cards-grid">
        {/* Card 1: Map Button Card */}
        <div className="dashboard-card map-card" onClick={() => navigate('/map')}>
          <div className="card-content">
            <FaMapMarked className="card-icon map-icon" />
            <div className="card-info">
              <h2>View Live Map</h2>
              <p className="status-text">
                Click to open tracking map
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Tracking Status */}
        <div 
          className={`dashboard-card ${tracking ? 'active' : 'paused'}`}
          onClick={onToggleTracking}
        >
          <div className="card-content">
            <FaMapMarked className="card-icon" />
            <div className="card-info">
              <h2>Tracking Status</h2>
              <p className="status-text">
                Click to {tracking ? 'Stop' : 'Start'} Tracking
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Total Area */}
        <div className="dashboard-card">
          <div className="card-content">
            <FaTractor className="card-icon blue" />
            <div className="card-info">
              <h2>Total Area</h2>
              <p className="metric-text blue">
                {totalAreaCovered.toFixed(2)} acres
              </p>
            </div>
          </div>
        </div>

        {/* Card 4: Active Equipment */}
        <div className="dashboard-card">
          <div className="card-content">
            <FaChartLine className="card-icon green" />
            <div className="card-info">
              <h2>Active Equipment</h2>
              <p className="metric-text green">
                {activeEquipment} / {equipmentPositions.length}
              </p>
            </div>
          </div>
        </div>

        {/* Card 5: Total Paths */}
        <div className="dashboard-card">
          <div className="card-content">
            <FaTools className="card-icon purple" />
            <div className="card-info">
              <h2>Total Paths</h2>
              <p className="metric-text purple">
                {totalPaths} points
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TractorDashboard;
