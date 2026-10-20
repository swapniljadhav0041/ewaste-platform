import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  Coins, 
  Leaf, 
  Layers, 
  PlusCircle, 
  Gift, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Share2,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import api from '../api/axios';

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [wallet, setWallet] = useState({
    balance: 0,
    recentTransactions: [],
  });

  const [stats, setStats] = useState({
    totalItems: 0,
    totalKg: 0,
    creditsEarned: 0,
    co2SavedKg: 0,
  });

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [walletRes, statsRes, subRes] = await Promise.allSettled([
          api.get('/wallet'),
          api.get('/stats/me'),
          api.get('/submissions/mine'),
        ]);

        if (walletRes.status === 'fulfilled' && walletRes.value.success) {
          setWallet(walletRes.value.data);
        }

        if (statsRes.status === 'fulfilled' && statsRes.value.success) {
          setStats(statsRes.value.data);
        }

        if (subRes.status === 'fulfilled' && subRes.value.success) {
          setSubmissions(subRes.value.data);
        }
      } catch (err) {
        console.warn('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const copyReferralCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      toast(`Copied referral code: ${user.referralCode}!`, 'success');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'VERIFIED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Verified</span>;
      case 'COLLECTED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">Collected</span>;
      case 'SCHEDULED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">Scheduled</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">Rejected</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">Requested</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Recycler Portal Active
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Welcome back, {user?.name || 'Recycler'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Track your live ledger balance, recent pickups, and ecological offset.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/submissions/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20 transition-all hover:scale-105 text-sm"
          >
            <PlusCircle className="w-4 h-4" />
            New Submission
          </Link>
          <Link
            to="/offers"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors text-sm shadow-sm"
          >
            <Gift className="w-4 h-4 text-amber-500" />
            Redeem Offers
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Wallet Balance Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Available Credits
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono">
            {wallet.balance.toLocaleString()}
            <span className="text-emerald-600 text-sm ml-1.5 font-sans font-bold">credits</span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <Link to="/wallet" className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1">
              View Ledger <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-slate-400">Append-Only</span>
          </div>
        </div>

        {/* Total Earned */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Lifetime Earned
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono">
            {stats.creditsEarned.toLocaleString()}
            <span className="text-amber-600 text-sm ml-1.5 font-sans font-bold">pts</span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
            Across verified recycle submissions
          </div>
        </div>

        {/* CO2 Offset */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              CO₂ Avoided
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-200">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-teal-600 font-mono">
            {stats.co2SavedKg.toFixed(1)}
            <span className="text-slate-600 text-sm ml-1.5 font-sans font-bold">kg</span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
            Diverted metals & reduced mining
          </div>
        </div>

        {/* Items Diverted */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Processed
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono">
            {stats.totalItems}
            <span className="text-indigo-600 text-sm ml-1.5 font-sans font-bold">gadgets</span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
            Weight: {stats.totalKg.toFixed(1)} kg total
          </div>
        </div>

      </div>

      {/* Main Grid: Submissions & Referral */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Latest Submissions (2 cols) */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recent E-Waste Submissions</h2>
              <p className="text-xs text-slate-500">Track verification status and collector assignment</p>
            </div>
            <Link
              to="/submissions"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              View all ({submissions.length}) <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {submissions.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50/50">
              <Layers className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700">No submissions recorded yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Clean your closets of old phones, cables, or obsolete tech and earn your first 50 bonus credits!
              </p>
              <Link
                to="/submissions/new"
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Schedule First Pickup
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.slice(0, 4).map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-slate-700">
                        #{sub.id.slice(0, 8)}
                      </span>
                      {getStatusBadge(sub.status)}
                    </div>
                    <p className="text-xs text-slate-600">
                      Address: {sub.pickupAddress}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {sub.items?.length || 0} item(s) • Created {new Date(sub.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-0 border-slate-200 pt-2 sm:pt-0">
                    <div className="text-sm font-bold text-emerald-600 font-mono">
                      +{sub.totalCredits} credits
                    </div>
                    <span className="text-[11px] text-slate-500">
                      {sub.status === 'VERIFIED' ? 'Credited to wallet' : 'Pending inspection'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column: Referral & Quick Links */}
        <div className="space-y-6">
          
          {/* Referral Card */}
          <div className="bg-emerald-50/60 p-6 rounded-3xl border border-emerald-200 shadow-sm relative overflow-hidden space-y-4">
            <div className="flex items-center gap-2 text-emerald-700">
              <Share2 className="w-5 h-5" />
              <h3 className="font-bold text-slate-900 text-base">Invite Friends & Earn</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Share your referral code. Both you and your friend receive <strong className="text-emerald-700 font-semibold">+25 reward credits</strong> when they complete their first verified submission!
            </p>

            <div className="p-3 rounded-xl bg-white border border-emerald-200 flex items-center justify-between shadow-xs">
              <span className="font-mono text-sm font-bold text-emerald-700 tracking-wider">
                {user?.referralCode || 'VOLT-SHARE'}
              </span>
              <button
                onClick={copyReferralCode}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                title="Copy Code"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Safety Reminder */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3 text-xs text-slate-600">
            <div className="flex items-center gap-2 text-amber-600 font-bold">
              <AlertCircle className="w-4 h-4" />
              Handoff Reminder
            </div>
            <p className="leading-relaxed">
              Please ensure all phones and laptops are wiped of personal data prior to collector arrival. Never attempt to puncture swollen batteries.
            </p>
            <Link to="/learn#safety" className="text-emerald-600 hover:text-emerald-700 font-semibold block pt-1">
              Read preparation checklist →
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
