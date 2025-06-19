'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditBlogPost() {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/blog/${id}`);
        if (!res.ok) throw new Error('Failed to fetch blog post');

        const data = await res.json();
        setTitle(data.title);
        setContent(data.content);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Something went wrong');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const confirmed = window.confirm('Are you sure you want to update this post?');
    if (!confirmed) return;

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) throw new Error('Failed to update post');
      router.push('/admin/blog');
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

  if (loading) return <p className="text-center mt-10">Loading post...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-black">Edit Blog Post</h1>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label htmlFor="title" className="block font-medium text-black">
            Title
          </label>
          <input
            id="title"
            type="text"
            className="w-full px-4 py-2 border rounded text-black"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="block font-medium text-black">
            Content
          </label>
          <textarea
            id="content"
            className="w-full px-4 py-2 border rounded min-h-[150px] text-black"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
        >
          {isSubmitting ? 'Updating...' : 'Update Post'}
        </button>
      </form>
    </div>
  );
}
