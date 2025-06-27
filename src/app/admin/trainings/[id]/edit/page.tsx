'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditTrainingPage() {
  const router = useRouter();
  const { id } = useParams();

  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [facilitators, setFacilitators] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [resources, setResources] = useState('');
  const [imageUrls, setImageUrls] = useState('');
  const [certificateIssued, setCertificateIssued] = useState(false);
  const [mode, setMode] = useState('In-Person');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isOngoing, setIsOngoing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTraining = async () => {
      try {
        const res = await fetch(`/api/trainings/${id}`);
        if (!res.ok) throw new Error('Failed to fetch training');
        const data = await res.json();

        setTitle(data.title);
        setShortDescription(data.shortDescription);
        setFullDescription(data.fullDescription);
        setFacilitators(data.facilitators.join(', '));
        setTargetAudience(data.targetAudience);
        setResources(data.resources.join(', '));
        setImageUrls(data.imageUrls.join(', '));
        setCertificateIssued(data.certificateIssued);
        setMode(data.mode);
        setStartDate(data.startDate?.slice(0, 10) || '');
        setEndDate(data.endDate?.slice(0, 10) || '');
        setIsOngoing(data.isOngoing);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      }
    };

    fetchTraining();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm('Are you sure you want to update this training?')) return;

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch(`/api/trainings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          shortDescription,
          fullDescription,
          facilitators: facilitators.split(',').map((f) => f.trim()),
          targetAudience,
          resources: resources.split(',').map((r) => r.trim()),
          imageUrls: imageUrls.split(',').map((url) => url.trim()),
          certificateIssued,
          mode,
          startDate,
          endDate: isOngoing ? null : endDate,
          isOngoing,
        }),
      });

      if (!res.ok) throw new Error('Failed to update training');
      router.push('/admin/trainings');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-black">Edit Training</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-black">Title</label>
          <input type="text" className="w-full px-4 py-2 border rounded text-black" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Title of the training" />
        </div>

        <div>
          <label className="block font-medium text-black">Short Description</label>
          <textarea className="w-full px-4 py-2 border rounded text-black" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} required placeholder="Brief summary of what the training was about" />
        </div>

        <div>
          <label className="block font-medium text-black">Full Description</label>
          <textarea className="w-full px-4 py-2 border rounded text-black min-h-[150px]" value={fullDescription} onChange={(e) => setFullDescription(e.target.value)} required placeholder="Detailed description of all details of the training done" />
        </div>

        <div>
          <label className="block font-medium text-black">Facilitators</label>
          <input type="text" className="w-full px-4 py-2 border rounded text-black" value={facilitators} onChange={(e) => setFacilitators(e.target.value)} placeholder="Comma-separated names" />
        </div>

        <div>
          <label className="block font-medium text-black">Target Audience</label>
          <input type="text" className="w-full px-4 py-2 border rounded text-black" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder="e.g. Medical students, Health workers" />
        </div>

        <div>
          <label className="block font-medium text-black">Resources</label>
          <input type="text" className="w-full px-4 py-2 border rounded text-black" value={resources} onChange={(e) => setResources(e.target.value)} placeholder="Comma-separated links or URLs" />
        </div>

        <div>
          <label htmlFor="imageUrls" className="block font-medium text-black">Image URLs</label>
          <input
            id="imageUrls"
            type="text"
            placeholder="Comma-separated image URLs"
            className="w-full px-4 py-2 border rounded text-black"
            value={imageUrls}
            onChange={(e) => setImageUrls(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
        <input
            id="certificateIssued"
            type="checkbox"
            checked={certificateIssued}
            onChange={(e) => setCertificateIssued(e.target.checked)}
            aria-label="Certificate issued"
        />
        <label htmlFor="certificateIssued" className="text-black">Certificate Issued</label>
        </div>


        <div>
        <label htmlFor="mode" className="block font-medium text-black">Mode</label>
        <select
            id="mode"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="w-full px-4 py-2 border rounded text-black"
            title="Training mode"
        >
            <option value="In-Person">In-Person</option>
            <option value="Online">Online</option>
            <option value="Both">Both</option>
        </select>
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
                title="Start Date"
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
                title="End Date"
            />
            </div>
        </div>

        <div className="flex items-center space-x-2">
          <input type="checkbox" id="isOngoing" checked={isOngoing} onChange={(e) => setIsOngoing(e.target.checked)} />
          <label htmlFor="isOngoing" className="text-black">Ongoing</label>
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {isSubmitting ? 'Updating...' : 'Update Training'}
        </button>
      </form>
    </div>
  );
}
