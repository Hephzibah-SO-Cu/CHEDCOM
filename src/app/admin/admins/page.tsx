'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Admin = {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
  canManageAdmins: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await fetch('/api/admins');
        if (!res.ok) throw new Error('Failed to fetch admins');
        const data = await res.json();
        setAdmins(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Error loading admins');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Admins</h1>
        <Link href="/admin/admins/new" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          + New Admin
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : admins.length === 0 ? (
        <p>No admins found.</p>
      ) : (
        <div className="space-y-4">
          {admins.map((admin) => (
            <div key={admin._id} className="p-4 border rounded shadow-sm flex justify-between items-start gap-4">
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{admin.name}</h2>
                <p className="text-sm text-gray-500">{admin.email}</p>
                <p className="text-sm text-gray-400">
                  <strong>Role:</strong> {admin.role}
                  {admin.canManageAdmins && <span className="ml-2 text-green-600">(Can Manage Admins)</span>}
                </p>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Created: {new Date(admin.createdAt).toLocaleString()}</p>
                  <p className="text-sm text-gray-400">Updated: {new Date(admin.updatedAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Link
                  href={`/admin/admins/${admin._id}/edit`}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Edit
                </Link>

                <button
                  onClick={async () => {
                    const confirmDelete = window.confirm(
                      `Are you sure you want to delete ${admin.name}?\n\nThis action is permanent and cannot be undone.`
                    );
                    if (!confirmDelete) return;

                    try {
                      const res = await fetch(`/api/admins/${admin._id}`, {
                        method: 'DELETE',
                      });

                      if (!res.ok) throw new Error('Failed to delete');

                      setAdmins((prev) => prev.filter((a) => a._id !== admin._id));
                    } catch (err) {
                      alert('Error deleting admin.');
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
