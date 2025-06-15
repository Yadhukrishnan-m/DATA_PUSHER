import { IRole } from "../models/role.model";

export interface IRoleRepository {
  findByName(roleName: string): Promise<IRole | null>;
}
