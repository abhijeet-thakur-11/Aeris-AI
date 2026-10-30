// ─────────────────────────────────────
// AERIS AI — Mock Data
// ─────────────────────────────────────

// AQI color utility
export function getAQIColor(aqi) {
  if (aqi <= 50) return '#30D158';
  if (aqi <= 100) return '#FFB020';
  if (aqi <= 200) return '#FF8C00';
  if (aqi <= 300) return '#FF4D4F';
  return '#8B0000';
}

export function getAQILabel(aqi) {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 200) return 'Poor';
  if (aqi <= 300) return 'Very Poor';
  return 'Severe';
}

// ─── Pollution Hotspots (Delhi NCR) ───
export const hotspots = [
  {
    id: 1,
    name: 'Anand Vihar',
    lat: 28.6469,
    lng: 77.3164,
    aqi: 287,
    type: 'Industrial Emission',
    severity: 'Very Poor',
    aiConfidence: 94,
    detectedAt: '14:23',
    pm25: 187,
    pm10: 312,
    nearbySchools: 3,
    nearbyHospitals: 1,
    windSpeed: 12,
    windDirection: 'ENE',
    predictedSpread: 1.8,
    suggestedAction: 'Deploy Water Mist Cannon + Industrial Inspection',
    photo: null
  },
  {
    id: 2,
    name: 'Rohini Sector 22',
    lat: 28.7352,
    lng: 77.1145,
    aqi: 224,
    type: 'Construction Dust',
    severity: 'Poor',
    aiConfidence: 89,
    detectedAt: '13:47',
    pm25: 142,
    pm10: 258,
    nearbySchools: 5,
    nearbyHospitals: 2,
    windSpeed: 8,
    windDirection: 'NW',
    predictedSpread: 1.2,
    suggestedAction: 'Issue Construction Notice + Street Cleaning',
    photo: null
  },
  {
    id: 3,
    name: 'Dwarka Sector 8',
    lat: 28.5823,
    lng: 77.0500,
    aqi: 178,
    type: 'Vehicle Pollution',
    severity: 'Poor',
    aiConfidence: 87,
    detectedAt: '12:15',
    pm25: 108,
    pm10: 195,
    nearbySchools: 2,
    nearbyHospitals: 1,
    windSpeed: 6,
    windDirection: 'W',
    predictedSpread: 0.9,
    suggestedAction: 'Traffic Diversion + Green Corridor',
    photo: null
  },
  {
    id: 4,
    name: 'Sarojini Nagar',
    lat: 28.5755,
    lng: 77.2001,
    aqi: 312,
    type: 'Garbage Burning',
    severity: 'Severe',
    aiConfidence: 96,
    detectedAt: '11:30',
    pm25: 234,
    pm10: 387,
    nearbySchools: 4,
    nearbyHospitals: 2,
    windSpeed: 14,
    windDirection: 'E',
    predictedSpread: 2.4,
    suggestedAction: 'Emergency Response + Health Advisory',
    photo: null
  },
  {
    id: 5,
    name: 'Nehru Place',
    lat: 28.5494,
    lng: 77.2529,
    aqi: 156,
    type: 'Vehicle Pollution',
    severity: 'Poor',
    aiConfidence: 82,
    detectedAt: '15:02',
    pm25: 94,
    pm10: 172,
    nearbySchools: 1,
    nearbyHospitals: 3,
    windSpeed: 5,
    windDirection: 'SE',
    predictedSpread: 0.7,
    suggestedAction: 'Traffic Signal Optimization',
    photo: null
  },
  {
    id: 6,
    name: 'Chandni Chowk',
    lat: 28.6506,
    lng: 77.2302,
    aqi: 198,
    type: 'Mixed Pollution',
    severity: 'Poor',
    aiConfidence: 78,
    detectedAt: '10:45',
    pm25: 124,
    pm10: 216,
    nearbySchools: 6,
    nearbyHospitals: 2,
    windSpeed: 7,
    windDirection: 'N',
    predictedSpread: 1.1,
    suggestedAction: 'Street Cleaning + Vehicle Restriction',
    photo: null
  },
  {
    id: 7,
    name: 'India Gate',
    lat: 28.6129,
    lng: 77.2295,
    aqi: 89,
    type: 'Moderate',
    severity: 'Moderate',
    aiConfidence: 91,
    detectedAt: '09:30',
    pm25: 52,
    pm10: 98,
    nearbySchools: 0,
    nearbyHospitals: 1,
    windSpeed: 10,
    windDirection: 'SW',
    predictedSpread: 0.4,
    suggestedAction: 'Monitor',
    photo: null
  },
  {
    id: 8,
    name: 'Connaught Place',
    lat: 28.6315,
    lng: 77.2167,
    aqi: 72,
    type: 'Vehicle Pollution',
    severity: 'Moderate',
    aiConfidence: 85,
    detectedAt: '08:15',
    pm25: 38,
    pm10: 82,
    nearbySchools: 2,
    nearbyHospitals: 2,
    windSpeed: 9,
    windDirection: 'S',
    predictedSpread: 0.3,
    suggestedAction: 'Green Zone Enforcement',
    photo: null
  },
  {
    id: 9,
    name: 'Noida Sector 62',
    lat: 28.6274,
    lng: 77.3650,
    aqi: 245,
    type: 'Industrial Emission',
    severity: 'Very Poor',
    aiConfidence: 91,
    detectedAt: '13:00',
    pm25: 162,
    pm10: 278,
    nearbySchools: 3,
    nearbyHospitals: 1,
    windSpeed: 11,
    windDirection: 'NE',
    predictedSpread: 1.6,
    suggestedAction: 'Industrial Inspection + Emission Check',
    photo: null
  },
  {
    id: 10,
    name: 'Gurugram Sec 29',
    lat: 28.4595,
    lng: 77.0266,
    aqi: 42,
    type: 'Normal',
    severity: 'Good',
    aiConfidence: 95,
    detectedAt: '16:00',
    pm25: 22,
    pm10: 45,
    nearbySchools: 2,
    nearbyHospitals: 3,
    windSpeed: 13,
    windDirection: 'W',
    predictedSpread: 0,
    suggestedAction: 'No action needed',
    photo: null
  },
  {
    id: 11,
    name: 'Mundka Industrial',
    lat: 28.6814,
    lng: 77.0210,
    aqi: 334,
    type: 'Industrial Emission',
    severity: 'Severe',
    aiConfidence: 97,
    detectedAt: '07:45',
    pm25: 256,
    pm10: 412,
    nearbySchools: 2,
    nearbyHospitals: 0,
    windSpeed: 15,
    windDirection: 'E',
    predictedSpread: 3.1,
    suggestedAction: 'Emergency Shutdown Notice + Health Advisory',
    photo: null
  },
  {
    id: 12,
    name: 'Lodhi Garden',
    lat: 28.5931,
    lng: 77.2197,
    aqi: 35,
    type: 'Normal',
    severity: 'Good',
    aiConfidence: 98,
    detectedAt: '16:15',
    pm25: 15,
    pm10: 38,
    nearbySchools: 1,
    nearbyHospitals: 1,
    windSpeed: 8,
    windDirection: 'SW',
    predictedSpread: 0,
    suggestedAction: 'No action needed',
    photo: null
  }
];

// ─── AI Insight ───
export const aiInsight = {
  title: 'Garbage Burning Detected',
  location: 'Sarojini Nagar',
  windInfo: 'Strong Eastward Wind',
  pm25Change: '+34%',
  predictedSpread: '2.4 km',
  confidence: 96,
  affectedPop: '~45,000',
  timeDetected: '11:30 AM'
};

// ─── Wind Data ───
export const windData = {
  speed: 12,
  direction: 245,
  directionLabel: 'WSW',
  gusts: 18
};

// ─── Map Layers ───
export const mapLayers = [
  { id: 'aqi', name: 'AQI Heatmap', icon: 'thermometer', active: true },
  { id: 'wind', name: 'Wind Direction', icon: 'wind', active: true },
  { id: 'traffic', name: 'Traffic Density', icon: 'car', active: false },
  { id: 'construction', name: 'Construction Zones', icon: 'hard-hat', active: false },
  { id: 'sensors', name: 'Govt. Sensors', icon: 'radio', active: true },
  { id: 'reports', name: 'Citizen Reports', icon: 'users', active: false },
  { id: 'satellite', name: 'Satellite View', icon: 'satellite', active: false },
  { id: 'industrial', name: 'Industrial Zones', icon: 'factory', active: false }
];

// ─── Timeline Steps ───
export const timelineSteps = [
  { label: 'Now', hours: 0, aqiMultiplier: 1.0 },
  { label: '+1h', hours: 1, aqiMultiplier: 1.08 },
  { label: '+3h', hours: 3, aqiMultiplier: 1.18 },
  { label: '+6h', hours: 6, aqiMultiplier: 1.32 },
  { label: '+12h', hours: 12, aqiMultiplier: 1.15 },
  { label: '+24h', hours: 24, aqiMultiplier: 0.88 }
];

// ─── Alerts ───
export const alerts = [
  {
    id: 1,
    type: 'Garbage Burning',
    priority: 'critical',
    status: 'Active',
    location: 'Sarojini Nagar',
    time: '11:30 AM',
    prediction: 'PM2.5 +34% in 2 hours',
    verification: 'AI Verified',
    eta: '15 min response',
    action: 'Deploy Water Mist Cannon',
    icon: 'flame'
  },
  {
    id: 2,
    type: 'Industrial Emission',
    priority: 'critical',
    status: 'Responding',
    location: 'Mundka Industrial Area',
    time: '07:45 AM',
    prediction: 'AQI 400+ by evening',
    verification: 'Sensor + AI',
    eta: 'Team en route',
    action: 'Emergency Shutdown Notice',
    icon: 'factory'
  },
  {
    id: 3,
    type: 'Construction Dust',
    priority: 'high',
    status: 'Monitoring',
    location: 'Rohini Sector 22',
    time: '01:47 PM',
    prediction: 'Localized, 1.2km spread',
    verification: 'AI Verified',
    eta: '30 min response',
    action: 'Issue Construction Notice',
    icon: 'hard-hat'
  },
  {
    id: 4,
    type: 'Vehicle Congestion',
    priority: 'medium',
    status: 'Active',
    location: 'Nehru Place Junction',
    time: '03:02 PM',
    prediction: 'Rush hour peak in 1h',
    verification: 'Traffic + AI',
    eta: '45 min',
    action: 'Traffic Signal Optimization',
    icon: 'car'
  },
  {
    id: 5,
    type: 'Industrial Emission',
    priority: 'high',
    status: 'Active',
    location: 'Anand Vihar',
    time: '02:23 PM',
    prediction: 'Cross-border pollution',
    verification: 'Multi-sensor',
    eta: '20 min response',
    action: 'Industrial Inspection',
    icon: 'factory'
  },
  {
    id: 6,
    type: 'School Zone Alert',
    priority: 'high',
    status: 'Advisory Sent',
    location: 'Chandni Chowk',
    time: '10:45 AM',
    prediction: 'AQI 200+ near schools',
    verification: 'AI Prediction',
    eta: 'Immediate',
    action: 'School Health Advisory',
    icon: 'school'
  },
  {
    id: 7,
    type: 'Dust Storm Warning',
    priority: 'medium',
    status: 'Predicted',
    location: 'Western Delhi',
    time: '06:00 PM',
    prediction: 'Incoming from Rajasthan',
    verification: 'Satellite + Wind',
    eta: '~3 hours',
    action: 'Pre-deploy water tankers',
    icon: 'cloud'
  },
  {
    id: 8,
    type: 'AQI Improvement',
    priority: 'low',
    status: 'Resolved',
    location: 'Lodhi Garden Area',
    time: '04:15 PM',
    prediction: 'Continued improvement',
    verification: 'Confirmed',
    eta: 'N/A',
    action: 'Green zone maintained',
    icon: 'leaf'
  }
];

// ─── Analytics Data ───
export const dailyAQI = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  data: [156, 189, 212, 178, 234, 198, 167]
};

export const weeklyTrend = {
  labels: ['W1', 'W2', 'W3', 'W4'],
  data: [198, 212, 187, 176]
};

export const pollutionSources = {
  labels: ['Vehicles', 'Industry', 'Construction', 'Burning', 'Other'],
  data: [35, 28, 18, 12, 7],
  colors: ['#4F8CFF', '#FF4D4F', '#FFB020', '#FF8C00', '#6E6E73']
};

export const worstLocations = [
  { name: 'Mundka Industrial', aqi: 334 },
  { name: 'Sarojini Nagar', aqi: 312 },
  { name: 'Anand Vihar', aqi: 287 },
  { name: 'Noida Sec 62', aqi: 245 },
  { name: 'Rohini Sec 22', aqi: 224 }
];

export const predictionAccuracy = 91.4;

// ─── Smart Recommendations ───
export const recommendations = [
  {
    id: 1,
    action: 'Deploy Water Mist Cannon',
    location: 'Sarojini Nagar',
    priority: 'Critical',
    aqiReduction: '18-24%',
    responseTime: '15 min',
    affectedPop: '45,000',
    icon: 'droplets'
  },
  {
    id: 2,
    action: 'Industrial Inspection',
    location: 'Mundka Industrial',
    priority: 'Critical',
    aqiReduction: '30-40%',
    responseTime: '45 min',
    affectedPop: '28,000',
    icon: 'search'
  },
  {
    id: 3,
    action: 'Traffic Diversion',
    location: 'Nehru Place',
    priority: 'High',
    aqiReduction: '12-15%',
    responseTime: '20 min',
    affectedPop: '62,000',
    icon: 'git-branch'
  },
  {
    id: 4,
    action: 'Street Cleaning',
    location: 'Rohini Sector 22',
    priority: 'Medium',
    aqiReduction: '8-12%',
    responseTime: '30 min',
    affectedPop: '35,000',
    icon: 'sparkles'
  },
  {
    id: 5,
    action: 'School Health Advisory',
    location: 'Chandni Chowk',
    priority: 'High',
    aqiReduction: 'N/A',
    responseTime: 'Immediate',
    affectedPop: '12,000 students',
    icon: 'heart'
  }
];

// ─── Resource Optimization ───
export const resources = {
  waterTankers: { total: 4, deployed: 2, available: 2 },
  inspectionTeams: { total: 2, deployed: 1, available: 1 },
  pollutionVehicle: { total: 1, deployed: 1, available: 0 },
  streetSweepers: { total: 6, deployed: 4, available: 2 }
};

// ─── Smart Route ───
export const smartRoute = {
  origin: 'Connaught Place',
  destination: 'Noida Sector 18',
  fastest: {
    time: '42 min',
    distance: '24.3 km',
    avgAQI: 198,
    exposure: 'High'
  },
  healthiest: {
    time: '51 min',
    distance: '28.7 km',
    avgAQI: 108,
    exposure: 'Moderate',
    reduction: '34% less pollution'
  }
};

// ─── AI Explainability ───
export const aiFactors = [
  { factor: 'Wind Speed & Direction', weight: 45, color: '#4F8CFF' },
  { factor: 'Traffic Density', weight: 23, color: '#FFB020' },
  { factor: 'Construction Activity', weight: 17, color: '#FF8C00' },
  { factor: 'Humidity & Temp', weight: 10, color: '#36CFC9' },
  { factor: 'Citizen Reports', weight: 5, color: '#30D158' }
];

// ─── AI Assistant Quick Questions ───
export const aiQuestions = [
  'Why is AQI increasing right now?',
  'Which route to office is healthiest?',
  'Which locality is safest today?',
  'What caused today\'s pollution spike?',
  'Should schools close tomorrow?',
  'When will air quality improve?'
];

// ─── AI Assistant Responses ───
export const aiResponses = {
  'Why is AQI increasing right now?': 'AQI is rising due to a combination of garbage burning detected in Sarojini Nagar and industrial emissions from Mundka. Strong eastward winds (12 km/h) are carrying PM2.5 particles across central Delhi. Expected to peak at 340+ by 6 PM.',
  'Which route to office is healthiest?': 'The Ring Road via Lodhi Garden route has 34% less pollution exposure (avg AQI 108) compared to the direct route through Nehru Place (avg AQI 198). Only 9 minutes longer.',
  'Which locality is safest today?': 'Lodhi Garden area currently has the best air quality (AQI 35 — Good). Gurugram Sector 29 is also excellent at AQI 42. Avoid Mundka Industrial and Sarojini Nagar.',
  'What caused today\'s pollution spike?': 'Three converging factors: (1) Garbage burning in Sarojini Nagar since 11:30 AM, (2) Industrial emissions in Mundka exceeding limits, (3) Rush-hour traffic congestion at Nehru Place. Wind patterns are carrying pollutants eastward.',
  'Should schools close tomorrow?': 'Based on current predictions, AQI near Chandni Chowk schools will remain above 200 until Thursday. A health advisory has been issued. School closure is recommended for sensitive zones.',
  'When will air quality improve?': 'Models predict AQI improvement starting tomorrow evening. A western wind shift is expected around 4 PM tomorrow, bringing cleaner air. Full recovery to Moderate levels by Friday.'
};

// ─── Citizen Report Classifications ───
export const reportClassifications = [
  { type: 'Smoke / Open Burning', confidence: 94, icon: 'flame' },
  { type: 'Construction Dust', confidence: 89, icon: 'hard-hat' },
  { type: 'Garbage Fire', confidence: 96, icon: 'trash' },
  { type: 'Industrial Emission', confidence: 91, icon: 'factory' },
  { type: 'Vehicle Pollution', confidence: 82, icon: 'car' }
];

// ─── Profile Data ───
export const userProfile = {
  name: 'Arjun Mehta',
  role: 'Municipal Officer',
  department: 'DPCC — Delhi',
  healthScore: 72,
  reportsSubmitted: 23,
  alertsActioned: 47,
  joinedDate: 'Jan 2025',
  avatar: null
};
