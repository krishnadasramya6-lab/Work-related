import { useState, useEffect } from 'react';
import { RAGStatus } from '../data/okrData';

export interface KRAUpdate {
  kraId: string;
  status: RAGStatus;
  progress: number;
  blockerNote: string;
  decisionNeeded: string;
  updatedAt: string;
}

const STORAGE_KEY = 'okr_kra_updates_v1';

function loadUpdates(): Record<string, KRAUpdate> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function saveUpdates(updates: Record<string, KRAUpdate>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updates));
}

export function useOKRStore() {
  const [updates, setUpdates] = useState<Record<string, KRAUpdate>>(loadUpdates);

  useEffect(() => {
    saveUpdates(updates);
  }, [updates]);

  const updateKRA = (update: KRAUpdate) => {
    setUpdates(prev => ({ ...prev, [update.kraId]: update }));
  };

  const getKRA = (kraId: string): KRAUpdate | null => updates[kraId] ?? null;

  const getAllUpdates = () => Object.values(updates);

  const clearKRA = (kraId: string) => {
    setUpdates(prev => {
      const next = { ...prev };
      delete next[kraId];
      return next;
    });
  };

  return { updateKRA, getKRA, getAllUpdates, clearKRA, updates };
}
