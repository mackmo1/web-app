/* Seed a sample residential project into the database using Prisma. */
const { PrismaClient } = require('../lib/generated/prisma');

async function main() {
  const prisma = new PrismaClient({ log: ['error'] });

  const data = {
    name: 'Sunrise Residency',
    address: 'Sector 62, Gurugram, Haryana',
    city: 'Gurugram',
    // Use an embeddable Google Maps URL so iframes render correctly
    google_location: 'https://www.google.com/maps?q=Sector+62+Gurugram+Haryana&output=embed',
    overview_area: '8 Acres',
    near_by: ['NH-48', 'Cyber City', 'Huda City Centre Metro', 'DLF Phase 3'].join(','),
    overview_floors: '24',
    overview_rem1: 'Towers: 6',
    overview_rem2: 'Units: 720',
    rooms: '1BHK,2BHK,3BHK,4BHK',
    area_sqft: '650-1950',
    price_range: '₹45L - ₹1.9Cr',
    usp: [
      'Clubhouse with gym & indoor games',
      'Infinity-edge swimming pool',
      'Gated community with 3-tier security',
      'Dedicated kids play area & jogging track',
      'Power backup & ample parking',
    ].join(','),
    external_id: 'sunrise-residency',
  };

  // Upsert by external_id if present
  const existing = await prisma.projects.findFirst({ where: { external_id: data.external_id } });
  let project;
  if (existing) {
    project = await prisma.projects.update({ where: { id: existing.id }, data });
  } else {
    project = await prisma.projects.create({ data });
  }

  console.log('Seeded project:', { id: project.id.toString(), name: project.name });
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  process.exitCode = 1;
});

