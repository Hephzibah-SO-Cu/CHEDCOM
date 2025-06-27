'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateTrainingPage() {
  const router = useRouter();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const confirm = window.confirm('Are you sure you want to create this training?');
    if (!confirm) return;

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/trainings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          shortDescription,
          fullDescription,
          facilitators: facilitators.split(',').map(f => f.trim()),
          targetAudience,
          resources: resources.split(',').map(r => r.trim()),
          imageUrls: imageUrls.split(',').map(url => url.trim()),
          certificateIssued,
          mode,
          startDate,
          endDate: isOngoing ? null : endDate,
          isOngoing
        })
      });

      if (!res.ok) throw new Error('Failed to create training');
      router.push('/admin/trainings');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-black">Create New Training</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block font-medium text-black">Title</label>
          <input id="title" placeholder="Title of the training" type="text" className="w-full px-4 py-2 border rounded text-black" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>

        <div>
          <label htmlFor="shortDescription" className="block font-medium text-black">Short Description</label>
          <textarea id="shortDescription" placeholder="Brief summary of what the training was about" className="w-full px-4 py-2 border rounded text-black" value={shortDescription} onChange={e => setShortDescription(e.target.value)} required />
        </div>

        <div>
          <label htmlFor="fullDescription" className="block font-medium text-black">Full Description</label>
          <textarea id="fullDescription" placeholder="Detailed description of all details of the training done" className="w-full px-4 py-2 border rounded text-black min-h-[150px]" value={fullDescription} onChange={e => setFullDescription(e.target.value)} required />
        </div>

        <div>
          <label htmlFor="facilitators" className="block font-medium text-black">Facilitators</label>
          <input id="facilitators" type="text" className="w-full px-4 py-2 border rounded text-black" value={facilitators} onChange={e => setFacilitators(e.target.value)} placeholder="Comma-separated names" />
        </div>

        <div>
          <label htmlFor="targetAudience" className="block font-medium text-black">Target Audience</label>
          <input id="targetAudience" type="text" className="w-full px-4 py-2 border rounded text-black" value={targetAudience} onChange={e => setTargetAudience(e.target.value)} placeholder="e.g. Medical students, Health workers" />
        </div>

        <div>
          <label htmlFor="resources" className="block font-medium text-black">Resources</label>
          <input id="resources" type="text" className="w-full px-4 py-2 border rounded text-black" value={resources} onChange={e => setResources(e.target.value)} placeholder="Comma-separated links or URLs" />
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
          <input type="checkbox" id="certificateIssued" checked={certificateIssued} onChange={e => setCertificateIssued(e.target.checked)} />
          <label htmlFor="certificateIssued" className="text-black">Certificate Issued</label>
        </div>

        <div>
          <label htmlFor="mode" className="block font-medium text-black">Mode</label>
          <select id="mode" className="w-full px-4 py-2 border rounded text-black" value={mode} onChange={e => setMode(e.target.value)}>
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
              title="Start Date"
              placeholder="Select start date"
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
              title="End Date"
              placeholder="Select end date"
              className="w-full px-4 py-2 border rounded text-black"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={isOngoing}
            />
          </div>

        </div>

        <div className="flex items-center space-x-2">
          <input type="checkbox" id="isOngoing" checked={isOngoing} onChange={e => setIsOngoing(e.target.checked)} />
          <label htmlFor="isOngoing" className="text-black">Ongoing</label>
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <button type="submit" disabled={isSubmitting} className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800">
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
