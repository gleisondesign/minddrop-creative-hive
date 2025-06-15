
import { useState, useEffect, useCallback } from 'react';
import { Drop } from '@/types';

export function useDrops() {
  const [drops, setDrops] = useState<Drop[]>([]);

  useEffect(() => {
    try {
      const savedDrops = localStorage.getItem('mind-drops');
      if (savedDrops) {
        setDrops(JSON.parse(savedDrops));
      }
    } catch (error) {
      console.error("Failed to load drops from localStorage", error);
      setDrops([]);
    }
  }, []);

  const saveDrops = useCallback((newDrops: Drop[]) => {
    try {
      const sortedDrops = [...newDrops].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setDrops(sortedDrops);
      localStorage.setItem('mind-drops', JSON.stringify(sortedDrops));
    } catch (error) {
      console.error("Failed to save drops to localStorage", error);
    }
  }, []);

  const addDrop = useCallback((newDrop: Omit<Drop, 'id' | 'createdAt'>) => {
    const dropWithId: Drop = {
      ...newDrop,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    saveDrops([dropWithId, ...drops]);
  }, [drops, saveDrops]);

  const deleteDrop = useCallback((id: string) => {
    const newDrops = drops.filter(drop => drop.id !== id);
    saveDrops(newDrops);
  }, [drops, saveDrops]);

  return { drops, addDrop, deleteDrop, setDrops: saveDrops };
}
