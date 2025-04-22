// 📁 prisma/seed.ts

// import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
// import process from "process";
import { PrismaClient } from "../generated/prisma";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  // 1. Create Permissions
  const allPermissions = [
    { name: "views", views: true },
    { name: "create", create: true },
    { name: "update", update: true },
    { name: "delete", delete: true },
  ];
  const permissions = await Promise.all(
    allPermissions.map((p) => prisma.permission.create({ data: p }))
  );

  console.log("✅ Permissions complete");

  // 2. Create Roles
  const superAdminRole = await prisma.role.create({
    data: {
      name: "Super Admin",
      permissions: {
        create: permissions.map((p) => ({
          permission: { connect: { id: p.id } },
        })),
      },
    },
  });
  console.log("✅ Super Admin complete");


  const adminRole = await prisma.role.create({
    data: {
      name: "Admin",
      permissions: {
        create: permissions
          .filter((p) => p.name !== "delete")
          .map((p) => ({
            permission: { connect: { id: p.id } },
          })),
      },
    },
  });
  console.log("✅ Admin complete");


  const staffRole = await prisma.role.create({
    data: {
      name: "Staff",
      permissions: {
        create: permissions
          .filter((p) => p.name === "create" || p.name === "update")
          .map((p) => ({
            permission: { connect: { id: p.id } },
          })),
      },
    },
  });
  console.log("✅ Staff complete");


  const roles = [superAdminRole, adminRole, staffRole];

  // 3. Create Users
  for (let i = 0; i < 10; i++) {
    const role = roles[i % 3];
    const password = `123456`;
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    await prisma.user.create({
      data: {
        name: `Staff0${i + 1}`,
        username: `Staff0${i + 1}`,
        phone: faker.string.numeric(10),
        image: "",
        password: hashed,
        salt,
        role: { connect: { id: role.id } },
      },
    });
  }
  console.log("✅ Create Users complete");


  console.log("✅ Seeding complete");
}

main().catch((e) => {
    console.error(e);
    // process.exit(1);
}).finally(() => prisma.$disconnect());
