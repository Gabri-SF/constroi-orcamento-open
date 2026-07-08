import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  FileText, Eye, Printer, Save, ArrowLeft, EyeOff, ChevronLeft,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CompanyForm } from "@/components/CompanyForm";
import { ClientForm } from "@/components/ClientForm";
import { CategoryTable } from "@/components/CategoryTable";
import { BudgetSummary } from "@/components/BudgetSummary";
import { BudgetPreview } from "@/components/BudgetPreview";
import { BudgetList } from "@/components/BudgetList";
import { useBudgetStorage } from "@/hooks/useBudgetStorage";
import { Budget, ClientData, BudgetCategory } from "@/types/budget";
import { DEFAULT_COMPANY } from "@/config/company";
import { Logo } from "@/components/Logo";

const emptyBudget = (): Budget => ({
  companyData: { ...DEFAULT_COMPANY },
  clientData: { name: "", nif: "", address: "", postalCode: "", city: "", email: "", phone: "" },
  categories: [],
  hasVAT: false,
  vatPercentage: 23,
  conditions: "",
  notIncluded: "Pagamento de Licenças Camarárias e todos os trabalhos não descritos na listagem de quantidades.",
  location: "",
  issueDate: new Date().toISOString().split('T')[0],
  subtotal: 0,
  vatAmount: 0,
  total: 0,
});

type View = 'list' | 'edit' | 'preview';

export default function Index() {
  const { budgetList, loading, loadBudget, saveBudget, deleteBudget, duplicateBudget } = useBudgetStorage();
  const { toast } = useToast();

  const [view, setView] = useState<View>('list');
  const [budget, setBudget] = useState<Budget>(emptyBudget());
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [currentName, setCurrentName] = useState("");
  const [hideValues, setHideValues] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [saveMode, setSaveMode] = useState<'save' | 'copy'>('save');

  // Recalculate totals whenever relevant fields change
  useEffect(() => {
    const subtotal = budget.categories.reduce((s, c) => s + c.total, 0);
    const vatAmount = budget.hasVAT ? subtotal * (budget.vatPercentage / 100) : 0;
    const total = subtotal + vatAmount;
    setBudget(prev => {
      if (prev.subtotal === subtotal && prev.vatAmount === vatAmount && prev.total === total) return prev;
      return { ...prev, subtotal, vatAmount, total };
    });
  }, [budget.categories, budget.hasVAT, budget.vatPercentage]);

  const patch = <K extends keyof Budget>(key: K, value: Budget[K]) =>
    setBudget(prev => ({ ...prev, [key]: value }));

  const openBudget = async (id: string) => {
    const saved = await loadBudget(id);
    if (!saved) {
      toast({ title: "Erro", description: "Não foi possível carregar o orçamento.", variant: "destructive" });
      return;
    }
    const { id: _i, name, createdAt: _c, updatedAt: _u, ...data } = saved;
    setBudget(data);
    setCurrentId(id);
    setCurrentName(name);
    setView('edit');
  };

  const newBudget = () => {
    setBudget(emptyBudget());
    setCurrentId(null);
    setCurrentName("");
    setView('edit');
  };

  const handleDuplicate = async (id: string) => {
    await duplicateBudget(id);
    toast({ title: "Orçamento duplicado", description: "Uma cópia foi criada." });
  };

  const handleDelete = async (id: string) => {
    await deleteBudget(id);
    toast({ title: "Orçamento eliminado" });
  };

  const openSaveDialog = (mode: 'save' | 'copy' = 'save') => {
    setSaveMode(mode);
    setSaveName(
      mode === 'copy'
        ? `${currentName} (cópia)`
        : currentName || `Orçamento ${budget.clientData.name || new Date().toLocaleDateString('pt-PT')}`
    );
    setSaveDialogOpen(true);
  };

  const confirmSave = async () => {
    const isCopy = saveMode === 'copy';
    const saved = await saveBudget(budget, saveName, isCopy ? undefined : currentId || undefined);
    if (!isCopy) {
      setCurrentId(saved.id);
      setCurrentName(saved.name);
    }
    setSaveDialogOpen(false);
    toast({
      title: isCopy ? "Cópia criada" : currentId ? "Guardado" : "Novo orçamento criado",
      description: `"${saved.name}" guardado com sucesso.`,
    });
  };

  const handleQuickSave = () => {
    if (currentId && currentName) {
      saveBudget(budget, currentName, currentId).then(() =>
        toast({ title: "Guardado", description: `"${currentName}" atualizado.` })
      );
    } else {
      openSaveDialog('save');
    }
  };

  const handlePrint = () => window.print();

  return (
    <div id="app-shell" className="min-h-screen bg-background">
      {/* Header */}
      <header className="no-print bg-[hsl(var(--brand-dark))] text-white px-6 py-4 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Logo variant="onDark" markSize={42} nameSize={22} tagSize={8} />
          {view !== 'list' && (
            <button
              onClick={() => setView('list')}
              className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Orçamentos
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* ── List view ─────────────────────────────────── */}
        {view === 'list' && (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-foreground">Orçamentos</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Gerir e criar orçamentos de construção</p>
            </div>
            <BudgetList
              budgets={budgetList}
              loading={loading}
              onOpen={openBudget}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
              onNew={newBudget}
            />
          </>
        )}

        {/* ── Edit + Preview views ──────────────────────── */}
        {(view === 'edit' || view === 'preview') && (
          <>
            {/* Toolbar */}
            <div className="no-print flex items-center justify-between gap-4 mb-6 flex-wrap">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => setView('list')}
                  className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Lista
                </button>
                <span className="text-muted-foreground">/</span>
                <span className="font-semibold text-sm truncate">
                  {currentName || "Novo Orçamento"}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {view === 'edit' && (
                  <Button
                    onClick={handleQuickSave}
                    className="bg-[hsl(var(--brand-green))] hover:bg-[hsl(var(--brand-green))]/90"
                    size="sm"
                  >
                    <Save className="w-4 h-4 mr-1.5" />
                    {currentId ? "Guardar" : "Guardar Como..."}
                  </Button>
                )}
                {view === 'edit' && currentId && (
                  <Button onClick={() => openSaveDialog('copy')} variant="outline" size="sm">
                    Guardar Cópia
                  </Button>
                )}

                <Button
                  onClick={() => setView(view === 'preview' ? 'edit' : 'preview')}
                  variant={view === 'preview' ? 'outline' : 'default'}
                  size="sm"
                  className={view === 'edit' ? 'bg-[hsl(var(--brand-blue))] hover:bg-[hsl(var(--brand-blue))]/90' : ''}
                >
                  {view === 'preview' ? (
                    <><FileText className="w-4 h-4 mr-1.5" />Editar</>
                  ) : (
                    <><Eye className="w-4 h-4 mr-1.5" />Pré-visualizar</>
                  )}
                </Button>

                {view === 'preview' && (
                  <>
                    <Button
                      onClick={() => setHideValues(!hideValues)}
                      variant="outline"
                      size="sm"
                    >
                      <EyeOff className="w-4 h-4 mr-1.5" />
                      {hideValues ? "Mostrar valores" : "Ocultar valores"}
                    </Button>
                    <Button onClick={handlePrint} variant="outline" size="sm">
                      <Printer className="w-4 h-4 mr-1.5" />
                      Imprimir / PDF
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* ── Editor ──────────────────────────────────── */}
            {view === 'edit' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <CompanyForm companyData={budget.companyData} onChange={(v) => patch('companyData', v)} />
                  <ClientForm clientData={budget.clientData} onChange={(v) => patch('clientData', v)} />
                </div>
                <CategoryTable categories={budget.categories} onUpdateCategories={(v) => patch('categories', v)} />
                <BudgetSummary
                  subtotal={budget.subtotal}
                  hasVAT={budget.hasVAT}
                  vatPercentage={budget.vatPercentage}
                  vatAmount={budget.vatAmount}
                  total={budget.total}
                  conditions={budget.conditions}
                  notIncluded={budget.notIncluded}
                  location={budget.location}
                  issueDate={budget.issueDate}
                  onVATChange={(hasVAT, vatPercentage) => setBudget(p => ({ ...p, hasVAT, vatPercentage }))}
                  onConditionsChange={(v) => patch('conditions', v)}
                  onNotIncludedChange={(v) => patch('notIncluded', v)}
                  onLocationChange={(v) => patch('location', v)}
                  onDateChange={(v) => patch('issueDate', v)}
                />
              </div>
            )}

            {/* ── Preview ─────────────────────────────────── */}
            {view === 'preview' && (
              <div id="preview-wrapper" className="flex justify-center">
                <BudgetPreview budget={budget} hideValues={hideValues} />
              </div>
            )}
          </>
        )}
      </main>

      {/* Save dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{saveMode === 'copy' ? 'Guardar cópia' : 'Guardar orçamento'}</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Input
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && confirmSave()}
              placeholder="Nome do orçamento"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>Cancelar</Button>
            <Button
              onClick={confirmSave}
              disabled={!saveName.trim()}
              className="bg-[hsl(var(--brand-green))] hover:bg-[hsl(var(--brand-green))]/90"
            >
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
