// Import images first to avoid circular dependency issues
const maizeImage1 = require('../assets/images/project_images/maize_image1.jpg');
const maizeImage2 = require('../assets/images/project_images/maize_image2.webp');
const maizeImage3 = require('../assets/images/project_images/maize_image3.webp');
const tomatoImage1 = require('../assets/images/project_images/tomato1.jpg');
const tomatoImage2 = require('../assets/images/project_images/tomato2.jpg');
const cassavaImage1 = require('../assets/images/project_images/cassava1.jpg');
const cassavaImage2 = require('../assets/images/project_images/cassava2.jpg');
const poultryImage1 = require('../assets/images/project_images/poultry1.webp');
const poultryImage2 = require('../assets/images/project_images/poultry2.jpg');
const fishImage1 = require('../assets/images/project_images/fish1.jpeg');
const fishImage2 = require('../assets/images/project_images/fish2.jpg');
const beefarmImage1 = require('../assets/images/project_images/beefarm1.webp');
const beefarmImage2 = require('../assets/images/project_images/beefarm2.jpg');

export const mockFarmProjects = [
   {
      id: 1,
      title: 'Maize Cultivation Project',
      description: 'Large scale maize cultivation in Northern region',
      type: 'Crop',
      status: 'Active',
      fundingGoal: 5000000,
      currentFunding: 3250000,
      progress: 65,
      startDate: '2024-01-15',
      duration: '6 months',
   },
   {
      id: 2,
      title: 'Poultry Farm Expansion',
      description: 'Modern poultry farm with 5000 birds capacity',
      type: 'Livestock',
      status: 'Under Review',
      fundingGoal: 7500000,
      currentFunding: 2250000,
      progress: 30,
      startDate: '2024-02-01',
      duration: '12 months',
   },
   {
      id: 3,
      title: 'Cassava Processing Plant',
      description:
         'Facility for turning cassava into flour and starch products',
      type: 'Agri-processing',
      status: 'Completed',
      fundingGoal: 8500000,
      currentFunding: 8500000,
      progress: 100,
      startDate: '2023-06-01',
      duration: '10 months',
   },
   {
      id: 4,
      title: 'Rice Irrigation Project',
      description:
         'Installation of efficient irrigation systems in paddy fields',
      type: 'Crop',
      status: 'Active',
      fundingGoal: 6200000,
      currentFunding: 4100000,
      progress: 66,
      startDate: '2024-03-10',
      duration: '7 months',
   },
   {
      id: 5,
      title: 'Goat Rearing Program',
      description: 'Sustainable goat farming for meat and dairy products',
      type: 'Livestock',
      status: 'Pending Approval',
      fundingGoal: 3000000,
      currentFunding: 0,
      progress: 0,
      startDate: '2024-05-01',
      duration: '8 months',
   },
   {
      id: 6,
      title: 'Greenhouse Vegetable Project',
      description:
         'Controlled environment agriculture for year-round vegetables',
      type: 'Crop',
      status: 'Active',
      fundingGoal: 4000000,
      currentFunding: 2800000,
      progress: 70,
      startDate: '2024-02-20',
      duration: '9 months',
   },
   {
      id: 7,
      title: 'Agro-Waste Recycling Unit',
      description: 'Converting farm waste into organic fertilizers',
      type: 'Agri-processing',
      status: 'Under Review',
      fundingGoal: 5500000,
      currentFunding: 1250000,
      progress: 23,
      startDate: '2024-04-05',
      duration: '6 months',
   },
];

export const mockTransactions = [
   {
      id: 'TR001',
      type: 'Disbursement',
      amount: 1500000,
      project: 'Maize Cultivation Project',
      date: '2024-03-15',
      status: 'Completed',
   },
   {
      id: 'TR002',
      type: 'Profit Share',
      amount: 750000,
      project: 'Cassava Processing Plant',
      date: '2024-03-10',
      status: 'Completed',
   },
   {
      id: 'TR003',
      type: 'Investment',
      amount: 2250000,
      project: 'Poultry Farm Expansion',
      date: '2024-02-28',
      status: 'Pending',
   },
   {
      id: 'TR004',
      type: 'Investment',
      amount: 1000000,
      project: 'Rice Irrigation Project',
      date: '2024-03-22',
      status: 'Completed',
   },
   {
      id: 'TR005',
      type: 'Disbursement',
      amount: 500000,
      project: 'Goat Rearing Program',
      date: '2024-04-01',
      status: 'Pending',
   },
   {
      id: 'TR006',
      type: 'Profit Share',
      amount: 920000,
      project: 'Cassava Processing Plant',
      date: '2024-03-18',
      status: 'Completed',
   },
   {
      id: 'TR007',
      type: 'Investment',
      amount: 850000,
      project: 'Greenhouse Vegetable Project',
      date: '2024-02-10',
      status: 'Completed',
   },
   {
      id: 'TR008',
      type: 'Disbursement',
      amount: 1300000,
      project: 'Maize Cultivation Project',
      date: '2024-03-25',
      status: 'Completed',
   },
   {
      id: 'TR009',
      type: 'Investment',
      amount: 300000,
      project: 'Agro-Waste Recycling Unit',
      date: '2024-04-08',
      status: 'Pending',
   },
   {
      id: 'TR010',
      type: 'Profit Share',
      amount: 400000,
      project: 'Maize Cultivation Project',
      date: '2024-03-30',
      status: 'Completed',
   },
   {
      id: 'TR011',
      type: 'Investment',
      amount: 1200000,
      project: 'Rice Irrigation Project',
      date: '2024-03-29',
      status: 'Completed',
   },
   {
      id: 'TR012',
      type: 'Disbursement',
      amount: 950000,
      project: 'Poultry Farm Expansion',
      date: '2024-04-03',
      status: 'Pending',
   },
   {
      id: 'TR013',
      type: 'Profit Share',
      amount: 500000,
      project: 'Cassava Processing Plant',
      date: '2024-03-05',
      status: 'Completed',
   },
   {
      id: 'TR014',
      type: 'Investment',
      amount: 675000,
      project: 'Greenhouse Vegetable Project',
      date: '2024-04-06',
      status: 'Completed',
   },
   {
      id: 'TR015',
      type: 'Disbursement',
      amount: 400000,
      project: 'Goat Rearing Program',
      date: '2024-04-10',
      status: 'Pending',
   },
   {
      id: 'TR016',
      type: 'Investment',
      amount: 950000,
      project: 'Agro-Waste Recycling Unit',
      date: '2024-04-11',
      status: 'Pending',
   },
   {
      id: 'TR017',
      type: 'Profit Share',
      amount: 360000,
      project: 'Maize Cultivation Project',
      date: '2024-03-28',
      status: 'Completed',
   },
   {
      id: 'TR018',
      type: 'Disbursement',
      amount: 880000,
      project: 'Rice Irrigation Project',
      date: '2024-04-01',
      status: 'Completed',
   },
];

export const mockFundingData = [
   {
      id: 'crops',
      label: 'Crop Projects',
      value: 45,
      color: 'hsl(125, 70%, 50%)',
   },
   {
      id: 'livestock',
      label: 'Livestock Projects',
      value: 30,
      color: 'hsl(162, 70%, 50%)',
   },
   {
      id: 'processing',
      label: 'Agri-processing',
      value: 25,
      color: 'hsl(291, 70%, 50%)',
   },
];

export const mockProjectProgress = [
   {
      id: 'funding',
      data: [
         { x: 'Jan', y: 20 },
         { x: 'Feb', y: 35 },
         { x: 'Mar', y: 65 },
         { x: 'Apr', y: 85 },
         { x: 'May', y: 95 },
         { x: 'Jun', y: 100 },
      ],
   },
   {
      id: 'implementation',
      data: [
         { x: 'Jan', y: 0 },
         { x: 'Feb', y: 15 },
         { x: 'Mar', y: 45 },
         { x: 'Apr', y: 60 },
         { x: 'May', y: 80 },
         { x: 'Jun', y: 90 },
      ],
   },
];

export const mockRegionalData = [
   { region: 'North', projects: 12 },
   { region: 'South', projects: 8 },
   { region: 'East', projects: 15 },
   { region: 'West', projects: 10 },
   { region: 'Central', projects: 18 },
];

export const mockFarmerGeoData = [
   { id: 'NGA', value: 75 }, // Nigeria
   { id: 'CMR', value: 60 }, // Cameroon
   { id: 'KEN', value: 50 }, // Kenya
   { id: 'UGA', value: 35 }, // Uganda
   { id: 'GHA', value: 45 }, // Ghana
   { id: 'ZAF', value: 30 }, // South Africa
   { id: 'ETH', value: 55 }, // Ethiopia
   { id: 'TZA', value: 40 }, // Tanzania
   { id: 'SEN', value: 25 }, // Senegal
   { id: 'ZMB', value: 20 }, // Zambia
];

export const projects = [
   {
      title: 'Maize Farm Project',
      status: 'Active',
      progress: 65,
      category: 'Crop',
      location: 'Northern Region',
      landSize: 50,
      budgetTotal: 5000000,
      fundingGoal: 3000000,
      duration_in_months: 12,
      photos: [maizeImage1, maizeImage2, maizeImage3],
      timestamp: '2023-10-01',
      documentation:
         'The project aims to cultivate 50 hectares of high-yield hybrid maize using mechanized farming techniques. This will increase food production and contribute to regional food security while creating seasonal jobs for local workers. The harvested maize will be distributed to processing partners for flour and animal feed.',
   },
   {
      title: 'Tomato Greenhouse Project',
      status: 'Under Review',
      progress: 40,
      category: 'Crop',
      location: 'Western Highlands',
      landSize: 10,
      budgetTotal: 2000000,
      fundingGoal: 1500000,
      duration_in_months: 6,
      photos: [tomatoImage1, tomatoImage2],
      timestamp: '2023-11-12',
      documentation:
         'This project focuses on controlled greenhouse cultivation of tomatoes to ensure year-round supply and reduce seasonal shortages. The facility will use drip irrigation, automated ventilation, and pest-resistant varieties. Expected yield is 5 tons per month, with partnerships already secured with local grocery chains.',
   },
   {
      title: 'Cassava Processing Plant',
      status: 'Completed',
      progress: 100,
      category: 'Agri-processing',
      location: 'Central Region',
      landSize: 5,
      budgetTotal: 7000000,
      fundingGoal: 7000000,
      duration_in_months: 10,
      photos: [cassavaImage1, cassavaImage2],
      timestamp: '2023-05-10',
      documentation:
         'The facility transforms raw cassava roots into high-quality flour, chips, and starch. Built to reduce post-harvest losses and improve farmer income, the plant processes 20 tons daily and serves over 800 outgrowers. All environmental standards were met, and community employment rose by 30%.',
   },
   {
      title: 'Poultry Expansion Initiative',
      status: 'Active',
      progress: 75,
      category: 'Livestock',
      location: 'Eastern Region',
      landSize: 2,
      budgetTotal: 4000000,
      fundingGoal: 3500000,
      duration_in_months: 8,
      photos: [poultryImage1, poultryImage2],
      timestamp: '2024-01-05',
      documentation:
         'This expansion will increase the poultry farm’s capacity from 2,000 to 6,000 birds, with improved ventilation, automatic feeders, and biosecurity systems. Eggs and broilers are sold to institutional buyers. Local feed suppliers and veterinary partners support the project ecosystem.',
   },
   {
      title: 'Fish Farm Project',
      status: 'Pending',
      progress: 20,
      category: 'Aquaculture',
      location: 'Southern Region',
      landSize: 3,
      budgetTotal: 2500000,
      fundingGoal: 2000000,
      duration_in_months: 9,
      photos: [fishImage1, fishImage2],
      timestamp: '2024-03-01',
      documentation:
         'This aquaculture initiative includes construction of six earthen ponds and installation of aeration systems for catfish and tilapia farming. The project introduces sustainable aquaculture practices to meet rising protein demand in urban markets. It includes training for 20 youth apprentices.',
   },
   {
      title: 'Bee Farming for Honey Production',
      status: 'Active',
      progress: 55,
      category: 'Livestock',
      location: 'Northwest Region',
      landSize: 1,
      budgetTotal: 1500000,
      fundingGoal: 1200000,
      duration_in_months: 6,
      photos: [beefarmImage1, beefarmImage2],
      timestamp: '2024-02-15',
      documentation:
         'This project involves the setup of 80 modern hives and processing equipment to produce organic honey and beeswax. Benefiting both agriculture (via pollination) and health sectors, it also trains local women on packaging and cooperative management for export readiness.',
   },
];
