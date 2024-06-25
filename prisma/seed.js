import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const types = [
  { id: 1, name: "Live TV" },
  { id: 2, name: "Movies" },
  { id: 3, name: "TV Shows" },
  { id: 4, name: "Sports" },
];

const categories = [
  { id: 1, name: "Recommended" },
  { id: 2, name: "Popular" },
  { id: 3, name: "Featured" },
  { id: 4, name: "Favorites" },
  { id: 5, name: "Watch Later" },
];

const roles = [
  { id: 1, name: "Admin" },
  { id: 2, name: "Editor" },
  { id: 3, name: "Contributor" },
  { id: 4, name: "Viewer" },
];

const users =[
  {id:1, username:"Admin", email:"admin@admin.com", password:"admin"},
  {id:2, username:"Editor", email:"editor@editor.com", password:"editor"},
  {id:3, username:"Contributor", email:"contributor@contributor.com", password:"contributor"},
  {id:4, username:"Viewer", email:"viewer@viewer.com", password:"viewer"},
]

const permissions = [
  {
    id: 1,
    name: "Manage All",
    action: "manage",
    subject: "all",
  },
  {
    id: 2,
    name: "Create User",
    action: "create",
    subject: "User",
  },
  {
    id: 3,
    name: "Read User",
    action: "read",
    subject: "User",
  },
  {
    id: 4,
    name: "Update User",
    action: "update",
    subject: "User",
  },
  {
    id: 5,
    name: "Delete User",
    action: "delete",
    subject: "User",
  },
  {
    id: 6,
    name: "Manage User",
    action: "manage",
    subject: "User",
  },
  {
    id: 7,
    name: "Create Program",
    action: "create",
    subject: "Program",
  },
  {
    id: 8,
    name: "Read Program",
    action: "read",
    subject: "Program",
  },
  {
    id: 9,
    name: "Update Program",
    action: "update",
    subject: "Program",
  },
  {
    id: 10,
    name: "Delete Program",
    action: "delete",
    subject: "Program",
  },
  {
    id: 11,
    name: "Manage Program",
    action: "manage",
    subject: "Program",
  },
  {
    id: 12,
    name: "Create Channel",
    action: "create",
    subject: "Channel",
  },
  {
    id: 13,
    name: "Read Channel",
    action: "read",
    subject: "Channel",
  },
  {
    id: 14,
    name: "Update Channel",
    action: "update",
    subject: "Channel",
  },
  {
    id: 15,
    name: "Delete Channel",
    action: "delete",
    subject: "Channel",
  },
  {
    id: 16,
    name: "Manage Channel",
    action: "manage",
    subject: "Channel",
  },
  {
    id: 17,
    name: "Manage Own Channel",
    action: "manage",
    subject: "Channel",
    conditions: {
      userId: "{{userId}}" // A condition that the program's userId must match the current user's ID
    },
  },
  {
    id: 18,
    name: "Update Program Title",
    action: "update",
    subject: "Program",
    conditions: {
      allowedFields: ["title"] // A condition that only allows updating the title field
    },
  },
];

async function main() {
  console.log("Seeding types...");
  for (const type of types) {
    await prisma.type.upsert({
      where: { id: type.id },
      update: {},
      create: type,
    });
  }

  console.log("Seeding categories...");
  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {},
      create: category,
    });
  }

  // console.log("Seeding roles...");
  // for (const role of roles) {
  //   await prisma.role.upsert({
  //     where: { id: role.id },
  //     update: {},
  //     create: role,
  //   });
  // }

  console.log("Seeding permissions...");
  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { id: permission.id },
      update: {},
      create: permission,
    });
  }

  console.log("Seeding users...");
  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: user,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
