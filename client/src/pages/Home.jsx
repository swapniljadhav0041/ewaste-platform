import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  Recycle, 
  ShieldCheck, 
  Truck, 
  Coins, 
  Gift, 
  Leaf, 
  BatteryCharging, 
  Smartphone, 
  Laptop, 
  Tv, 
  CheckCircle2, 
  Flame,
  Award
} from 'lucide-react';
import api from '../api/axios';

export default function Home() {
  const [platformStats, setPlatformStats] = useState({
    totalSubmissions: 142,
    totalKgDiverted: 1280,
    totalCreditsIssued: 84500,
    co2SavedKg: 2450,
  });

  const [featuredOffers, setFeaturedOffers] = useState([
    {
      id: '1',
      partner: 'Amazon EcoPay',
      title: '₹500 Shopping Voucher',
      creditCost: 500,
      description: 'Applicable across electronics, books, and eco-certified home products.',
      stock: 45
    },
    {
      id: '2',
      partner: 'Croma Retail',
      title: '15% Off New Laptops & Tablets',
      creditCost: 350,
      description: 'Exclusive discount code on green-certified and energy-star laptops.',
      stock: 20
    },
    {
      id: '3',
      partner: 'Starbucks Green Cup',
      title: 'Free Beverage Voucher',
      creditCost: 180,
      description: 'Redeem any handcrafted tall beverage at participating outlets.',
      stock: 100
    }
  ]);

  useEffect(() => {
    // Attempt to load live platform stats if available
    api.get('/stats/platform')
      .then(res => {
        if (res.success && res.data) {
          setPlatformStats(prev => ({ ...prev, ...res.data }));
        }
      })
      .catch(() => {
        // Fallback demo numbers are already present
      });

    api.get('/offers')
      .then(res => {
        if (res.success && res.data && res.data.length > 0) {
          setFeaturedOffers(res.data.slice(0, 3));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-24 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20">
        {/* Glow ambient background lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[250px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6 shadow-inner shadow-emerald-900/50">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Turn Old Electronics into Verified Circular Rewards</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Recycle E-Waste.{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Earn Real Credits.
            </span>{' '}
            Restore the Planet.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Safely dispose of old phones, computers, batteries, and appliances with verified collectors.
            Accumulate reward credits into your ledger wallet and unlock store vouchers.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/submissions/new"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 text-base"
            >
              <Recycle className="w-5 h-5 text-slate-950" />
              Schedule a Pickup
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              to="/learn"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 transition-all hover:border-slate-600 text-base"
            >
              What Qualifies as E-Waste?
            </Link>
          </div>

          {/* Trust badges row */}
          <div className="mt-12 pt-8 border-t border-slate-800/60 max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-medium text-slate-400">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Certified Recyclers</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Truck className="w-4 h-4 text-cyan-400" />
              <span>Free Doorstep Pickup</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>Ledger-Backed Credits</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-400" />
              <span>Zero Landfill Pledge</span>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Counters Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl glass-panel p-8 sm:p-10 border border-emerald-500/20 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center mb-8">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
              Community Impact Metric
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Measurable Environmental Contribution
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                {platformStats.totalKgDiverted.toLocaleString()}
                <span className="text-emerald-400 text-lg ml-1">kg</span>
              </div>
              <p className="text-xs text-slate-400 mt-2 font-medium">E-Waste Diverted</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                {platformStats.co2SavedKg.toLocaleString()}
                <span className="text-teal-400 text-lg ml-1">kg</span>
              </div>
              <p className="text-xs text-slate-400 mt-2 font-medium">Approx. CO₂ Abated</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono">
                {platformStats.totalCreditsIssued.toLocaleString()}
                <span className="text-xs text-amber-300 ml-1">⚡ pts</span>
              </div>
              <p className="text-xs text-slate-400 mt-2 font-medium">Reward Credits Issued</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                {platformStats.totalSubmissions.toLocaleString()}
                <span className="text-indigo-400 text-lg ml-1">+</span>
              </div>
              <p className="text-xs text-slate-400 mt-2 font-medium">Verified Pickups</p>
            </div>

          </div>
        </div>
      </section>

      {/* How it Works (4 Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
            How VoltCycle Rewards Your Recycling
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            From your junk drawer to verified refinery recycling in four effortless stages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Step 1 */}
          <div className="glass-card rounded-2xl p-6 relative border border-slate-800 group hover:border-emerald-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 transition-transform">
              <Smartphone className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded">
              STEP 01
            </span>
            <h3 className="text-lg font-bold text-white mt-3 mb-2">Select & Photograph</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pick item categories (phones, laptops, cables) and upload clear device condition photos with safety checks.
            </p>
          </div>

          {/* Step 2 */}
          <div className="glass-card rounded-2xl p-6 relative border border-slate-800 group hover:border-cyan-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-110 transition-transform">
              <Truck className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded">
              STEP 02
            </span>
            <h3 className="text-lg font-bold text-white mt-3 mb-2">Doorstep Pickup</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pick your preferred pickup address and timing slot. An authorized collector arrives to inspect and collect.
            </p>
          </div>

          {/* Step 3 */}
          <div className="glass-card rounded-2xl p-6 relative border border-slate-800 group hover:border-amber-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded">
              STEP 03
            </span>
            <h3 className="text-lg font-bold text-white mt-3 mb-2">Grade & Verification</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Collector inspects functionality and weight. Grade multipliers (A: 1.5x, B: 1.0x, C: 0.5x) determine fair value.
            </p>
          </div>

          {/* Step 4 */}
          <div className="glass-card rounded-2xl p-6 relative border border-slate-800 group hover:border-indigo-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-5 group-hover:scale-110 transition-transform">
              <Gift className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded">
              STEP 04
            </span>
            <h3 className="text-lg font-bold text-white mt-3 mb-2">Instant Credits</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Credits post automatically into your append-only wallet. Redeem anytime for gift cards and partner offers.
            </p>
          </div>

        </div>
      </section>

      {/* Featured Offers & Vouchers Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
              Vouchers & Rewards
            </span>
            <h2 className="text-3xl font-bold text-white mt-1">Featured Partner Offers</h2>
            <p className="text-slate-400 text-sm mt-1">
              Redeem your verified recycling credits directly into digital coupons.
            </p>
          </div>
          <Link
            to="/offers"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-400 hover:text-emerald-300"
          >
            Explore all reward offers <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredOffers.map((offer) => (
            <div
              key={offer.id}
              className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between hover:border-emerald-500/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                    {offer.partner}
                  </span>
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-950/60 text-amber-400 text-xs font-bold border border-amber-500/30">
                    <Coins className="w-3.5 h-3.5" />
                    {offer.creditCost} credits
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{offer.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">{offer.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Stock: <strong className="text-slate-300">{offer.stock} left</strong>
                </span>
                <Link
                  to="/offers"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 transition-colors"
                >
                  Redeem
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to action card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 p-8 sm:p-14 border border-emerald-500/30 relative overflow-hidden text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-white max-w-2xl mx-auto">
            Ready to Clear Out Unused Gadgets & Earn Rewards?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Get 50 bonus credits on your first verified submission! Join thousands of conscious citizens today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-7 py-3 rounded-xl font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-lg shadow-emerald-500/20 hover:scale-105"
            >
              Sign Up in 30 Seconds
            </Link>
            <Link
              to="/learn"
              className="px-7 py-3 rounded-xl font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700 transition-all"
            >
              Read Acceptance Guidelines
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
