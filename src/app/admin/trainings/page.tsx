'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Training = {
  _id: string;
  title: string;
  shortDescription: string;
  facilitators: string[];
  targetAudience: string;
  mode: 'In-Person' | 'Online' | 'Both';
  certificateIssued: boolean;
  startDate: string;
  endDate?: string;
  isOngoing: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function TrainingsAdminPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const res = await fetch('/api/trainings');
        if (!res.ok) throw new Error('Failed to fetch trainings');
        const data = await res.json();
        setTrainings(data);
      } catch (err: any) {
        setError(err.message || 'Error loading trainings');
      } finally {
        setLoading(false);
      }
    };

    fetchTrainings();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Trainings</h1>
        <Link href="/admin/trainings/new" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          + New Training
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : trainings.length === 0 ? (
        <p>No trainings found.</p>
      ) : (
        <div className="space-y-4">
          {trainings.map((training) => (
            <div key={training._id} className="p-4 border rounded shadow-sm flex justify-between items-start gap-4">
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{training.title}</h2>
                <p className="text-sm text-gray-500">{training.shortDescription}</p>
                <p className="text-sm text-gray-400">
                  <strong>Facilitators:</strong> {training.facilitators.join(', ')}
                </p>
                <p className="text-sm text-gray-400">
                  <strong>Audience:</strong> {training.targetAudience}
                </p>
                <p className="text-sm text-gray-400">
                  <strong>Mode:</strong> {training.mode} | <strong>Certificate:</strong>{' '}
                  {training.certificateIssued ? 'Yes' : 'No'}
                </p>
                <p className="text-sm text-gray-400">
                  <strong>Duration:</strong> {' '}
                  {new Date(training.startDate).toLocaleDateString()} -{' '}
                  {training.isOngoing ? 'Ongoing' : new Date(training.endDate || '').toLocaleDateString()}
                </p>

                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                  Created: {new Date(training.createdAt).toLocaleString()} 
                  </p>
                  <p className="text-sm text-gray-400">
                  Updated: {new Date(training.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Link
                  href={`/admin/trainings/${training._id}/edit`}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Edit
                </Link>

                <button
                  onClick={async () => {
                    const confirmDelete = window.confirm(
                      'Are you sure you want to delete this training?\n\nThis action is permanent and cannot be undone.'
                    );
                    if (!confirmDelete) return;

                    try {
                      const res = await fetch(`/api/trainings/${training._id}`, {
                        method: 'DELETE',
                      });

                      if (!res.ok) throw new Error('Failed to delete');

                      // remove from local state
                      setTrainings((prev) => prev.filter((t) => t._id !== training._id));
                    } catch (err) {
                      alert('Error deleting training.');
                      console.error(err);
                    }
                  }}
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
