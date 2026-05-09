import { Outlet, Link, useLocation } from 'react-router';
import { Home, Map, TrendingUp, BookOpen, ClipboardCheck } from 'lucide-react';

export function RootLayout() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/assessment', label: 'Assessment', icon: ClipboardCheck },
    { path: '/learning-path', label: 'Learning Path', icon: Map },
    { path: '/progress', label: 'Progress', icon: TrendingUp },
    { path: '/resources', label: 'Resources', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-gray-800 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#39ff14] rounded flex items-center justify-center">
                <span className="text-black font-bold">T3</span>
              </div>
              <span className="font-semibold">triolingo</span>
            </div>

            <div className="flex gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[#39ff14] text-black'
                        : 'text-gray-400 hover:text-white hover:bg-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-gray-800 bg-black mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-center text-gray-500 text-sm">
            © 2026 triolingo - Your Spanish Learning Journey
          </p>
        </div>
      </footer>
    </div>
  );
}
