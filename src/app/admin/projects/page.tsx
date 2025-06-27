'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Project = {
  _id: string;
  title: string;
  shortDescription: string;
  startDate: string;
  endDate?: string;
  isOngoing: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        if (!res.ok) throw new Error('Failed to fetch projects');
        const data = await res.json();
        setProjects(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this project?\n\nThis action is permanent and cannot be undone.'
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete project');
      setProjects(projects.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert('Error deleting project');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Projects</h1>
        <Link href="/admin/projects/new" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          + New Project
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project._id} className="p-4 border rounded shadow-sm flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">{project.title}</h2>
                <p className="text-sm text-gray-500">{project.shortDescription}</p>
                <p className="text-sm text-gray-400">
                    Duration:{' '}
                    {new Date(project.startDate).toLocaleDateString()} –{' '}
                    {project.isOngoing ? 'Ongoing' : new Date(project.endDate || '').toLocaleDateString()}
                  </p>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Created: {new Date(project.createdAt).toLocaleString()}</p>
                  <p className="text-sm text-gray-400">Updated: {new Date(project.updatedAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="space-x-2">
                <Link
                  href={`/admin/projects/${project._id}/edit`}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(project._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
