// src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TractorDashboard from './Dashboard/TractorDashboard';
import EquipmentMap from './components/EquipmentMap';
import GpsTracker from './components/GpsTracker';

const App = () => {
    const [tracking, setTracking] = useState(false);
    const [equipmentPositions, setEquipmentPositions] = useState([
        { 
            id: 1, 
            name: 'My Device', 
            latitude: null, 
            longitude: null, 
            type: 'tractor',
            speed: 0,
            accuracy: 0,
            lastUpdate: null
        }
    ]);
    const [paths, setPaths] = useState({
        1: []
    });

    const handleLocationUpdate = (location) => {
        const { latitude, longitude, accuracy, speed, timestamp } = location;
        
        console.log('New GPS Position:', latitude, longitude); // Debug log

        // Update equipment position with real GPS data
        setEquipmentPositions(prev => prev.map(equipment => {
            if (equipment.id === 1) {
                return {
                    ...equipment,
                    latitude,
                    longitude,
                    speed,
                    accuracy,
                    lastUpdate: timestamp
                };
            }
            return equipment;
        }));

        // Update path history
        setPaths(prev => {
            const newPaths = { ...prev };
            if (!newPaths[1]) {
                newPaths[1] = [];
            }
            newPaths[1].push([latitude, longitude]);
            // Keep only last 1000 points to prevent memory issues
            if (newPaths[1].length > 1000) {
                newPaths[1] = newPaths[1].slice(-1000);
            }
            return newPaths;
        });
    };

    return (
        <Router>
            <GpsTracker 
                onLocationUpdate={handleLocationUpdate}
                tracking={tracking}
            />
            <Routes>
                <Route path="/" element={
                    <TractorDashboard 
                        equipmentPositions={equipmentPositions}
                        paths={paths}
                        tracking={tracking}
                        onToggleTracking={() => setTracking(prev => !prev)}
                    />
                } />
                <Route path="/map" element={
                    <EquipmentMap
                        tracking={tracking}
                        setTracking={setTracking}
                        equipmentPositions={equipmentPositions}
                        paths={paths}
                    />
                } />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;
