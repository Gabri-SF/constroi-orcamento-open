import { useState, useEffect, useCallback } from "react";
import { Budget, SavedBudget, BudgetListItem } from "@/types/budget";

const API = "http://localhost:3001/api/budgets";

export const useBudgetStorage = () => {
  const [budgetList, setBudgetList] = useState<BudgetListItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API);
      if (res.ok) setBudgetList(await res.json());
    } catch {
      setBudgetList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadList(); }, [loadList]);

  const loadBudget = useCallback(async (id: string): Promise<SavedBudget | null> => {
    try {
      const res = await fetch(`${API}/${id}`);
      if (res.ok) return await res.json();
    } catch {}
    return null;
  }, []);

  const saveBudget = useCallback(async (
    budget: Budget,
    name: string,
    existingId?: string
  ): Promise<SavedBudget> => {
    const now = new Date().toISOString();
    const id = existingId || `orc-${Date.now()}`;

    const existing = existingId ? budgetList.find(b => b.id === existingId) : null;

    const saved: SavedBudget = {
      ...budget,
      id,
      name: name.trim() || `Orçamento ${new Date().toLocaleDateString('pt-PT')}`,
      createdAt: existing ? (await loadBudget(id))?.createdAt || now : now,
      updatedAt: now,
    };

    const method = existingId ? 'PUT' : 'POST';
    const url = existingId ? `${API}/${existingId}` : API;

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(saved),
    });

    await loadList();
    return saved;
  }, [budgetList, loadBudget, loadList]);

  const deleteBudget = useCallback(async (id: string) => {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    await loadList();
  }, [loadList]);

  const duplicateBudget = useCallback(async (id: string): Promise<SavedBudget | null> => {
    const original = await loadBudget(id);
    if (!original) return null;
    const { id: _id, createdAt: _c, updatedAt: _u, name, ...budgetData } = original;
    return saveBudget(budgetData as Budget, `${name} (cópia)`);
  }, [loadBudget, saveBudget]);

  return {
    budgetList,
    loading,
    loadList,
    loadBudget,
    saveBudget,
    deleteBudget,
    duplicateBudget,
  };
};
