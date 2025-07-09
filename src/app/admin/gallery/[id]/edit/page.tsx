'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditGalleryItemPage() {
  const router = useRouter();
  const { id } = useParams();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'document'>('image');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`/api/gallery/${id}`);
        if (!res.ok) throw new Error('Failed to load gallery item');

        const data = await res.json();
        setTitle(data.title);
        setDescription(data.description);
        setTags(data.tags.join(', '));
        setMediaUrl(data.mediaUrl);
        setMediaType(data.mediaType);
      } catch (err: any) {
        setError(err.message || 'Error loading item');
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          tags: tags.split(',').map(t => t.trim()),
        }),
      });

      if (!res.ok) throw new Error('Failed to update gallery item');
      router.push('/admin/gallery');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6 text-black">Edit Gallery Item</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-black">Title</label>
            <input
            id="title"
            type="text"
            title="Media title"
            placeholder="e.g. Community outreach in Lagos"
            className="w-full px-4 py-2 border rounded text-black"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            />
          </div>

          <div>
            <label className="block font-medium text-black">Description</label>
            <textarea
            id="description"
            title="Media description"
            placeholder="e.g. A brief about what this image or video is about"
            className="w-full px-4 py-2 border rounded text-black"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium text-black">Tags</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded text-black"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="e.g. Health, Women Empowerment, 2023"
            />
          </div>

          <div>
            <label className="block font-medium text-black mb-1">Media Preview</label>
            {mediaType === 'image' ? (
              <img src={mediaUrl} alt="preview" className="w-full rounded max-h-96 object-contain" />
            ) : mediaType === 'video' ? (
              <video src={mediaUrl} controls className="w-full rounded max-h-96" />
            ) : (
              <a
                href={mediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View Document
              </a>
            )}
          </div>

          {error && <p className="text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      )}
    </div>
  );
}
