import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { 
  Plus, 
  Trash2, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  ArrowLeft, 
  Loader2,
  ShieldAlert,
  Coins
} from 'lucide-react';
import api from '../api/axios';

const DEFAULT_CATEGORIES = [
  { id: 'cat-1', name: 'Mobile Phones & Tablets', baseRate: 120, unit: 'PER_ITEM', hazardous: true },
  { id: 'cat-2', name: 'Computers & Laptops', baseRate: 300, unit: 'PER_ITEM', hazardous: false },
  { id: 'cat-3', name: 'Computer Accessories', baseRate: 30, unit: 'PER_ITEM', hazardous: false },
  { id: 'cat-4', name: 'Batteries & Power Banks', baseRate: 20, unit: 'PER_ITEM', hazardous: true },
  { id: 'cat-5', name: 'Chargers & Cables', baseRate: 10, unit: 'PER_ITEM', hazardous: false },
  { id: 'cat-6', name: 'Audio & Wearables', baseRate: 50, unit: 'PER_ITEM', hazardous: false },
  { id: 'cat-7', name: 'Small Home Appliances', baseRate: 40, unit: 'PER_ITEM', hazardous: false },
  { id: 'cat-8', name: 'Large Appliances', baseRate: 250, unit: 'PER_ITEM', hazardous: true },
  { id: 'cat-9', name: 'Circuit Boards & Components', baseRate: 80, unit: 'PER_KG', hazardous: false },
  { id: 'cat-10', name: 'Gaming & Entertainment', baseRate: 60, unit: 'PER_ITEM', hazardous: false }
];

export default function NewSubmission() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form state
  const [items, setItems] = useState([
    { categoryId: DEFAULT_CATEGORIES[0].id, quantity: 1, weightKg: 0.5, photoUrls: [] }
  ]);
  const [pickupAddress, setPickupAddress] = useState('');
  const [pickupSlot, setPickupSlot] = useState('');
  const [notes, setNotes] = useState('');

  // Step 2 checklist confirmations
  const [safetyCheck1, setSafetyCheck1] = useState(false);
  const [safetyCheck2, setSafetyCheck2] = useState(false);
  const [safetyCheck3, setSafetyCheck3] = useState(false);

  useEffect(() => {
    api.get('/categories')
      .then(res => {
        if (res.success && res.data && res.data.length > 0) {
          setCategories(res.data);
          setItems(prev => prev.map(item => ({ ...item, categoryId: res.data[0].id })));
        }
      })
      .catch(() => {});
  }, []);

  const addItem = () => {
    setItems([
      ...items,
      { categoryId: categories[0]?.id || 'cat-1', quantity: 1, weightKg: 1, photoUrls: [] }
    ]);
  };

  const removeItem = (idx) => {
    if (items.length <= 1) {
      toast('You must have at least one item', 'info');
      return;
    }
    setItems(items.filter((_, i) => i !== idx));
  };

  const updateItem = (idx, field, value) => {
    const updated = [...items];
    updated[idx][field] = value;
    setItems(updated);
  };

  const handleFileUpload = async (idx, e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('photos', files[i]);
    }

    try {
      toast('Uploading photo preview...', 'info');
      const res = await api.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.success && res.data?.urls) {
        updateItem(idx, 'photoUrls', [...items[idx].photoUrls, ...res.data.urls]);
        toast('Photo uploaded successfully', 'success');
      }
    } catch (err) {
      // In local fallback mode without server uploads, create an object URL preview
      const localUrls = Array.from(files).map(f => URL.createObjectURL(f));
      updateItem(idx, 'photoUrls', [...items[idx].photoUrls, ...localUrls]);
      toast('Photo attached for review', 'success');
    }
  };

  // Estimate credit range
  const calculateEstimatedCredits = () => {
    let totalBase = 0;
    items.forEach(item => {
      const cat = categories.find(c => c.id === item.categoryId) || categories[0];
      if (cat.unit === 'PER_KG') {
        totalBase += (cat.baseRate || 80) * (Number(item.weightKg) || 1);
      } else {
        totalBase += (cat.baseRate || 50) * (Number(item.quantity) || 1);
      }
    });
    // Grade range A: 1.5x, B: 1.0x, C: 0.5x
    return {
      min: Math.round(totalBase * 0.5),
      expected: Math.round(totalBase * 1.0),
      max: Math.round(totalBase * 1.5)
    };
  };

  const handleSubmit = async () => {
    if (!pickupAddress.trim()) {
      toast('Please enter a valid pickup address', 'error');
      setStep(3);
      return;
    }

    try {
      setLoading(true);
      const payload = {
        pickupAddress,
        pickupSlot: pickupSlot ? new Date(pickupSlot).toISOString() : null,
        notes,
        items: items.map(item => ({
          categoryId: item.categoryId,
          quantity: Number(item.quantity) || 1,
          weightKg: Number(item.weightKg) || null,
          photoUrls: item.photoUrls
        }))
      };

      const res = await api.post('/submissions', payload);
      if (res.success) {
        toast('E-waste pickup scheduled successfully! A collector will be assigned.', 'success');
        navigate('/submissions');
      }
    } catch (err) {
      toast(err.error || 'Failed to submit pickup request', 'error');
    } finally {
      setLoading(false);
    }
  };

  const est = calculateEstimatedCredits();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      
      {/* Title & Step Wizard */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Schedule E-Waste Pickup
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Complete the 4-step wizard to arrange doorstep collection & earn credits.
        </p>

        {/* Wizard Steps indicator */}
        <div className="mt-8 grid grid-cols-4 gap-2 text-center text-xs font-semibold">
          <div className={`p-2.5 rounded-xl border ${step >= 1 ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
            1. Items & Photos
          </div>
          <div className={`p-2.5 rounded-xl border ${step >= 2 ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
            2. Safety Checks
          </div>
          <div className={`p-2.5 rounded-xl border ${step >= 3 ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
            3. Address & Slot
          </div>
          <div className={`p-2.5 rounded-xl border ${step >= 4 ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
            4. Review & Confirm
          </div>
        </div>
      </div>

      {/* STEP 1: Items & Photos */}
      {step === 1 && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Add Electronics for Recycling</h2>
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Another Item
            </button>
          </div>

          <div className="space-y-6">
            {items.map((item, idx) => {
              const selectedCat = categories.find(c => c.id === item.categoryId) || categories[0];
              const isKg = selectedCat?.unit === 'PER_KG';

              return (
                <div key={idx} className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      ITEM #{idx + 1}
                    </span>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="text-slate-500 hover:text-rose-400 transition-colors"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Category Selection */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Select Category
                      </label>
                      <select
                        value={item.categoryId}
                        onChange={(e) => updateItem(idx, 'categoryId', e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.baseRate} pts / {c.unit === 'PER_KG' ? 'kg' : 'item'})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Quantity or Weight */}
                    {isKg ? (
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Estimated Weight (kg)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min="0.1"
                          value={item.weightKg}
                          onChange={(e) => updateItem(idx, 'weightKg', e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Quantity
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                        />
                      </div>
                    )}
                  </div>

                  {/* Photo Upload Section */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Upload Photos <span className="text-slate-500 font-normal">(Min 1-2 photos recommended)</span>
                    </label>
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700">
                        <Upload className="w-3.5 h-3.5 text-emerald-400" />
                        Upload Device Photo
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleFileUpload(idx, e)}
                          className="hidden"
                        />
                      </label>

                      {item.photoUrls.map((url, pIdx) => (
                        <div key={pIdx} className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-700">
                          <img src={url} alt="Item" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-6 py-2.5 rounded-xl font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 flex items-center gap-2 text-sm"
            >
              Next: Safety Checks
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Safety Checklist (Section 5.4) */}
      {step === 2 && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center gap-2 text-amber-400">
            <ShieldAlert className="w-6 h-6" />
            <h2 className="text-lg font-bold text-white">Pre-Submission Safety Checklist</h2>
          </div>
          <p className="text-xs text-slate-400">
            To ensure safe handling and privacy protection, please acknowledge the following standards:
          </p>

          <div className="space-y-4">
            <label className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700">
              <input
                type="checkbox"
                checked={safetyCheck1}
                onChange={(e) => setSafetyCheck1(e.target.checked)}
                className="mt-1 w-4 h-4 text-emerald-500 rounded bg-slate-950 border-slate-700 focus:ring-emerald-500"
              />
              <div className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-white block font-semibold mb-0.5">1. Personal Data Erased & SIMs Removed</strong>
                I have factory-reset smart devices, wiped internal disks, and removed all SIM cards and memory chips. VoltCycle is not liable for lingering private data.
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700">
              <input
                type="checkbox"
                checked={safetyCheck2}
                onChange={(e) => setSafetyCheck2(e.target.checked)}
                className="mt-1 w-4 h-4 text-emerald-500 rounded bg-slate-950 border-slate-700 focus:ring-emerald-500"
              />
              <div className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-white block font-semibold mb-0.5">2. Battery Inspection</strong>
                None of the submitted items have leaking, actively punctured, or smoking batteries. Loose battery terminals have tape placed over their contacts.
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700">
              <input
                type="checkbox"
                checked={safetyCheck3}
                onChange={(e) => setSafetyCheck3(e.target.checked)}
                className="mt-1 w-4 h-4 text-emerald-500 rounded bg-slate-950 border-slate-700 focus:ring-emerald-500"
              />
              <div className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-white block font-semibold mb-0.5">3. Genuine Ownership & Acceptance</strong>
                These devices belong to me or my organization and do not contain hazardous bio-medical or explosive material.
              </div>
            </label>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-2.5 rounded-xl text-slate-300 hover:text-white flex items-center gap-2 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              type="button"
              disabled={!safetyCheck1 || !safetyCheck2 || !safetyCheck3}
              onClick={() => setStep(3)}
              className="px-6 py-2.5 rounded-xl font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 flex items-center gap-2 text-sm disabled:opacity-40"
            >
              Next: Pickup Logistics
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Address & Slot */}
      {step === 3 && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <h2 className="text-lg font-bold text-white">Pickup Logistics & Timing</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                Complete Pickup Address *
              </label>
              <textarea
                rows="3"
                required
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                placeholder="Apartment/Flat No, Building, Street, Landmark, City, PIN code"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-cyan-400" />
                Preferred Pickup Date & Time
              </label>
              <input
                type="datetime-local"
                value={pickupSlot}
                onChange={(e) => setPickupSlot(e.target.value)}
                className="w-full sm:w-80 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Special Instructions for Collector (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Ring the bell twice, elevator available, call before arriving"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-xl text-slate-300 hover:text-white flex items-center gap-2 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              type="button"
              onClick={() => {
                if (!pickupAddress.trim()) {
                  toast('Please provide a pickup address', 'error');
                  return;
                }
                setStep(4);
              }}
              className="px-6 py-2.5 rounded-xl font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 flex items-center gap-2 text-sm"
            >
              Next: Review & Submit
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Review & Confirm */}
      {step === 4 && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <h2 className="text-lg font-bold text-white">Review Submission Summary</h2>

          {/* Items Summary Table */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Submitted Items ({items.length})
            </h3>
            <div className="divide-y divide-slate-800 text-xs">
              {items.map((item, idx) => {
                const cat = categories.find(c => c.id === item.categoryId);
                return (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-white">{cat?.name}</span>
                      <span className="text-slate-400 ml-2">
                        {cat?.unit === 'PER_KG' ? `${item.weightKg} kg` : `Qty: ${item.quantity}`}
                      </span>
                    </div>
                    <span className="text-slate-400">
                      Photos: {item.photoUrls.length}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pickup Address Summary */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-1">
            <strong className="text-white block font-semibold">Pickup Address:</strong>
            <p>{pickupAddress}</p>
            {pickupSlot && <p className="text-cyan-400 font-medium">Slot: {new Date(pickupSlot).toLocaleString()}</p>}
          </div>

          {/* Credit Estimation Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-teal-950/60 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs uppercase font-bold text-emerald-400">Estimated Value</span>
                <div className="text-2xl font-extrabold text-white font-mono">
                  {est.min} - {est.max}{' '}
                  <span className="text-sm text-emerald-300 font-sans font-normal">credits</span>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 max-w-xs">
              Final credits depend on physical condition grading (Grade A: 1.5x, B: 1.0x, C: 0.5x) performed by collector.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-5 py-2.5 rounded-xl text-slate-300 hover:text-white flex items-center gap-2 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={handleSubmit}
              className="px-7 py-3 rounded-xl font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 flex items-center gap-2 text-sm shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  Scheduling Pickup...
                </>
              ) : (
                <>
                  Confirm & Schedule Pickup
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
