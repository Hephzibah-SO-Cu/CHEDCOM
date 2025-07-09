'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';


type GalleryItem = {
  _id: string;
  title: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  tags: string[];
  createdAt: string;
};

export default function GalleryAdminPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch('/api/gallery');
        if (!res.ok) throw new Error('Failed to load gallery');
        const data = await res.json();
        setItems(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Error loading item');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this item? This action is permanent and cannot be undone.');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete item');
      setItems(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      alert('Error deleting item');
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Gallery</h1>
        <Link
          href="/admin/gallery/new"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Upload Media
        </Link>
      </div>

      {loading ? (
        <p>Loading gallery...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : items.length === 0 ? (
        <p>No gallery items yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item._id} className="border rounded shadow p-3 bg-white flex flex-col">
              {item.mediaType === 'image' ? (
                <Image
                  src={item.mediaUrl.replace(/\.(jpg|jpeg|png)$/, '.webp')}
                  alt={item.title}
                  width={800}
                  height={600}
                  className="w-full h-48 object-cover rounded"
                  unoptimized
                />
              ) : (
                <video
                  src={item.mediaUrl}
                  controls
                  className="w-full h-48 object-cover rounded"
                />
              )}
              <div className="mt-3 flex-1">
                <h2 className="text-lg font-semibold text-black">{item.title}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {item.tags.join(', ')}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Uploaded: {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="mt-4 flex justify-between gap-2">
                <Link
                  href={`/admin/gallery/${item._id}/edit`}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
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
