import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Edit2, GripVertical, Check, X } from "lucide-react";
import { BudgetCategory, BudgetItem } from "@/types/budget";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const UNITS = ["m³", "m²", "m", "km", "kg", "t", "l", "ml", "vg", "un", "hr", "dia"];

interface SortableItemProps {
  item: BudgetItem;
  categoryId: string;
  onUpdate: (categoryId: string, itemId: string, field: keyof BudgetItem, value: string | number) => void;
  onRemove: (categoryId: string, itemId: string) => void;
}

const SortableItem = ({ item, categoryId, onUpdate, onRemove }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  return (
    <tr
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
      className="group"
    >
      <td className="border border-[hsl(var(--table-border))] p-1 w-8 text-center">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing inline-flex">
          <GripVertical className="w-3.5 h-3.5 text-muted-foreground" />
        </div>
      </td>
      <td className="border border-[hsl(var(--table-border))] p-1">
        <Input
          value={item.description}
          onChange={(e) => onUpdate(categoryId, item.id, 'description', e.target.value)}
          placeholder="Descrição do trabalho"
          className="h-7 text-sm border-0 bg-transparent focus-visible:ring-1 px-1"
        />
      </td>
      <td className="border border-[hsl(var(--table-border))] p-1 w-24">
        <Select value={item.unit} onValueChange={(v) => onUpdate(categoryId, item.id, 'unit', v)}>
          <SelectTrigger className="h-7 text-sm border-0 bg-transparent focus:ring-1 px-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {UNITS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
          </SelectContent>
        </Select>
      </td>
      <td className="border border-[hsl(var(--table-border))] p-1 w-24">
        <Input
          type="number" min="0" step="0.01"
          value={item.quantity || ''}
          onChange={(e) => onUpdate(categoryId, item.id, 'quantity', parseFloat(e.target.value) || 0)}
          className="h-7 text-sm border-0 bg-transparent focus-visible:ring-1 px-1 text-right"
        />
      </td>
      <td className="border border-[hsl(var(--table-border))] p-1 w-28">
        <Input
          type="number" min="0" step="0.01"
          value={item.unitPrice || ''}
          onChange={(e) => onUpdate(categoryId, item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
          className="h-7 text-sm border-0 bg-transparent focus-visible:ring-1 px-1 text-right"
        />
      </td>
      <td className="border border-[hsl(var(--table-border))] p-1 w-28 text-right font-medium text-sm pr-2">
        {item.total.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} €
      </td>
      <td className="border border-[hsl(var(--table-border))] p-1 w-10 text-center">
        <button
          onClick={() => onRemove(categoryId, item.id)}
          className="text-destructive hover:text-destructive/80 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Remover linha"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </td>
    </tr>
  );
};

interface Props {
  categories: BudgetCategory[];
  onUpdateCategories: (categories: BudgetCategory[]) => void;
}

export const CategoryTable = ({ categories, onUpdateCategories }: Props) => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const addCategory = () => {
    const name = newCategoryName.trim();
    if (!name) return;
    onUpdateCategories([...categories, { id: `cat-${Date.now()}`, name, items: [], total: 0 }]);
    setNewCategoryName("");
  };

  const removeCategory = (id: string) =>
    onUpdateCategories(categories.filter(c => c.id !== id));

  const saveEditingName = () => {
    if (!editingId || !editingName.trim()) return;
    onUpdateCategories(categories.map(c => c.id === editingId ? { ...c, name: editingName.trim() } : c));
    setEditingId(null);
  };

  const addItem = (categoryId: string) => {
    const newItem: BudgetItem = { id: `item-${Date.now()}`, description: "", unit: "un", quantity: 0, unitPrice: 0, total: 0 };
    onUpdateCategories(categories.map(c => c.id === categoryId ? { ...c, items: [...c.items, newItem] } : c));
  };

  const removeItem = (categoryId: string, itemId: string) => {
    onUpdateCategories(categories.map(c => {
      if (c.id !== categoryId) return c;
      const items = c.items.filter(i => i.id !== itemId);
      return { ...c, items, total: items.reduce((s, i) => s + i.total, 0) };
    }));
  };

  const updateItem = (categoryId: string, itemId: string, field: keyof BudgetItem, value: string | number) => {
    onUpdateCategories(categories.map(c => {
      if (c.id !== categoryId) return c;
      const items = c.items.map(i => {
        if (i.id !== itemId) return i;
        const updated = { ...i, [field]: value };
        updated.total = updated.quantity * updated.unitPrice;
        return updated;
      });
      return { ...c, items, total: items.reduce((s, i) => s + i.total, 0) };
    }));
  };

  const handleDragEnd = (event: DragEndEvent, categoryId: string) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    onUpdateCategories(categories.map(c => {
      if (c.id !== categoryId) return c;
      const oldIndex = c.items.findIndex(i => i.id === active.id);
      const newIndex = c.items.findIndex(i => i.id === over.id);
      const items = arrayMove(c.items, oldIndex, newIndex);
      return { ...c, items };
    }));
  };

  return (
    <div className="space-y-4">
      {/* Add category row */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex gap-2 items-center">
            <Label className="text-sm whitespace-nowrap text-muted-foreground">Nova categoria:</Label>
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCategory()}
              placeholder="Ex: Demolições, Estrutura, Acabamentos..."
              className="flex-1"
            />
            <Button
              onClick={addCategory}
              disabled={!newCategoryName.trim()}
              className="bg-[hsl(var(--brand-blue))] hover:bg-[hsl(var(--brand-blue))]/90 whitespace-nowrap"
            >
              <Plus className="w-4 h-4 mr-1" />
              Adicionar
            </Button>
          </div>
        </CardContent>
      </Card>

      {categories.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">Ainda não existem categorias. Adicione uma para começar.</p>
        </div>
      )}

      {categories.map((category) => (
        <Card key={category.id}>
          <CardHeader className="pb-2 pt-3 px-4">
            <div className="flex items-center justify-between gap-3">
              {editingId === category.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEditingName();
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    autoFocus
                    className="flex-1 h-8"
                  />
                  <button onClick={saveEditingName} className="text-[hsl(var(--brand-green))] hover:opacity-80">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-muted-foreground hover:opacity-80">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 min-w-0">
                  <CardTitle className="text-sm font-semibold text-[hsl(var(--brand-dark))] truncate">
                    {category.name}
                  </CardTitle>
                  <button
                    onClick={() => { setEditingId(category.id); setEditingName(category.name); }}
                    className="text-muted-foreground hover:text-foreground flex-shrink-0"
                    title="Renomear"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-sm font-bold text-[hsl(var(--brand-green))]">
                  {category.total.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} €
                </span>
                <button
                  onClick={() => removeCategory(category.id)}
                  className="text-destructive hover:text-destructive/80"
                  title="Remover categoria"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-4 pb-4">
            <div className="overflow-x-auto">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(e) => handleDragEnd(e, category.id)}
              >
                <SortableContext items={category.items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-[hsl(var(--table-head-bg))] text-xs text-left">
                        <th className="border border-[hsl(var(--table-border))] p-1.5 w-8"></th>
                        <th className="border border-[hsl(var(--table-border))] p-1.5">Descrição</th>
                        <th className="border border-[hsl(var(--table-border))] p-1.5 w-24">Unidade</th>
                        <th className="border border-[hsl(var(--table-border))] p-1.5 w-24 text-right">Quantidade</th>
                        <th className="border border-[hsl(var(--table-border))] p-1.5 w-28 text-right">P. Unit. (€)</th>
                        <th className="border border-[hsl(var(--table-border))] p-1.5 w-28 text-right">Import. (€)</th>
                        <th className="border border-[hsl(var(--table-border))] p-1.5 w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.items.map((item) => (
                        <SortableItem
                          key={item.id}
                          item={item}
                          categoryId={category.id}
                          onUpdate={updateItem}
                          onRemove={removeItem}
                        />
                      ))}
                      {category.items.length === 0 && (
                        <tr>
                          <td colSpan={7} className="border border-[hsl(var(--table-border))] p-4 text-center text-muted-foreground text-xs">
                            Clique em "Adicionar Linha" para inserir o primeiro item.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </SortableContext>
              </DndContext>
            </div>

            <Button
              onClick={() => addItem(category.id)}
              variant="outline"
              size="sm"
              className="mt-3 text-[hsl(var(--brand-blue))] border-[hsl(var(--brand-blue))]/40 hover:bg-[hsl(var(--brand-blue))]/5"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Adicionar Linha
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
