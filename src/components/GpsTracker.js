import { useState, useEffect } from 'react';

const GpsTracker = ({ onLocationUpdate, tracking, deviceId = 'mobile-1' }) => {
    const [error, setError] = useState(null);

    useEffect(() => {
        let watchId;

        const startTracking = () => {
            if ("geolocation" in navigator) {
                const options = {
                    enableHighAccuracy: true, // Use GPS if available
                    timeout: 5000,           // Time to wait for position
                    maximumAge: 0            // Don't use cached position
                };

                // Watch position continuously
                watchId = navigator.geolocation.watchPosition(
                    (position) => {
                        const locationData = {
                            id: deviceId,
                            name: `Mobile Device ${deviceId}`,
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            accuracy: position.coords.accuracy,
                            speed: position.coords.speed || 0,
                            lastUpdate: new Date().toISOString()
                        };

                        // Store in localStorage
                        const existingData = JSON.parse(localStorage.getItem('trackingData') || '[]');
                        const updatedData = existingData.filter(item => item.id !== deviceId);
                        updatedData.push(locationData);
                        localStorage.setItem('trackingData', JSON.stringify(updatedData));

                        onLocationUpdate(locationData);
                        setError(null);
                    },
                    (err) => {
                        setError(err.message);
                        console.error('GPS Error:', err);
                    },
                    options
                );
            } else {
                setError("Geolocation is not supported by this device/browser");
            }
        };

        if (tracking) {
            startTracking();
        }

        // Cleanup function
        return () => {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, [tracking, onLocationUpdate, deviceId]);

    return null; // This is a functional component, no UI needed
};

export default GpsTracker; 