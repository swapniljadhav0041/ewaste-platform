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
    api.get('/stats/platform')
      .then(res => {
        if (res.success && res.data) {
          setPlatformStats(prev => ({ ...prev, ...res.data }));
        }
      })
      .catch(() => {});

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
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-200/40 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[250px] bg-teal-100/50 rounded-full blur-[90px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>Turn Old Electronics into Verified Circular Rewards</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.1]">
            Recycle E-Waste.{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Earn Real Credits.
            </span>{' '}
            Restore the Planet.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Safely dispose of old phones, computers, batteries, and appliances with verified collectors.
            Accumulate reward credits into your ledger wallet and unlock store vouchers.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/submissions/new"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/25 transition-all hover:scale-105 active:scale-95 text-base"
            >
              <Recycle className="w-5 h-5 text-white" />
              Schedule a Pickup
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              to="/learn"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all hover:border-slate-300 text-base"
            >
              What Qualifies as E-Waste?
            </Link>
          </div>

          {/* Trust badges row */}
          <div className="mt-12 pt-8 border-t border-slate-200 max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-medium text-slate-600">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Certified Recyclers</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Truck className="w-4 h-4 text-cyan-600" />
              <span>Free Doorstep Pickup</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Coins className="w-4 h-4 text-amber-500" />
              <span>Ledger-Backed Credits</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>Zero Landfill Pledge</span>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Counters Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white p-8 sm:p-10 border border-slate-200 shadow-xl relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center mb-8">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-700">
              Community Impact Metric
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Measurable Environmental Contribution
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono">
                {platformStats.totalKgDiverted.toLocaleString()}
                <span className="text-emerald-600 text-lg ml-1">kg</span>
              </div>
              <p className="text-xs text-slate-500 mt-2 font-medium">E-Waste Diverted</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono">
                {platformStats.co2SavedKg.toLocaleString()}
                <span className="text-teal-600 text-lg ml-1">kg</span>
              </div>
              <p className="text-xs text-slate-500 mt-2 font-medium">Approx. CO₂ Abated</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-600 font-mono">
                {platformStats.totalCreditsIssued.toLocaleString()}
                <span className="text-xs text-amber-500 ml-1">⚡ pts</span>
              </div>
              <p className="text-xs text-slate-500 mt-2 font-medium">Reward Credits Issued</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono">
                {platformStats.totalSubmissions.toLocaleString()}
                <span className="text-indigo-600 text-lg ml-1">+</span>
              </div>
              <p className="text-xs text-slate-500 mt-2 font-medium">Verified Pickups</p>
            </div>

          </div>
        </div>
      </section>

      {/* How it Works (4 Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase font-bold tracking-widest text-emerald-700">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
            How VoltCycle Rewards Your Recycling
          </h2>
          <p className="text-slate-600 text-sm mt-3">
            From your junk drawer to verified refinery recycling in four effortless stages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 relative border border-slate-200 shadow-sm group hover:border-emerald-500 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-5 group-hover:scale-110 transition-transform">
              <Smartphone className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              STEP 01
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-3 mb-2">Select & Photograph</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pick item categories (phones, laptops, cables) and upload clear device condition photos with safety checks.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 relative border border-slate-200 shadow-sm group hover:border-cyan-500 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 mb-5 group-hover:scale-110 transition-transform">
              <Truck className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
              STEP 02
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-3 mb-2">Doorstep Pickup</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pick your preferred pickup address and timing slot. An authorized collector arrives to inspect and collect.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 relative border border-slate-200 shadow-sm group hover:border-amber-500 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-5 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              STEP 03
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-3 mb-2">Grade & Verification</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Collector inspects functionality and weight. Grade multipliers (A: 1.5x, B: 1.0x, C: 0.5x) determine fair value.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl p-6 relative border border-slate-200 shadow-sm group hover:border-indigo-500 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-5 group-hover:scale-110 transition-transform">
              <Gift className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              STEP 04
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-3 mb-2">Instant Credits</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Credits post automatically into your append-only wallet. Redeem anytime for gift cards and partner offers.
            </p>
          </div>

        </div>
      </section>

      {/* Featured Offers & Vouchers Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-700">
              Vouchers & Rewards
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mt-1">Featured Partner Offers</h2>
            <p className="text-slate-500 text-sm mt-1">
              Redeem your verified recycling credits directly into digital coupons.
            </p>
          </div>
          <Link
            to="/offers"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-500"
          >
            Explore all reward offers <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredOffers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-emerald-400 hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                    {offer.partner}
                  </span>
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                    <Coins className="w-3.5 h-3.5 text-amber-500" />
                    {offer.creditCost} credits
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">{offer.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">{offer.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Stock: <strong className="text-slate-700">{offer.stock} left</strong>
                </span>
                <Link
                  to="/offers"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-sm"
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
        <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-8 sm:p-14 text-white text-center space-y-6 shadow-xl shadow-emerald-700/10">
          <h2 className="text-3xl sm:text-4xl font-bold max-w-2xl mx-auto">
            Ready to Clear Out Unused Gadgets & Earn Rewards?
          </h2>
          <p className="text-emerald-50 text-sm max-w-xl mx-auto">
            Get 50 bonus credits on your first verified submission! Join thousands of conscious citizens today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-7 py-3 rounded-xl font-bold text-emerald-950 bg-white hover:bg-emerald-50 transition-all shadow-md hover:scale-105"
            >
              Sign Up in 30 Seconds
            </Link>
            <Link
              to="/learn"
              className="px-7 py-3 rounded-xl font-semibold text-white bg-emerald-700/80 hover:bg-emerald-800 transition-all border border-emerald-500/50"
            >
              Read Acceptance Guidelines
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
