const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const CATEGORIES = [
  {
    name: 'Mobile Phones & Tablets',
    description: 'Smartphones, feature phones, and tablets with touchscreens and batteries.',
    examples: ['Smartphones', 'Feature phones', 'Tablets', 'iPads', 'E-readers'],
    baseRate: 120,
    unit: 'PER_ITEM',
    hazardous: true,
    co2PerKg: 15.0,
  },
  {
    name: 'Computers & Laptops',
    description: 'Laptops, desktop CPUs, motherboards, hard drives, and system chassis.',
    examples: ['Laptops', 'Desktops', 'Motherboards', 'Hard drives', 'RAM', 'Power supplies'],
    baseRate: 300,
    unit: 'PER_ITEM',
    hazardous: false,
    co2PerKg: 24.5,
  },
  {
    name: 'Computer Accessories',
    description: 'Keyboards, mice, routers, webcams, and peripheral components.',
    examples: ['Keyboards', 'Mice', 'Webcams', 'Speakers', 'Routers', 'Docking stations'],
    baseRate: 30,
    unit: 'PER_ITEM',
    hazardous: false,
    co2PerKg: 3.2,
  },
  {
    name: 'Batteries & Power Banks',
    description: 'Lithium-ion cells, portable power banks, and UPS backup batteries.',
    examples: ['Li-ion batteries', 'Power banks', 'UPS batteries', 'Laptop batteries'],
    baseRate: 20,
    unit: 'PER_ITEM',
    hazardous: true,
    co2PerKg: 8.5,
  },
  {
    name: 'Chargers & Cables',
    description: 'Wall adapters, USB charging cables, HDMI, and power extension leads.',
    examples: ['Phone chargers', 'Laptop chargers', 'USB cables', 'Adapters', 'Extension cords'],
    baseRate: 10,
    unit: 'PER_ITEM',
    hazardous: false,
    co2PerKg: 1.8,
  },
  {
    name: 'Audio & Wearables',
    description: 'Headphones, earphones, Bluetooth audio speakers, and smartwatches.',
    examples: ['Earphones', 'Headphones', 'Bluetooth speakers', 'Smartwatches', 'Fitness bands'],
    baseRate: 50,
    unit: 'PER_ITEM',
    hazardous: false,
    co2PerKg: 4.0,
  },
  {
    name: 'Small Home Appliances',
    description: 'Kitchen and grooming electronics including mixers, kettles, and irons.',
    examples: ['Mixers', 'Irons', 'Hair dryers', 'Electric kettles', 'Table fans', 'Toasters'],
    baseRate: 40,
    unit: 'PER_ITEM',
    hazardous: false,
    co2PerKg: 5.5,
  },
  {
    name: 'Large Appliances',
    description: 'Heavy domestic white goods (refrigerators, ACs, washing machines, TVs).',
    examples: ['Refrigerators', 'Washing machines', 'ACs', 'TVs', 'Microwave ovens'],
    baseRate: 250,
    unit: 'PER_ITEM',
    hazardous: true,
    co2PerKg: 45.0,
  },
  {
    name: 'Lighting & Bulbs',
    description: 'CFL bulbs, LED fixtures, and fluorescent discharge lamps.',
    examples: ['CFL bulbs', 'LED bulbs', 'Tube lights', 'Decorative lamps'],
    baseRate: 15,
    unit: 'PER_ITEM',
    hazardous: true,
    co2PerKg: 1.2,
  },
  {
    name: 'Printers & Peripherals',
    description: 'Inkjet and laser printers, scanners, and multi-function copiers.',
    examples: ['Printers', 'Scanners', 'Toner cartridges', 'Fax machines'],
    baseRate: 70,
    unit: 'PER_ITEM',
    hazardous: false,
    co2PerKg: 8.0,
  },
  {
    name: 'Circuit Boards & Components',
    description: 'High-density PCBs, server backplanes, microchips, and sensor modules.',
    examples: ['PCBs', 'Chips', 'Motherboards', 'Sensors', 'Relays'],
    baseRate: 80,
    unit: 'PER_KG',
    hazardous: false,
    co2PerKg: 35.0,
  },
  {
    name: 'Gaming & Entertainment',
    description: 'Video game consoles, wireless gamepads, DVD/Blu-ray players, and remotes.',
    examples: ['Consoles', 'Controllers', 'Remotes', 'DVD players', 'Set-top boxes'],
    baseRate: 60,
    unit: 'PER_ITEM',
    hazardous: false,
    co2PerKg: 6.0,
  },
];

async function main() {
  console.log('🌱 Starting VoltCycle database seed...');

  // 1. Seed Categories
  for (const cat of CATEGORIES) {
    await prisma.ewasteCategory.upsert({
      where: { name: cat.name },
      update: cat,
      create: cat,
    });
  }
  console.log(`✅ Seeded ${CATEGORIES.length} e-waste categories`);

  // 2. Seed Default Accounts
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const collectorPassword = await bcrypt.hash('Collector123!', 10);
  const userPassword = await bcrypt.hash('Citizen123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@ewaste.org' },
    update: {},
    create: {
      name: 'System Administrator',
      email: 'admin@ewaste.org',
      phone: '+91 99999 00001',
      passwordHash: adminPassword,
      role: 'ADMIN',
      referralCode: 'VOLT-ADMIN',
    },
  });

  const collector = await prisma.user.upsert({
    where: { email: 'collector@ewaste.org' },
    update: {},
    create: {
      name: 'Green Field Collector',
      email: 'collector@ewaste.org',
      phone: '+91 99999 00002',
      passwordHash: collectorPassword,
      role: 'COLLECTOR',
      referralCode: 'VOLT-COLLECT',
    },
  });

  const citizen = await prisma.user.upsert({
    where: { email: 'citizen@ewaste.org' },
    update: {},
    create: {
      name: 'Priya Sharma',
      email: 'citizen@ewaste.org',
      phone: '+91 98765 43210',
      passwordHash: userPassword,
      role: 'USER',
      referralCode: 'VOLT-PRIYA',
    },
  });
  console.log('✅ Seeded Admin, Collector, and Citizen demo users');

  // 3. Seed Offers
  const sampleOffers = [
    {
      partner: 'Amazon EcoPay',
      title: '₹500 Shopping Voucher',
      description: 'Applicable across electronics, books, and eco-certified home products.',
      creditCost: 500,
      stock: 45,
    },
    {
      partner: 'Croma Retail',
      title: '15% Off Refurbished Tech',
      description: 'Exclusive discount code on green-certified laptops, phones, and tablets.',
      creditCost: 350,
      stock: 25,
    },
    {
      partner: 'Starbucks Green Cup',
      title: 'Complimentary Beverage Voucher',
      description: 'Redeem any handcrafted tall beverage at participating outlets.',
      creditCost: 180,
      stock: 100,
    },
    {
      partner: 'Plant a Tree Foundation',
      title: 'Adopt a Native Urban Tree',
      description: 'Convert your recycling credits into a geotagged tree in urban greenbelts.',
      creditCost: 100,
      stock: 500,
    },
  ];

  for (const offer of sampleOffers) {
    const existing = await prisma.offer.findFirst({
      where: { title: offer.title },
    });
    if (!existing) {
      await prisma.offer.create({ data: offer });
    }
  }
  console.log('✅ Seeded partner reward offers');

  // 4. Seed initial welcome bonus for sample citizen
  const existingTx = await prisma.walletTransaction.findFirst({
    where: { userId: citizen.id },
  });
  if (!existingTx) {
    await prisma.walletTransaction.create({
      data: {
        userId: citizen.id,
        type: 'BONUS',
        amount: 500,
        note: 'Platform Pioneer Welcome Bonus',
      },
    });
    console.log('✅ Seeded citizen wallet bonus (500 credits)');
  }

  // 5. Seed Collection Centers
  const centers = [
    {
      name: 'Downtown GreenHub Center',
      address: 'Plot 42, Eco Park Road, Tech Zone',
      lat: 12.9716,
      lng: 77.5946,
      accepted: ['Mobile Phones', 'Laptops', 'Batteries', 'Small Appliances'],
    },
    {
      name: 'North Suburban Refinement Yard',
      address: 'Industrial Sector 9, Gateway Logistics Park',
      lat: 13.0358,
      lng: 77.597,
      accepted: ['Large Appliances', 'PCBs', 'Batteries', 'Bulk Scrap'],
    },
  ];

  for (const center of centers) {
    const existing = await prisma.collectionCenter.findFirst({
      where: { name: center.name },
    });
    if (!existing) {
      await prisma.collectionCenter.create({ data: center });
    }
  }
  console.log('✅ Seeded collection centers');

  console.log('🌿 VoltCycle database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
