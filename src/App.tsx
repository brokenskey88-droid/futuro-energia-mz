import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { useStore } from './lib/store';
import { Home, Zap, Wallet, User as UserIcon, ShieldAlert } from 'lucide-react';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard';
import Invest from './pages/Invest';
import Finance from './pages/Finance';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const currentUser = useStore((state) => state.currentUser);
  return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const currentUser = useStore((state) => state.currentUser);
  const claimDailyEarnings = useStore((state) => state.claimDailyEarnings);

  useEffect(() => {
    if (currentUser) {
      claimDailyEarnings();
    }
  }, [currentUser, claimDailyEarnings]);

  const navItems = [
    { icon: Home, label: 'Início', path: '/' },
    { icon: Zap, label: 'Investir', path: '/invest' },
    { icon: Wallet, label: 'Finanças', path: '/finance' },
    { icon: UserIcon, label: 'Perfil', path: '/profile' },
  ];

  if (currentUser?.role === 'admin') {
    navItems.push({ icon: ShieldAlert, label: 'Admin', path: '/admin' });
  }

  const hideNav = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0 md:pl-0 lg:pl-0">
      <main className="max-w-md mx-auto min-h-screen bg-white shadow-xl relative">
        {children}
        
        {!hideNav && (
          <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center h-16 max-w-md mx-auto z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                  location.pathname === item.path ? 'text-green-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <item.icon size={20} className={location.pathname === item.path ? 'animate-bounce-subtle' : ''} />
                <span className="text-[10px] mt-1 font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        )}
      </main>
      <Toaster position="top-center" richColors />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/invest"
            element={
              <PrivateRoute>
                <Invest />
              </PrivateRoute>
            }
          />
          <Route
            path="/finance"
            element={
              <PrivateRoute>
                <Finance />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <Admin />
              </PrivateRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
