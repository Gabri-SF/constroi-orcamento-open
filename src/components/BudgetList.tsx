import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FileText, Search, Plus, Edit2, Copy, Trash2, Euro } from "lucide-react";
import { BudgetListItem } from "@/types/budget";

interface Props {
  budgets: BudgetListItem[];
  loading: boolean;
  onOpen: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}

const fmt = (n: number) => n.toLocaleString('pt-PT', { minimumFractionDigits: 2 });

const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' });

export const BudgetList = ({ budgets, loading, onOpen, onDuplicate, onDelete, onNew }: Props) => {
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const filtered = budgets.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.clientName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          onClick={onNew}
          className="bg-[hsl(var(--brand-green))] hover:bg-[hsl(var(--brand-green))]/90"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Novo Orçamento
        </Button>
      </div>

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <FileText className="w-14 h-14 mb-4 opacity-25" />
          <p className="font-medium mb-1">
            {search ? "Nenhum resultado encontrado" : "Ainda não há orçamentos"}
          </p>
          <p className="text-sm">
            {search ? "Tente uma pesquisa diferente." : "Clique em \"Novo Orçamento\" para começar."}
          </p>
        </div>
      )}

      {/* Budget cards */}
      <div className="grid gap-3">
        {filtered.map((b) => (
          <Card
            key={b.id}
            className="hover:shadow-md transition-all hover:border-[hsl(var(--brand-blue))]/30 cursor-pointer group"
            onClick={() => onOpen(b.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-[hsl(var(--brand-blue-light))] flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-[hsl(var(--brand-blue))]" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate text-foreground group-hover:text-[hsl(var(--brand-blue))] transition-colors">
                    {b.name}
                  </p>
                  <div className="flex gap-3 mt-0.5 text-xs text-muted-foreground flex-wrap">
                    {b.clientName && <span>Cliente: <span className="text-foreground/70">{b.clientName}</span></span>}
                    <span>Atualizado: {fmtDate(b.updatedAt)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="text-right flex-shrink-0 hidden sm:block">
                  <div className="flex items-center gap-1 text-[hsl(var(--brand-green))] font-bold text-sm">
                    <Euro className="w-3.5 h-3.5" />
                    {fmt(b.total)}
                  </div>
                  <p className="text-xs text-muted-foreground">total</p>
                </div>

                {/* Actions */}
                <div
                  className="flex items-center gap-1.5 flex-shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    size="sm" variant="ghost"
                    className="h-8 w-8 p-0 text-[hsl(var(--brand-blue))] hover:bg-[hsl(var(--brand-blue))]/10"
                    onClick={() => onOpen(b.id)}
                    title="Editar"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="sm" variant="ghost"
                    className="h-8 w-8 p-0 text-muted-foreground hover:bg-muted"
                    onClick={() => onDuplicate(b.id)}
                    title="Duplicar"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="sm" variant="ghost"
                    className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                    onClick={() => setDeleteTarget(b.id)}
                    title="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar orçamento</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação é permanente e não pode ser desfeita. Tem a certeza?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => { onDelete(deleteTarget!); setDeleteTarget(null); }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
