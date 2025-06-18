'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

type BlogPost = {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
};

export default function BlogAdminPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get('/api/blog');
        setBlogs(res.data);
      } catch (err) {
        setError('Failed to fetch blog posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm('Are you sure you want to delete this blog post?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/blog/${id}`);
      setBlogs(blogs.filter((blog) => blog._id !== id));
    } catch (err) {
      alert('Error deleting blog post');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Blog Posts</h1>
        <Link href="/admin/blog/new" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          + New Post
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : blogs.length === 0 ? (
        <p>No blog posts yet.</p>
      ) : (
        <div className="space-y-4">
          {blogs.map((post) => (
            <div key={post._id} className="p-4 border rounded flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">{post.title}</h2>
                <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
              </div>
              <div className="space-x-2">
                <Link
                  href={`/admin/blog/${post._id}/edit`}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
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
