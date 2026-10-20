import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  Gift, 
  Coins, 
  CheckCircle2, 
  Copy, 
  Clock, 
  Tag, 
  ExternalLink, 
  Sparkles, 
  Loader2,
  X
} from 'lucide-react';
import api from '../api/axios';

const DEFAULT_OFFERS = [
  {
    id: 'off-1',
    partner: 'Amazon EcoPay',
    title: '₹500 Shopping Voucher',
    description: 'Valid for electronics, green energy devices, books, and home accessories.',
    creditCost: 500,
    stock: 40,
    active: true
  },
  {
    id: 'off-2',
    partner: 'Croma Retail',
    title: '15% Off Refurbished Tech',
    description: 'Get extra discounts on Grade-A certified laptops, smartphones, and accessories.',
    creditCost: 350,
    stock: 25,
    active: true
  },
  {
    id: 'off-3',
    partner: 'Starbucks Green Cup',
    title: 'Complimentary Beverage Voucher',
    description: 'Redeem any handcrafted tall beverage at participating outlets nationwide.',
    creditCost: 180,
    stock: 90,
    active: true
  },
  {
    id: 'off-4',
    partner: 'Plant a Tree Foundation',
    title: 'Adopt a Native Urban Tree',
    description: 'Convert your recycling credits into an actual geotagged tree planted in urban greenbelts.',
    creditCost: 100,
    stock: 500,
    active: true
  }
];

export default function Offers() {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const { toast } = useToast();

  const [offers, setOffers] = useState(DEFAULT_OFFERS);
  const [balance, setBalance] = useState(0);
  const [myRedemptions, setMyRedemptions] = useState([]);
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'coupons'
  const [loading, setLoading] = useState(true);
  const [redeemingId, setRedeemingId] = useState(null);

  // Success Modal
  const [issuedCoupon, setIssuedCoupon] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [offersRes, walletRes, redempRes] = await Promise.allSettled([
        api.get('/offers'),
        api.get('/wallet'),
        api.get('/redemptions/mine')
      ]);

      if (offersRes.status === 'fulfilled' && offersRes.value.success) {
        setOffers(offersRes.value.data);
      }
      if (walletRes.status === 'fulfilled' && walletRes.value.success) {
        setBalance(walletRes.value.data.balance || 0);
      }
      if (redempRes.status === 'fulfilled' && redempRes.value.success) {
        setMyRedemptions(redempRes.value.data || []);
      }
    } catch (err) {
      console.warn('Offers fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAuthenticated]);

  const handleRedeem = async (offer) => {
    if (!isAuthenticated) {
      toast('Please sign in to redeem rewards', 'error');
      return;
    }

    if (balance < offer.creditCost) {
      toast(`Insufficient credits. You need ${offer.creditCost - balance} more credits.`, 'error');
      return;
    }

    try {
      setRedeemingId(offer.id);
      const res = await api.post(`/offers/${offer.id}/redeem`);
      if (res.success && res.data) {
        setIssuedCoupon(res.data);
        toast(`Successfully redeemed ${offer.title}!`, 'success');
        fetchData();
        refreshUser();
      }
    } catch (err) {
      toast(err.error || 'Failed to redeem offer', 'error');
    } finally {
      setRedeemingId(null);
    }
  };

  const copyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    toast(`Copied code: ${code}!`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      
      {/* Header & Balance Chip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Reward Vouchers & Offers
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Redeem your e-waste recycling credits for shopping discounts, gift cards, and eco initiatives.
          </p>
        </div>

        {isAuthenticated && (
          <div className="flex items-center gap-2 p-2.5 px-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
            <Coins className="w-5 h-5 text-amber-500" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Your Balance</span>
              <span className="text-base font-bold text-slate-900 font-mono">{balance.toLocaleString()} credits</span>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('browse')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'browse'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Browse All Offers ({offers.length})
        </button>

        {isAuthenticated && (
          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'coupons'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Issued Coupons ({myRedemptions.length})
          </button>
        )}
      </div>

      {/* Tab 1: Browse Offers */}
      {activeTab === 'browse' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => {
            const canAfford = balance >= offer.creditCost;

            return (
              <div
                key={offer.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-emerald-500/50 hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {offer.partner}
                    </span>
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                      <Coins className="w-3.5 h-3.5" />
                      {offer.creditCost} credits
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">{offer.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">{offer.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Stock: <strong className="text-slate-700">{offer.stock} available</strong>
                  </span>

                  <button
                    onClick={() => handleRedeem(offer)}
                    disabled={redeemingId === offer.id || (isAuthenticated && !canAfford) || offer.stock <= 0}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      canAfford && offer.stock > 0
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm active:scale-95'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                    }`}
                  >
                    {redeemingId === offer.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Gift className="w-3.5 h-3.5" />
                    )}
                    {offer.stock <= 0
                      ? 'Out of Stock'
                      : !isAuthenticated
                      ? 'Sign In to Redeem'
                      : canAfford
                      ? 'Redeem Voucher'
                      : 'Need More Credits'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: My Issued Coupons */}
      {activeTab === 'coupons' && (
        <div className="space-y-4">
          {myRedemptions.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
              <Gift className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No coupons redeemed yet</p>
              <p className="text-xs text-slate-500 mt-1">Browse active offers and redeem with your credits.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myRedemptions.map((redemption) => (
                <div
                  key={redemption.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider block">
                      {redemption.offer?.partner || 'VoltCycle Partner'}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {redemption.offer?.title || 'Voucher'}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Redeemed on {new Date(redemption.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-right space-y-2">
                    <div className="p-2 px-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-700 tracking-wider">
                        {redemption.couponCode}
                      </span>
                      <button
                        onClick={() => copyCoupon(redemption.couponCode)}
                        className="text-slate-400 hover:text-slate-800"
                        title="Copy Code"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold inline-block">
                      {redemption.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Redemption Success Modal */}
      {issuedCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-6 text-center relative">
            <button
              onClick={() => setIssuedCoupon(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                Redemption Successful
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">Here is Your Coupon Code!</h2>
              <p className="text-xs text-slate-600 mt-2">
                Use this unique voucher code at checkout with our retail partner.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-emerald-200 flex items-center justify-between">
              <span className="font-mono text-lg font-bold text-emerald-700 tracking-widest">
                {issuedCoupon.couponCode}
              </span>
              <button
                onClick={() => copyCoupon(issuedCoupon.couponCode)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 shadow-sm"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy
              </button>
            </div>

            <button
              onClick={() => {
                setIssuedCoupon(null);
                setActiveTab('coupons');
              }}
              className="w-full py-2.5 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 text-xs border border-slate-200"
            >
              View in My Coupons
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
