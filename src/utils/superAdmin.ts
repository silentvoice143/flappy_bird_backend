import bcrypt from "bcryptjs";
import { User } from "../models/user.model";

export const ensureSuperAdmin = async () => {
  const adminEmail = process.env.SUPER_ADMIN_EMAIL!;
  const adminPassword = process.env.SUPER_ADMIN_PASSWORD!;

  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    const hashed = await bcrypt.hash(adminPassword, 10);
    admin = await User.create({
      name: "Super Admin",
      email: adminEmail,
      password: hashed,
      role: "super_admin",
    });
    console.log("✅ Super admin created");
  } else {
    console.log("✅ Super admin already exists");
  }
};
