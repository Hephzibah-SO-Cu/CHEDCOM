// scripts/seed-superadmin.ts
import './setup-env'; // load env vars first

import connectToDatabase from '../src/lib/mongoose';
import User from '../src/models/User';
import bcrypt from 'bcryptjs';

async function seedAdmins() {
  await connectToDatabase();

  const users = [
    {
      name: 'CHEDCOM Root Admin',
      email: 'superadmin@chedcom.org',
      password: 'rootadmin123',
      role: 'superadmin',
      canManageAdmins: true,
    },
    {
      name: 'CEO',
      email: 'ceo@chedcom.org',
      password: 'ceo12345',
      role: 'superadmin',
      canManageAdmins: true,
    },
    {
      name: 'Executive Director',
      email: 'ed@chedcom.org',
      password: 'ed12345',
      role: 'superadmin',
      canManageAdmins: true,
    },
    {
      name: 'Program Manager',
      email: 'pm@chedcom.org',
      password: 'pm12345',
      role: 'admin',
      canManageAdmins: false,
    },
    {
      name: 'Field Officer',
      email: 'fo@chedcom.org',
      password: 'fo12345',
      role: 'admin',
      canManageAdmins: false,
    },
  ];

  for (const u of users) {
    const existing = await User.findOne({ email: u.email });
    if (existing) {
      console.log(`🚫 User already exists: ${u.email}`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(u.password, 10);
    await User.create({ ...u, password: hashedPassword });

    console.log(`✅ User created: ${u.email} (${u.role})`);
  }

  console.log('🎉 Seeding complete!');
}

seedAdmins()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Failed to seed admins:', err);
    process.exit(1);
  });
