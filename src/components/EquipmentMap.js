import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './EquipmentMap.css';

// Fix for default marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to update map center when position changes
const MapUpdater = ({ position }) => {
    const map = useMap();
    
    useEffect(() => {
        if (position && position[0] && position[1]) {
            map.setView(position, map.getZoom());
        }
    }, [position, map]);
    
    return null;
};

const EquipmentMap = ({ tracking, setTracking, equipmentPositions, paths }) => {
    const [mapReady, setMapReady] = useState(false);
    const firstPosition = equipmentPositions[0];
    
    // Use current position or fallback to a default
    const mapCenter = firstPosition?.latitude && firstPosition?.longitude
        ? [firstPosition.latitude, firstPosition.longitude]
        : [0, 0]; // Default to world center if no position yet

    return (
        <div style={{ height: '100vh', position: 'relative' }}>
            <MapContainer
                center={mapCenter}
                zoom={15}
                style={{ height: '100%' }}
                whenReady={() => setMapReady(true)}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {mapReady && <MapUpdater position={mapCenter} />}

                {equipmentPositions.map((equipment) => (
                    equipment?.latitude && equipment?.longitude ? (
                        <React.Fragment key={equipment.id}>
                            <Marker
                                position={[equipment.latitude, equipment.longitude]}
                                icon={DefaultIcon}
                            >
                                <Popup className="popup-content">
                                    <h3>{equipment.name}</h3>
                                    <p>Latitude: {equipment.latitude.toFixed(6)}</p>
                                    <p>Longitude: {equipment.longitude.toFixed(6)}</p>
                                    <p>Speed: {((equipment.speed || 0) * 3.6).toFixed(1)} km/h</p>
                                    <p>Accuracy: ±{(equipment.accuracy || 0).toFixed(1)}m</p>
                                    <p>Last Update: {equipment.lastUpdate ? 
                                        new Date(equipment.lastUpdate).toLocaleTimeString() : 
                                        'Waiting for GPS...'}</p>
                                </Popup>
                            </Marker>

                            {paths[equipment.id]?.length > 1 && (
                                <Polyline 
                                    positions={paths[equipment.id]} 
                                    color="blue"
                                    weight={3}
                                    opacity={0.7}
                                />
                            )}
                        </React.Fragment>
                    ) : null
                ))}
            </MapContainer>

            <div
                className={`tracking-btn ${tracking ? 'stop' : 'start'}`}
                onClick={() => setTracking(!tracking)}
            >
                {tracking ? 'Stop Tracking' : 'Start Tracking'}
            </div>

            {!firstPosition?.latitude && (
                <div className="gps-status">
                    Waiting for GPS signal...
                </div>
            )}
        </div>
    );
};

export default EquipmentMap;
