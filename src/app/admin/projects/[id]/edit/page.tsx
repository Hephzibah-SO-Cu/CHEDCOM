'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

export default function EditProjectPage() {
  const router = useRouter();
  const { id } = useParams();

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

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (!res.ok) throw new Error('Failed to fetch project');
        const data = await res.json();

        setTitle(data.title);
        setShortDescription(data.shortDescription);
        setFullDescription(data.fullDescription);
        setCollaborators(data.collaborators.join(', '));
        setImageUrls(data.imageUrls.join(', '));
        setStartDate(data.startDate?.slice(0, 10) || '');
        setEndDate(data.endDate?.slice(0, 10) || '');
        setIsOngoing(data.isOngoing);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Something went wrong');
        }
      }
    };

    fetchProject();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const confirmUpdate = window.confirm('Are you sure you want to update this project?');
    if (!confirmUpdate) return;

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
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

      if (!res.ok) throw new Error('Failed to update project');

      router.push('/admin/projects');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong');
      }
    }
 finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-black">Edit Project</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-black">Title</label>
          <input
            type="text"
            placeholder="Project title"
            className="w-full px-4 py-2 border rounded text-black"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium text-black">Short Description</label>
          <textarea
            placeholder="Brief summary of the project"
            className="w-full px-4 py-2 border rounded text-black"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium text-black">Full Description</label>
          <textarea
            placeholder="Detailed write-up of the complete project details"
            className="w-full px-4 py-2 border rounded text-black min-h-[150px]"
            value={fullDescription}
            onChange={(e) => setFullDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium text-black">Collaborators</label>
          <input
            type="text"
            placeholder="Comma-separated names"
            className="w-full px-4 py-2 border rounded text-black"
            value={collaborators}
            onChange={(e) => setCollaborators(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium text-black">Image URLs</label>
          <input
            type="text"
            placeholder="Comma-separated URLs"
            className="w-full px-4 py-2 border rounded text-black"
            value={imageUrls}
            onChange={(e) => setImageUrls(e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-medium text-black">Start Date</label>
            <input
              type="date"
              title="Start Date"
              className="w-full px-4 py-2 border rounded text-black"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

        <div className="flex-1">
          <label className="block font-medium text-black">End Date</label>
          <input
            type="date"
            title="End Date"
            className="w-full px-4 py-2 border rounded text-black"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            disabled={isOngoing}
          />
        </div>
</div>


        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isOngoing"
            checked={isOngoing}
            onChange={(e) => setIsOngoing(e.target.checked)}
          />
          <label htmlFor="isOngoing">Ongoing</label>
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {isSubmitting ? 'Updating...' : 'Update Project'}
        </button>
      </form>
    </div>
  );
}
