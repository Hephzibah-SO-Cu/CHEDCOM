// src/app/admin/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import connectToDatabase from '@/lib/mongoose';

import Link from 'next/link';
import Blog from '@/models/Blog';
import Project from '@/models/Project';
import Gallery from '@/models/Gallery';
import Training from '@/models/Training';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect('/admin/login');
  }

  await connectToDatabase();

  const [blogCount, projectCount, galleryCount, trainingCount] = await Promise.all([
    Blog.countDocuments(),
    Project.countDocuments(),
    Gallery.countDocuments(),
    Training.countDocuments(),
  ]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 px-4 py-8 text-gray-900 dark:text-white">
      <div className="space-y-4">
        <p>
          Welcome, <strong>{session.user?.name || session.user?.email}</strong>.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard title="Projects" value={projectCount} />
          <DashboardCard title="Trainings" value={trainingCount} />
          <DashboardCard title="Gallery Items" value={galleryCount} />
          <DashboardCard title="Blog Posts" value={blogCount} />
        </div>

        {/* Quick Actions */}
        <section className="mt-6">
          <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <QuickLink href="/admin/blog/new" label="New Blog Post" />
            <QuickLink href="/admin/projects/new" label="New Project" />
            <QuickLink href="/admin/trainings/new" label="New Training" />
            <QuickLink href="/admin/gallery/new" label="Upload to Gallery" />
          </div>
        </section>

        <p className="text-sm text-gray-600 dark:text-gray-400 mt-6">
          Use the sidebar to access each module or create new entries.
        </p>
      </div>
    </div>
  );
}

function DashboardCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 shadow">
      <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block text-center px-4 py-3 rounded bg-green-600 text-white hover:bg-green-700 transition"
    >
      {label}
    </Link>
  );
}
