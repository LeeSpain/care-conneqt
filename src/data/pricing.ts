export type Package = {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  devicesIncluded: number;
  familyDashboards: number;
  popular?: boolean;
};

export type AddOn = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'device' | 'service';
  icon?: string;
};

export type DeviceOption = {
  id: string;
  name: string;
  description: string;
  price: number;
  type: string;
};

export const packages: Package[] = [
  {
    id: 'base',
    name: 'Base Membership',
    price: 49.99,
    description: 'Essential care for independent living',
    features: [
      '1 Device (Vivago Watch or SOS Pendant)',
      'AI Guardian (EN/ES/NL)',
      'Member Dashboard',
      'Monthly Nurse Check-in',
      '24/7 Emergency Call Center',
      'Clinical notes & family notifications'
    ],
    devicesIncluded: 1,
    familyDashboards: 0,
  },
  {
    id: 'independent',
    name: 'Independent Living',
    price: 69.99,
    description: 'Enhanced monitoring and emergency response',
    features: [
      'Everything in Base Membership',
      '2 Devices included',
      'Weekly Nurse Check-ins',
      'Priority Emergency Response',
      'Advanced Activity Monitoring',
      'Family Dashboard (2 users)'
    ],
    devicesIncluded: 2,
    familyDashboards: 2,
    popular: true,
  },
  {
    id: 'chronic',
    name: 'Chronic Disease Mgmt',
    price: 119.99,
    description: 'Comprehensive health monitoring',
    features: [
      'Everything in Independent Living',
      '4 Devices (health monitoring suite)',
      'Daily Nurse Monitoring',
      'Medication Management',
      'Vital Signs Tracking',
      'Care Coordinator',
      'Unlimited Family Dashboards'
    ],
    devicesIncluded: 4,
    familyDashboards: -1, // unlimited
  },
  {
    id: 'mental',
    name: 'Mental Health & Wellness',
    price: 159.99,
    description: 'Complete support with therapy access',
    features: [
      'Everything in Chronic Disease Mgmt',
      'Weekly Therapy Sessions',
      'Mental Health Specialist',
      'Social Wellness Activities',
      'Mood & Anxiety Tracking',
      'Crisis Intervention Support',
      'Caregiver Support Programs'
    ],
    devicesIncluded: 4,
    familyDashboards: -1, // unlimited
  }
];

export const addOns: AddOn[] = [
  {
    id: 'family-dashboard',
    name: 'Additional Family Dashboard',
    description: 'Give another family member access to real-time monitoring and alerts',
    price: 2.99,
    category: 'service',
  },
  {
    id: 'vivago-watch',
    name: 'Vivago Smart Watch',
    description: 'Activity tracking, fall detection, automatic alerts',
    price: 5.99,
    category: 'device',
  },
  {
    id: 'sos-pendant',
    name: 'SOS Pendant',
    description: 'Wearable emergency button with GPS tracking',
    price: 3.99,
    category: 'device',
  },
  {
    id: 'medication-dispenser',
    name: 'Smart Medication Dispenser',
    description: 'Automated medication reminders and tracking',
    price: 7.99,
    category: 'device',
  },
  {
    id: 'bbrain-monitor',
    name: 'BBrain Sleep & Wellness Monitor',
    description: 'Sleep quality, breathing patterns, and room environment monitoring',
    price: 9.99,
    category: 'device',
  },
  {
    id: 'blood-pressure',
    name: 'Blood Pressure Monitor',
    description: 'Automatic readings synced to nurse dashboard',
    price: 4.99,
    category: 'device',
  },
  {
    id: 'glucose-monitor',
    name: 'Glucose Monitor',
    description: 'Continuous glucose monitoring for diabetics',
    price: 12.99,
    category: 'device',
  },
];

export const deviceOptions: DeviceOption[] = [
  {
    id: 'vivago-watch',
    name: 'Vivago Smart Watch',
    description: 'Activity tracking, fall detection, automatic alerts',
    price: 5.99,
    type: 'wearable',
  },
  {
    id: 'sos-pendant',
    name: 'SOS Pendant',
    description: 'Wearable emergency button with GPS tracking',
    price: 3.99,
    type: 'emergency',
  },
  {
    id: 'medication-dispenser',
    name: 'Smart Medication Dispenser',
    description: 'Automated medication reminders and tracking',
    price: 7.99,
    type: 'medication',
  },
  {
    id: 'bbrain-monitor',
    name: 'BBrain Sleep & Wellness Monitor',
    description: 'Sleep quality, breathing patterns, and room environment',
    price: 9.99,
    type: 'monitoring',
  },
  {
    id: 'blood-pressure',
    name: 'Blood Pressure Monitor',
    description: 'Automatic readings synced to nurse dashboard',
    price: 4.99,
    type: 'health',
  },
  {
    id: 'glucose-monitor',
    name: 'Glucose Monitor',
    description: 'Continuous glucose monitoring for diabetics',
    price: 12.99,
    type: 'health',
  },
];
