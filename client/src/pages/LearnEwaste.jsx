import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  BatteryCharging,
  Smartphone,
  Cpu,
  Tv,
  Printer,
  Headphones,
  Zap,
  Info
} from 'lucide-react';
import api from '../api/axios';

const DEFAULT_CATEGORIES = [
  {
    name: 'Mobile Phones & Tablets',
    examples: ['Smartphones', 'Feature phones', 'iPads', 'Android tablets', 'E-readers'],
    hazardous: true,
    hazardReason: 'Contains lithium-ion battery',
    baseRate: 120,
    unit: 'PER_ITEM',
    co2PerKg: 15.0,
    accepted: true
  },
  {
    name: 'Computers & Laptops',
    examples: ['Laptops', 'Desktops', 'Motherboards', 'Hard drives', 'RAM modules', 'Power supply units'],
    hazardous: false,
    hazardReason: 'Partly hazardous circuitry',
    baseRate: 300,
    unit: 'PER_ITEM',
    co2PerKg: 24.5,
    accepted: true
  },
  {
    name: 'Computer Accessories',
    examples: ['Keyboards', 'Mice', 'Webcams', 'External speakers', 'Wi-Fi Routers', 'Docking stations'],
    hazardous: false,
    hazardReason: 'Non-hazardous plastics & copper wiring',
    baseRate: 30,
    unit: 'PER_ITEM',
    co2PerKg: 3.2,
    accepted: true
  },
  {
    name: 'Batteries & Power Banks',
    examples: ['Li-ion batteries', 'Power banks', 'Laptop replacement batteries', 'UPS inverter batteries'],
    hazardous: true,
    hazardReason: 'High thermal runaway hazard; special taping required',
    baseRate: 20,
    unit: 'PER_ITEM',
    co2PerKg: 8.5,
    accepted: true
  },
  {
    name: 'Chargers & Cables',
    examples: ['Phone chargers', 'Type-C cables', 'HDMI cables', 'Laptop brick adapters', 'Extension cords'],
    hazardous: false,
    hazardReason: 'High copper recovery value',
    baseRate: 10,
    unit: 'PER_ITEM',
    co2PerKg: 1.8,
    accepted: true
  },
  {
    name: 'Audio & Wearables',
    examples: ['Earphones', 'Headphones', 'Bluetooth speakers', 'Smartwatches', 'Fitness trackers'],
    hazardous: false,
    hazardReason: 'Micro lithium batteries inside',
    baseRate: 50,
    unit: 'PER_ITEM',
    co2PerKg: 4.0,
    accepted: true
  },
  {
    name: 'Small Home Appliances',
    examples: ['Mixers & blenders', 'Electric irons', 'Hair dryers', 'Electric kettles', 'Table fans', 'Toasters'],
    hazardous: false,
    hazardReason: 'Motors and steel casing',
    baseRate: 40,
    unit: 'PER_ITEM',
    co2PerKg: 5.5,
    accepted: true
  },
  {
    name: 'Large Appliances',
    examples: ['Refrigerators', 'Washing machines', 'Air conditioners', 'Televisions & CRTs'],
    hazardous: true,
    hazardReason: 'Contains refrigerants (CFCs/HFCs) or heavy CRT lead glass',
    baseRate: 250,
    unit: 'PER_ITEM',
    co2PerKg: 45.0,
    accepted: true
  },
  {
    name: 'Lighting & Bulbs',
    examples: ['CFL bulbs', 'LED tube lights', 'Halogen fixtures', 'Desk lamps'],
    hazardous: true,
    hazardReason: 'CFLs contain trace mercury vapor',
    baseRate: 15,
    unit: 'PER_ITEM',
    co2PerKg: 1.2,
    accepted: true
  },
  {
    name: 'Printers & Peripherals',
    examples: ['Inkjet printers', 'Laser printers', 'Flatbed scanners', 'Toner cartridges'],
    hazardous: false,
    hazardReason: 'Contains toner powders and servo motors',
    baseRate: 70,
    unit: 'PER_ITEM',
    co2PerKg: 8.0,
    accepted: true
  },
  {
    name: 'Circuit Boards & Components',
    examples: ['PCBs', 'Telecom motherboards', 'Server backplanes', 'Sensors', 'Relays'],
    hazardous: false,
    hazardReason: 'Rich in precious metals (gold, palladium, copper)',
    baseRate: 80,
    unit: 'PER_KG',
    co2PerKg: 35.0,
    accepted: true
  },
  {
    name: 'Gaming & Entertainment',
    examples: ['PlayStation / Xbox consoles', 'Controllers', 'TV remotes', 'DVD players', 'Set-top boxes'],
    hazardous: false,
    hazardReason: 'ABS plastic and composite electronics',
    baseRate: 60,
    unit: 'PER_ITEM',
    co2PerKg: 6.0,
    accepted: true
  }
];

const FAQS = [
  {
    q: 'How are recycling credits calculated?',
    a: 'Credits are determined by: (Category Base Rate) × (Quantity or Weight in kg) × (Condition Grade Multiplier). Grade A (reusable) gets 1.5x, Grade B (repairable) gets 1.0x, Grade C (scrap) gets 0.5x. First-time recyclers also receive a 50 credit welcome bonus!'
  },
  {
    q: 'How does pickup scheduling work?',
    a: 'When you submit items through VoltCycle, you select your preferred date and 2-hour window. An assigned authorized collector will verify your address, inspect the devices, confirm grading, and collect them directly from your doorstep.'
  },
  {
    q: 'What if an item is not accepted or broken?',
    a: 'Our collectors accept almost all electronic scrap including non-functional gadgets. However, hazardous or severely swollen batteries with physical puncture risks cannot be transported without specialized fireproof containers. Review our preparation checklist before pickup.'
  },
  {
    q: 'Is my personal data safe on submitted phones and laptops?',
    a: 'You must perform a full factory reset and remove SIM/microSD cards prior to handover. VoltCycle certified e-waste partners also adhere to R2 / ISO 14001 data shredding and degaussing protocols for all memory storage devices.'
  },
  {
    q: 'Can I redeem credits for actual goods or cash vouchers?',
    a: 'Yes! Your earned credits are stored in an append-only digital wallet ledger. You can redeem them in the Offers section for partner gift cards, e-commerce vouchers, or donate them to environmental reforestation initiatives.'
  }
];

export default function LearnEwaste() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    api.get('/categories')
      .then(res => {
        if (res.success && res.data && res.data.length > 0) {
          setCategories(res.data);
        }
      })
      .catch(() => {
        // Fall back to comprehensive default categories
      });
  }, []);

  // Filter categories by name or examples
  const filteredCategories = categories.filter(cat => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const nameMatch = cat.name.toLowerCase().includes(q);
    const examplesMatch = cat.examples?.some(ex => ex.toLowerCase().includes(q));
    return nameMatch || examplesMatch;
  });

  return (
    <div className="space-y-20 pb-20 pt-6">
      
      {/* Hero Header */}
      <section className="text-center max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-4">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span>E-Waste Identification & Acceptance Handbook</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          What Exactly is <span className="text-emerald-600">E-Waste?</span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
          E-waste is any discarded electrical or electronic device or component — anything with a{' '}
          <strong className="text-slate-900">plug, battery, circuit board or power cable</strong> that no longer works or is no longer wanted.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/submissions/new"
            className="px-6 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20 transition-all hover:scale-105"
          >
            Start Submitting E-Waste
          </Link>
          <a
            href="#checker"
            className="px-6 py-3 rounded-xl font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
          >
            Search Acceptable Items
          </a>
        </div>
      </section>

      {/* Quick Identification Tips Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white p-6 sm:p-8 border border-slate-200/80 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Quick Identification Rule of Thumb
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80">
              <strong className="text-emerald-700 block text-sm mb-1">1. Has a Plug or Cord</strong>
              <span className="text-slate-600">Wall appliances, chargers, cables, and adaptors that conduct electric current.</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80">
              <strong className="text-cyan-700 block text-sm mb-1">2. Battery-Powered</strong>
              <span className="text-slate-600">Phones, remotes, toys with circuit boards, wireless earbuds, smartwatches.</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80">
              <strong className="text-amber-700 block text-sm mb-1">3. Crossed-Out Bin Symbol</strong>
              <span className="text-slate-600">Look at the product label: a crossed-out wheelie bin indicates mandatory e-waste disposal.</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80">
              <strong className="text-indigo-700 block text-sm mb-1">4. Drawer Stash Gadgets</strong>
              <span className="text-slate-600">Old broken phones, keyboards, cables, and obsolete chargers lying forgotten in closets.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Item Checker / Search */}
      <section id="checker" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-600">
              Catalog & Rates
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Accepted Categories & Base Credits
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Search by gadget name to see if it qualifies, base reward points, and handling flags.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. iPhone, blender, cable, PCB..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat, idx) => (
            <div
              key={cat.id || idx}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-emerald-500/50 hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-bold text-slate-900 text-base">{cat.name}</h3>
                  {cat.hazardous ? (
                    <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Hazardous
                    </span>
                  ) : (
                    <span className="shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Standard
                    </span>
                  )}
                </div>

                {/* Examples tag cloud */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {cat.examples?.map((ex, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Base Reward</span>
                  <strong className="text-emerald-600 font-mono text-sm">
                    {cat.baseRate} credits / {cat.unit === 'PER_KG' ? 'kg' : 'item'}
                  </strong>
                </div>

                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">CO₂ Offset</span>
                  <span className="text-slate-600 font-mono text-xs">
                    ~{cat.co2PerKg} kg CO₂/kg
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
            <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-700 font-medium text-sm">No category matched "{searchQuery}"</p>
            <p className="text-xs text-slate-500 mt-1">Try searching for keywords like "laptop", "battery", or "adapter".</p>
          </div>
        )}
      </section>

      {/* Do & Don't Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* What WE ACCEPT */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-emerald-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-emerald-700">
              <CheckCircle2 className="w-6 h-6" />
              <h3 className="text-xl font-bold text-slate-900">Items Accepted for Recycling</h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                Any electronic device with a cord, circuit board, or battery chamber
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                Broken, non-booting, cracked screen gadgets and legacy components
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                Loose wires, HDMI, USB cords, phone chargers, power strips
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                Home appliances (mixers, irons, microwaves, fans, audio gear)
              </li>
            </ul>
          </div>

          {/* What is NOT E-WASTE */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-rose-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-rose-600">
              <XCircle className="w-6 h-6" />
              <h3 className="text-xl font-bold text-slate-900">Do Not Submit (Not E-Waste)</h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                Regular municipal trash, food scraps, paper, cardboard, and empty plastic bottles
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                Medical or biohazardous waste (e.g. used syringes even if electronic)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                Explosives, fireworks, fire extinguishers, or pressurized gas cylinders
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                Leaking, actively smoking, or charred batteries — contact collector first
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* Safety & Preparation Checklist */}
      <section id="safety" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white p-8 sm:p-12 border border-slate-200/80 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-600">
              Safety First
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Device Preparation & Handoff Checklist
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-2">
              Follow these mandatory precautions before your scheduled collector arrival.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm mb-3">
                1
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Erase Personal Data</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Factory reset phones, tablets, and laptops. Remove SIM cards and microSD storage chips.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold text-sm mb-3">
                2
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Detach Removable Batteries</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                If battery is detachable, remove it and store in a separate sealable bag.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm mb-3">
                3
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Do Not Break or Dismantle</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Never intentionally crack open lithium battery housings or smash CRT displays.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-sm mb-3">
                4
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Store Dry & Out of Sun</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Keep stored items away from humidity and heat sources to prevent short circuits.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm mb-3">
                5
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Tape Battery Terminals</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Place electrical tape over exposed metal contact terminals on loose lithium batteries.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-sm mb-3">
                6
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Take Clear Photos</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upload 2+ photos from different angles during submission so collectors can pre-verify.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs uppercase font-bold tracking-widest text-emerald-600">
            Common Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-xl border border-slate-200/80 bg-white shadow-xs overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? -1 : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 hover:text-emerald-600 transition-colors"
                >
                  <span className="text-sm sm:text-base flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
