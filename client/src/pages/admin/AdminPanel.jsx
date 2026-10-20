import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  BarChart3, 
  Layers, 
  Gift, 
  Plus, 
  Edit2, 
  Trash2, 
  Users, 
  Coins, 
  Leaf, 
  Loader2,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';

const PIE_COLORS = ['#10b981', '#06b6d4', '#f59e0b', '#8b5cf6', '#ec4899', '#3b82f6'];

export default function AdminPanel() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'categories' | 'offers'
  
  const [adminStats, setAdminStats] = useState({
    totalUsers: 24,
    totalSubmissions: 68,
    totalCreditsIssued: 45200,
    totalCreditsRedeemed: 21500,
    totalKgDiverted: 820,
    categoryVolume: [
      { name: 'Phones', count: 42 },
      { name: 'Laptops', count: 28 },
      { name: 'Accessories', count: 65 },
      { name: 'Batteries', count: 80 },
      { name: 'Cables', count: 120 },
      { name: 'Appliances', count: 18 }
    ],
    creditsFlow: [
      { month: 'May', issued: 8200, redeemed: 3400 },
      { month: 'Jun', issued: 12400, redeemed: 5100 },
      { month: 'Jul', issued: 15600, redeemed: 7800 },
      { month: 'Aug', issued: 18900, redeemed: 9200 },
      { month: 'Sep', issued: 22400, redeemed: 11400 }
    ]
  });

  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);

  // New Category Modal / Form
  const [showCatModal, setShowCatModal] = useState(false);
  const [catForm, setCatForm] = useState({
    name: '',
    description: '',
    examples: '',
    baseRate: 50,
    unit: 'PER_ITEM',
    hazardous: false,
    co2PerKg: 5.0
  });

  // New Offer Modal / Form
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerForm, setOfferForm] = useState({
    partner: '',
    title: '',
    description: '',
    creditCost: 200,
    stock: 50
  });

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, catRes, offRes] = await Promise.allSettled([
        api.get('/stats/admin'),
        api.get('/categories'),
        api.get('/offers')
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value.success) {
        setAdminStats(prev => ({ ...prev, ...statsRes.value.data }));
      }
      if (catRes.status === 'fulfilled' && catRes.value.success) {
        setCategories(catRes.value.data);
      }
      if (offRes.status === 'fulfilled' && offRes.value.success) {
        setOffers(offRes.value.data);
      }
    } catch (err) {
      console.warn('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...catForm,
        baseRate: Number(catForm.baseRate),
        co2PerKg: Number(catForm.co2PerKg),
        examples: catForm.examples.split(',').map(s => s.trim()).filter(Boolean)
      };

      const res = await api.post('/categories', payload);
      if (res.success) {
        toast('Category added to platform', 'success');
        setShowCatModal(false);
        fetchAdminData();
      }
    } catch (err) {
      toast(err.error || 'Failed to create category', 'error');
    }
  };

  const handleCreateOffer = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...offerForm,
        creditCost: Number(offerForm.creditCost),
        stock: Number(offerForm.stock)
      };

      const res = await api.post('/offers', payload);
      if (res.success) {
        toast('Partner offer published successfully', 'success');
        setShowOfferModal(false);
        fetchAdminData();
      }
    } catch (err) {
      toast(err.error || 'Failed to create offer', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Platform Administrator Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            VoltCycle Management Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Configure rates, monitor recycling volume analytics, and manage reward vouchers.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'analytics'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            Analytics & KPIs
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'categories'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            Categories & Rates
          </button>
          <button
            onClick={() => setActiveTab('offers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'offers'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            Reward Offers
          </button>
        </div>
      </div>

      {/* TAB 1: Analytics */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          
          {/* Key Metric KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Recyclers</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono mt-1">
                {adminStats.totalUsers}
              </div>
              <span className="text-[11px] text-emerald-600 flex items-center gap-1 mt-1 font-medium">
                <TrendingUp className="w-3.5 h-3.5" /> +18% this month
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Diverted</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-600 font-mono mt-1">
                {adminStats.totalKgDiverted} kg
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Certified refiners</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Credits Issued</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono mt-1">
                {adminStats.totalCreditsIssued.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Ledger debits</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Credits Redeemed</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-mono mt-1">
                {adminStats.totalCreditsRedeemed.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {Math.round((adminStats.totalCreditsRedeemed / (adminStats.totalCreditsIssued || 1)) * 100)}% redemption rate
              </span>
            </div>
          </div>

          {/* Recharts Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Category Volume Chart */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base">E-Waste Volume by Item Category</h3>
              <p className="text-xs text-slate-500">Total units processed across verified collector pickups</p>

              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={adminStats.categoryVolume || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Credits Flow Chart */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Credits Issued vs. Redeemed</h3>
              <p className="text-xs text-slate-500">Monthly reward velocity and voucher redemption burn</p>

              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={adminStats.creditsFlow || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="issued" name="Credits Issued" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="redeemed" name="Credits Redeemed" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: Categories & Rates */}
      {activeTab === 'categories' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">E-Waste Categories & Base Rates</h2>
              <p className="text-xs text-slate-500">Dynamic credit calculation baseline read directly from database</p>
            </div>
            <button
              onClick={() => setShowCatModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Base Rate</th>
                  <th className="py-3 px-3">Unit</th>
                  <th className="py-3 px-3">Hazardous?</th>
                  <th className="py-3 px-3">CO₂ / kg</th>
                  <th className="py-3 px-3">Examples</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-3 font-semibold text-slate-900">{c.name}</td>
                    <td className="py-3 px-3 font-mono text-emerald-600 font-bold">{c.baseRate}</td>
                    <td className="py-3 px-3 font-mono text-slate-500">{c.unit}</td>
                    <td className="py-3 px-3">
                      {c.hazardous ? (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                          Hazardous
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                          Standard
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono text-teal-600">{c.co2PerKg} kg</td>
                    <td className="py-3 px-3 text-slate-500 text-[11px] max-w-xs truncate">
                      {c.examples?.join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Offers */}
      {activeTab === 'offers' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Partner Reward Offers</h2>
              <p className="text-xs text-slate-500">Shopping discounts and vouchers redeemable by citizens</p>
            </div>
            <button
              onClick={() => setShowOfferModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Reward Offer
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {offers.map((off) => (
              <div key={off.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                    {off.partner}
                  </span>
                  <span className="text-xs font-bold text-amber-600 font-mono">
                    {off.creditCost} credits
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{off.title}</h4>
                <p className="text-xs text-slate-600">{off.description}</p>
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <span>Stock: {off.stock} available</span>
                  <span className="text-emerald-700 font-semibold">Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Category Modal */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <form onSubmit={handleCreateCategory} className="max-w-md w-full bg-white p-6 rounded-3xl border border-slate-200 shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Add New E-Waste Category</h3>
            
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Name</label>
              <input
                type="text"
                required
                value={catForm.name}
                onChange={e => setCatForm({ ...catForm, name: e.target.value })}
                placeholder="e.g. Solar Inverters"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
              <input
                type="text"
                required
                value={catForm.description}
                onChange={e => setCatForm({ ...catForm, description: e.target.value })}
                placeholder="Brief description"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 shadow-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Base Rate (credits)</label>
                <input
                  type="number"
                  required
                  value={catForm.baseRate}
                  onChange={e => setCatForm({ ...catForm, baseRate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Unit</label>
                <select
                  value={catForm.unit}
                  onChange={e => setCatForm({ ...catForm, unit: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 shadow-xs"
                >
                  <option value="PER_ITEM">PER_ITEM</option>
                  <option value="PER_KG">PER_KG</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Examples (comma-separated)</label>
              <input
                type="text"
                value={catForm.examples}
                onChange={e => setCatForm({ ...catForm, examples: e.target.value })}
                placeholder="Inverter, MPPT, Charge Controller"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 shadow-xs"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="haz"
                checked={catForm.hazardous}
                onChange={e => setCatForm({ ...catForm, hazardous: e.target.checked })}
                className="rounded text-rose-600 bg-white border-slate-300"
              />
              <label htmlFor="haz" className="text-xs text-slate-700">Hazardous handling required</label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowCatModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-sm"
              >
                Save Category
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Create Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <form onSubmit={handleCreateOffer} className="max-w-md w-full bg-white p-6 rounded-3xl border border-slate-200 shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Add Partner Reward Offer</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Partner Brand</label>
              <input
                type="text"
                required
                value={offerForm.partner}
                onChange={e => setOfferForm({ ...offerForm, partner: e.target.value })}
                placeholder="e.g. Croma, Uber Green, Flipkart"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Offer Title</label>
              <input
                type="text"
                required
                value={offerForm.title}
                onChange={e => setOfferForm({ ...offerForm, title: e.target.value })}
                placeholder="e.g. 20% Off EV Rides"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                rows="2"
                required
                value={offerForm.description}
                onChange={e => setOfferForm({ ...offerForm, description: e.target.value })}
                placeholder="Terms and details"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 shadow-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Credit Cost</label>
                <input
                  type="number"
                  required
                  value={offerForm.creditCost}
                  onChange={e => setOfferForm({ ...offerForm, creditCost: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Stock</label>
                <input
                  type="number"
                  required
                  value={offerForm.stock}
                  onChange={e => setOfferForm({ ...offerForm, stock: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 shadow-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowOfferModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-sm"
              >
                Publish Offer
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
