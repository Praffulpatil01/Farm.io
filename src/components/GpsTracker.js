import { useState, useEffect } from 'react';

const GpsTracker = ({ onLocationUpdate, tracking }) => {
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
                        const { latitude, longitude, accuracy, speed } = position.coords;
                        onLocationUpdate({
                            latitude,
                            longitude,
                            accuracy,
                            speed: speed || 0,
                            timestamp: position.timestamp
                        });
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
    }, [tracking, onLocationUpdate]);

    return null; // This is a functional component, no UI needed
};

export default GpsTracker; 