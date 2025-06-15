import { sequelize } from "../config/db.config";
import { User } from "./user.model";
import { Role } from "./role.model"; 
import { Account } from "./account.model"; 
import { AccountMember } from "./accountMember.model"; 
import { Destination } from "./destination.model"; 
import { Log } from "./log.model"; 

// Associations
User.hasMany(AccountMember, { foreignKey: "userId", onDelete: "CASCADE" });
Account.hasMany(AccountMember, {
  foreignKey: "accountId",
  onDelete: "CASCADE",
});
Role.hasMany(AccountMember, { foreignKey: "roleId", onDelete: "CASCADE" });
AccountMember.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
AccountMember.belongsTo(Account, {
  foreignKey: "accountId",
  onDelete: "CASCADE",
});
AccountMember.belongsTo(Role, { foreignKey: "roleId", onDelete: "CASCADE" });

Account.hasMany(Destination, { foreignKey: "accountId", onDelete: "CASCADE" });
Destination.belongsTo(Account, { foreignKey: "accountId" });

Account.hasMany(Log, { foreignKey: "accountId", onDelete: "CASCADE" });
Destination.hasMany(Log, { foreignKey: "destinationId", onDelete: "CASCADE" });
Log.belongsTo(Account, { foreignKey: "accountId", onDelete: "CASCADE" });
Log.belongsTo(Destination, {
  foreignKey: "destinationId",
  onDelete: "CASCADE",
});


// sync DB
export const syncDatabase = async () => {
  await sequelize.sync(); 
  console.log("All models were synchronized.");
};

export { User, Role, Account, AccountMember, Destination, Log };
