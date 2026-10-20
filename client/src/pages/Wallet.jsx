import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wallet as WalletIcon, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Gift, 
  PlusCircle, 
  Filter, 
  Clock, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import api from '../api/axios';

export default function Wallet() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        setLoading(true);
        const res = await api.get('/wallet');
        if (res.success && res.data) {
          setBalance(res.data.balance || 0);
          setTransactions(res.data.recentTransactions || []);
        }
      } catch (err) {
        console.warn('Failed to load wallet:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, []);

  const filteredTx = transactions.filter(tx => {
    if (filter === 'ALL') return true;
    return tx.type === filter;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      
      {/* Wallet Balance Hero Header */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Immutable Append-Only Ledger
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            VoltCycle Credit Balance
          </h1>
          <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 font-mono tracking-tight pt-2">
            {balance.toLocaleString()}{' '}
            <span className="text-emerald-600 text-lg font-sans font-bold">credits</span>
          </div>
          <p className="text-xs text-slate-500">
            Every transaction is cryptographically accounted for. Balance is never directly modified.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/offers"
            className="px-5 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm text-xs sm:text-sm flex items-center gap-2"
          >
            <Gift className="w-4 h-4" />
            Redeem on Offers
          </Link>
          <Link
            to="/submissions/new"
            className="px-5 py-3 rounded-xl font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-xs text-xs sm:text-sm flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            Earn More Credits
          </Link>
        </div>
      </div>

      {/* Ledger History Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Transaction History</h2>
            <p className="text-xs text-slate-500">Audit trail of all reward additions and redemptions</p>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
            {['ALL', 'EARN', 'REDEEM', 'BONUS'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filter === f
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions Table */}
        {filteredTx.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50/50">
            <Clock className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">No transactions recorded</p>
            <p className="text-xs text-slate-500 mt-1">
              Complete an e-waste pickup to earn credits or use your referral code.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Description / Note</th>
                  <th className="py-3 px-3">Reference</th>
                  <th className="py-3 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTx.map((tx) => {
                  const isPositive = tx.amount > 0;
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            tx.type === 'EARN'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : tx.type === 'BONUS'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : tx.type === 'REDEEM'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-900 font-medium">
                        {tx.note || 'Ledger adjustment'}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-400 text-[11px]">
                        {tx.refId ? tx.refId.slice(0, 8) : '—'}
                      </td>
                      <td className={`py-3 px-3 text-right font-mono font-bold text-sm ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isPositive ? `+${tx.amount}` : tx.amount}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
