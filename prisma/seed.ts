import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Demo member: phone 5551234567, zip 07030
  const member = await prisma.member.upsert({
    where: { phone: "5551234567" },
    update: {},
    create: {
      phone: "5551234567",
      zipcode: "07030",
      name: "Demo Member",
      email: "demo@nagga.net",
      membershipYear: 2025,
      handicap: 12.5,
    },
  });

  // Admin member: phone 9998887777, zip 00000
  const admin = await prisma.member.upsert({
    where: { phone: "9998887777" },
    update: { role: "ADMIN" },
    create: {
      phone: "9998887777",
      zipcode: "00000",
      name: "Admin User",
      email: "admin@nagga.net",
      role: "ADMIN",
    },
  });

  // Sample events
  const now = new Date();
  const events = [
    {
      title: "Spring Invitational 2025",
      description: "Annual spring tournament. 18 holes, shotgun start.",
      date: new Date(now.getFullYear(), 3, 15, 8, 0),
      location: "Ridgewood Country Club, Paramus NJ",
      maxParticipants: 72,
    },
    {
      title: "NAGGA Championship",
      description: "Year-end championship. Handicap flights.",
      date: new Date(now.getFullYear(), 8, 20, 7, 30),
      location: "Baltusrol Golf Club, Springfield NJ",
      maxParticipants: 96,
    },
    {
      title: "Monthly Scramble - June",
      description: "4-person scramble. All skill levels welcome.",
      date: new Date(now.getFullYear(), 5, 10, 9, 0),
      location: "Edison Township Golf Course, Edison NJ",
      maxParticipants: 48,
    },
  ];

  for (const e of events) {
    await prisma.event.create({ data: e }).catch(() => { });
  }

  console.log("Seed complete. Demo login: 5551234567 / 07030");
  console.log("Admin login: 9998887777 / 00000");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
