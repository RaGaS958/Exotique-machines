import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { Appointment } from '../types';

function usePersistent<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable: keep in memory */
    }
  }, [key, value]);
  return [value, setValue] as const;
}

interface Store {
  saved: string[];
  toggleSaved: (id: string) => void;
  isSaved: (id: string) => boolean;
  appointments: Appointment[];
  addAppointment: (a: Omit<Appointment, 'createdAt' | 'status'>) => void;
  cancelAppointment: (id: string) => void;
  drawerOpen: boolean;
  setDrawerOpen: (v: boolean) => void;
  enquiry: { open: boolean; carId?: string; topic?: string };
  openEnquiry: (opts?: { carId?: string; topic?: string }) => void;
  closeEnquiry: () => void;
  toast: string | null;
  notify: (msg: string) => void;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [saved, setSaved] = usePersistent<string[]>('exotique.saved', []);
  const [appointments, setAppointments] = usePersistent<Appointment[]>('exotique.appointments', []);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [enquiry, setEnquiry] = useState<Store['enquiry']>({ open: false });
  const [toast, setToast] = useState<string | null>(null);

  const toastTimer = useRef<number | undefined>(undefined);
  const notify = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 3200);
  }, []);

  const toggleSaved = useCallback(
    (id: string) => {
      const has = saved.includes(id);
      setSaved((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev]));
      notify(has ? 'Removed from your saved cars' : 'Saved. Find it under the heart at the top of the page.');
    },
    [saved, setSaved, notify],
  );

  const value = useMemo<Store>(
    () => ({
      saved,
      toggleSaved,
      isSaved: (id) => saved.includes(id),
      appointments,
      addAppointment: (a) =>
        setAppointments((prev) => [{ ...a, createdAt: new Date().toISOString(), status: 'active' }, ...prev]),
      cancelAppointment: (id) =>
        setAppointments((prev) => prev.map((x) => (x.id === id ? { ...x, status: 'cancelled' } : x))),
      drawerOpen,
      setDrawerOpen,
      enquiry,
      openEnquiry: (opts) => setEnquiry({ open: true, ...opts }),
      closeEnquiry: () => setEnquiry((e) => ({ ...e, open: false })),
      toast,
      notify,
    }),
    [saved, toggleSaved, appointments, setAppointments, drawerOpen, enquiry, toast, notify],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore outside StoreProvider');
  return s;
}
