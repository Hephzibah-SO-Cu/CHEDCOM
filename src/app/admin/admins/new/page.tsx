'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateAdminPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'superadmin'>('admin');
  const [canManageAdmins, setCanManageAdmins] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const confirm = window.confirm('Are you sure you want to create this admin?');
    if (!confirm) return;

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role, canManageAdmins }),
      });

      if (!res.ok) throw new Error('Failed to create admin');
      router.push('/admin/admins');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-black">Create New Admin</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block font-medium text-black">
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Admin full name"
            className="w-full px-4 py-2 border rounded text-black"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block font-medium text-black">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Admin email"
            className="w-full px-4 py-2 border rounded text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="role" className="block font-medium text-black">
            Role
          </label>
          <select
            id="role"
            title="Select admin role"
            className="w-full px-4 py-2 border rounded text-black"
            value={role}
            onChange={(e) => setRole(e.target.value as 'admin' | 'superadmin')}
          >
            <option value="admin">Admin</option>
            <option value="superadmin">Superadmin</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <input
            id="canManageAdmins"
            type="checkbox"
            checked={canManageAdmins}
            onChange={(e) => setCanManageAdmins(e.target.checked)}
          />
          <label htmlFor="canManageAdmins" className="text-black">
            Can Manage Admins
          </label>
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
