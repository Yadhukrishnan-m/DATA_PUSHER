import { Role } from "../models/role.model";
export async function seedRoles() {
  const count = await Role.count();
  if (count === 0) {
    await Role.bulkCreate([
      {  roleName: "Admin" },
      {  roleName: "Normal user" },
    ]);
    console.log("Roles seeded successfully");
  } 
}
