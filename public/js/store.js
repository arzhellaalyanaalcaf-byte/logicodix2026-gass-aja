// Penyimpanan progres belajar di localStorage (hanya di perangkat pengguna).
import { MATERI, CHECKLIST } from './data/content.js';

const KEY = 'banjireuy:v1';
const DEFAULT = {
  nama: '',
  materiDone: [],
  checklist: {},
  kuis: { best: null, last: null, answers: [] },
  simulasi: { best: null, last: null },
  cuacaDilihat: false,
  janji: false,
  lokasi: '31.71.01.1001',
  lokasiNama: 'Gambir, Jakarta Pusat',
  lokasiDipilih: false,
  notifRead: false,
};

let state = load();
const listeners = new Set();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...structuredClone(DEFAULT), ...JSON.parse(raw) } : structuredClone(DEFAULT);
  } catch { return structuredClone(DEFAULT); }
}

export function get() { return state; }

export function set(patch) {
  state = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) };
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* mode privat */ }
  listeners.forEach((fn) => fn(state));
}

export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }

export function reset() { localStorage.removeItem(KEY); state = structuredClone(DEFAULT); listeners.forEach((fn) => fn(state)); }

export const totalChecklist = CHECKLIST.reduce((n, c) => n + c.items.length, 0);

export function stats() {
  const s = state;
  const checked = Object.values(s.checklist).filter(Boolean).length;
  const lencana = {
    pembelajar: s.materiDone.length >= MATERI.length,
    siaga: checked >= totalChecklist,
    simulasi: (s.simulasi.best ?? 0) >= 4,
    kuis: (s.kuis.best ?? 0) >= 80,
    cuaca: !!s.cuacaDilihat,
    aksi: !!s.janji,
  };
  const steps = [s.materiDone.length >= MATERI.length, checked >= totalChecklist, s.simulasi.best != null, s.kuis.best != null, s.janji];
  return {
    materi: s.materiDone.length, materiTotal: MATERI.length,
    checked, checklistTotal: totalChecklist,
    lencana, lencanaCount: Object.values(lencana).filter(Boolean).length,
    progress: Math.round((steps.filter(Boolean).length / steps.length) * 100),
  };
}
