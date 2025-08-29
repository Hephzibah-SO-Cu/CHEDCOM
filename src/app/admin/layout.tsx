'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Menu, LogOut, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isLoginPage = pathname === '/admin/login';

  const navLinks = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/blog', label: 'Blog' },
    { href: '/admin/projects', label: 'Projects' },
    { href: '/admin/trainings', label: 'Trainings' },
    { href: '/admin/gallery', label: 'Gallery' },
    { href: '/admin/admins', label: 'Manage Admins' },
  ];

  useEffect(() => {
    if (!isLoginPage) setSidebarOpen(false);
  }, [pathname, isLoginPage]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);

    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {isLoginPage ? (
        <main className="flex-1">{children}</main>
      ) : (
        <>
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-30 lg:hidden"
              aria-hidden="true"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <aside
            id="admin-sidebar"
            aria-label="Admin navigation"
            className={`${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } fixed top-0 left-0 w-64 h-full bg-white dark:bg-gray-800 shadow-lg z-40 transform transition-transform duration-200 ease-in-out lg:translate-x-0`}
          >
            <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Panel</h2>
              <button
                type="button"
                aria-label="Close sidebar"
                aria-controls="admin-sidebar"
                className="lg:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            <nav role="navigation" className="p-4 space-y-2">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== '/admin' && pathname.startsWith(link.href));

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`block px-3 py-2 rounded ${
                      isActive
                        ? 'bg-green-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          <div className="flex-1 flex flex-col lg:ml-64">
            <header className="flex items-center justify-between bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Toggle sidebar"
                  data-expanded={sidebarOpen ? 'true' : 'false'}
                  aria-controls="admin-sidebar"
                  className="lg:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setSidebarOpen((v) => !v)}
                >
                  <span className="sr-only">{sidebarOpen ? 'Close sidebar' : 'Open sidebar'}</span>
                  <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </button>

                <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Admin Dashboard
                </h1>
              </div>
              <div className="flex items-center gap-4">
                {session?.user && (
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {session.user.name || session.user.email}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: '/admin/login' })}
                  className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            </header>

            <main className="flex-1 p-6">{children}</main>
          </div>
        </>
      )}
    </div>
  );
}
