import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  Truck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Loader2, 
  Scale, 
  Award,
  AlertTriangle
} from 'lucide-react';
import api from '../../api/axios';

export default function CollectorPanel() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [submissions, setSubmissions] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Verification modal state
  const [verifyingSub, setVerifyingSub] = useState(null);
  const [itemGrades, setItemGrades] = useState({}); // { itemId: { grade, weightKg } }
  const [submittingVerification, setSubmittingVerification] = useState(false);

  const fetchPickups = async () => {
    try {
      setLoading(true);
      const url = filterStatus === 'ALL' ? '/submissions' : `/submissions?status=${filterStatus}`;
      const res = await api.get(url);
      if (res.success && res.data) {
        setSubmissions(res.data);
      }
    } catch (err) {
      console.warn('Failed to fetch pickups:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPickups();
  }, [filterStatus]);

  const handleSchedule = async (id) => {
    try {
      const res = await api.patch(`/submissions/${id}/schedule`, {
        pickupSlot: new Date(Date.now() + 86400000).toISOString()
      });
      if (res.success) {
        toast('Pickup assigned and scheduled!', 'success');
        fetchPickups();
      }
    } catch (err) {
      toast(err.error || 'Failed to schedule pickup', 'error');
    }
  };

  const handleCollect = async (id) => {
    try {
      const res = await api.patch(`/submissions/${id}/collect`);
      if (res.success) {
        toast('Marked as collected from citizen!', 'success');
        fetchPickups();
      }
    } catch (err) {
      toast(err.error || 'Failed to mark as collected', 'error');
    }
  };

  const openVerifyModal = (sub) => {
    setVerifyingSub(sub);
    const initialGrades = {};
    sub.items?.forEach(item => {
      initialGrades[item.id] = {
        grade: 'B',
        weightKg: item.weightKg || (item.quantity * 0.5) || 1
      };
    });
    setItemGrades(initialGrades);
  };

  const handleVerifySubmit = async () => {
    if (!verifyingSub) return;

    try {
      setSubmittingVerification(true);
      const itemsPayload = Object.keys(itemGrades).map(itemId => ({
        itemId,
        grade: itemGrades[itemId].grade,
        weightKg: Number(itemGrades[itemId].weightKg) || 1
      }));

      const res = await api.post(`/submissions/${verifyingSub.id}/verify`, {
        items: itemsPayload
      });

      if (res.success) {
        toast(`Submission verified! ${res.data.creditsAwarded || 0} credits posted to citizen wallet.`, 'success');
        setVerifyingSub(null);
        fetchPickups();
      }
    } catch (err) {
      toast(err.error || 'Verification failed', 'error');
    } finally {
      setSubmittingVerification(false);
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Reason for rejecting pickup submission:');
    if (!reason) return;

    try {
      const res = await api.post(`/submissions/${id}/reject`, { reason });
      if (res.success) {
        toast('Submission marked as rejected', 'info');
        fetchPickups();
      }
    } catch (err) {
      toast(err.error || 'Failed to reject submission', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 mb-2">
            <Truck className="w-3.5 h-3.5 text-amber-600" />
            Authorized Collector Terminal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            E-Waste Pickups & Inspection
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Assign pickup routes, inspect physical device condition, and verify reward credits.
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['ALL', 'REQUESTED', 'SCHEDULED', 'COLLECTED', 'VERIFIED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === status
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions List */}
      {submissions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-3 shadow-sm">
          <Truck className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No Assigned Pickups</h3>
          <p className="text-xs text-slate-500">
            No submissions found under status filter "{filterStatus}".
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-700">
                    #{sub.id.slice(0, 8).toUpperCase()}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      sub.status === 'VERIFIED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : sub.status === 'COLLECTED'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : sub.status === 'SCHEDULED'
                        ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {sub.status}
                  </span>
                  <span className="text-xs text-slate-500">
                    User: {sub.user?.name || 'Citizen'} ({sub.user?.phone || 'No phone'})
                  </span>
                </div>

                <div className="flex items-start gap-1.5 text-xs text-slate-700">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{sub.pickupAddress}</span>
                </div>

                <div className="text-xs text-slate-500">
                  Items: <strong className="text-slate-800">{sub.items?.length || 0}</strong>{' '}
                  {sub.pickupSlot && `• Scheduled: ${new Date(sub.pickupSlot).toLocaleString()}`}
                  {sub.notes && ` • Notes: "${sub.notes}"`}
                </div>
              </div>

              {/* Action Buttons by Status */}
              <div className="flex flex-wrap items-center gap-2">
                {sub.status === 'REQUESTED' && (
                  <button
                    onClick={() => handleSchedule(sub.id)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Accept & Schedule
                  </button>
                )}

                {sub.status === 'SCHEDULED' && (
                  <button
                    onClick={() => handleCollect(sub.id)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    Confirm Collected
                  </button>
                )}

                {sub.status === 'COLLECTED' && (
                  <button
                    onClick={() => openVerifyModal(sub)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Inspect & Verify Credits
                  </button>
                )}

                {sub.status !== 'VERIFIED' && sub.status !== 'REJECTED' && (
                  <button
                    onClick={() => handleReject(sub.id)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors"
                  >
                    Reject
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Verification & Grading Modal */}
      {verifyingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-2xl w-full bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Item Grading & Weight Inspection</h3>
                <p className="text-xs text-slate-500">
                  Submission #{verifyingSub.id.slice(0, 8)} • Citizen: {verifyingSub.user?.name}
                </p>
              </div>
              <button
                onClick={() => setVerifyingSub(null)}
                className="text-slate-400 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
              {verifyingSub.items?.map((item, idx) => (
                <div key={item.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">Item #{idx + 1}</span>
                    <span className="text-[11px] text-slate-500">
                      Declared: {item.quantity} units / {item.weightKg || '—'} kg
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Condition Grade
                      </label>
                      <select
                        value={itemGrades[item.id]?.grade || 'B'}
                        onChange={(e) => {
                          setItemGrades({
                            ...itemGrades,
                            [item.id]: {
                              ...itemGrades[item.id],
                              grade: e.target.value
                            }
                          });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 shadow-xs"
                      >
                        <option value="A">Grade A (Working / Reusable - 1.5x)</option>
                        <option value="B">Grade B (Repairable - 1.0x)</option>
                        <option value="C">Grade C (Scrap Only - 0.5x)</option>
                        <option value="REJECTED">REJECTED (Unsafe/Not Accepted - 0x)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Verified Weight (kg)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={itemGrades[item.id]?.weightKg || 1}
                        onChange={(e) => {
                          setItemGrades({
                            ...itemGrades,
                            [item.id]: {
                              ...itemGrades[item.id],
                              weightKg: e.target.value
                            }
                          });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 shadow-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setVerifyingSub(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifySubmit}
                disabled={submittingVerification}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 shadow-sm"
              >
                {submittingVerification && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Approve & Post Ledger Credits
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
