import React from 'react';
import { Link } from 'react-router-dom';
import { Recycle, ShieldAlert, Heart, Leaf, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-200">
                <Recycle className="w-5 h-5" />
              </div>
              <span className="font-bold text-slate-900 text-lg tracking-tight">VoltCycle</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Empowering communities to divert toxic electronics from landfills, earn verified circular credits, and foster ethical urban mining.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Leaf className="w-3.5 h-3.5" />
              100% Certified Recycler Network
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/learn" className="hover:text-emerald-600 transition-colors">
                  What is E-Waste?
                </Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-emerald-600 transition-colors">
                  Rewards & Offers
                </Link>
              </li>
              <li>
                <Link to="/submissions/new" className="hover:text-emerald-600 transition-colors">
                  Schedule a Pickup
                </Link>
              </li>
              <li>
                <Link to="/learn#safety" className="hover:text-emerald-600 transition-colors">
                  Safety & Prep Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Guidelines & Safety */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Safety & Data Policy
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/learn#hazardous" className="hover:text-emerald-600 transition-colors">
                  Handling Swollen Batteries
                </Link>
              </li>
              <li>
                <Link to="/learn#wipe" className="hover:text-emerald-600 transition-colors">
                  Factory Reset & Data Wipe
                </Link>
              </li>
              <li>
                <span className="text-slate-500">
                  Disclaimer: Always remove personal data before handoff.
                </span>
              </li>
            </ul>
          </div>

          {/* Community & Stats */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Impact Standards
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              Calculations for CO₂ offset and materials diverted follow standardized e-waste metallurgical recovery factors.
            </p>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
              <span className="font-semibold text-slate-800">Got questions?</span>{' '}
              Visit our FAQ section on the Learn page for pickup and credit queries.
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} VoltCycle Platform. Built for cleaner cities & circular recovery.</p>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-slate-600">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Planet Earth
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
