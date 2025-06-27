'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateProjectPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [collaborators, setCollaborators] = useState('');
  const [imageUrls, setImageUrls] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isOngoing, setIsOngoing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const confirm = window.confirm('Are you sure you want to create this project?');
    if (!confirm) return;

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          shortDescription,
          fullDescription,
          collaborators: collaborators.split(',').map((c) => c.trim()),
          imageUrls: imageUrls.split(',').map((u) => u.trim()),
          startDate,
          endDate: isOngoing ? null : endDate,
          isOngoing,
        }),
      });

      if (!res.ok) throw new Error('Failed to create project');

      router.push('/admin/projects');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-black">Create New Project</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block font-medium text-black">Title</label>
          <input
            id="title"
            type="text"
            className="w-full px-4 py-2 border rounded text-black"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Project title"
          />
        </div>

        <div>
          <label htmlFor="shortDescription" className="block font-medium text-black">Short Description</label>
          <textarea
            id="shortDescription"
            className="w-full px-4 py-2 border rounded text-black"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            required
            placeholder="Brief summary of the project"
          />
        </div>

        <div>
          <label htmlFor="fullDescription" className="block font-medium text-black">Full Description</label>
          <textarea
            id="fullDescription"
            className="w-full px-4 py-2 border rounded text-black min-h-[150px]"
            value={fullDescription}
            onChange={(e) => setFullDescription(e.target.value)}
            required
            placeholder="Detailed write-up of the complete project details"
          />
        </div>

        <div>
          <label htmlFor="collaborators" className="block font-medium text-black">Collaborators</label>
          <input
            id="collaborators"
            type="text"
            className="w-full px-4 py-2 border rounded text-black"
            value={collaborators}
            onChange={(e) => setCollaborators(e.target.value)}
            placeholder="Comma-separated names"
          />
        </div>

        <div>
          <label htmlFor="imageUrls" className="block font-medium text-black">Image URLs</label>
          <input
            id="imageUrls"
            type="text"
            className="w-full px-4 py-2 border rounded text-black"
            value={imageUrls}
            onChange={(e) => setImageUrls(e.target.value)}
            placeholder="Comma-separated URLs"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="startDate" className="block font-medium text-black">Start Date</label>
            <input
              id="startDate"
              type="date"
              className="w-full px-4 py-2 border rounded text-black"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="flex-1">
            <label htmlFor="endDate" className="block font-medium text-black">End Date</label>
            <input
              id="endDate"
              type="date"
              className="w-full px-4 py-2 border rounded text-black"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={isOngoing}
              placeholder="Leave empty if ongoing"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isOngoing"
            checked={isOngoing}
            onChange={(e) => setIsOngoing(e.target.checked)}
            aria-label="Toggle whether project is ongoing"
          />
          <label htmlFor="isOngoing" className="text-black">
            Ongoing
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
