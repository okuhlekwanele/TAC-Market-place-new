export const mockServiceProviders = [
  {
    id: 'mock-001',
    fullName: 'Thabo Mthembu',
    service: 'Plumbing',
    yearsExperience: 8,
    location: 'Khayelitsha, Cape Town',
    coordinates: { lat: -34.0351, lng: 18.6920 },
    contactDetails: {
      phone: '+27 73 456 7890',
      email: 'thabo.plumbing@gmail.com',
      whatsapp: '+27 73 456 7890'
    },
    generatedBio: 'Thabo is a skilled plumber with 8 years of experience serving clients in Khayelitsha and surrounding areas. Known for delivering high-quality work and exceptional customer service, specializing in residential and commercial plumbing solutions.',
    suggestedPrice: 350,
    status: 'Published' as const,
    createdAt: new Date('2024-01-15'),
    isBusinessOwner: false,
    availability: [
      { date: '2024-12-20', startTime: '08:00', endTime: '12:00', available: true },
      { date: '2024-12-20', startTime: '13:00', endTime: '17:00', available: true },
      { date: '2024-12-21', startTime: '08:00', endTime: '12:00', available: true },
      { date: '2024-12-21', startTime: '13:00', endTime: '17:00', available: false },
      { date: '2024-12-22', startTime: '08:00', endTime: '12:00', available: true }
    ]
  },
  {
    id: 'mock-002',
    fullName: 'Nomsa Dlamini',
    service: 'Hair Styling',
    yearsExperience: 12,
    location: 'Gugulethu, Cape Town',
    coordinates: { lat: -34.0167, lng: 18.5833 },
    contactDetails: {
      phone: '+27 82 123 4567',
      email: 'nomsa.hair@outlook.com',
      whatsapp: '+27 82 123 4567'
    },
    generatedBio: 'Nomsa brings 12 years of professional hair styling experience to every client. Based in Gugulethu, she specializes in natural hair care, braids, weaves, and modern styling techniques. Known for her creativity and attention to detail.',
    suggestedPrice: 180,
    status: 'Published' as const,
    createdAt: new Date('2024-02-10'),
    isBusinessOwner: true,
    businessInfo: {
      businessName: 'Nomsa\'s Hair Studio',
      businessType: 'Small Business' as const,
      description: 'A modern hair salon specializing in natural hair care and contemporary styling for the community.',
      services: ['Hair Styling', 'Braids', 'Weaves', 'Hair Treatment'],
      operatingHours: {
        monday: { open: '09:00', close: '17:00', closed: false },
        tuesday: { open: '09:00', close: '17:00', closed: false },
        wednesday: { open: '09:00', close: '17:00', closed: false },
        thursday: { open: '09:00', close: '17:00', closed: false },
        friday: { open: '09:00', close: '18:00', closed: false },
        saturday: { open: '08:00', close: '16:00', closed: false },
        sunday: { open: '10:00', close: '14:00', closed: true }
      }
    },
    availability: [
      { date: '2024-12-20', startTime: '09:00', endTime: '12:00', available: true },
      { date: '2024-12-20', startTime: '14:00', endTime: '17:00', available: true },
      { date: '2024-12-21', startTime: '09:00', endTime: '12:00', available: false },
      { date: '2024-12-21', startTime: '14:00', endTime: '17:00', available: true }
    ]
  },
  {
    id: 'mock-003',
    fullName: 'Ahmed Hassan',
    service: 'Electrical Work',
    yearsExperience: 15,
    location: 'Mitchell\'s Plain, Cape Town',
    coordinates: { lat: -34.0333, lng: 18.6167 },
    contactDetails: {
      phone: '+27 71 987 6543',
      email: 'ahmed.electrical@gmail.com',
      whatsapp: '+27 71 987 6543',
      website: 'https://ahmedelectrical.co.za'
    },
    generatedBio: 'Ahmed is a certified electrician with 15 years of experience in residential and commercial electrical work. Based in Mitchell\'s Plain, he provides reliable electrical services including installations, repairs, and safety inspections.',
    suggestedPrice: 400,
    status: 'Published' as const,
    createdAt: new Date('2024-01-20'),
    isBusinessOwner: true,
    businessInfo: {
      businessName: 'Hassan Electrical Services',
      businessType: 'Small Business' as const,
      description: 'Professional electrical services for homes and businesses with certified, experienced technicians.',
      services: ['Electrical Installations', 'Repairs', 'Safety Inspections', 'Emergency Services'],
      operatingHours: {
        monday: { open: '07:00', close: '17:00', closed: false },
        tuesday: { open: '07:00', close: '17:00', closed: false },
        wednesday: { open: '07:00', close: '17:00', closed: false },
        thursday: { open: '07:00', close: '17:00', closed: false },
        friday: { open: '07:00', close: '17:00', closed: false },
        saturday: { open: '08:00', close: '14:00', closed: false },
        sunday: { open: '09:00', close: '13:00', closed: true }
      }
    },
    availability: [
      { date: '2024-12-20', startTime: '07:00', endTime: '11:00', available: true },
      { date: '2024-12-20', startTime: '12:00', endTime: '16:00', available: true },
      { date: '2024-12-21', startTime: '07:00', endTime: '11:00', available: true }
    ]
  },
  {
    id: 'mock-004',
    fullName: 'Sipho Ndaba',
    service: 'Tutoring',
    yearsExperience: 6,
    location: 'Langa, Cape Town',
    coordinates: { lat: -33.9500, lng: 18.5167 },
    contactDetails: {
      phone: '+27 84 567 8901',
      email: 'sipho.tutor@gmail.com',
      whatsapp: '+27 84 567 8901'
    },
    generatedBio: 'Sipho is a dedicated mathematics and science tutor with 6 years of experience helping students excel in their studies. Based in Langa, he specializes in high school mathematics, physical science, and exam preparation.',
    suggestedPrice: 200,
    status: 'Published' as const,
    createdAt: new Date('2024-03-05'),
    isBusinessOwner: false,
    availability: [
      { date: '2024-12-20', startTime: '15:00', endTime: '18:00', available: true },
      { date: '2024-12-21', startTime: '15:00', endTime: '18:00', available: true },
      { date: '2024-12-22', startTime: '09:00', endTime: '12:00', available: true }
    ]
  },
  {
    id: 'mock-005',
    fullName: 'Fatima Abrahams',
    service: 'Catering',
    yearsExperience: 10,
    location: 'Athlone, Cape Town',
    coordinates: { lat: -33.9667, lng: 18.5167 },
    contactDetails: {
      phone: '+27 76 234 5678',
      email: 'fatima.catering@gmail.com',
      whatsapp: '+27 76 234 5678'
    },
    generatedBio: 'Fatima specializes in traditional Cape Malay cuisine and modern catering services with 10 years of experience. Based in Athlone, she provides catering for weddings, corporate events, and special occasions with authentic flavors.',
    suggestedPrice: 280,
    status: 'Published' as const,
    createdAt: new Date('2024-02-28'),
    isBusinessOwner: true,
    businessInfo: {
      businessName: 'Fatima\'s Cape Malay Kitchen',
      businessType: 'Small Business' as const,
      description: 'Authentic Cape Malay cuisine and catering services for all occasions, bringing traditional flavors to your events.',
      services: ['Wedding Catering', 'Corporate Events', 'Traditional Cuisine', 'Special Occasions'],
      operatingHours: {
        monday: { open: '08:00', close: '18:00', closed: false },
        tuesday: { open: '08:00', close: '18:00', closed: false },
        wednesday: { open: '08:00', close: '18:00', closed: false },
        thursday: { open: '08:00', close: '18:00', closed: false },
        friday: { open: '08:00', close: '18:00', closed: false },
        saturday: { open: '07:00', close: '20:00', closed: false },
        sunday: { open: '08:00', close: '16:00', closed: false }
      }
    },
    availability: [
      { date: '2024-12-21', startTime: '10:00', endTime: '14:00', available: true },
      { date: '2024-12-22', startTime: '08:00', endTime: '12:00', available: true }
    ]
  },
  {
    id: 'mock-006',
    fullName: 'Mandla Zulu',
    service: 'Gardening',
    yearsExperience: 7,
    location: 'Nyanga, Cape Town',
    coordinates: { lat: -34.0167, lng: 18.5833 },
    contactDetails: {
      phone: '+27 78 345 6789',
      email: 'mandla.gardens@gmail.com',
      whatsapp: '+27 78 345 6789'
    },
    generatedBio: 'Mandla is a passionate gardener with 7 years of experience in landscape design and garden maintenance. Based in Nyanga, he specializes in indigenous plants, vegetable gardens, and sustainable gardening practices.',
    suggestedPrice: 160,
    status: 'Published' as const,
    createdAt: new Date('2024-01-30'),
    isBusinessOwner: false,
    availability: [
      { date: '2024-12-20', startTime: '06:00', endTime: '10:00', available: true },
      { date: '2024-12-20', startTime: '14:00', endTime: '18:00', available: true },
      { date: '2024-12-21', startTime: '06:00', endTime: '10:00', available: true }
    ]
  },
  {
    id: 'mock-007',
    fullName: 'Priya Patel',
    service: 'Photography',
    yearsExperience: 9,
    location: 'Wynberg, Cape Town',
    coordinates: { lat: -34.0167, lng: 18.4667 },
    contactDetails: {
      phone: '+27 83 456 7890',
      email: 'priya.photography@gmail.com',
      whatsapp: '+27 83 456 7890',
      website: 'https://priyaphotography.co.za'
    },
    generatedBio: 'Priya is a professional photographer with 9 years of experience capturing life\'s precious moments. Based in Wynberg, she specializes in weddings, portraits, and event photography with a creative and artistic approach.',
    suggestedPrice: 450,
    status: 'Published' as const,
    createdAt: new Date('2024-02-15'),
    isBusinessOwner: true,
    businessInfo: {
      businessName: 'Priya Photography Studio',
      businessType: 'Small Business' as const,
      description: 'Professional photography services specializing in weddings, portraits, and events with artistic flair.',
      services: ['Wedding Photography', 'Portrait Sessions', 'Event Photography', 'Family Photos'],
      operatingHours: {
        monday: { open: '09:00', close: '17:00', closed: false },
        tuesday: { open: '09:00', close: '17:00', closed: false },
        wednesday: { open: '09:00', close: '17:00', closed: false },
        thursday: { open: '09:00', close: '17:00', closed: false },
        friday: { open: '09:00', close: '17:00', closed: false },
        saturday: { open: '08:00', close: '20:00', closed: false },
        sunday: { open: '10:00', close: '18:00', closed: false }
      }
    },
    availability: [
      { date: '2024-12-21', startTime: '09:00', endTime: '13:00', available: true },
      { date: '2024-12-22', startTime: '14:00', endTime: '18:00', available: true }
    ]
  },
  {
    id: 'mock-008',
    fullName: 'Lungile Mthembu',
    service: 'Cleaning',
    yearsExperience: 5,
    location: 'Philippi, Cape Town',
    coordinates: { lat: -34.0333, lng: 18.6000 },
    contactDetails: {
      phone: '+27 72 567 8901',
      email: 'lungile.cleaning@gmail.com',
      whatsapp: '+27 72 567 8901'
    },
    generatedBio: 'Lungile provides professional cleaning services with 5 years of experience in residential and office cleaning. Based in Philippi, she is known for her attention to detail and reliable service.',
    suggestedPrice: 140,
    status: 'Published' as const,
    createdAt: new Date('2024-03-10'),
    isBusinessOwner: false,
    availability: [
      { date: '2024-12-20', startTime: '08:00', endTime: '12:00', available: true },
      { date: '2024-12-20', startTime: '13:00', endTime: '17:00', available: true },
      { date: '2024-12-21', startTime: '08:00', endTime: '12:00', available: true }
    ]
  }
];

export const mockLocalProfiles = [
  {
    id: 'local-001',
    fullName: 'Zanele Khumalo',
    skill: 'Sewing',
    yearsExperience: 8,
    location: 'Khayelitsha, Cape Town',
    contact: '+27 74 123 4567',
    availability: 'Part-time',
    status: 'Ready',
    bioAI: 'Zanele is a skilled seamstress with 8 years of experience creating beautiful garments and alterations. Known for her precision and creativity in traditional and modern designs.',
    suggestedPriceZAR: 120,
    createdAt: new Date('2024-02-20')
  },
  {
    id: 'local-002',
    fullName: 'Bongani Sithole',
    skill: 'Mechanic',
    yearsExperience: 12,
    location: 'Gugulethu, Cape Town',
    contact: '+27 81 234 5678',
    availability: 'Full-time',
    status: 'Published',
    bioAI: 'Bongani is an experienced mechanic with 12 years of expertise in automotive repairs and maintenance. Specializes in both petrol and diesel engines with honest, reliable service.',
    suggestedPriceZAR: 300,
    createdAt: new Date('2024-01-25')
  },
  {
    id: 'local-003',
    fullName: 'Amina Davids',
    skill: 'Makeup',
    yearsExperience: 4,
    location: 'Mitchell\'s Plain, Cape Town',
    contact: '+27 79 345 6789',
    availability: 'Weekends only',
    status: 'Ready',
    bioAI: 'Amina is a talented makeup artist with 4 years of experience specializing in bridal makeup, special events, and photoshoots. Known for enhancing natural beauty with professional techniques.',
    suggestedPriceZAR: 180,
    createdAt: new Date('2024-03-01')
  },
  {
    id: 'local-004',
    fullName: 'Themba Nkomo',
    skill: 'Electrical',
    yearsExperience: 10,
    location: 'Langa, Cape Town',
    contact: '+27 76 456 7890',
    availability: 'Full-time',
    status: 'Published',
    bioAI: 'Themba is a certified electrician with 10 years of experience in residential electrical work. Provides safe, reliable electrical installations and repairs with excellent customer service.',
    suggestedPriceZAR: 350,
    createdAt: new Date('2024-02-05')
  },
  {
    id: 'local-005',
    fullName: 'Nadia Hendricks',
    skill: 'Crochet',
    yearsExperience: 6,
    location: 'Athlone, Cape Town',
    contact: '+27 82 567 8901',
    availability: 'Part-time',
    status: 'Ready',
    bioAI: 'Nadia creates beautiful handmade crochet items with 6 years of experience. Specializes in baby clothes, blankets, and custom designs with attention to detail and quality.',
    suggestedPriceZAR: 80,
    createdAt: new Date('2024-02-12')
  }
];
{
  id: 'mock-009',
  fullName: 'Lerato Ndlovu',
  service: 'Tutoring',
  yearsExperience: 2,
  location: 'Observatory, Cape Town',
  coordinates: { lat: -33.9286, lng: 18.4478 },
  contactDetails: {
    phone: '+27 61 234 7890',
    email: 'lerato.ndlovu@studentmail.co.za',
    whatsapp: '+27 61 234 7890'
  },
  generatedBio: 'Lerato is a UCT student offering tutoring services in mathematics and life sciences for high school learners. Passionate about education and academic success.',
  suggestedPrice: 100,
  status: 'Published' as const,
  createdAt: new Date('2024-03-20'),
  isBusinessOwner: false,
  availability: [
    { date: '2024-12-22', startTime: '14:00', endTime: '17:00', available: true },
    { date: '2024-12-23', startTime: '10:00', endTime: '13:00', available: true }
  ]
},
{
  id: 'mock-010',
  fullName: 'Jason Petersen',
  service: 'Carpentry',
  yearsExperience: 11,
  location: 'Salt River, Cape Town',
  coordinates: { lat: -33.9289, lng: 18.4487 },
  contactDetails: {
    phone: '+27 72 456 7891',
    email: 'jason.carpentry@gmail.com',
    whatsapp: '+27 72 456 7891'
  },
  generatedBio: 'Jason is a seasoned carpenter based in Salt River with over a decade of experience in custom furniture, woodwork repairs, and home fittings.',
  suggestedPrice: 380,
  status: 'Published' as const,
  createdAt: new Date('2024-04-10'),
  isBusinessOwner: true,
  businessInfo: {
    businessName: 'Salt River Woodworks',
    businessType: 'Small Business' as const,
    description: 'Quality custom carpentry for homes and small businesses.',
    services: ['Custom Furniture', 'Cabinet Making', 'Repairs'],
    operatingHours: {
      monday: { open: '08:00', close: '17:00', closed: false },
      tuesday: { open: '08:00', close: '17:00', closed: false },
      wednesday: { open: '08:00', close: '17:00', closed: false },
      thursday: { open: '08:00', close: '17:00', closed: false },
      friday: { open: '08:00', close: '17:00', closed: false },
      saturday: { open: '09:00', close: '13:00', closed: false },
      sunday: { open: '00:00', close: '00:00', closed: true }
    }
  },
  availability: [
    { date: '2024-12-21', startTime: '08:00', endTime: '12:00', available: true },
    { date: '2024-12-22', startTime: '13:00', endTime: '17:00', available: true }
  ]
},
{
  id: 'mock-011',
  fullName: 'Noluthando Jacobs',
  service: 'Nail Technician',
  yearsExperience: 6,
  location: 'Delft, Cape Town',
  coordinates: { lat: -33.9646, lng: 18.6297 },
  contactDetails: {
    phone: '+27 74 321 6789',
    email: 'nolu.nails@gmail.com',
    whatsapp: '+27 74 321 6789'
  },
  generatedBio: 'Noluthando offers expert nail services including gel, acrylic, and nail art from her home studio in Delft. She’s known for creative designs and affordable beauty services.',
  suggestedPrice: 150,
  status: 'Published' as const,
  createdAt: new Date('2024-01-18'),
  isBusinessOwner: true,
  businessInfo: {
    businessName: 'Nolu Nails Studio',
    businessType: 'Home Business' as const,
    description: 'Affordable nail art and care for every occasion.',
    services: ['Gel Nails', 'Acrylics', 'Nail Art'],
    operatingHours: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '19:00', closed: false },
      saturday: { open: '08:00', close: '16:00', closed: false },
      sunday: { open: '00:00', close: '00:00', closed: true }
    }
  },
  availability: [
    { date: '2024-12-20', startTime: '09:00', endTime: '12:00', available: true },
    { date: '2024-12-21', startTime: '13:00', endTime: '17:00', available: true }
  ]
},
{
  id: 'mock-012',
  fullName: 'Zubair Khan',
  service: 'Tech Support',
  yearsExperience: 5,
  location: 'Parklands, Cape Town',
  coordinates: { lat: -33.8186, lng: 18.4892 },
  contactDetails: {
    phone: '+27 83 210 9876',
    email: 'zubair.tech@gmail.com',
    whatsapp: '+27 83 210 9876'
  },
  generatedBio: 'Zubair is an IT support specialist based in Parklands, offering PC and mobile repairs, home network setup, and software troubleshooting with 5 years of experience.',
  suggestedPrice: 250,
  status: 'Published' as const,
  createdAt: new Date('2024-02-17'),
  isBusinessOwner: false,
  availability: [
    { date: '2024-12-22', startTime: '10:00', endTime: '14:00', available: true },
    { date: '2024-12-23', startTime: '15:00', endTime: '18:00', available: true }
  ]
},
{
  id: 'mock-013',
  fullName: 'Chantal Brown',
  service: 'Event Planning',
  yearsExperience: 9,
  location: 'Cape Town CBD',
  coordinates: { lat: -33.9258, lng: 18.4232 },
  contactDetails: {
    phone: '+27 79 555 3210',
    email: 'chantal.events@gmail.com',
    whatsapp: '+27 79 555 3210'
  },
  generatedBio: 'Chantal is an experienced event planner based in Cape Town, specializing in weddings, parties, and corporate functions. She’s known for her eye for detail and smooth execution.',
  suggestedPrice: 600,
  status: 'Published' as const,
  createdAt: new Date('2024-01-05'),
  isBusinessOwner: true,
  businessInfo: {
    businessName: 'Brown Events Co.',
    businessType: 'Small Business' as const,
    description: 'Creating memorable events with precision and flair.',
    services: ['Weddings', 'Corporate Events', 'Parties'],
    operatingHours: {
      monday: { open: '09:00', close: '17:00', closed: false },
      tuesday: { open: '09:00', close: '17:00', closed: false },
      wednesday: { open: '09:00', close: '17:00', closed: false },
      thursday: { open: '09:00', close: '17:00', closed: false },
      friday: { open: '09:00', close: '17:00', closed: false },
      saturday: { open: '10:00', close: '15:00', closed: false },
      sunday: { open: '00:00', close: '00:00', closed: true }
    }
  },
  availability: [
    { date: '2024-12-21', startTime: '11:00', endTime: '15:00', available: true },
    { date: '2024-12-22', startTime: '09:00', endTime: '12:00', available: true }
  ]
}
