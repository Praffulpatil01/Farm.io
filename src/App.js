// src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ref, set, onValue } from 'firebase/database';
import { db } from './firebase-config';
import TractorDashboard from './Dashboard/TractorDashboard';
import EquipmentMap from './components/EquipmentMap';
import GpsTracker from './components/GpsTracker';

const App = () => {
    const [tracking, setTracking] = useState(false);
    const [equipmentPositions, setEquipmentPositions] = useState([
        { 
            id: 1, 
            name: 'Mobile Device', 
            latitude: null,
            longitude: null,
            type: 'tractor',
            speed: 0,
            accuracy: 0,
            lastUpdate: null,
            deviceId: null // Will store unique device identifier
        }
    ]);
    const [paths, setPaths] = useState({ 1: [] });
    const [deviceId, setDeviceId] = useState(null);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

    // Generate or retrieve device ID
    useEffect(() => {
        const storedDeviceId = localStorage.getItem('deviceId');
        if (storedDeviceId) {
            setDeviceId(storedDeviceId);
        } else {
            const newDeviceId = 'device_' + Date.now();
            localStorage.setItem('deviceId', newDeviceId);
            setDeviceId(newDeviceId);
        }
    }, []);

    // Listen for window resize to determine if desktop
    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth > 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle location updates
    const handleLocationUpdate = (location) => {
        const { latitude, longitude, accuracy, speed, timestamp } = location;

        // Update Firebase with new position
        if (deviceId) {
            set(ref(db, `locations/${deviceId}`), {
                latitude,
                longitude,
                accuracy,
                speed,
                timestamp,
                deviceId,
                type: 'tractor',
                name: 'Mobile Device'
            });
        }
    };

    // Listen for real-time updates from Firebase
    useEffect(() => {
        const locationsRef = ref(db, 'locations');
        
        const unsubscribe = onValue(locationsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const positions = Object.values(data).map(device => ({
                    id: device.deviceId,
                    name: device.name,
                    latitude: device.latitude,
                    longitude: device.longitude,
                    speed: device.speed,
                    accuracy: device.accuracy,
                    lastUpdate: device.timestamp,
                    type: device.type
                }));

                setEquipmentPositions(positions);

                // Update paths
                const newPaths = { ...paths };
                positions.forEach(position => {
                    if (!newPaths[position.id]) {
                        newPaths[position.id] = [];
                    }
                    newPaths[position.id].push([position.latitude, position.longitude]);
                    // Limit path length
                    if (newPaths[position.id].length > 1000) {
                        newPaths[position.id] = newPaths[position.id].slice(-1000);
                    }
                });
                setPaths(newPaths);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <Router>
            {!isDesktop && (
                <GpsTracker 
                    onLocationUpdate={handleLocationUpdate}
                    tracking={tracking}
                />
            )}
            <Routes>
                <Route path="/" element={
                    <TractorDashboard 
                        equipmentPositions={equipmentPositions}
                        paths={paths}
                        tracking={tracking}
                        onToggleTracking={() => setTracking(prev => !prev)}
                        isDesktop={isDesktop}
                    />
                } />
                <Route path="/map" element={
                    <EquipmentMap
                        tracking={tracking}
                        setTracking={setTracking}
                        equipmentPositions={equipmentPositions}
                        paths={paths}
                        isDesktop={isDesktop}
                    />
                } />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;
