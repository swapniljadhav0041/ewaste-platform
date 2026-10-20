import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { 
  Layers, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  Calendar, 
  ChevronRight, 
  AlertCircle, 
  PlusCircle,
  Truck,
  ShieldCheck,
  Ban
} from 'lucide-react';
import api from '../api/axios';

const STATUS_STEPS = ['REQUESTED', 'SCHEDULED', 'COLLECTED', 'VERIFIED'];

export default function MySubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSubmissions = async () => {
    try {
      setLoading(false);
      const res = await api.get('/submissions/mine');
      if (res.success && res.data) {
        setSubmissions(res.data);
      }
    } catch (err) {
      console.warn('Failed to load user submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this pickup request?')) {
      return;
    }

    try {
      const res = await api.patch(`/submissions/${id}/cancel`);
      if (res.success) {
        toast('Pickup request cancelled', 'info');
        fetchSubmissions();
      }
    } catch (err) {
      toast(err.error || 'Cannot cancel request', 'error');
    }
  };

  const getStepIndex = (status) => {
    return STATUS_STEPS.indexOf(status);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            My E-Waste Submissions
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Track pickup timelines, collector inspections, and awarded credits.
          </p>
        </div>

        <Link
          to="/submissions/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm text-sm"
        >
          <PlusCircle className="w-4 h-4" />
          Schedule Another Pickup
        </Link>
      </div>

      {submissions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-4 shadow-sm">
          <Layers className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No Pickups Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't scheduled any e-waste recycling pickups yet. Earn bonus credits on your first submission!
          </p>
          <Link
            to="/submissions/new"
            className="inline-block px-5 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 text-xs shadow-sm"
          >
            Create First Submission
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {submissions.map((sub) => {
            const currentStepIdx = getStepIndex(sub.status);
            const isTerminal = sub.status === 'REJECTED' || sub.status === 'CANCELLED';

            return (
              <div
                key={sub.id}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6"
              >
                {/* Submission Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-sm text-slate-900">
                        REF #{sub.id.slice(0, 8).toUpperCase()}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Created {new Date(sub.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{sub.pickupAddress}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Credits</span>
                      <div className="text-lg font-mono font-bold text-emerald-600">
                        +{sub.totalCredits} credits
                      </div>
                    </div>

                    {sub.status === 'REQUESTED' && (
                      <button
                        onClick={() => handleCancel(sub.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* Status Timeline */}
                {!isTerminal ? (
                  <div className="py-2">
                    <div className="grid grid-cols-4 gap-2 relative">
                      {STATUS_STEPS.map((stepName, sIdx) => {
                        const isDone = sIdx <= currentStepIdx;
                        const isCurrent = sIdx === currentStepIdx;

                        return (
                          <div key={stepName} className="text-center space-y-2">
                            <div
                              className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                                isDone
                                  ? 'bg-emerald-600 text-white shadow-sm'
                                  : 'bg-slate-100 text-slate-400 border border-slate-200'
                              }`}
                            >
                              {sIdx + 1}
                            </div>
                            <span
                              className={`text-[11px] block font-semibold ${
                                isCurrent
                                  ? 'text-emerald-700'
                                  : isDone
                                  ? 'text-slate-700'
                                  : 'text-slate-400'
                              }`}
                            >
                              {stepName}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    This submission was {sub.status.toLowerCase()}. {sub.notes && `Note: ${sub.notes}`}
                  </div>
                )}

                {/* Items breakdown list */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <h4 className="text-[11px] uppercase font-bold text-slate-500">
                    Inspected Items ({sub.items?.length || 0})
                  </h4>
                  <div className="divide-y divide-slate-200 text-xs">
                    {sub.items?.map((item, iIdx) => (
                      <div key={iIdx} className="py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {item.photoUrls?.[0] && (
                            <img
                              src={item.photoUrls[0]}
                              alt="Item"
                              className="w-10 h-10 rounded-lg object-cover border border-slate-200 shadow-xs"
                            />
                          )}
                          <div>
                            <span className="font-semibold text-slate-900">Item #{iIdx + 1}</span>
                            <p className="text-[11px] text-slate-500">
                              {item.weightKg ? `${item.weightKg} kg` : `Qty: ${item.quantity}`}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          {item.grade ? (
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                              Grade {item.grade}
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400">Pending grade</span>
                          )}
                          <div className="text-xs font-mono font-bold text-slate-800 mt-1">
                            {item.credits} pts
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
