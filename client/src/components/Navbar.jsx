import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Zap, 
  Recycle, 
  BookOpen, 
  Gift, 
  LayoutDashboard, 
  PlusCircle, 
  Wallet, 
  ShieldCheck, 
  Truck, 
  LogOut, 
  Menu, 
  X, 
  User, 
  Sparkles,
  Layers
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, isCollector, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
      isActive
        ? 'text-emerald-700 bg-emerald-50 border border-emerald-200 shadow-sm'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-500 p-0.5 shadow-md shadow-emerald-500/10 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Recycle className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                Volt<span className="text-emerald-600">Cycle</span>
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 -mt-1 tracking-wider uppercase">
                E-Waste Credits
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/learn" className={navLinkClass}>
              <BookOpen className="w-4 h-4 text-emerald-600" />
              Learn E-Waste
            </NavLink>
            <NavLink to="/offers" className={navLinkClass}>
              <Gift className="w-4 h-4 text-amber-500" />
              Offers
            </NavLink>

            {isAuthenticated && (
              <>
                <NavLink to="/dashboard" className={navLinkClass}>
                  <LayoutDashboard className="w-4 h-4 text-cyan-600" />
                  Dashboard
                </NavLink>
                <NavLink to="/submissions" end className={navLinkClass}>
                  <Layers className="w-4 h-4 text-indigo-600" />
                  My Submissions
                </NavLink>
                <NavLink to="/wallet" className={navLinkClass}>
                  <Wallet className="w-4 h-4 text-emerald-600" />
                  Wallet
                </NavLink>

                {isCollector && (
                  <NavLink to="/collector" className={navLinkClass}>
                    <Truck className="w-4 h-4 text-amber-600" />
                    Collector
                  </NavLink>
                )}

                {isAdmin && (
                  <NavLink to="/admin" className={navLinkClass}>
                    <ShieldCheck className="w-4 h-4 text-rose-600" />
                    Admin
                  </NavLink>
                )}
              </>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/submissions/new"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <PlusCircle className="w-4 h-4" />
                  Submit E-Waste
                </Link>

                <div className="h-6 w-px bg-slate-200" />

                <div className="flex items-center gap-2 pl-1">
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-semibold text-slate-800">
                      {user?.name || 'Recycler'}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold capitalize">
                      {user?.role?.toLowerCase() || 'user'}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 shadow-xl">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-100"
          >
            Home
          </Link>
          <Link
            to="/learn"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-100"
          >
            Learn E-Waste
          </Link>
          <Link
            to="/offers"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-100"
          >
            Offers & Rewards
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-100"
              >
                Dashboard
              </Link>
              <Link
                to="/submissions"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-100"
              >
                My Submissions
              </Link>
              <Link
                to="/submissions/new"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-emerald-700 bg-emerald-50 border border-emerald-200"
              >
                + New Submission
              </Link>
              <Link
                to="/wallet"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-100"
              >
                Wallet & Ledger
              </Link>

              {isCollector && (
                <Link
                  to="/collector"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-amber-700 hover:bg-slate-100"
                >
                  Collector Panel
                </Link>
              )}

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-rose-700 hover:bg-slate-100"
                >
                  Admin Panel
                </Link>
              )}

              <div className="pt-3 border-t border-slate-200">
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out ({user?.name})
                </button>
              </div>
            </>
          ) : (
            <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg text-sm font-semibold text-slate-800 bg-slate-100 border border-slate-200 hover:bg-slate-200"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm"
              >
                Create Free Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
