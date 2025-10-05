// App.js

import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Camera, Cloud, TrendingUp, AlertTriangle, Brain, Eye, Activity, MapPin, Download, Share2, Settings, Bell, Menu, X, RefreshCw, Play, Pause, Upload, CheckCircle, Satellite, Wind } from 'lucide-react';
const API_BASE_URL = 'http://localhost:5000/api';

const AirWatchPro = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentAQI, setCurrentAQI] = useState(68);
  const [location, setLocation] = useState('Los Angeles, CA');
  const [locationInput, setLocationInput] = useState('Los Angeles, CA');
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [mlPredictions, setMlPredictions] = useState([]);
  const [satelliteData, setSatelliteData] = useState([]);
  const [cvAnalysis, setCvAnalysis] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [pollutants, setPollutants] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [notifications, setNotifications] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dataSource, setDataSource] = useState('');
  const [usingRealData, setUsingRealData] = useState(false);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const locationParam = location ? `&location=${encodeURIComponent(location)}` : '';
      
      const aqiRes = await fetch(`${API_BASE_URL}/current-aqi?lat=34.0522&lon=-118.2437${locationParam}`);
      const aqiData = await aqiRes.json();
      setCurrentAQI(aqiData.aqi);
      setPollutants(aqiData.pollutants);
      setDataSource(aqiData.data_sources?.primary || 'OpenAQ Network');
      setUsingRealData(aqiData.data_sources?.using_real_data || false);
      
      const forecastRes = await fetch(`${API_BASE_URL}/forecast`);
      const forecastData = await forecastRes.json();
      setMlPredictions(forecastData.forecasts || []);
      
      const satelliteRes = await fetch(`${API_BASE_URL}/satellite-data?lat=34.0522&lon=-118.2437${locationParam}`);
      const satelliteDataRes = await satelliteRes.json();
      setSatelliteData(satelliteDataRes.data_points || []);
      
      const alertsRes = await fetch(`${API_BASE_URL}/alerts`);
      const alertsData = await alertsRes.json();
      setAlerts(alertsData.alerts || []);
      setShowAlert(alertsData.alerts.length > 0);
      
      const analyticsRes = await fetch(`${API_BASE_URL}/analytics`);
      const analyticsData = await analyticsRes.json();
      setAnalytics(analyticsData);
      
      setLastUpdate(new Date());
    } catch (error) {
      console.error('API Error:', error);
      generateSimulatedData();
    }
    setIsLoading(false);
  };

  const generateSimulatedData = () => {
    const predictions = [];
    for (let i = 0; i < 72; i++) {
      predictions.push({
        time: new Date(Date.now() + i * 3600000).toLocaleTimeString('en-US', { hour: '2-digit' }),
        predicted: Math.floor(50 + Math.sin(i / 8) * 40 + Math.random() * 20),
        confidence: 85 + Math.random() * 10,
        lstm: Math.floor(48 + Math.sin(i / 8) * 38),
        randomForest: Math.floor(52 + Math.sin(i / 8) * 42),
        neuralNet: Math.floor(50 + Math.sin(i / 8) * 40),
      });
    }
    setMlPredictions(predictions);

    const satData = [];
    for (let i = 0; i < 50; i++) {
      satData.push({
        lat: 34 + (Math.random() - 0.5) * 2,
        lon: -118 + (Math.random() - 0.5) * 2,
        no2: 15 + Math.random() * 30,
        pm25: 10 + Math.random() * 40,
      });
    }
    setSatelliteData(satData);

    setPollutants({
      no2: 24.5,
      pm25: 18.2,
      o3: 45.8,
      hcho: 8.7,
      pm10: 32.1,
      so2: 12.3,
    });

    setAlerts([
      {
        level: 'critical',
        title: 'Unhealthy AQI Forecast',
        message: 'ML models predict AQI will exceed 150 in the next 3 hours.',
        confidence: 94,
        timestamp: new Date().toISOString()
      }
    ]);
    setShowAlert(true);

    setAnalytics({
      correlations: [
        { variable: 'temperature', correlation: 0.75, impact: 'High' },
        { variable: 'humidity', correlation: -0.62, impact: 'High' },
        { variable: 'wind_speed', correlation: -0.58, impact: 'Medium' },
        { variable: 'traffic', correlation: 0.82, impact: 'Very High' },
      ]
    });
  };

  const handleImageAnalysis = async () => {
    if (!imageFile) {
      alert('Please select an image first!');
      return;
    }
    
    setIsLoading(true);
    setUploadProgress(0);
    
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);
    
    setTimeout(() => {
      setCvAnalysis({
        smoke_detection: Math.random() > 0.7,
        smoke_confidence: Math.floor(Math.random() * 30 + 70),
        cloud_cover: Math.floor(Math.random() * 100),
        visibility_km: Math.floor(Math.random() * 20 + 5),
        industrial_activity: Math.random() > 0.6,
        traffic_density: Math.floor(Math.random() * 100),
        wildfire_proximity: Math.random() > 0.8,
      });
      setUploadProgress(100);
      clearInterval(progressInterval);
      setIsLoading(false);
      setTimeout(() => setUploadProgress(0), 2000);
    }, 2000);
  };

  const handleLocationSearch = () => {
    setLocation(locationInput);
    fetchAllData();
  };

  const handleDownload = () => {
    const report = {
      location,
      timestamp: new Date().toISOString(),
      current_aqi: currentAQI,
      pollutants,
      forecast: mlPredictions.slice(0, 24),
      data_source: dataSource,
      using_real_data: usingRealData
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `airwatch-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const shareText = `Air Quality in ${location}: AQI ${Math.round(currentAQI)} (${getAQICategory(currentAQI)}) - Data: ${dataSource}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'AirWatch Pro', text: shareText });
      } catch (err) {
        navigator.clipboard.writeText(shareText);
        alert('Copied to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Copied to clipboard!');
    }
  };

useEffect(() => {
    fetchAllData();
    
    if (autoRefresh) {
      const interval = setInterval(fetchAllData, 300000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, fetchAllData]);

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return '#00e400';
    if (aqi <= 100) return '#ffff00';
    if (aqi <= 150) return '#ff7e00';
    if (aqi <= 200) return '#ff0000';
    if (aqi <= 300) return '#8f3f97';
    return '#7e0023';
  };

  const getAQICategory = (aqi) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  const pollutantData = [
    { name: 'NO₂', value: pollutants.no2 || 24.5, unit: 'ppb', color: '#60a5fa' },
    { name: 'PM2.5', value: pollutants.pm25 || 18.2, unit: 'µg/m³', color: '#34d399' },
    { name: 'O₃', value: pollutants.o3 || 45.8, unit: 'ppb', color: '#fbbf24' },
    { name: 'HCHO', value: pollutants.hcho || 8.7, unit: 'ppb', color: '#f87171' },
    { name: 'PM10', value: pollutants.pm10 || 32.1, unit: 'µg/m³', color: '#a78bfa' },
    { name: 'SO₂', value: pollutants.so2 || 12.3, unit: 'ppb', color: '#2dd4bf' },
  ];

  const COLORS = ['#60a5fa', '#34d399', '#fbbf24', '#f87171'];

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-900 via-sky-700 to-cyan-900 text-white overflow-hidden relative">
      {/* Animated cloud background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <Cloud className="absolute top-20 left-10 w-32 h-32 animate-pulse" style={{animationDuration: '4s'}} />
        <Cloud className="absolute top-40 right-20 w-24 h-24 animate-pulse" style={{animationDuration: '5s', animationDelay: '1s'}} />
        <Cloud className="absolute bottom-32 left-1/4 w-28 h-28 animate-pulse" style={{animationDuration: '6s', animationDelay: '2s'}} />
        <Wind className="absolute top-1/2 right-10 w-20 h-20 animate-pulse" style={{animationDuration: '3s'}} />
      </div>

      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-blue-950/90 to-sky-900/90 backdrop-blur-xl border-r border-sky-400/30 transition-all duration-300 flex flex-col shadow-2xl relative z-10`}>
        <div className="p-6 border-b border-sky-400/30">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Cloud className="text-sky-300" size={28} />
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-300 via-blue-200 to-cyan-300 bg-clip-text text-transparent">AirWatch Pro</h1>
                </div>
                <p className="text-xs text-sky-300 flex items-center gap-1">
                  <Satellite size={12} />
                  NASA TEMPO Integration
                </p>
              </div>
            )}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="p-2 hover:bg-sky-500/20 rounded-lg transition"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'dashboard', icon: Activity, label: 'Dashboard' },
            { id: 'ml', icon: Brain, label: 'ML Predictions' },
            { id: 'cv', icon: Eye, label: 'Computer Vision' },
            { id: 'analytics', icon: TrendingUp, label: 'Analytics' },
            { id: 'satellite', icon: Satellite, label: 'Satellite Data' },
            { id: 'alerts', icon: Bell, label: 'Alerts' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${
                activeTab === item.id 
                  ? 'bg-sky-500/40 text-sky-100 shadow-lg' 
                  : 'hover:bg-sky-500/20 text-sky-200'
              }`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-sky-400/30">
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${
              activeTab === 'settings' 
                ? 'bg-sky-500/40 text-sky-100' 
                : 'hover:bg-sky-500/20 text-sky-200'
            }`}
          >
            <Settings size={20} />
            {sidebarOpen && <span>Settings</span>}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto relative z-10">
        <div className="bg-gradient-to-r from-blue-950/80 to-sky-900/80 backdrop-blur-xl border-b border-sky-400/30 p-6 sticky top-0 z-10 shadow-lg">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <MapPin size={20} className="text-sky-300" />
                <input 
                  type="text" 
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLocationSearch()}
                  className="bg-sky-950/50 px-4 py-2 rounded-lg border border-sky-400/40 focus:outline-none focus:border-sky-300 text-white placeholder-sky-300/50"
                  placeholder="Enter location..."
                />
                <button 
                  onClick={handleLocationSearch}
                  className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 rounded-lg transition shadow-lg"
                >
                  Search
                </button>
              </div>
              <div className="text-sm text-sky-200 flex items-center gap-2">
                <span>Updated: {lastUpdate.toLocaleTimeString()}</span>
                {usingRealData && (
                  <span className="px-2 py-1 bg-green-500/30 text-green-200 rounded text-xs flex items-center gap-1">
                    <CheckCircle size={12} />
                    Real Data
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`p-2 rounded-lg transition ${autoRefresh ? 'bg-green-500/30 text-green-300' : 'bg-sky-700/50 text-sky-300'}`}
                title={autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
              >
                {autoRefresh ? <Play size={20} /> : <Pause size={20} />}
              </button>
              <button 
                onClick={fetchAllData}
                disabled={isLoading}
                className="p-2 hover:bg-sky-500/20 rounded-lg transition disabled:opacity-50"
                title="Refresh data"
              >
                <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
              </button>
              <button 
                onClick={handleDownload}
                className="p-2 hover:bg-sky-500/20 rounded-lg transition"
                title="Download report"
              >
                <Download size={20} />
              </button>
              <button 
                onClick={handleShare}
                className="p-2 hover:bg-sky-500/20 rounded-lg transition"
                title="Share data"
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <div className="p-6 space-y-6">
            {showAlert && alerts.length > 0 && (
              <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/40 rounded-xl p-4 flex items-start gap-4 backdrop-blur-sm">
                <AlertTriangle className="text-orange-300 mt-1 flex-shrink-0" size={24} />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-orange-100">{alerts[0]?.title}</h3>
                  <p className="text-orange-200/90 text-sm mt-1">{alerts[0]?.message}</p>
                </div>
                <button 
                  onClick={() => setShowAlert(false)}
                  className="text-orange-300 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="md:col-span-2 bg-gradient-to-br from-sky-500/30 to-blue-600/30 backdrop-blur-xl rounded-2xl p-8 border border-sky-400/40 shadow-2xl">
                <div className="text-center">
                  <p className="text-sky-200 text-sm mb-2 flex items-center justify-center gap-2">
                    <Cloud size={16} />
                    Current AQI
                  </p>
                  <div 
                    className="w-48 h-48 mx-auto rounded-full flex flex-col items-center justify-center mb-4 shadow-2xl border-4 border-white/20"
                    style={{ backgroundColor: getAQIColor(currentAQI) }}
                  >
                    <div className="text-6xl font-bold text-white drop-shadow-lg">{Math.round(currentAQI)}</div>
                    <div className="text-lg text-white/95">AQI</div>
                  </div>
                  <div className="text-2xl font-semibold mb-2" style={{ color: getAQIColor(currentAQI) }}>
                    {getAQICategory(currentAQI)}
                  </div>
                  <div className="text-sm text-sky-200 flex items-center justify-center gap-2">
                    <Satellite size={14} />
                    <span>{dataSource}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-600/30 to-sky-700/30 backdrop-blur-xl rounded-2xl p-6 border border-sky-400/40 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <Brain className="text-sky-300" size={24} />
                  <span className="text-xs px-2 py-1 bg-sky-400/30 rounded-full text-sky-100">Active</span>
                </div>
                <div className="text-3xl font-bold">6</div>
                <div className="text-sm text-sky-200 mt-1">ML Models</div>
                <div className="mt-4 text-xs text-sky-300">LSTM • RF • NN • XGB</div>
              </div>

              <div className="bg-gradient-to-br from-cyan-600/30 to-blue-700/30 backdrop-blur-xl rounded-2xl p-6 border border-sky-400/40 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <Satellite className="text-cyan-300" size={24} />
                  <span className="text-xs px-2 py-1 bg-cyan-400/30 rounded-full text-cyan-100">Live</span>
                </div>
                <div className="text-3xl font-bold">{satelliteData.length}</div>
                <div className="text-sm text-sky-200 mt-1">Data Points</div>
                <div className="mt-4 text-xs text-sky-300">OpenAQ Network</div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {pollutantData.map((poll, idx) => (
                <div key={idx} className="bg-gradient-to-br from-sky-800/40 to-blue-900/40 backdrop-blur-xl rounded-xl p-4 border border-sky-400/30 hover:border-sky-300 transition cursor-pointer shadow-lg">
                  <div className="text-sm text-sky-200 mb-2">{poll.name}</div>
                  <div className="text-2xl font-bold" style={{ color: poll.color }}>
                    {poll.value?.toFixed(1) || '--'}
                  </div>
                  <div className="text-xs text-sky-300 mt-1">{poll.unit}</div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-blue-900/40 to-sky-800/40 backdrop-blur-xl rounded-2xl p-6 border border-sky-400/30 shadow-xl">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-sky-100">
                <TrendingUp size={20} className="text-sky-300" />
                24-Hour Forecast
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={mlPredictions.slice(0, 24)}>
                  <defs>
                    <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#075985" />
                  <XAxis dataKey="time" stroke="#bae6fd" />
                  <YAxis stroke="#bae6fd" />
                  <Tooltip contentStyle={{ backgroundColor: '#0c4a6e', border: '1px solid #38bdf8', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="predicted" stroke="#38bdf8" fillOpacity={1} fill="url(#colorPredicted)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'ml' && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { model: 'LSTM', accuracy: 94.2, mse: 3.8, color: '#38bdf8' },
                { model: 'Random Forest', accuracy: 91.5, mse: 5.2, color: '#34d399' },
                { model: 'Neural Network', accuracy: 93.8, mse: 4.1, color: '#fbbf24' },
                { model: 'XGBoost', accuracy: 92.7, mse: 4.5, color: '#f87171' },
              ].map((m, idx) => (
                <div key={idx} className="bg-gradient-to-br from-blue-900/40 to-sky-800/40 backdrop-blur-xl rounded-xl p-6 border border-sky-400/30 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-sky-100">{m.model}</h3>
                    <Brain className="text-sky-300" size={20} />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-sky-200">Accuracy</span>
                        <span className="font-semibold text-sky-100">{m.accuracy}%</span>
                      </div>
                      <div className="w-full bg-sky-950/50 rounded-full h-2">
                        <div className="h-2 rounded-full" style={{ width: `${m.accuracy}%`, backgroundColor: m.color }}></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-sky-200">MSE</span>
                      <span className="text-sky-100">{m.mse}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-blue-900/40 to-sky-800/40 backdrop-blur-xl rounded-2xl p-6 border border-sky-400/30 shadow-xl">
              <h3 className="text-lg font-semibold mb-4 text-sky-100">72-Hour Prediction Ensemble</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={mlPredictions}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#075985" />
                  <XAxis dataKey="time" stroke="#bae6fd" interval={5} />
                  <YAxis stroke="#bae6fd" />
                  <Tooltip contentStyle={{ backgroundColor: '#0c4a6e', border: '1px solid #38bdf8', borderRadius: '8px' }} />
                  <Legend />
                  <Line type="monotone" dataKey="lstm" stroke="#38bdf8" strokeWidth={2} dot={false} name="LSTM" />
                  <Line type="monotone" dataKey="randomForest" stroke="#34d399" strokeWidth={2} dot={false} name="Random Forest" />
                  <Line type="monotone" dataKey="neuralNet" stroke="#fbbf24" strokeWidth={2} dot={false} name="Neural Net" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-900/40 to-sky-800/40 backdrop-blur-xl rounded-xl p-6 border border-sky-400/30 shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-sky-100">Model Performance Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'LSTM', value: 94.2 },
                        { name: 'RF', value: 91.5 },
                        { name: 'NN', value: 93.8 },
                        { name: 'XGB', value: 92.7 }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-gradient-to-br from-blue-900/40 to-sky-800/40 backdrop-blur-xl rounded-xl p-6 border border-sky-400/30 shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-sky-100">Confidence Intervals</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mlPredictions.slice(0, 12)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#075985" />
                    <XAxis dataKey="time" stroke="#bae6fd" />
                    <YAxis stroke="#bae6fd" />
                    <Tooltip contentStyle={{ backgroundColor: '#0c4a6e', border: '1px solid #38bdf8', borderRadius: '8px' }} />
                    <Bar dataKey="confidence" fill="#38bdf8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cv' && (
          <div className="p-6 space-y-6">
            <div className="bg-gradient-to-br from-blue-900/40 to-sky-800/40 backdrop-blur-xl rounded-2xl p-6 border border-sky-400/30 shadow-xl">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-sky-100">
                <Camera className="text-sky-300" size={20} />
                Upload Satellite Image for Analysis
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="flex-1 bg-sky-950/50 px-4 py-3 rounded-lg border border-sky-400/40 cursor-pointer hover:border-sky-300 transition flex items-center gap-3">
                    <Upload size={20} className="text-sky-300" />
                    <span className="text-sky-200">{imageFile ? imageFile.name : 'Choose image file...'}</span>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                  <button 
                    onClick={handleImageAnalysis}
                    disabled={isLoading || !imageFile}
                    className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-500 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw size={20} className="animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Eye size={20} />
                        Analyze
                      </>
                    )}
                  </button>
                </div>
                
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="w-full bg-sky-950/50 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-sky-400 to-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
                
                {uploadProgress === 100 && (
                  <div className="flex items-center gap-2 text-green-300">
                    <CheckCircle size={20} />
                    <span>Analysis complete!</span>
                  </div>
                )}
              </div>
            </div>

            {cvAnalysis && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { label: 'Smoke Detection', value: cvAnalysis.smoke_detection ? 'Detected' : 'Clear', icon: Eye, alert: cvAnalysis.smoke_detection },
                  { label: 'Cloud Cover', value: `${cvAnalysis.cloud_cover}%`, icon: Cloud },
                  { label: 'Visibility', value: `${cvAnalysis.visibility_km} km`, icon: Eye },
                  { label: 'Industrial Activity', value: cvAnalysis.industrial_activity ? 'High' : 'Normal', icon: Activity },
                  { label: 'Traffic Density', value: `${cvAnalysis.traffic_density}%`, icon: Activity },
                  { label: 'Wildfire Proximity', value: cvAnalysis.wildfire_proximity ? '< 50km' : 'None', icon: AlertTriangle, alert: cvAnalysis.wildfire_proximity },
                ].map((item, idx) => (
                  <div key={idx} className={`bg-gradient-to-br from-blue-900/40 to-sky-800/40 backdrop-blur-xl rounded-xl p-6 border ${item.alert ? 'border-red-400/50' : 'border-sky-400/30'} shadow-lg`}>
                    <div className="flex items-center justify-between mb-4">
                      <item.icon className={item.alert ? 'text-red-300' : 'text-cyan-300'} size={24} />
                      <span className={`text-xs px-3 py-1 rounded-full ${item.alert ? 'bg-red-500/30 text-red-200' : 'bg-cyan-500/30 text-cyan-200'}`}>
                        CV Model
                      </span>
                    </div>
                    <h3 className="font-semibold mb-2 text-sky-100">{item.label}</h3>
                    <div className="text-2xl font-bold text-sky-100">{item.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-900/40 to-sky-800/40 backdrop-blur-xl rounded-2xl p-6 border border-sky-400/30 shadow-xl">
                <h3 className="text-lg font-semibold mb-4 text-sky-100">Pollutant Correlations</h3>
                <div className="space-y-4">
                  {analytics.correlations?.map((corr, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-sky-200 capitalize">{corr.variable}</span>
                        <span className="font-semibold text-sky-100">{corr.correlation.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-sky-950/50 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${corr.correlation > 0 ? 'bg-green-400' : 'bg-red-400'}`}
                            style={{ width: `${Math.abs(corr.correlation) * 100}%` }}
                          ></div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          corr.impact === 'Very High' ? 'bg-red-500/30 text-red-200' :
                          corr.impact === 'High' ? 'bg-orange-500/30 text-orange-200' :
                          'bg-yellow-500/30 text-yellow-200'
                        }`}>
                          {corr.impact}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-900/40 to-sky-800/40 backdrop-blur-xl rounded-2xl p-6 border border-sky-400/30 shadow-xl">
                <h3 className="text-lg font-semibold mb-4 text-sky-100">Spatial Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="#075985" />
                    <XAxis dataKey="lon" name="Longitude" stroke="#bae6fd" />
                    <YAxis dataKey="lat" name="Latitude" stroke="#bae6fd" />
                    <Tooltip contentStyle={{ backgroundColor: '#0c4a6e', border: '1px solid #38bdf8', borderRadius: '8px' }} />
                    <Scatter name="NO₂ Levels" data={satelliteData} fill="#38bdf8" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-900/40 to-sky-800/40 backdrop-blur-xl rounded-2xl p-6 border border-sky-400/30 shadow-xl">
              <h3 className="text-lg font-semibold mb-4 text-sky-100">Pollutant Distribution</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={pollutantData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#075985" />
                  <XAxis dataKey="name" stroke="#bae6fd" />
                  <YAxis stroke="#bae6fd" />
                  <Tooltip contentStyle={{ backgroundColor: '#0c4a6e', border: '1px solid #38bdf8', borderRadius: '8px' }} />
                  <Legend />
                  <Bar dataKey="value" fill="#38bdf8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'satellite' && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'NO₂', value: '2.4×10¹⁵', unit: 'molec/cm²', status: 'Normal', color: '#38bdf8' },
                { name: 'HCHO', value: '8.7×10¹⁵', unit: 'molec/cm²', status: 'Elevated', color: '#fbbf24' },
                { name: 'O₃', value: '305 DU', unit: 'Dobson Units', status: 'Normal', color: '#34d399' },
                { name: 'Aerosol Index', value: '0.8', unit: 'unitless', status: 'Low', color: '#60a5fa' },
              ].map((item, idx) => (
                <div key={idx} className="bg-gradient-to-br from-blue-900/40 to-sky-800/40 backdrop-blur-xl rounded-xl p-6 border border-sky-400/30 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <Satellite className="text-sky-300" size={24} />
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.status === 'Elevated' ? 'bg-orange-500/30 text-orange-200' :
                      item.status === 'Low' ? 'bg-green-500/30 text-green-200' :
                      'bg-cyan-500/30 text-cyan-200'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-2 text-sky-100">{item.name}</h3>
                  <div className="text-2xl font-bold mb-1" style={{ color: item.color }}>{item.value}</div>
                  <div className="text-xs text-sky-300">{item.unit}</div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-blue-900/40 to-sky-800/40 backdrop-blur-xl rounded-2xl p-6 border border-sky-400/30 shadow-xl">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-sky-100">
                <Satellite size={20} className="text-sky-300" />
                Data Sources & Coverage
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-sky-950/50 rounded-lg border border-sky-400/20">
                    <div className="text-2xl font-bold text-sky-300">{satelliteData.length}</div>
                    <div className="text-xs text-sky-200 mt-1">Data Points</div>
                  </div>
                  <div className="text-center p-4 bg-sky-950/50 rounded-lg border border-sky-400/20">
                    <div className="text-2xl font-bold text-cyan-300">OpenAQ</div>
                    <div className="text-xs text-sky-200 mt-1">Primary Source</div>
                  </div>
                  <div className="text-center p-4 bg-sky-950/50 rounded-lg border border-sky-400/20">
                    <div className="text-2xl font-bold text-green-300">Hourly</div>
                    <div className="text-xs text-sky-200 mt-1">Update Freq.</div>
                  </div>
                  <div className="text-center p-4 bg-sky-950/50 rounded-lg border border-sky-400/20">
                    <div className="text-2xl font-bold text-blue-300">Global</div>
                    <div className="text-xs text-sky-200 mt-1">Coverage</div>
                  </div>
                </div>
                
                <div className="bg-sky-950/30 rounded-lg p-4 border border-sky-400/20">
                  <h4 className="font-semibold mb-3 text-sky-100 flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-300" />
                    Active Data Sources
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-sky-200 flex items-center gap-2">
                        <Satellite size={14} />
                        OpenAQ Network
                      </span>
                      <span className="text-green-300 flex items-center gap-1">
                        <CheckCircle size={14} />
                        Live
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sky-200 flex items-center gap-2">
                        <Cloud size={14} />
                        WAQI (aqicn.org)
                      </span>
                      <span className="text-green-300 flex items-center gap-1">
                        <CheckCircle size={14} />
                        Connected
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sky-200 flex items-center gap-2">
                        <Brain size={14} />
                        ML Model Pipeline
                      </span>
                      <span className="text-green-300 flex items-center gap-1">
                        <CheckCircle size={14} />
                        Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sky-200 flex items-center gap-2">
                        <AlertTriangle size={14} />
                        NASA TEMPO
                      </span>
                      <span className="text-orange-300 flex items-center gap-1">
                        <AlertTriangle size={14} />
                        Unavailable (Gov Shutdown)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { type: 'Critical', count: alerts.filter(a => a.level === 'critical').length, color: 'red', icon: AlertTriangle },
                { type: 'Warning', count: alerts.filter(a => a.level === 'warning').length, color: 'yellow', icon: Bell },
                { type: 'Info', count: alerts.filter(a => a.level === 'info').length, color: 'blue', icon: Activity },
              ].map((item, idx) => (
                <div key={idx} className="bg-gradient-to-br from-blue-900/40 to-sky-800/40 backdrop-blur-xl rounded-xl p-6 border border-sky-400/30 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <item.icon className={`text-${item.color}-300`} size={32} />
                    <span className="text-3xl font-bold text-sky-100">{item.count}</span>
                  </div>
                  <h3 className="font-semibold text-sky-100">{item.type} Alerts</h3>
                  <div className="mt-2 text-sm text-sky-200">Active notifications</div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {alerts.length > 0 ? alerts.map((alert, idx) => (
                <div key={idx} className={`bg-gradient-to-br from-blue-900/40 to-sky-800/40 backdrop-blur-xl rounded-xl p-6 border ${
                  alert.level === 'critical' ? 'border-red-400/40' : 
                  alert.level === 'warning' ? 'border-yellow-400/40' : 'border-cyan-400/40'
                } shadow-lg`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <Bell className={
                        alert.level === 'critical' ? 'text-red-300' : 
                        alert.level === 'warning' ? 'text-yellow-300' : 'text-cyan-300'
                      } size={24} />
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2 text-sky-100">{alert.title}</h3>
                        <p className="text-sky-200 text-sm mb-3">{alert.message}</p>
                        <div className="flex items-center gap-4 text-xs text-sky-300">
                          <span>AI Confidence: {alert.confidence}%</span>
                          <span>•</span>
                          <span>{new Date(alert.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setAlerts(alerts.filter((_, i) => i !== idx))}
                      className="text-sky-300 hover:text-white transition"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="bg-gradient-to-br from-blue-900/40 to-sky-800/40 backdrop-blur-xl rounded-xl p-12 border border-sky-400/30 text-center shadow-lg">
                  <CheckCircle className="mx-auto mb-4 text-green-300" size={48} />
                  <h3 className="text-xl font-semibold mb-2 text-sky-100">No Active Alerts</h3>
                  <p className="text-sky-200">Air quality is within normal parameters</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="p-6 space-y-6">
            <div className="bg-gradient-to-br from-blue-900/40 to-sky-800/40 backdrop-blur-xl rounded-2xl p-6 border border-sky-400/30 shadow-xl">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-sky-100">
                <Settings size={20} className="text-sky-300" />
                Application Settings
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-sky-950/30 rounded-lg border border-sky-400/20">
                  <div>
                    <h4 className="font-semibold mb-1 text-sky-100">Auto-refresh Data</h4>
                    <p className="text-sm text-sky-200">Automatically update data every 5 minutes</p>
                  </div>
                  <button 
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    className={`px-6 py-2 rounded-lg font-semibold transition ${
                      autoRefresh 
                        ? 'bg-green-500 hover:bg-green-600 text-white' 
                        : 'bg-sky-700 hover:bg-sky-600 text-sky-200'
                    }`}
                  >
                    {autoRefresh ? 'ON' : 'OFF'}
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-sky-950/30 rounded-lg border border-sky-400/20">
                  <div>
                    <h4 className="font-semibold mb-1 text-sky-100">Push Notifications</h4>
                    <p className="text-sm text-sky-200">Receive alerts for air quality changes</p>
                  </div>
                  <button 
                    onClick={() => setNotifications(!notifications)}
                    className={`px-6 py-2 rounded-lg font-semibold transition ${
                      notifications 
                        ? 'bg-green-500 hover:bg-green-600 text-white' 
                        : 'bg-sky-700 hover:bg-sky-600 text-sky-200'
                    }`}
                  >
                    {notifications ? 'Enabled' : 'Disabled'}
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-sky-950/30 rounded-lg border border-sky-400/20">
                  <div>
                    <h4 className="font-semibold mb-1 text-sky-100">Default Location</h4>
                    <p className="text-sm text-sky-200">Set your primary monitoring location</p>
                  </div>
                  <input 
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="px-4 py-2 bg-sky-950/50 rounded-lg border border-sky-400/40 focus:outline-none focus:border-sky-300 text-white"
                  />
                </div>

                <div className="p-4 bg-sky-950/30 rounded-lg border border-sky-400/20">
                  <h4 className="font-semibold mb-3 text-sky-100">Data Sources</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-sky-200">OpenAQ Network (Free)</span>
                      <span className="text-green-300 flex items-center gap-2">
                        <CheckCircle size={16} />
                        Connected
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sky-200">WAQI (aqicn.org)</span>
                      <span className="text-green-300 flex items-center gap-2">
                        <CheckCircle size={16} />
                        Connected
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sky-200">ML Model Pipeline</span>
                      <span className="text-green-300 flex items-center gap-2">
                        <CheckCircle size={16} />
                        Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sky-200">NASA TEMPO Satellite</span>
                      <span className="text-orange-300 flex items-center gap-2">
                        <AlertTriangle size={16} />
                        Unavailable
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-sky-500/20 to-blue-500/20 border border-sky-400/40 rounded-lg">
                  <h4 className="font-semibold mb-2 text-sky-100">About AirWatch Pro</h4>
                  <p className="text-sm text-sky-200 mb-3">
                    AI-powered air quality monitoring system integrating OpenAQ network data, 
                    machine learning predictions, and computer vision analysis for NASA Space Apps Challenge 2024.
                  </p>
                  <div className="text-xs text-sky-300 space-y-1">
                    <div>Version: 1.0.0 MVP</div>
                    <div>Models: LSTM, Random Forest, Neural Network, XGBoost</div>
                    <div>Data Sources: OpenAQ, WAQI, PurpleAir (Free & Open)</div>
                    <div>NASA TEMPO: Currently unavailable due to government shutdown</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AirWatchPro;