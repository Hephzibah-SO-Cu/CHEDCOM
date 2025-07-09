'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { uploadToReImage } from '@/lib/uploadToReImage';

export default function NewGalleryItemPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert('Please select a file to upload.');

    const confirmUpload = window.confirm('Are you sure you want to upload this media item?');
    if (!confirmUpload) return;

    setIsSubmitting(true);
    setError('');

    try {
      // 1. Upload file to ReImage
      const { url, assetId } = await uploadToReImage(file, tags.split(',').map(t => t.trim()));

      // 2. Send metadata to our API
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          tags: tags.split(',').map(t => t.trim()),
          mediaUrl: url,
          assetId, // 👈 Add this
        }),
      });


      if (!res.ok) throw new Error('Failed to save gallery item');
      router.push('/admin/gallery');
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6 text-black">Upload New Gallery Media</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
  <label className="block font-medium text-black" htmlFor="title">Title</label>
  <input
    id="title"
    type="text"
    title="Media title"
    placeholder="e.g. Community outreach in Lagos"
    className="w-full px-4 py-2 border rounded text-black"
    value={title}
    onChange={e => setTitle(e.target.value)}
    required
  />
</div>

<div>
  <label className="block font-medium text-black" htmlFor="description">Description</label>
  <textarea
    id="description"
    title="Media description"
    placeholder="e.g. A brief about what this image or video is about"
    className="w-full px-4 py-2 border rounded text-black"
    value={description}
    onChange={e => setDescription(e.target.value)}
  />
</div>

<div>
  <label className="block font-medium text-black" htmlFor="tags">Tags</label>
  <input
    id="tags"
    type="text"
    title="Media tags"
    placeholder="e.g. Health, Women Empowerment, 2023"
    className="w-full px-4 py-2 border rounded text-black"
    value={tags}
    onChange={e => setTags(e.target.value)}
  />
</div>

<div>
  <label className="block font-medium text-black" htmlFor="file">Upload Media</label>
  <input
    id="file"
    type="file"
    title="Select image or video"
    accept="image/*,video/*"
    onChange={e => setFile(e.target.files?.[0] || null)}
    className="hidden"
  />
  <label
    htmlFor="file"
    className="inline-block mt-2 cursor-pointer bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 text-black"
  >
    {file ? file.name : 'Choose File'}
  </label>
</div>

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
        >
          {isSubmitting ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
}
