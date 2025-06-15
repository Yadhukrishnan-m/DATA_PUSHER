import { Role } from "../models/role.model";
import { IRoleRepository } from "../interfaces/role.repository.interface"; 

export class RoleRepository implements IRoleRepository {
  async findByName(roleName: string): Promise<Role | null> {
    return await Role.findOne({ where: { roleName } });
  }
}
