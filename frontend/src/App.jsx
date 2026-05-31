import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function App() {
  const [items, setItems] = useState([]);
  const [userId, setUserId] = useState('');

  async function loadMapData() {
    const response = await fetch('http://localhost:3000/fraud-map');
    const json = await response.json();
    setItems(json.data || []);
  }

  async function searchUser(event) {
  event.preventDefault();

  if (!userId.trim()) {
    return loadMapData();
  }

  try {
    const response = await fetch(
      `http://localhost:3000/fraud-check?userId=${encodeURIComponent(userId.trim())}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch user fraud data');
    }

    const json = await response.json();

    console.log('Search result:', json);

    const records = Array.isArray(json) ? json : json.data || [];

    const recordsWithGeo = records.filter(
      (item) => item.geo && item.geo.lat && item.geo.lng
    );

    setItems(recordsWithGeo);

    if (recordsWithGeo.length === 0) {
      alert('No flagged map data found for this user.');
    }
  } catch (error) {
    console.error(error);
    alert('Could not load fraud data. Check if backend is running.');
  }
}

  useEffect(() => {
    loadMapData();
  }, []);

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', padding: 20 }}>
      <h1>Fraud Detection Map</h1>
      <form onSubmit={searchUser} style={{ marginBottom: 16 }}>
        <input
          placeholder="Search userId"
          value={userId}
          onChange={(event) => setUserId(event.target.value)}
          style={{ padding: 8, width: 260 }}
        />
        <button style={{ padding: 8, marginLeft: 8 }}>Search</button>
        <button type="button" onClick={loadMapData} style={{ padding: 8, marginLeft: 8 }}>
          Show All
        </button>
      </form>

      <MapContainer center={[9.082, 8.6753]} zoom={6} style={{ height: '75vh', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {items
          .filter((item) => item.geo?.coordinates?.length === 2)
          .map((item) => {
            const [lng, lat] = item.geo.coordinates;
            return (
              <Marker key={item.transactionId} position={[lat, lng]} icon={markerIcon}>
                <Popup>
                  <strong>{item.userId}</strong>
                  <br />
                  {item.transactionId}
                  <br />
                  ${item.amount}
                  <br />
                  {item.reasons?.join(', ')}
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
