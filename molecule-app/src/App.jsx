import { useState, useEffect, useRef } from 'react'

// ─── Initial Data ────────────────────────────────────────────────────────────

const INITIAL_DELIVERABLES = [
  { id:"1_parent", phase:"ONE", code:"ONE", description:"CONCEPT DESIGN (Complete Phase Deliverables)", optimalRate:40, bufferedRate:40, isParent:true, checked:true, section:"Design Fees", taxRate:15, subItems:["1_1","1_2"] },
  { id:"1_1", phase:"ONE", code:"1", description:"Planning & Schematic layout", optimalRate:20, bufferedRate:20, isParent:false, checked:true, taxRate:15, section:"Design Fees" },
  { id:"1_2", phase:"ONE", code:"2", description:"Concept Mood Boards & References", optimalRate:20, bufferedRate:20, isParent:false, checked:true, taxRate:15, section:"Design Fees" },
  { id:"2_parent", phase:"TWO", code:"TWO", description:"DESIGN DEVELOPMENT - INTERIOR (Detailed Phases)", optimalRate:90, bufferedRate:90, isParent:true, checked:true, section:"Design Fees", taxRate:15, subItems:["2_1","2_2","2_3","2_4","2_5","2_6"] },
  { id:"2_1", phase:"TWO", code:"1", description:"Interior Elevations", optimalRate:15, bufferedRate:15, isParent:false, checked:true, taxRate:15, section:"Design Fees" },
  { id:"2_2", phase:"TWO", code:"2", description:"2D Interior Sections", optimalRate:15, bufferedRate:15, isParent:false, checked:true, taxRate:15, section:"Design Fees" },
  { id:"2_3", phase:"TWO", code:"3", description:"3D Design Modelling", optimalRate:25, bufferedRate:25, isParent:false, checked:true, taxRate:15, section:"Design Fees" },
  { id:"2_4", phase:"TWO", code:"4", description:"Detail Design & Renders", optimalRate:15, bufferedRate:15, isParent:false, checked:true, taxRate:15, section:"Design Fees" },
  { id:"2_5", phase:"TWO", code:"5", description:"Selection of Finishes & Materials", optimalRate:10, bufferedRate:10, isParent:false, checked:true, taxRate:15, section:"Design Fees" },
  { id:"2_6", phase:"TWO", code:"6", description:"Furniture Layout Plan, Design & Finishes", optimalRate:10, bufferedRate:10, isParent:false, checked:true, taxRate:15, section:"Design Fees" },
  { id:"3_parent", phase:"THREE", code:"THREE", description:"DRAWING DEVELOPMENT (Interior - Tender Package)", optimalRate:75, bufferedRate:75, isParent:true, checked:true, section:"Design Fees", taxRate:15, subItems:["3_1"] },
  { id:"3_1", phase:"THREE", code:"1", description:"Interior Working Drawings (Plans, Sections, Elevations, Details)", optimalRate:75, bufferedRate:75, isParent:false, checked:true, taxRate:15, section:"Design Fees" },
  { id:"4_parent", phase:"FOUR", code:"FOUR", description:"BOQ DEVELOPMENT (Interior - Tender Package)", optimalRate:45, bufferedRate:45, isParent:true, checked:true, section:"Design Fees", taxRate:15, subItems:["4_1","4_2"] },
  { id:"4_1", phase:"FOUR", code:"1", description:"Interior Scope", optimalRate:25, bufferedRate:25, isParent:false, checked:true, taxRate:15, section:"Design Fees" },
  { id:"4_2", phase:"FOUR", code:"2", description:"Furniture Details", optimalRate:20, bufferedRate:20, isParent:false, checked:true, taxRate:15, section:"Design Fees" },
  { id:"5_parent", phase:"FIVE", code:"FIVE", description:"DESIGN PACKAGE (MEP Design Standard Group)", optimalRate:36, bufferedRate:36, isParent:true, checked:true, section:"Design Fees", taxRate:15, subItems:["5_1","5_2","5_3","5_4"] },
  { id:"5_1", phase:"FIVE", code:"1", description:"Electrical Drawings", optimalRate:9, bufferedRate:9, isParent:false, checked:true, taxRate:15, section:"Design Fees" },
  { id:"5_2", phase:"FIVE", code:"2", description:"Plumbing Drawings", optimalRate:9, bufferedRate:9, isParent:false, checked:true, taxRate:15, section:"Design Fees" },
  { id:"5_3", phase:"FIVE", code:"3", description:"Fire Fighting Drawings", optimalRate:9, bufferedRate:9, isParent:false, checked:true, taxRate:15, section:"Design Fees" },
  { id:"5_4", phase:"FIVE", code:"4", description:"HVAC Air Conditioning", optimalRate:9, bufferedRate:9, isParent:false, checked:true, taxRate:15, section:"Design Fees" },
  { id:"6_parent", phase:"SIX", code:"SIX", description:"BOQ DEVELOPMENT (MEP Design Deliverable Group)", optimalRate:24, bufferedRate:24, isParent:true, checked:true, section:"Design Fees", taxRate:15, subItems:["6_1"] },
  { id:"6_1", phase:"SIX", code:"1", description:"MEP BOQ Estimates", optimalRate:24, bufferedRate:24, isParent:false, checked:true, taxRate:15, section:"Design Fees" },
  { id:"fitout_1", phase:"FITOUT", code:"1.0", description:"ID Scope (Civil, Finishes & FF&E)", optimalRate:5500, bufferedRate:7000, isParent:true, checked:false, section:"Fit-Out Scope", taxRate:15, subItems:["fitout_1_1","fitout_1_2","fitout_1_3","fitout_1_4","fitout_1_5","fitout_1_6","fitout_1_7"] },
  { id:"fitout_1_1", phase:"FITOUT", code:"1", description:"Facade Protection Partitions", optimalRate:0, bufferedRate:0, isParent:false, checked:false, taxRate:15, section:"Fit-Out Scope" },
  { id:"fitout_1_2", phase:"FITOUT", code:"2", description:"Dismantling Scope", optimalRate:0, bufferedRate:0, isParent:false, checked:false, taxRate:15, section:"Fit-Out Scope" },
  { id:"fitout_1_3", phase:"FITOUT", code:"3", description:"Partitioning - Gypsum / Cement Board", optimalRate:0, bufferedRate:0, isParent:false, checked:false, taxRate:15, section:"Fit-Out Scope" },
  { id:"fitout_1_4", phase:"FITOUT", code:"4", description:"Glass Partitions (tempered 12mm+, privacy film)", optimalRate:0, bufferedRate:0, isParent:false, checked:false, taxRate:15, section:"Fit-Out Scope" },
  { id:"fitout_1_5", phase:"FITOUT", code:"5", description:"Levelling of Floor", optimalRate:0, bufferedRate:0, isParent:false, checked:false, taxRate:15, section:"Fit-Out Scope" },
  { id:"fitout_1_6", phase:"FITOUT", code:"6", description:"Concealed Ceiling & Gypsum Tiles", optimalRate:0, bufferedRate:0, isParent:false, checked:false, taxRate:15, section:"Fit-Out Scope" },
  { id:"fitout_1_7", phase:"FITOUT", code:"7", description:"Flooring - Dark Grey Carpet / Tiles/Vinyl Tiles", optimalRate:0, bufferedRate:0, isParent:false, checked:false, taxRate:15, section:"Fit-Out Scope" },
  { id:"fitout_2", phase:"FITOUT", code:"2.0", description:"HVAC Works Package", optimalRate:2000, bufferedRate:2000, isParent:true, checked:false, section:"Fit-Out Scope", taxRate:15, subItems:["fitout_2_1","fitout_2_2","fitout_2_3"] },
  { id:"fitout_2_1", phase:"FITOUT", code:"1", description:"Air Supply Ductings & Return Systems", optimalRate:0, bufferedRate:0, isParent:false, checked:false, taxRate:15, section:"Fit-Out Scope" },
  { id:"fitout_2_2", phase:"FITOUT", code:"2", description:"Dampers, Volume Controllers & Diffusers", optimalRate:0, bufferedRate:0, isParent:false, checked:false, taxRate:15, section:"Fit-Out Scope" },
  { id:"fitout_2_3", phase:"FITOUT", code:"3", description:"Dedicated Precision AC for Server Room", optimalRate:0, bufferedRate:0, isParent:false, checked:false, taxRate:15, section:"Fit-Out Scope" },
  { id:"fitout_3", phase:"FITOUT", code:"3.0", description:"Electrical Works Package", optimalRate:2500, bufferedRate:2500, isParent:true, checked:false, section:"Fit-Out Scope", taxRate:15, subItems:["fitout_3_1","fitout_3_2","fitout_3_3"] },
  { id:"fitout_3_1", phase:"FITOUT", code:"1", description:"Raceways & Raw Power Wiring (Pakistan Cables)", optimalRate:0, bufferedRate:0, isParent:false, checked:false, taxRate:15, section:"Fit-Out Scope" },
  { id:"fitout_3_2", phase:"FITOUT", code:"2", description:"Data Wiring - Cat 6 (3M)", optimalRate:0, bufferedRate:0, isParent:false, checked:false, taxRate:15, section:"Fit-Out Scope" },
  { id:"fitout_3_3", phase:"FITOUT", code:"3", description:"Voice Wiring (3M) & Basic Lighting", optimalRate:0, bufferedRate:0, isParent:false, checked:false, taxRate:15, section:"Fit-Out Scope" },
  { id:"fitout_4", phase:"FITOUT", code:"4.0", description:"Furniture Package", optimalRate:2500, bufferedRate:3500, isParent:true, checked:false, section:"Fit-Out Scope", taxRate:15, subItems:["fitout_4_1","fitout_4_2"] },
  { id:"fitout_4_1", phase:"FITOUT", code:"1", description:"Workstation Type A - Height-adj. desk", optimalRate:0, bufferedRate:0, isParent:false, checked:false, taxRate:15, section:"Fit-Out Scope" },
  { id:"fitout_4_2", phase:"FITOUT", code:"2", description:"Lounge Areas & Staff Lockers", optimalRate:0, bufferedRate:0, isParent:false, checked:false, taxRate:15, section:"Fit-Out Scope" },
  { id:"fitout_5", phase:"FITOUT", code:"5.0", description:"AV / IT Equipment Package (OFM for Optimal)", optimalRate:0, bufferedRate:1000, isParent:true, checked:false, section:"Fit-Out Scope", taxRate:15, subItems:["fitout_5_1","fitout_5_2"] },
  { id:"fitout_5_1", phase:"FITOUT", code:"1", description:"LG Displays, Logi Rally Bars, Mic Arrays & Schedulers", optimalRate:0, bufferedRate:0, isParent:false, checked:false, taxRate:15, section:"Fit-Out Scope" },
  { id:"fitout_5_2", phase:"FITOUT", code:"2", description:"USB-C Adapters, Active Extenders & Cabling standard", optimalRate:0, bufferedRate:0, isParent:false, checked:false, taxRate:15, section:"Fit-Out Scope" },
  { id:"fitout_6", phase:"FITOUT", code:"6.0", description:"Server Room / Hub Room Fit-Out (OFM for Optimal)", optimalRate:0, bufferedRate:1300, isParent:true, checked:false, section:"Fit-Out Scope", taxRate:15, subItems:["fitout_6_1","fitout_6_2"] },
  { id:"fitout_6_1", phase:"FITOUT", code:"1", description:"Server Racks, PDU, UPS Battery Arrays", optimalRate:0, bufferedRate:0, isParent:false, checked:false, taxRate:15, section:"Fit-Out Scope" },
  { id:"fitout_6_2", phase:"FITOUT", code:"2", description:"Dedicated Precision AC / CRAC Unit", optimalRate:0, bufferedRate:0, isParent:false, checked:false, taxRate:15, section:"Fit-Out Scope" },
]

const INITIAL_MILESTONES = [
  { label:"Payment One - (ADVANCE)", ratio:50 },
  { label:"Payment Two - Completion of Handover Deliverables", ratio:50 },
]

const INITIAL_TIMELINE = [
  { title:"Design Requirements", days:9, badge:"Phase 1" },
  { title:"Interior Design Process", days:60, badge:"Phase 2" },
  { title:"Construction & Fit-Out handover", days:120, badge:"Phase 3" },
]

const INITIAL_PROPOSALS = [
  { id:"v1.0", clientName:"Engro Polymer", projectName:"Workspace Extension Project", sqft:5130, strategy:"optimal", subtotal:1590300, grandTotal:1828845, timestamp:"02:30 PM",
    milestones: JSON.parse(JSON.stringify(INITIAL_MILESTONES)),
    timelinePhases: JSON.parse(JSON.stringify(INITIAL_TIMELINE)),
    deliverables: null }
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatPKR(val) {
  return new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 }).format(val)
}

function calcTotals(deliverables, sqft, strategy) {
  let subtotal = 0, totalTax = 0
  deliverables.forEach(item => {
    const rate = strategy === 'optimal' ? item.optimalRate : item.bufferedRate
    const tax = item.taxRate ?? 15
    if (!item.checked) return
    if (item.isParent) {
      if (item.subItems?.length) {
        const children = deliverables.filter(c => item.subItems.includes(c.id))
        const hasNonZeroChildren = children.some(c => (strategy === 'optimal' ? c.optimalRate : c.bufferedRate) > 0)
        if (!hasNonZeroChildren) {
          const t = rate * sqft
          subtotal += t; totalTax += t * (tax / 100)
        }
      } else {
        const t = rate * sqft
        subtotal += t; totalTax += t * (tax / 100)
      }
    } else {
      const parent = deliverables.find(p => p.isParent && p.subItems?.includes(item.id))
      if (!parent || parent.checked) {
        const t = rate * sqft
        subtotal += t; totalTax += t * (tax / 100)
      }
    }
  })
  return { subtotal, tax: totalTax, grandTotal: subtotal + totalTax }
}

function getRowTotal(item, deliverables, sqft, strategy) {
  if (!item.checked) return 0
  const rate = strategy === 'optimal' ? item.optimalRate : item.bufferedRate
  if (item.isParent) {
    if (item.subItems?.length) {
      const children = deliverables.filter(c => item.subItems.includes(c.id))
      const hasNonZeroChildren = children.some(c => (strategy === 'optimal' ? c.optimalRate : c.bufferedRate) > 0)
      if (hasNonZeroChildren) {
        const activeChildren = children.filter(c => c.checked)
        return activeChildren.reduce((s, c) => s + (strategy === 'optimal' ? c.optimalRate : c.bufferedRate), 0) * sqft
      }
      return rate * sqft
    }
    return rate * sqft
  }
  const parent = deliverables.find(p => p.isParent && p.subItems?.includes(item.id))
  if (!parent || parent.checked) return rate * sqft
  return 0
}

// ─── SVG Logo ────────────────────────────────────────────────────────────────
function MoleculeLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="45" fill="#0f172a"/>
      <path d="M50 15L75 30V60L50 75L25 60V30L50 15Z" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M50 15V75" stroke="#2563eb" strokeWidth="2"/>
      <path d="M25 30L75 60" stroke="#2563eb" strokeWidth="2"/>
      <path d="M25 60L75 30" stroke="#2563eb" strokeWidth="2"/>
      <path d="M50 33L65 42V58L50 67L35 58V42L50 33Z" fill="#3b82f6" opacity="0.6" stroke="#ffffff" strokeWidth="2"/>
    </svg>
  )
}

// ─── Notification Modal ───────────────────────────────────────────────────────
function NotificationModal({ title, text, onClose }) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center font-sans" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-xl p-5 max-w-sm w-full mx-3 shadow-2xl border border-slate-200 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-3 text-lg border border-green-100">
          <i className="fa-solid fa-check"></i>
        </div>
        <h3 className="text-sm font-bold text-slate-900 mb-0.5">{title}</h3>
        <p className="text-slate-500 text-[11px] mb-4 leading-relaxed whitespace-pre-line">{text}</p>
        <button onClick={onClose} className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs transition-colors">Done</button>
      </div>
    </div>
  )
}

// ─── Sync Configuration Modal ────────────────────────────────────────────────
function SyncSettingsModal({ syncUrl, setSyncUrl, spreadsheetId, setSpreadsheetId, onClose, onTest, connectedSheet }) {
  const [tempUrl, setTempUrl] = useState(syncUrl)
  const [tempId, setTempId] = useState(spreadsheetId)
  const [testing, setTesting] = useState(false)

  function handleSave() {
    localStorage.setItem('molecule_sync_url', tempUrl.trim())
    localStorage.setItem('molecule_spreadsheet_id', tempId.trim())
    setSyncUrl(tempUrl.trim())
    setSpreadsheetId(tempId.trim())
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <div>
            <h3 className="text-xs font-extrabold text-slate-950 flex items-center uppercase tracking-wide">
              <i className="fa-solid fa-cloud-arrow-up mr-1.5 text-blue-600"></i> Google Sheet & Drive Sync Setup
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Securely bridge your local pricing app with Cloud Workspaces</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div className="text-[11px] text-slate-500 leading-relaxed bg-blue-50 p-3 rounded-lg border border-blue-100">
            <p className="font-semibold text-blue-900 mb-1">Step-by-step Connection Guide:</p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Deploy your updated script in **Extensions &rarr; Apps Script**.</li>
              <li>Copy and paste your **Web App URL** and **Spreadsheet ID** below.</li>
              <li>Save settings to start automatic document version synchronization.</li>
            </ol>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-[9px] font-bold uppercase text-slate-500 tracking-wider mb-1">Apps Script Web App URL</label>
              <input type="text" value={tempUrl} onChange={e => setTempUrl(e.target.value)} 
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-[11px] text-slate-800 font-mono" 
                placeholder="https://script.google.com/macros/s/.../exec" />
            </div>
            <div>
              <label className="block text-[9px] font-bold uppercase text-slate-500 tracking-wider mb-1">Spreadsheet ID</label>
              <input type="text" value={tempId} onChange={e => setTempId(e.target.value)} 
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-[11px] text-slate-800 font-mono" 
                placeholder="1McyNBt4J8vM4_KjezCWjAAW366AmA2ns_N5R6WrrgEM" />
            </div>
          </div>

          {connectedSheet.name && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-[11px] text-emerald-800">
              <span className="font-extrabold block text-[9px] uppercase tracking-wider text-emerald-600 mb-1">ACTIVE WORKBOOK ENDPOINT</span>
              <p className="font-bold flex items-center gap-1"><i className="fa-solid fa-file-excel"></i> {connectedSheet.name}</p>
              <p className="text-[9px] text-emerald-500 font-mono mt-0.5 truncate font-semibold">ID: {connectedSheet.id}</p>
            </div>
          )}
        </div>
        <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
          <button onClick={() => {
            setTesting(true)
            onTest(tempUrl, tempId, () => setTesting(false))
          }} disabled={!tempUrl.trim() || !tempId.trim() || testing} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 flex items-center gap-1">
            {testing ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-wifi"></i>}
            <span>Test Connection</span>
          </button>
          <div className="flex space-x-2">
            <button onClick={onClose} className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 rounded-lg">Cancel</button>
            <button onClick={handleSave} className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center">
              <i className="fa-solid fa-floppy-disk mr-1.5"></i> Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Scope Popup ─────────────────────────────────────────────────────────────
function ScopePopup({ deliverables, strategy, onClose, onApply }) {
  const [customDesc, setCustomDesc] = useState('')
  const [customRate, setCustomRate] = useState('')
  const fitoutParents = deliverables.filter(i => i.section === 'Fit-Out Scope' && i.isParent)
  const [selected, setSelected] = useState(() => {
    const m = {}
    fitoutParents.forEach(p => { m[p.id] = p.checked })
    return m
  })

  function handleApply() {
    onApply(selected, customDesc.trim(), parseFloat(customRate) || 0)
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-xl max-w-xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200 font-sans">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <div>
            <h3 className="text-xs font-extrabold text-slate-950 flex items-center uppercase tracking-wide">
              <i className="fa-solid fa-boxes-packing mr-1.5 text-blue-600"></i> Add Scope / Package
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Select preconfigured fit-out packages or specify custom items</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>
        <div className="p-4 overflow-y-auto custom-scrollbar space-y-4 flex-1">
          <div className="space-y-2.5">
            <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Select Preconfigured Package</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {fitoutParents.map(pkg => (
                <label key={pkg.id} className="flex items-start space-x-2.5 p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100/50 transition-all text-[11px] select-none">
                  <input type="checkbox" checked={!!selected[pkg.id]} onChange={e => setSelected(s => ({ ...s, [pkg.id]: e.target.checked }))}
                    className="w-3.5 h-3.5 mt-0.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer" />
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Package {pkg.code}</span>
                    <h4 className="font-extrabold text-slate-800 leading-tight">{pkg.description}</h4>
                    <div className="flex space-x-2 text-[9px] text-slate-500 mt-0.5">
                      <span>Optimal: <span className="font-semibold text-slate-800">{pkg.optimalRate === 0 ? 'OFM' : pkg.optimalRate}</span></span>
                      <span>Buffered: <span className="font-semibold text-slate-800">{pkg.bufferedRate}</span></span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div className="relative flex py-1.5 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">OR CREATE CUSTOM ITEM</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
            <div>
              <label className="block text-[9px] font-bold uppercase text-slate-500 tracking-wider mb-1">Custom Scope Name</label>
              <input type="text" value={customDesc} onChange={e => setCustomDesc(e.target.value)} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-slate-800" placeholder="e.g. Partitioning - Cem. Board" />
            </div>
            <div>
              <label className="block text-[9px] font-bold uppercase text-slate-500 tracking-wider mb-1">Rate (PKR/Sq.Ft)</label>
              <input type="number" value={customRate} onChange={e => setCustomRate(e.target.value)} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-slate-800" placeholder="e.g. 50" />
            </div>
          </div>
        </div>
        <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
          <button onClick={() => { setSelected({}); setCustomDesc(''); setCustomRate('') }} className="text-[10px] text-slate-400 hover:text-red-500 font-bold uppercase tracking-wider font-semibold">Reset Selection</button>
          <div className="flex space-x-2">
            <button onClick={onClose} className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 rounded-lg transition-colors">Cancel</button>
            <button onClick={handleApply} className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center transition-colors">
              <i className="fa-solid fa-check mr-1.5"></i> Add to calculations
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Nested Item Popup ────────────────────────────────────────────────────────
function NestedItemPopup({ parentId, parentDesc, onClose, onSave }) {
  const [desc, setDesc] = useState('')
  const [rate, setRate] = useState('')
  function handleSave() {
    if (!desc.trim()) return
    onSave(parentId, desc.trim(), parseFloat(rate) || 0)
    onClose()
  }
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-xl max-w-sm w-full shadow-2xl border border-slate-200 flex flex-col animate-in fade-in zoom-in-95 duration-200 font-sans">
        <div className="p-3.5 border-b border-slate-100 bg-slate-50 rounded-t-xl flex justify-between items-center">
          <div>
            <h3 className="text-xs font-extrabold text-slate-950 flex items-center uppercase tracking-wide">
              <i className="fa-solid fa-folder-plus mr-1.5 text-blue-600"></i> Add Nested Deliverable
            </h3>
            <p className="text-[9px] text-slate-400 mt-0.5">Category: {parentDesc}</p>
          </div>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 transition-colors">
            <i className="fa-solid fa-xmark text-xs"></i>
          </button>
        </div>
        <div className="p-4 space-y-3 text-[11px]">
          <div>
            <label className="block text-[9px] font-bold uppercase text-slate-500 tracking-wider mb-1">Deliverable Name</label>
            <input type="text" value={desc} onChange={e => setDesc(e.target.value)} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800" placeholder="e.g. Schematic design details" />
          </div>
          <div>
            <label className="block text-[9px] font-bold uppercase text-slate-500 tracking-wider mb-1">Rate (PKR/Sq.Ft)</label>
            <input type="number" value={rate} onChange={e => setRate(e.target.value)} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-slate-800" placeholder="e.g. 15" />
          </div>
        </div>
        <div className="p-3 border-t border-slate-100 bg-slate-50 rounded-b-xl flex justify-end space-x-2">
          <button onClick={onClose} className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200 rounded transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded shadow-sm flex items-center transition-colors">
            <i className="fa-solid fa-check mr-1"></i> Add Deliverable
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Printable Report ─────────────────────────────────────────────────────────
function PrintableReport({ clientName, projectName, sqft, strategy, deliverables, milestones, invitationText, setInvitationText }) {
  const { subtotal, tax, grandTotal } = calcTotals(deliverables, sqft, strategy)
  const reportItems = deliverables.filter(i => i.checked && (i.isParent || i.id.startsWith('custom_')))

  return (
    <div className="border border-slate-300 bg-white rounded-lg shadow-lg max-w-2xl mx-auto text-slate-800 relative overflow-hidden" id="printableReportArea">
      <div className="brand-banner-bg h-3 w-full bg-slate-950"></div>
      <div className="p-5">
        {/* Letterhead */}
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 flex items-center justify-center bg-slate-950 text-white rounded shadow-md">
              <MoleculeLogo size={32} />
            </div>
            <div>
              <h2 className="text-sm font-extrabold tracking-wider text-slate-950 header-font leading-none">MOLECULE</h2>
              <p className="text-[8px] text-slate-500 tracking-widest uppercase font-bold mt-1 leading-none">Work Place Solution</p>
            </div>
          </div>
          <div className="text-right text-[9px] text-slate-500 space-y-0.5">
            <p className="font-black text-slate-900 text-xs uppercase leading-none">Official Proposal Report</p>
            <p className="font-semibold text-slate-700">Date: June 24, 2026</p>
            <p>Reference: <span className="font-mono text-slate-800">M-QT-2601</span></p>
            <p>Status: Version <span className="font-bold text-slate-800">1.0</span></p>
          </div>
        </div>

        {/* Project Info */}
        <div className="my-3 bg-slate-50 rounded border border-slate-200 p-2.5 grid grid-cols-3 gap-3 text-[10px]">
          <div>
            <span className="block text-[8px] text-slate-400 font-bold uppercase">PROPOSAL FOR</span>
            <span className="font-extrabold text-slate-900 block mt-0.5">{clientName || '--'}</span>
            <span className="text-[9px] text-slate-500 block">{projectName}</span>
          </div>
          <div>
            <span className="block text-[8px] text-slate-400 font-bold uppercase">TOTAL AREA</span>
            <span className="font-extrabold text-slate-900 block mt-0.5">{sqft ? Number(sqft).toLocaleString() : '0'} Sq. Ft.</span>
            <span className="text-[9px] text-slate-500 block">Calculated Multiplier</span>
          </div>
          <div>
            <span className="block text-[8px] text-slate-400 font-bold uppercase">PLAN STRATEGY</span>
            <span className="font-extrabold text-slate-900 block mt-0.5">{strategy === 'optimal' ? 'Optimal Plan' : 'Buffered Plan'}</span>
            <span className="text-[9px] text-slate-500 block">Base Rates Applied</span>
          </div>
        </div>

        {/* Editable invitation text */}
        <div className="relative group my-3">
          <div contentEditable suppressContentEditableWarning
            onBlur={e => setInvitationText(e.currentTarget.textContent)}
            className="text-[10px] text-slate-600 leading-relaxed outline-none border border-transparent hover:border-slate-300 focus:border-blue-500 p-1.5 rounded transition-all cursor-pointer font-medium">
            {invitationText}
          </div>
          <div className="absolute right-1 top-1 text-[8px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none select-none">
            <i className="fa-solid fa-pen-to-magic text-xs"></i>
          </div>
        </div>

        {/* Items Table */}
        <div className="my-3 border border-slate-200 rounded overflow-hidden">
          <table className="w-full text-left text-[10px] border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <th className="py-1.5 px-2.5">Consultancy Stage / Deliverables</th>
                <th className="py-1.5 px-2.5 text-right">Rate</th>
                <th className="py-1.5 px-2.5 text-right">Area sq.ft</th>
                <th className="py-1.5 px-2.5 text-right">Total PKR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reportItems.map(item => {
                const rate = strategy === 'optimal' ? item.optimalRate : item.bufferedRate
                const total = rate * sqft
                return (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50 text-slate-800">
                    <td className="py-1.5 px-3 text-slate-700 font-semibold">{item.description}</td>
                    <td className="py-1.5 px-3 text-right text-slate-500">{rate}</td>
                    <td className="py-1.5 px-3 text-right text-slate-500">{sqft ? Number(sqft).toLocaleString() : '0'}</td>
                    <td className="py-1.5 px-3 text-right font-bold text-slate-800">{formatPKR(total)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="my-3 p-2.5 bg-slate-50 rounded border border-slate-100 space-y-1 text-[11px]">
          <div className="flex justify-between text-slate-600">
            <span>Design Subtotal Fee:</span>
            <span className="font-bold text-slate-800">{formatPKR(subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-600 font-medium">
            <span>Sales Tax (SRB) Amount:</span>
            <span className="font-bold text-slate-800">{formatPKR(tax)}</span>
          </div>
          <div className="flex justify-between text-slate-900 font-black border-t border-slate-200 pt-1 text-[11px]">
            <span>TOTAL CONTRACT VALUE:</span>
            <span className="text-blue-700 font-black">{formatPKR(grandTotal)}</span>
          </div>
        </div>

        {/* Milestones */}
        <div className="my-3">
          <h4 className="text-[9px] font-bold uppercase text-slate-500 tracking-wider mb-1.5">Milestone Allocation Matrix</h4>
          <div className="grid grid-cols-2 gap-2">
            {milestones.map((stone, idx) => {
              const stoneGross = grandTotal * (stone.ratio / 100)
              return (
                <div key={idx} className="p-2 bg-slate-50 border border-slate-200 rounded">
                  <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-bold">{stone.label}</span>
                  <div className="flex justify-between items-baseline mt-1">
                    <span className="font-extrabold text-slate-700 text-[10px]">{stone.ratio}%</span>
                    <span className="font-black text-blue-800 text-[10px]">{formatPKR(stoneGross)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Signature */}
        <div className="mt-6 pt-3 border-t border-slate-100 flex justify-end text-center text-[10px]">
          <div className="w-1/2 max-w-[240px]">
            <div className="h-8 border-b border-slate-200 flex items-center justify-center">
              <span className="text-slate-300 text-[9px]">Client Signature Area</span>
            </div>
            <p className="text-[9px] font-bold text-slate-800 mt-1">Authorized Representative</p>
            <p className="text-[8px] text-slate-400">Accepted and Agreed</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-2 border-t border-slate-200 text-center text-[8px] text-slate-400 uppercase tracking-widest leading-none">
          Plot # 47-B, Main Khayaban-e-Shamsheer, Phase-V, DHA, Karachi, Pakistan. | sales@molecule.pk
        </div>
      </div>
    </div>
  )
}


// ─── Step 2: Spreadsheet ──────────────────────────────────────────────────────
function SpreadsheetView({ deliverables, setDeliverables, sqft, strategy }) {
  const [nestedPopup, setNestedPopup] = useState(null)

  const filtered = deliverables.filter(item => {
    if (item.section === 'Design Fees') return true
    if (item.section === 'Fit-Out Scope' || item.section === 'Custom Exclusions') {
      if (item.checked) return true
      const parent = deliverables.find(p => p.isParent && p.subItems?.includes(item.id))
      if (parent && parent.checked) return true
    }
    return false
  })

  function toggleItem(id, isChecked) {
    setDeliverables(prev => {
      const next = prev.map(item => {
        if (item.id === id) return { ...item, checked: isChecked }
        return item
      })
      const target = next.find(i => i.id === id)
      if (!target) return next
      if (target.isParent && target.subItems) {
        return next.map(item => target.subItems.includes(item.id) ? { ...item, checked: isChecked } : item)
      } else {
        const parent = next.find(p => p.isParent && p.subItems?.includes(id))
        if (parent) {
          const siblings = next.filter(s => parent.subItems.includes(s.id))
          const anyChecked = siblings.some(s => s.checked)
          return next.map(item => item.id === parent.id ? { ...item, checked: anyChecked } : item)
        }
      }
      return next
    })
  }

  function editRate(id, val) {
    const rateNum = parseFloat(val) || 0
    setDeliverables(prev => {
      const next = prev.map(item => {
        if (item.id !== id) return item
        return strategy === 'optimal' ? { ...item, optimalRate: rateNum } : { ...item, bufferedRate: rateNum }
      })
      const target = next.find(i => i.id === id)
      if (target?.isParent && target.subItems) {
        const children = next.filter(c => target.subItems.includes(c.id))
        const hasNonZero = children.some(c => (strategy === 'optimal' ? c.optimalRate : c.bufferedRate) > 0)
        if (hasNonZero) {
          const share = rateNum / target.subItems.length
          return next.map(item => {
            if (!target.subItems.includes(item.id)) return item
            return strategy === 'optimal' ? { ...item, optimalRate: share } : { ...item, bufferedRate: share }
          })
        }
      }
      return next
    })
  }

  function editTax(id, val) {
    const taxNum = Math.min(100, Math.max(0, parseFloat(val) || 0))
    setDeliverables(prev => {
      const next = prev.map(item => item.id === id ? { ...item, taxRate: taxNum } : item)
      var target = next.find(i => i.id === id)
      if (target?.isParent && target.subItems) {
        return next.map(item => target.subItems.includes(item.id) ? { ...item, taxRate: taxNum } : item)
      }
      return next;
    })
  }

  function removeRow(id) {
    setDeliverables(prev => {
      const target = prev.find(i => i.id === id)
      let next = prev.filter(i => i.id !== id)
      if (target?.isParent && target.subItems) {
        next = next.filter(i => !target.subItems.includes(i.id))
      }
      const parent = next.find(p => p.isParent && p.subItems?.includes(id))
      if (parent) {
        next = next.map(i => i.id === parent.id ? { ...i, subItems: i.subItems.filter(s => s !== id) } : i)
      }
      return next
    })
  }

  function handleNestedSave(parentId, desc, rate) {
    setDeliverables(prev => {
      const parent = prev.find(p => p.id === parentId)
      if (!parent) return prev
      const newId = `sub_${Date.now()}`
      const newItem = {
        id: newId, phase: parent.phase, code: `${(parent.subItems?.length || 0) + 1}`,
        description: desc, optimalRate: rate, bufferedRate: rate,
        isParent: false, checked: true, taxRate: parent.taxRate || 15, section: parent.section
      }
      let parentIndex = prev.findIndex(p => p.id === parentId)
      let insertIndex = parentIndex
      for (let i = parentIndex + 1; i < prev.length; i++) {
        if (parent.subItems?.includes(prev[i].id)) insertIndex = i
      }
      const next = [...prev]
      next.splice(insertIndex + 1, 0, newItem)
      return next.map(i => i.id === parentId ? { ...i, subItems: [...(i.subItems || []), newId] } : i)
    })
  }

  let groupSeq = 0

  return (
    <>
      <div className="flex-grow overflow-auto custom-scrollbar max-h-[420px] border border-slate-200 rounded-lg">
        <table className="w-full text-left border-collapse text-xs min-w-[800px]" id="spreadsheetTable">
          <thead>
            <tr className="bg-slate-900 text-white uppercase tracking-wider text-[10px] font-bold sticky top-0 z-10">
              <th className="py-2.5 px-3 w-8 text-center">Sel</th>
              <th className="py-2.5 px-2 w-12 text-center">Code</th>
              <th className="py-2.5 px-3">Design Deliverable &amp; Fit-Out Scope Packages</th>
              <th className="py-2.5 px-3 w-24 text-right">Rate/Sq.Ft (PKR)</th>
              <th className="py-2.5 px-3 w-24 text-right">Area sq. ft.</th>
              <th className="py-2.5 px-3 w-28 text-right">Total (PKR)</th>
              <th className="py-2.5 px-3 w-20 text-center">Tax %</th>
              <th className="py-2.5 px-3 w-28 text-right">Total PKR with Tax</th>
              <th className="py-2.5 px-2 w-10 text-center">Rem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filtered.map(item => {
              if (item.isParent) { groupSeq = 0 }
              else groupSeq++
              const rate = strategy === 'optimal' ? item.optimalRate : item.bufferedRate
              const tax = item.taxRate ?? 15
              const rowTotal = getRowTotal(item, deliverables, sqft, strategy)
              const gross = rowTotal * (1 + tax / 100)
              const code = item.isParent ? item.code : `${groupSeq}`
              const cleanDesc = item.isParent ? item.description : item.description.replace(/^↳\s*(?:\d+\.\s*)?/, '').trim()

              return (
                <tr key={item.id} className={`${item.isParent ? 'bg-slate-50 font-semibold text-slate-950 border-t border-slate-200' : 'hover:bg-slate-50/50 transition-colors'} ${item.checked ? 'bg-blue-50/30' : ''}`}>
                  <td className="py-2 px-3 text-center">
                    <input type="checkbox" checked={item.checked} onChange={e => toggleItem(item.id, e.target.checked)}
                      className="w-3.5 h-3.5 border-slate-300 rounded text-blue-600 focus:ring-blue-500 cursor-pointer" />
                  </td>
                  <td className="py-2 px-2 text-center font-bold text-[10px] text-slate-400 uppercase tracking-wider select-none">{code}</td>
                  <td className="py-2 px-3">
                    <div className={`flex items-center space-x-1.5 ${!item.isParent ? 'pl-5 text-slate-500 text-[11px]' : 'text-slate-800 font-bold'}`}>
                      {item.isParent && <span className="text-blue-600 text-[10px]"><i className="fa-solid fa-folder-open"></i></span>}
                      <span className="truncate max-w-[280px]" title={cleanDesc}>{cleanDesc}</span>
                      {item.isParent && (
                        <button onClick={() => setNestedPopup({ parentId: item.id, parentDesc: item.description })}
                          className="text-blue-600 hover:text-blue-800 ml-1.5 transition-all" title="Add Deliverable">
                          <i className="fa-solid fa-circle-plus text-xs"></i>
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-3 text-right">
                    <input type="number" defaultValue={rate} onBlur={e => editRate(item.id, e.target.value)}
                      className="w-16 text-right pr-1 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  </td>
                  <td className="py-2 px-3 text-right text-slate-600 font-medium select-none">{item.checked ? Number(sqft).toLocaleString() : '0'}</td>
                  <td className="py-2 px-3 text-right font-bold text-slate-800">{formatPKR(rowTotal)}</td>
                  <td className="py-2 px-3 text-center">
                    <div className="inline-flex items-center justify-center">
                      <input type="number" defaultValue={tax} min="0" max="100" onBlur={e => editTax(item.id, e.target.value)}
                        className="w-12 text-center py-0.5 bg-white border border-slate-200 rounded text-[11px] font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                      <span className="text-slate-400 ml-0.5">%</span>
                    </div>
                  </td>
                  <td className="py-2 px-3 text-right font-bold text-slate-800">{formatPKR(gross)}</td>
                  <td className="py-2 px-3 text-center">
                    <button onClick={() => removeRow(item.id)} className="text-slate-300 hover:text-red-500 transition-colors p-0.5" title="Remove">
                      <i className="fa-solid fa-trash-can text-[10px]"></i>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {nestedPopup && (
        <NestedItemPopup parentId={nestedPopup.parentId} parentDesc={nestedPopup.parentDesc}
          onClose={() => setNestedPopup(null)} onSave={handleNestedSave} />
      )}
    </>
  )
}

// ─── Step 3: Milestones & Timeline ───────────────────────────────────────────
function MilestonesPanel({ milestones, setMilestones, subtotal, tax, grandTotal }) {
  function updateLabel(idx, val) {
    setMilestones(prev => prev.map((m, i) => i === idx ? { ...m, label: val } : m))
  }
  function updateRatio(idx, val) {
    let num = Math.min(100, Math.max(0, parseInt(val) || 0))
    setMilestones(prev => {
      const next = prev.map((m, i) => i === idx ? { ...m, ratio: num } : m)
      if (next.length === 2) {
        const other = idx === 0 ? 1 : 0
        next[other] = { ...next[other], ratio: 100 - num }
      }
      return next
    })
  }
  function addRow() {
    const sum = milestones.reduce((s, m) => s + m.ratio, 0)
    const remaining = Math.max(0, 100 - sum)
    setMilestones(prev => [...prev, { label: `Payment Stage ${prev.length + 1}`, ratio: remaining }])
  }
  function removeRow(idx) {
    if (milestones.length <= 1) return
    setMilestones(prev => prev.filter((_, i) => i !== idx))
  }
  function evenSplit() {
    const count = milestones.length
    if (!count) return
    const base = Math.floor(100 / count)
    const rem = 100 % count
    setMilestones(prev => prev.map((m, i) => ({ ...m, ratio: base + (i < rem ? 1 : 0) })))
  }
  function reset5050() {
    setMilestones([{ label:'Payment One - (ADVANCE)', ratio:50 }, { label:'Payment Two - Completion of Handover Deliverables', ratio:50 }])
  }

  const totalRatio = milestones.reduce((s, m) => s + m.ratio, 0)

  return (
    <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-slate-900 text-[12px] flex items-center">
          <i className="fa-solid fa-credit-card mr-1.5 text-blue-600"></i> Payment Schedule / Milestones
        </h3>
        <div className="flex space-x-1">
          <button onClick={addRow} className="text-[9px] bg-blue-600 hover:bg-blue-700 text-white font-bold px-1.5 py-0.5 rounded shadow-sm transition-colors">+ Add</button>
          <button onClick={evenSplit} className="text-[9px] bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-1.5 py-0.5 rounded border border-slate-300 transition-colors">Equal Split</button>
          <button onClick={reset5050} className="text-[9px] text-blue-600 hover:underline font-bold pl-1">Reset (50/50)</button>
        </div>
      </div>
      <div className="space-y-3">
        {milestones.map((stone, idx) => {
          const stoneNet = subtotal * (stone.ratio / 100)
          const stoneGross = grandTotal * (stone.ratio / 100)
          return (
            <div key={idx} className="p-2.5 bg-white border border-slate-200 rounded-lg space-y-2 shadow-sm hover:shadow transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                <input type="text" value={stone.label} onChange={e => updateLabel(idx, e.target.value)}
                  className="flex-grow font-bold text-slate-800 uppercase bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-slate-50 focus:outline-none px-1 rounded transition-all truncate" />
                <div className="flex items-center space-x-1.5 flex-shrink-0">
                  <span className="text-slate-400 font-medium">Ratio:</span>
                  <div className="relative w-14">
                    <input type="number" value={stone.ratio} min="0" max="100" onChange={e => updateRatio(idx, e.target.value)}
                      className="w-full text-right pr-4 pl-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-[11px]" />
                    <span className="absolute inset-y-0 right-1.5 flex items-center text-[9px] text-slate-400 font-bold select-none">%</span>
                  </div>
                  {milestones.length > 1 && (
                    <button onClick={() => removeRow(idx)} className="text-slate-300 hover:text-red-500 transition-colors pl-1" title="Delete">
                      <i className="fa-solid fa-trash-can text-xs"></i>
                    </button>
                  )}
                </div>
              </div>
              <input type="range" min="0" max="100" value={stone.ratio} onChange={e => updateRatio(idx, e.target.value)}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
              <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-slate-100 text-[10px]">
                <div>
                  <span className="block text-[8px] text-slate-400 uppercase font-semibold">Net Stage</span>
                  <span className="font-bold text-slate-700 block mt-0.5">{formatPKR(stoneNet)}</span>
                </div>
                <div>
                  <span className="block text-[8px] text-blue-500 uppercase font-bold">Gross Stage</span>
                  <span className="font-bold text-blue-700 block mt-0.5">{formatPKR(stoneGross)}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="pt-1.5 flex justify-between items-center text-[10px] text-slate-500 border-t border-slate-100">
        <span>Sum Total: <span className={`font-extrabold ${totalRatio !== 100 ? 'text-red-500 animate-pulse' : 'text-slate-900'}`}>{totalRatio}%</span></span>
        {totalRatio !== 100 && <span className="text-red-500 font-bold"><i className="fa-solid fa-circle-exclamation mr-1"></i>Ratios must sum to 100%</span>}
      </div>
    </div>
  )
}

function TimelinePanel({ timelinePhases, setTimelinePhases }) {
  function updateProp(idx, key, val) {
    setTimelinePhases(prev => prev.map((p, i) => i === idx ? { ...p, [key]: val } : p))
  }
  function addPhase() {
    const n = timelinePhases.length + 1
    setTimelinePhases(prev => [...prev, { title:`Project Stage ${n}`, days:30, badge:`Phase ${n}` }])
  }
  function removePhase(idx) {
    if (timelinePhases.length <= 1) return
    setTimelinePhases(prev => prev.filter((_, i) => i !== idx))
  }
  const totalDays = timelinePhases.reduce((s, p) => s + (p.days || 0), 0)
  const totalMonths = (totalDays / 30).toFixed(1)

  return (
    <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-slate-950 text-[12px] flex items-center">
          <i className="fa-solid fa-calendar-days mr-1.5 text-blue-600"></i> Schedule Timeline Assumptions
        </h3>
        <button onClick={addPhase} className="text-[9px] bg-blue-600 hover:bg-blue-700 text-white font-bold px-2 py-0.5 rounded shadow-sm transition-colors">+ Add Phase</button>
      </div>
      <div className="space-y-2">
        {timelinePhases.map((phase, idx) => (
          <div key={idx} className="p-2 bg-white border border-slate-100 rounded-lg flex flex-col space-y-1.5 shadow-sm">
            <div className="flex items-center justify-between gap-1.5">
              <div className="flex-grow grid grid-cols-12 gap-1.5">
                <div className="col-span-6">
                  <input type="text" value={phase.title} onChange={e => updateProp(idx, 'title', e.target.value)}
                    className="w-full text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 rounded px-1.5 py-0.5 focus:outline-none" />
                </div>
                <div className="col-span-3 relative">
                  <input type="number" value={phase.days} onChange={e => updateProp(idx, 'days', parseInt(e.target.value) || 0)}
                    className="w-full text-xs font-bold text-slate-800 text-right bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 rounded pl-1 pr-5 py-0.5 focus:outline-none" min="0" />
                  <span className="absolute inset-y-0 right-1.5 flex items-center text-[8px] font-bold text-slate-400 select-none">d</span>
                </div>
                <div className="col-span-3">
                  <input type="text" value={phase.badge} onChange={e => updateProp(idx, 'badge', e.target.value)}
                    className="w-full text-[9px] uppercase font-bold text-slate-500 text-center bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 rounded px-1 py-0.5 focus:outline-none" />
                </div>
              </div>
              {timelinePhases.length > 1 && (
                <button onClick={() => removePhase(idx)} className="text-slate-300 hover:text-red-500 transition-colors px-1">
                  <i className="fa-solid fa-trash-can text-xs"></i>
                </button>
              )}
            </div>
            <div className="text-[9px] text-slate-400 text-right pr-1">Estimated duration: ~{(phase.days / 30).toFixed(1)} Months</div>
          </div>
        ))}
      </div>
      <div className="bg-blue-50 border border-blue-100 text-blue-800 text-[11px] p-2.5 rounded-lg font-bold flex justify-between items-center mt-1">
        <span>Commencement to Total Handover:</span>
        <span className="text-xs text-blue-950 font-black">{totalDays} Days (~{totalMonths} Months)</span>
      </div>
    </div>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  // Core state
  const [clientName, setClientName] = useState('Engro Polymer')
  const [projectName, setProjectName] = useState('Workspace Extension Project')
  const [sqft, setSqft] = useState(5130)
  const [strategy, setStrategy] = useState('optimal')
  const [currentStep, setCurrentStep] = useState(1)
  const [darkMode, setDarkMode] = useState(false)
  const [deliverables, setDeliverables] = useState(JSON.parse(JSON.stringify(INITIAL_DELIVERABLES)))
  const [milestones, setMilestones] = useState(JSON.parse(JSON.stringify(INITIAL_MILESTONES)))
  const [timelinePhases, setTimelinePhases] = useState(JSON.parse(JSON.stringify(INITIAL_TIMELINE)))
  const [savedProposals, setSavedProposals] = useState(JSON.parse(JSON.stringify(INITIAL_PROPOSALS)))
  const [loadedVersionId, setLoadedVersionId] = useState(null)
  const [notification, setNotification] = useState(null)
  const [showScopePopup, setShowScopePopup] = useState(false)
  const [versionsOpen, setVersionsOpen] = useState(false)
  const [versionSearch, setVersionSearch] = useState('')
  const [showSyncModal, setShowSyncModal] = useState(false)
  const [syncUrl, setSyncUrl] = useState(() => localStorage.getItem('molecule_sync_url') || '')
  const [spreadsheetId, setSpreadsheetId] = useState(() => localStorage.getItem('molecule_spreadsheet_id') || '1McyNBt4J8vM4_KjezCWjAAW366AmA2ns_N5R6WrrgEM')
  const [syncing, setSyncing] = useState(false)
  const [activeSheetInfo, setActiveSheetInfo] = useState({ name: '', id: '' })
  
  const versionsRef = useRef(null)
  const [invitationText, setInvitationText] = useState(
    'We appreciate you giving us the opportunity to present this design proposal and service breakdown. Our workplace pricing engine handles each individual section precisely to match your budget targets. All selected project consultancy fees scale based on our verified area consideration.'
  )

  // Dynamically load FontAwesome to ensure icons show up instantly
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    document.head.appendChild(link)
    return () => {
      document.head.removeChild(link)
    }
  }, [])

  // On Mount: Auto-fetch existing proposals from Google Sheet if a valid URL is configured
  useEffect(() => {
    if (!syncUrl) return
    if (!syncUrl.startsWith('http://') && !syncUrl.startsWith('https://')) {
      return
    }
    setSyncing(true)
    
    const fetchUrl = spreadsheetId 
      ? `${syncUrl}?spreadsheetId=${encodeURIComponent(spreadsheetId)}` 
      : syncUrl;

    fetch(fetchUrl)
      .then(res => {
        if (!res.ok) throw new Error('Network response not ok')
        return res.json()
      })
      .then(res => {
        if (res.status === 'success') {
          if (res.data && res.data.length > 0) {
            setSavedProposals(res.data)
          }
          if (res.sheetName) {
            setActiveSheetInfo({ name: res.sheetName, id: res.sheetId || '' })
          }
        }
      })
      .catch(err => {
        console.warn("Silent cloud synchronizer sync block prevented:", err)
      })
      .finally(() => setSyncing(false))
  }, [syncUrl, spreadsheetId])

  // Dark mode effect
  useEffect(() => {
    document.body.classList.toggle('dark-theme', darkMode)
  }, [darkMode])

  // Close the Quote History dropdown when clicking anywhere else in the app
  useEffect(() => {
    if (!versionsOpen) return
    function handleOutsideClick(e) {
      if (versionsRef.current && !versionsRef.current.contains(e.target)) {
        setVersionsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [versionsOpen])

  const { subtotal, tax, grandTotal } = calcTotals(deliverables, sqft, strategy)

  // Status tag
  let statusTag = 'Unsaved workspace draft'
  let statusClass = 'text-[10px] text-slate-500 font-bold font-sans'
  if (loadedVersionId) {
    statusTag = `Version ${loadedVersionId} Active (Saved)`
    statusClass = 'text-[10px] text-green-600 font-bold font-sans'
  }

  function showNotif(title, text) { setNotification({ title, text }) }

  // Test Connection helper inside the Cloud Settings Modal
  function handleTestConnection(url, id, callback) {
    if (!url.trim().startsWith('http://') && !url.trim().startsWith('https://')) {
      showNotif('Invalid URL', 'Please make sure your Apps Script Web App URL starts with http:// or https://')
      if (callback) callback()
      return
    }
    
    const testUrl = id ? `${url}?spreadsheetId=${encodeURIComponent(id)}` : url;

    fetch(testUrl)
      .then(res => res.json())
      .then(res => {
        if (res.status === 'success') {
          showNotif('Connection Valid!', `Successfully verified spreadsheet endpoint. Fetched ${res.data ? res.data.length : 0} archived versions. Workbook is active!`)
          if (res.sheetName) {
            setActiveSheetInfo({ name: res.sheetName, id: res.sheetId || '' })
          }
        } else {
          showNotif('Handshake Failed', `Server responded with error: ${res.message}`)
        }
      })
      .catch(err => {
        showNotif('Offline or Invalid URL', `Unable to contact Apps Script: ${err.message}. Ensure CORS or "Anyone" permissions are enabled for your Web App deployment.`)
      })
      .finally(() => {
        if (callback) callback()
      })
  }

  function triggerNewQuotation() {
    setClientName(''); setSqft(0); setStrategy('optimal'); setLoadedVersionId(null)
    setDeliverables(JSON.parse(JSON.stringify(INITIAL_DELIVERABLES)))
    setMilestones(JSON.parse(JSON.stringify(INITIAL_MILESTONES)))
    setTimelinePhases(JSON.parse(JSON.stringify(INITIAL_TIMELINE)))
    setCurrentStep(1)
    showNotif('New Quotation Initialized', 'Client details, square footage and plan matrices have been reset to a pristine draft.')
  }

  function triggerSaveVersion(forceSaveAsNew = false) {
    const clientSavedCount = savedProposals.filter(p => p.clientName.toLowerCase() === clientName.toLowerCase()).length
    let targetId = loadedVersionId
    if (forceSaveAsNew || !loadedVersionId) {
      targetId = `v${(clientSavedCount + 1).toFixed(1)}`
    }
    const snapshot = {
      id: targetId, clientName: clientName || 'Unspecified Client',
      projectName: projectName || 'Workspace Extension Project',
      sqft, strategy, subtotal, grandTotal, tax,
      timestamp: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }),
      milestones: JSON.parse(JSON.stringify(milestones)),
      timelinePhases: JSON.parse(JSON.stringify(timelinePhases)),
      deliverables: JSON.parse(JSON.stringify(deliverables))
    }

    // ─── STABLE PRINTING PDF ENGINE BLUEPRINT COMPILER ────────────────────────
    // Programmatically generates a table-based document layout to ensure perfect visual alignment on Drive
    const reportItems = deliverables.filter(i => i.checked && (i.isParent || i.id.startsWith('custom_')));
    
    let itemsTableRowsHtml = "";
    reportItems.forEach(item => {
      const rate = strategy === 'optimal' ? item.optimalRate : item.bufferedRate;
      const total = rate * sqft;
      itemsTableRowsHtml += `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px 12px; font-size: 13px; color: #334155; text-align: left; font-weight: bold;">${item.description}</td>
          <td style="padding: 10px 12px; font-size: 13px; color: #64748b; text-align: right;">${rate}</td>
          <td style="padding: 10px 12px; font-size: 13px; color: #64748b; text-align: right;">${Number(sqft).toLocaleString()}</td>
          <td style="padding: 10px 12px; font-size: 13px; color: #0f172a; text-align: right; font-weight: bold;">${formatPKR(total)}</td>
        </tr>
      `;
    });

    let milestoneCardsHtml = "";
    milestones.forEach(stone => {
      const stoneGross = grandTotal * (stone.ratio / 100);
      milestoneCardsHtml += `
        <td width="${100 / milestones.length}%" style="padding-right: 10px;">
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 6px;">
            <span style="font-size: 10px; text-transform: uppercase; color: #94a3b8; font-weight: bold; display: block; letter-spacing: 0.5px;">${stone.label}</span>
            <table width="100%" style="margin-top: 6px;">
              <tr>
                <td style="font-size: 14px; font-weight: 800; color: #475569;">${stone.ratio}%</td>
                <td style="font-size: 14px; font-weight: 900; color: #1e40af; text-align: right;">${formatPKR(stoneGross)}</td>
              </tr>
            </table>
          </div>
        </td>
      `;
    });

    const compiledReportHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 30px; background-color: #ffffff; color: #1e293b; line-height: 1.5; }
            table { border-collapse: collapse; }
          </style>
        </head>
        <body>
          <div style="max-width: 760px; margin: 0 auto; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
            <div style="height: 12px; background: #0f172a;"></div>
            
            <div style="padding: 24px;">
              <table width="100%" style="border-bottom: 2px solid #0f172a; padding-bottom: 16px;">
                <tr>
                  <td style="vertical-align: middle;">
                    <div style="font-size: 22px; font-weight: 900; color: #0f172a; letter-spacing: 1px; line-height: 1;">MOLECULE</div>
                    <div style="font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: bold; letter-spacing: 2px; margin-top: 4px;">Work Place Solution</div>
                  </td>
                  <td style="text-align: right; vertical-align: middle;">
                    <div style="font-size: 14px; font-weight: 900; color: #0f172a; text-transform: uppercase;">Official Proposal Report</div>
                    <div style="font-size: 11px; color: #475569; margin-top: 2px;">Date: June 24, 2026</div>
                    <div style="font-size: 11px; color: #475569;">Reference: <span style="font-family: monospace;">M-QT-2601</span></div>
                    <div style="font-size: 11px; color: #475569;">Status: Version <span style="font-weight: bold;">1.0</span></div>
                  </td>
                </tr>
              </table>

              <table width="100%" style="margin-top: 20px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px;">
                <tr>
                  <td width="33.33%" style="vertical-align: top;">
                    <span style="font-size: 9px; color: #94a3b8; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">PROPOSAL FOR</span>
                    <div style="font-size: 13px; font-weight: 800; color: #0f172a; margin-top: 2px;">${clientName || '--'}</div>
                    <div style="font-size: 11px; color: #64748b;">${projectName}</div>
                  </td>
                  <td width="33.33%" style="vertical-align: top; padding-left: 10px;">
                    <span style="font-size: 9px; color: #94a3b8; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">TOTAL AREA</span>
                    <div style="font-size: 13px; font-weight: 800; color: #0f172a; margin-top: 2px;">${sqft ? Number(sqft).toLocaleString() : '0'} Sq. Ft.</div>
                    <div style="font-size: 11px; color: #64748b;">Calculated Multiplier</div>
                  </td>
                  <td width="33.33%" style="vertical-align: top; padding-left: 10px;">
                    <span style="font-size: 9px; color: #94a3b8; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">PLAN STRATEGY</span>
                    <div style="font-size: 13px; font-weight: 800; color: #0f172a; margin-top: 2px;">${strategy === 'optimal' ? 'Optimal Plan' : 'Buffered Plan'}</div>
                    <div style="font-size: 11px; color: #64748b;">Base Rates Applied</div>
                  </td>
                </tr>
              </table>

              <div style="margin-top: 20px; font-size: 12px; color: #475569; line-height: 1.6; text-align: justify;">
                ${invitationText}
              </div>

              <table width="100%" style="margin-top: 24px; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden;">
                <thead>
                  <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                    <th style="padding: 10px 12px; font-size: 11px; text-transform: uppercase; color: #475569; text-align: left; font-weight: bold;">Consultancy Stage / Deliverables</th>
                    <th style="padding: 10px 12px; font-size: 11px; text-transform: uppercase; color: #475569; text-align: right; font-weight: bold; width: 80px;">Rate</th>
                    <th style="padding: 10px 12px; font-size: 11px; text-transform: uppercase; color: #475569; text-align: right; font-weight: bold; width: 100px;">Area sq.ft</th>
                    <th style="padding: 10px 12px; font-size: 11px; text-transform: uppercase; color: #475569; text-align: right; font-weight: bold; width: 120px;">Total PKR</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsTableRowsHtml}
                </tbody>
              </table>

              <table width="100%" style="margin-top: 20px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px;">
                <tr>
                  <td style="font-size: 13px; color: #475569; padding-bottom: 6px;">Design Subtotal Fee:</td>
                  <td style="font-size: 13px; font-weight: bold; color: #0f172a; text-align: right; padding-bottom: 6px;">${formatPKR(subtotal)}</td>
                </tr>
                <tr>
                  <td style="font-size: 13px; color: #475569; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Sales Tax (SRB) Amount:</td>
                  <td style="font-size: 13px; font-weight: bold; color: #0f172a; text-align: right; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">${formatPKR(tax)}</td>
                </tr>
                <tr>
                  <td style="font-size: 13px; font-weight: 900; color: #0f172a; padding-top: 8px;">TOTAL CONTRACT VALUE:</td>
                  <td style="font-size: 14px; font-weight: 900; color: #1d4ed8; text-align: right; padding-top: 8px;">${formatPKR(grandTotal)}</td>
                </tr>
              </table>

              <div style="margin-top: 24px;">
                <span style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; display: block; margin-bottom: 8px;">Milestone Allocation Matrix</span>
                <table width="100%">
                  <tr>
                    ${milestoneCardsHtml}
                  </tr>
                </table>
              </div>

              <table width="100%" style="margin-top: 40px;">
                <tr>
                  <td width="50%"></td>
                  <td width="50%" style="text-align: center;">
                    <div style="border-bottom: 1px solid #cbd5e1; height: 35px; width: 220px; margin: 0 auto;"></div>
                    <div style="font-size: 12px; font-weight: bold; color: #334155; margin-top: 6px;">Authorized Representative</div>
                    <div style="font-size: 10px; color: #94a3b8;">Accepted and Agreed</div>
                  </td>
                </tr>
              </table>

              <div style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 12px; text-align: center; font-size: 9px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">
                Plot # 47-B, Main Khayaban-e-Shamsheer, Phase-V, DHA, Karachi, Pakistan. | sales@molecule.pk
              </div>

            </div>
          </div>
        </body>
      </html>
    `;

    if (syncUrl && (syncUrl.startsWith('http://') || syncUrl.startsWith('https://'))) {
      setSyncing(true)
      fetch(syncUrl, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          spreadsheetId: spreadsheetId,
          versionId: targetId,
          clientName: clientName || 'Unspecified Client',
          projectName: projectName || 'Workspace Extension Project',
          sqft,
          strategy,
          subtotal,
          tax,
          grandTotal,
          reportHtml: compiledReportHtml,
          snapshot: snapshot
        })
      })
      .then(res => {
        if (!res.ok) throw new Error('Failed to upload data')
        return res.json()
      })
      .then(res => {
        if (res.status === 'success') {
          setSavedProposals(res.data)
          setLoadedVersionId(targetId)
          if (res.reportLink && res.reportLink.startsWith("Pending")) {
            showNotif(
              `Quotation Saved (Drive Authorization Pending)`, 
              `Proposal successfully saved to Google Sheets "Versions" tab!\n\nHowever, Google Drive PDF creation is locked because permissions are pending. Please run 'triggerAuthorization' inside Apps Script once to approve access.`
            );
          } else {
            showNotif(`Saved & Deployed (Version ${targetId})`, `Proposal successfully archived!\n\n1. Metrics recorded in Google Sheet "Versions" tab.\n2. Beautiful PDF matching your app layout compiled and uploaded to Drive!`)
          }
        } else {
          throw new Error(res.message || 'Apps Script returned error')
        }
      })
      .catch(err => {
        console.error("Cloud Sync write failed:", err)
        setSavedProposals(prev => [snapshot, ...prev])
        setLoadedVersionId(targetId)
        showNotif('Saved Locally (Sync Failed)', `Local database updated. Cloud write failed: ${err.message}`)
      })
      .finally(() => {
        setSyncing(false)
        setCurrentStep(1)
      })
    } else {
      if (!forceSaveAsNew && loadedVersionId) {
        setSavedProposals(prev => {
          const idx = prev.findIndex(p => p.clientName.toLowerCase() === clientName.toLowerCase() && p.id === loadedVersionId)
          if (idx !== -1) { const next = [...prev]; next[idx] = snapshot; return next }
          return [snapshot, ...prev]
        })
        showNotif('Snapshot Version Updated', `All changes saved back to local browser cache: ${loadedVersionId}.`)
      } else {
        setSavedProposals(prev => [snapshot, ...prev])
        showNotif(`Proposal Saved as Version ${targetId}`, `Quotation archived locally for ${clientName || 'Unspecified Client'}. Set up sync connection to save to Drive!`)
        setLoadedVersionId(targetId)
      }
      setCurrentStep(1)
    }
  }

  function restoreProposal(clientN, verId) {
    const config = savedProposals.find(p => p.clientName.toLowerCase() === clientN.toLowerCase() && p.id === verId)
    if (!config) return
    setClientName(config.clientName)
    setProjectName(config.projectName || 'Workspace Extension Project')
    setSqft(config.sqft)
    setStrategy(config.strategy)
    setLoadedVersionId(config.id)
    if (config.milestones) setMilestones(JSON.parse(JSON.stringify(config.milestones)))
    if (config.timelinePhases) setTimelinePhases(JSON.parse(JSON.stringify(config.timelinePhases)))
    if (config.deliverables) setDeliverables(JSON.parse(JSON.stringify(config.deliverables)))
    else setDeliverables(JSON.parse(JSON.stringify(INITIAL_DELIVERABLES)))
    setVersionsOpen(false)
    showNotif(`Restored ${config.id}`, `Successfully loaded proposal for ${config.clientName}.`)
    setCurrentStep(1)
  }

  function exitActiveVersionMode() {
    setLoadedVersionId(null)
    showNotif('Exited Edit Mode', 'You are now modifying a local draft. Saving will create a new version snapshot.')
  }

  function handleScopeApply(selectedMap, customDesc, customRate) {
    setDeliverables(prev => {
      let next = prev.map(item => {
        if (!(item.section === 'Fit-Out Scope' && item.isParent)) return item
        const isChecked = !!selectedMap[item.id]
        return { ...item, checked: isChecked }
      }).map(item => {
        const parent = prev.find(p => p.isParent && p.subItems?.includes(item.id) && p.section === 'Fit-Out Scope')
        if (parent) return { ...item, checked: !!selectedMap[parent.id] }
        return item
      })
      if (customDesc) {
        next = [...next, {
          id: `custom_${Date.now()}`, phase:'CUST', code:'Custom',
          description: customDesc, optimalRate: customRate, bufferedRate: customRate,
          isParent: false, checked: true, taxRate: 15, section:'Custom Exclusions'
        }]
      }
      return next
    })
    setShowScopePopup(false)
    showNotif('Scope Customization Applied', 'Selected packages injected into active calculation matrices.')
  }

  const displayedVersions = versionSearch.trim() === ''
    ? savedProposals
    : savedProposals.filter(p => p.clientName.toLowerCase().includes(versionSearch.toLowerCase()) || p.id.toLowerCase().includes(versionSearch.toLowerCase()))

  function handlePrint() {
    const reportEl = document.getElementById('printableReportArea')
    if (!reportEl) return

    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
      .map(n => n.outerHTML)
      .join('\n')

    const printWin = window.open('', '_blank', 'width=900,height=700')
    if (!printWin) return

    printWin.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <title>Molecule - Quotation Report</title>
        ${styles}
        <style>
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          body { margin: 0; padding: 10mm; background: white !important; font-family: 'Inter', sans-serif; }
          .brand-banner-bg { background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #2563eb 100%) !important; }
          #printableReportArea { border: none !important; box-shadow: none !important; max-width: 100% !important; }
          #no-print { display: flex; justify-content: flex-end; margin-bottom: 8px; }
          #no-print button { background: #ef4444; color: white; border: none; padding: 6px 14px; border-radius: 6px; font-size: 11px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 6px; }
          @media print { #no-print { display: none !important; } }
          @page { size: portrait; margin: 1cm; }
        </style>
      </head>
      <body>
        <div id="no-print">
          <button onclick="window.close()">
            <i class="fa-solid fa-xmark"></i> Cancel
          </button>
        </div>
        ${reportEl.outerHTML}
        <script>
          window.onload = function() { window.print(); }
        <\/script>
      </body>
      </html>
    `)
    printWin.document.close()
  }

  return (
    <div className="h-screen overflow-hidden flex flex-col text-slate-700 antialiased selection:bg-blue-500 selection:text-white font-sans">
      <style>{`
        body { background-color: #f1f5f9; transition: background-color 0.2s, color 0.2s; }
        body.dark-theme { background-color: #0b1220; }
        body.dark-theme .bg-white { background-color: #1e293b !important; }
        body.dark-theme .bg-slate-50,
        body.dark-theme .bg-slate-50\\/50 { background-color: #16203a !important; }
        body.dark-theme .border-slate-100,
        body.dark-theme .border-slate-200 { border-color: #334155 !important; }
        body.dark-theme .text-slate-500,
        body.dark-theme .text-slate-600,
        body.dark-theme .text-slate-700 { color: #94a3b8 !important; }
        body.dark-theme .text-slate-800,
        body.dark-theme .text-slate-900,
        body.dark-theme .text-slate-950 { color: #e2e8f0 !important; }
        body.dark-theme input,
        body.dark-theme select,
        body.dark-theme textarea { background-color: #0f172a !important; border-color: #334155 !important; color: #e2e8f0 !important; }
        body.dark-theme .row-selected { background-color: #064e3b !important; }
        
        /* Modern Scrollbars */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 9999px;
        }
        body.dark-theme .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
        }
      `}</style>

      {/* Global Syncing Block Overlay Loader */}
      {syncing && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-[1px] z-[99] flex flex-col items-center justify-center space-y-3">
          <div className="bg-white px-6 py-4 rounded-xl shadow-2xl border border-slate-200 flex items-center space-x-3">
            <i className="fa-solid fa-circle-notch animate-spin text-blue-600 text-lg"></i>
            <span className="text-xs font-bold text-slate-800">Synchronizing to Google Sheets & Drive...</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 flex items-center justify-center bg-transparent rounded text-white select-none">
              <MoleculeLogo size={32} />
            </div>
            <div>
              <h1 className="text-sm font-extrabold tracking-wider text-white header-font">MOLECULE</h1>
              <p className="text-[8px] text-slate-400 tracking-widest uppercase font-semibold">Work Place Solution</p>
            </div>
          </div>

          {activeSheetInfo.name && (
            <div className="hidden md:flex items-center space-x-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-[10px] text-slate-300 font-bold max-w-xs lg:max-w-md">
              <i className="fa-solid fa-file-excel text-emerald-400"></i>
              <span className="truncate font-sans uppercase tracking-wide">Bound: {activeSheetInfo.name}</span>
            </div>
          )}

          <div className="flex items-center space-x-2">
            {/* Cloud Connection Indicator */}
            <button onClick={() => setShowSyncModal(true)} className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border flex items-center space-x-1.5 transition-colors ${
              syncUrl 
                ? 'bg-emerald-950/40 border-emerald-800 hover:border-emerald-600 text-emerald-400' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}>
              <i className={`fa-solid ${syncUrl ? 'fa-cloud' : 'fa-cloud-arrow-up'} text-xs`}></i>
              <span className="hidden sm:inline">{syncUrl ? 'CLOUD SYNC ACTIVE' : 'CONNECT CLOUD'}</span>
              <span className={`w-1.5 h-1.5 rounded-full inline-block ${syncUrl ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            </button>

            {/* Quote History */}
            <div className="relative" ref={versionsRef}>
              <button onClick={() => setVersionsOpen(v => !v)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-slate-700 transition-colors flex items-center space-x-1">
                <i className="fa-solid fa-clock-rotate-left text-[9px] text-blue-400"></i>
                <span>QUOTE HISTORY</span>
                <i className="fa-solid fa-chevron-down text-[8px] ml-1"></i>
              </button>
              {versionsOpen && (
                <div className="absolute right-0 mt-1.5 w-80 bg-white border border-slate-200 rounded-lg shadow-xl z-50 py-1 text-left animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100 bg-slate-50">
                    <div className="relative mb-1">
                      <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-slate-400 pointer-events-none"><i className="fa-solid fa-magnifying-glass text-[9px]"></i></span>
                      <input type="text" value={versionSearch} onChange={e => setVersionSearch(e.target.value)} placeholder="Search client, version..."
                        className="w-full pl-6 pr-2 py-1 text-[10px] border border-slate-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-slate-700" />
                    </div>
                    <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                      {versionSearch ? `Search Results (${displayedVersions.length})` : `All Saved Proposals (${displayedVersions.length})`}
                    </p>
                  </div>
                  <div className="max-h-72 overflow-y-auto custom-scrollbar divide-y divide-slate-100 font-sans">
                    {displayedVersions.length === 0
                      ? <div className="text-center py-5 text-slate-400 text-[10px]"><i className="fa-solid fa-box-open text-xs mb-1 block"></i>No versions archived yet</div>
                      : displayedVersions.map(p => (
                        <button key={p.id} onClick={() => restoreProposal(p.clientName, p.id)}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 transition-colors flex justify-between items-center text-[10px]">
                          <div className="truncate pr-2">
                            <span className="font-bold text-blue-600 text-[9px] block uppercase">{p.id}</span>
                            <h4 className="font-extrabold text-slate-800 truncate">{p.clientName}</h4>
                            <span className="text-[8px] text-slate-400 block font-semibold">{Number(p.sqft).toLocaleString()} SqFt &bull; {p.timestamp}</span>
                            {p.reportLink && p.reportLink.startsWith("http") && (
                              <a href={p.reportLink} target="_blank" rel="noopener noreferrer" className="text-[8px] text-emerald-600 hover:underline font-extrabold flex items-center gap-0.5 mt-0.5" onClick={e => e.stopPropagation()}>
                                <i className="fa-solid fa-file-pdf"></i> View PDF Report
                              </a>
                            )}
                          </div>
                          <div className="text-right text-[10px] flex-shrink-0">
                            <span className="font-black text-slate-900 block">{formatPKR(p.grandTotal)}</span>
                            <span className="text-[8px] text-blue-500 font-bold block">Restore</span>
                          </div>
                        </button>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>
            {/* Theme toggle */}
            <button onClick={() => setDarkMode(d => !d)} className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors border border-slate-700" title="Toggle Theme">
              <i className={`fa-solid ${darkMode ? 'fa-sun text-yellow-400' : 'fa-moon'} text-xs`}></i>
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 min-h-0 overflow-hidden max-w-[1400px] w-full mx-auto px-4 py-4 flex flex-col gap-3">
        {/* Active version banner */}
        {loadedVersionId && (
          <div className="w-full flex-shrink-0 bg-blue-50 border border-blue-200 rounded-xl p-3 flex justify-between items-center text-xs text-blue-800 font-semibold shadow-sm">
            <div className="flex items-center space-x-2">
              <i className="fa-solid fa-file-pen text-sm text-blue-600"></i>
              <span>You are currently editing saved snapshot: <span className="font-extrabold text-blue-950">{loadedVersionId}</span>. Changes can be saved back to this snapshot.</span>
            </div>
            <button onClick={exitActiveVersionMode} className="text-[10px] font-bold uppercase text-blue-900 hover:text-red-500 transition-colors">Exit Edit Mode</button>
          </div>
        )}

        {/* Wizard Card */}
        <div className="w-full flex-1 min-h-0 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Step header */}
          <div className="bg-slate-50 border-b border-slate-200 p-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-2.5">
              <button onClick={() => currentStep > 1 && setCurrentStep(s => s - 1)}
                style={{ visibility: currentStep === 1 ? 'hidden' : 'visible' }}
                className="flex items-center justify-center w-7 h-7 rounded hover:bg-slate-200 text-slate-600 transition-colors">
                <i className="fa-solid fa-arrow-left text-xs"></i>
              </button>
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Step {currentStep} of 3</span>
                <h2 className="text-xs font-extrabold text-slate-950">
                  {currentStep === 1 ? 'Setup Project Details' : currentStep === 2 ? 'Add & Configure Work Scope' : 'Payment Schedule Milestones & Report Preview'}
                </h2>
              </div>
            </div>
            {/* Step dots */}
            <div className="flex items-center space-x-1.5 mr-2">
              {[1,2,3].map((step, i) => (
                <div key={step} className="flex items-center">
                  {i > 0 && <div className={`w-4 h-0.5 ${currentStep >= step ? 'bg-blue-600' : 'bg-slate-200'} mr-1.5`}></div>}
                  <button onClick={() => setCurrentStep(step)}
                    className={`w-4 h-4 rounded-full flex items-center justify-center transition-all hover:scale-110 cursor-pointer focus:outline-none ${currentStep >= step ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    <span className={`text-[8px] font-bold leading-none ${currentStep >= step ? 'text-white' : 'text-slate-600'}`}>{step}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 1 */}
          {currentStep === 1 && (
            <div className="p-6 flex-1 min-h-0 overflow-y-auto custom-scrollbar flex flex-col justify-start items-center w-full">
              <div className="max-w-xl w-full space-y-4">
                <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Configure Base Criteria</h3>
                  <button onClick={triggerNewQuotation} className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm transition-colors flex items-center space-x-1">
                    <i className="fa-solid fa-plus text-[9px]"></i><span>NEW QUOTE</span>
                  </button>
                </div>
                <div className="w-full bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4 shadow-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-1">Client Name</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-slate-400"><i className="fa-solid fa-building text-xs"></i></span>
                        <input type="text" value={clientName} onChange={e => setClientName(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-xs text-slate-800"
                          placeholder="e.g. Engro Polymer" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-1">Project Name</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-slate-400"><i className="fa-solid fa-folder-open text-xs"></i></span>
                        <input type="text" value={projectName} onChange={e => setProjectName(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-xs text-slate-800"
                          placeholder="e.g. Head Office Interior" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-1">Total Square Footage (Sq. Ft.)</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-slate-400"><i className="fa-solid fa-ruler-combined text-xs"></i></span>
                        <input type="number" value={sqft} onChange={e => setSqft(parseInt(e.target.value) || 0)}
                          className="w-full pl-8 pr-10 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-xs text-slate-800" />
                        <span className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[9px] font-bold text-slate-400 select-none">SqFt</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-1">Packages</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-slate-400"><i className="fa-solid fa-sliders text-xs"></i></span>
                        <select value={strategy} onChange={e => setStrategy(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-xs text-slate-800 cursor-pointer appearance-none">
                          <option value="optimal">Optimal Plan (Standard)</option>
                          <option value="buffered">Buffered Plan</option>
                        </select>
                        <span className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 pointer-events-none text-[10px]"><i className="fa-solid fa-chevron-down"></i></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div className="flex flex-col flex-1 min-h-0">
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px] flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-slate-500">Client:</span>
                  <span className="font-bold text-slate-900 bg-white border border-slate-200 px-2.5 py-0.5 rounded">{clientName || '--'}</span>
                  <span className="font-medium text-slate-500">Total SQ. FT.:</span>
                  <span className="font-bold text-slate-900 bg-white border border-slate-200 px-2.5 py-0.5 rounded">{Number(sqft).toLocaleString()} Sq. Ft</span>
                </div>
                <button onClick={() => setShowScopePopup(true)} className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center shadow-sm">
                  <i className="fa-solid fa-plus mr-1.5"></i> Add Scope / Package
                </button>
              </div>
              <SpreadsheetView deliverables={deliverables} setDeliverables={setDeliverables} sqft={sqft} strategy={strategy} />
            </div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <div className="p-4 flex-1 min-h-0 flex flex-col space-y-4 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <MilestonesPanel milestones={milestones} setMilestones={setMilestones} subtotal={subtotal} tax={tax} grandTotal={grandTotal} />
                <TimelinePanel timelinePhases={timelinePhases} setTimelinePhases={setTimelinePhases} />
              </div>
              {/* Report */}
              <div className="border border-slate-200 rounded-xl bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                  <h4 className="font-extrabold text-slate-900 text-xs flex items-center">
                    <i className="fa-solid fa-file-invoice-dollar mr-1.5 text-blue-600"></i> Corporate Quotation Report
                  </h4>
                  <div className="flex items-center space-x-2">
                    <button onClick={handlePrint}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-semibold px-2.5 py-1.5 rounded shadow-sm flex items-center transition-all active:scale-95">
                      <i className="fa-solid fa-print mr-1.5"></i> Print / Save PDF
                    </button>
                    <button onClick={() => setCurrentStep(2)}
                      className="bg-slate-100 hover:bg-red-50 border border-slate-200 hover:border-red-300 text-slate-400 hover:text-red-500 w-7 h-7 flex items-center justify-center rounded transition-all" title="Close report">
                      <i className="fa-solid fa-xmark text-sm"></i>
                    </button>
                  </div>
                </div>
                <PrintableReport
                  clientName={clientName} projectName={projectName}
                  sqft={sqft} strategy={strategy}
                  deliverables={deliverables} milestones={milestones}
                  invitationText={invitationText} setInvitationText={setInvitationText}
                />
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-auto flex-shrink-0 bg-slate-50 border-t border-slate-200 p-2.5 px-4 flex justify-between items-center z-10 font-sans">
            <span className={statusClass}>{statusTag}</span>
            <div className="flex items-center space-x-2">
              {currentStep === 3 && loadedVersionId && (
                <button onClick={() => triggerSaveVersion(true)} className="flex items-center justify-center space-x-1 px-3 h-9 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition-all cursor-pointer">
                  <i className="fa-solid fa-copy text-[10px]"></i><span>SAVE AS NEW VERSION</span>
                </button>
              )}
              <button onClick={() => {
                if (currentStep < 3) setCurrentStep(s => s + 1)
                else triggerSaveVersion(false)
              }} className="flex items-center justify-center space-x-1.5 px-4 h-9 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer">
                {currentStep === 3
                  ? <><span>{loadedVersionId ? 'UPDATE CURRENT VERSION' : 'SAVE & LOCK'}</span><i className="fa-solid fa-cloud-arrow-up text-[10px]"></i></>
                  : <><span>NEXT</span><i className="fa-solid fa-chevron-right text-[10px]"></i></>
                }
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {notification && <NotificationModal title={notification.title} text={notification.text} onClose={() => setNotification(null)} />}
      {showScopePopup && <ScopePopup deliverables={deliverables} strategy={strategy} onClose={() => setShowScopePopup(false)} onApply={handleScopeApply} />}
      {showSyncModal && <SyncSettingsModal syncUrl={syncUrl} setSyncUrl={setSyncUrl} spreadsheetId={spreadsheetId} setSpreadsheetId={setSpreadsheetId} onClose={() => setShowSyncModal(false)} onTest={handleTestConnection} connectedSheet={activeSheetInfo} />}
    </div>
  )
}