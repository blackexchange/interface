// Dashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import Menu from '../../components/Menu/Menu';
import Footer from '../../components/Footer/Footer';
import Toast from '../../components/Toast/Toast';
import DeviceCards from './DeviceCards';
import { getActiveDevices } from '../../services/InterfacesService';
import useWebSocket from 'react-use-websocket';

function Dashboard() {

  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ type: '', text: '' });
  const condition = [
    { $match: { 'devices.status': 'active' } },
    {
      $project: {
        _id: 1,
        name: 1,
        devices: {
          $map: {
            input: {
              $filter: {
                input: '$devices',
                as: 'device',
                cond: {
                  $eq: ['$$device.status', 'active'],
                },
              },
            },
            as: 'device',
            in: {
              _id: '$$device._id',
              deviceId: '$$device.deviceId',
              ip: '$$device.ip',
              role: '$$device.role',
              port: '$$device.port',
              mode: '$$device.mode',
              protocol: '$$device.protocol',
              status: '$$device.status',
              isOnline: '$$device.isOnline',
            },
          },
        },
      },
    },
    { $unwind: '$devices' },
    {
      $lookup: {
        from: 'interfaceresults',
        localField: 'devices._id',
        foreignField: 'device._id',
        as: 'results',
      },
    },
    {
      $addFields: {
        totalResultsProcessed: { $size: '$results' },
        totalMinutes: {
          $divide: [
            { $subtract: [{ $toDate: '$$NOW' }, { $arrayElemAt: ['$results.createdAt', 0] }] },
            60000,
          ],
        },
      },
    },
    {
      $addFields: {
        averageResultsPerMinute: {
          $cond: {
            if: { $gt: ['$totalMinutes', 0] },
            then: { $divide: ['$totalResultsProcessed', '$totalMinutes'] },
            else: 0,
          },
        },
      },
    },
    {
      $group: {
        _id: '$_id',
        name: { $first: '$name' },
        devices: { $push: '$devices' },
        totalResultsProcessed: { $sum: '$totalResultsProcessed' },
        averageResultsPerMinute: { $avg: '$averageResultsPerMinute' },
      },
    },
    { $sort: { name: 1 } },
  ];
  const fetchDevices = useCallback(async () => {

  
    try {
      const result = await getActiveDevices(condition);
      setDevices(result);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch devices.');
      setLoading(false);
    }
  }, [condition]);

  const { lastJsonMessage } = useWebSocket(process.env.REACT_APP_API_URL, {
    onOpen: () => {
      console.log(`Connected to App WS to ${process.env.REACT_APP_API_URL}`);
    },
    onMessage: () => {
      fetchDevices();
      console.log(lastJsonMessage);
    },
    queryParams: { token: localStorage.getItem('token') },
    onError: (event) => {
      console.error('Error:', event);
      setNotification({ type: 'error', text: event });
    },
    shouldReconnect: () => true,
    reconnectInterval: 3000,
  });

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <p>Carregando...</p>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <>
      <Menu />
      <main className="content">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
          <div className="d-block mb-4 mb-md-0">
            <h1 className="h4">Dashboard</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <h4>Active Devices</h4>
            {/* Passando os dispositivos para o componente DeviceCards */}
            <DeviceCards devices={devices} />
          </div>
        </div>
        <Footer />
      </main>
      <Toast text={notification.text} type={notification.type} />
    </>
  );
}

export default Dashboard;
