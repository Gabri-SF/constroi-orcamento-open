import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface Props {
  subtotal: number;
  hasVAT: boolean;
  vatPercentage: number;
  vatAmount: number;
  total: number;
  conditions: string;
  notIncluded: string;
  location: string;
  issueDate: string;
  onVATChange: (hasVAT: boolean, vatPercentage: number) => void;
  onConditionsChange: (v: string) => void;
  onNotIncludedChange: (v: string) => void;
  onLocationChange: (v: string) => void;
  onDateChange: (v: string) => void;
}

export const BudgetSummary = ({
  subtotal, hasVAT, vatPercentage, vatAmount, total,
  conditions, notIncluded, location, issueDate,
  onVATChange, onConditionsChange, onNotIncludedChange, onLocationChange, onDateChange,
}: Props) => {
  const fmt = (n: number) => n.toLocaleString('pt-PT', { minimumFractionDigits: 2 });

  return (
    <div className="space-y-4">
      {/* Totals + VAT */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-[hsl(var(--brand-blue))]">Resumo Financeiro</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center py-1 border-b">
            <span className="text-sm text-muted-foreground">Subtotal</span>
            <span className="font-semibold">{fmt(subtotal)} €</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="vat-switch"
                checked={hasVAT}
                onCheckedChange={(v) => onVATChange(v, vatPercentage)}
              />
              <Label htmlFor="vat-switch" className="text-sm cursor-pointer">Aplicar IVA</Label>
            </div>
            {hasVAT && (
              <div className="flex items-center gap-1.5">
                <Input
                  type="number" min="0" max="100" step="1"
                  value={vatPercentage}
                  onChange={(e) => onVATChange(true, parseFloat(e.target.value) || 0)}
                  className="w-16 h-7 text-sm text-right"
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            )}
          </div>

          {hasVAT && (
            <div className="flex justify-between items-center py-1 border-b">
              <span className="text-sm text-muted-foreground">IVA ({vatPercentage}%)</span>
              <span className="font-semibold">{fmt(vatAmount)} €</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-1">
            <span className="font-bold text-base">TOTAL {hasVAT ? '(c/ IVA)' : '(s/ IVA)'}</span>
            <span className="text-xl font-bold text-[hsl(var(--brand-green))]">{fmt(total)} €</span>
          </div>
        </CardContent>
      </Card>

      {/* Conditions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[hsl(var(--brand-blue))]">Condições</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={conditions}
              onChange={(e) => onConditionsChange(e.target.value)}
              placeholder="Condições de pagamento, prazo de execução, validade do orçamento..."
              className="min-h-[100px] text-sm resize-none"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[hsl(var(--brand-blue))]">Não incluído</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={notIncluded}
              onChange={(e) => onNotIncludedChange(e.target.value)}
              placeholder="Pagamento de Licenças Camarárias e todos os trabalhos não descritos na listagem de quantidades."
              className="min-h-[100px] text-sm resize-none"
            />
          </CardContent>
        </Card>
      </div>

      {/* Emission */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-[hsl(var(--brand-blue))]">Emissão</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Local</Label>
            <Input
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              placeholder="Ex: Lisboa"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Data</Label>
            <Input
              type="date"
              value={issueDate}
              onChange={(e) => onDateChange(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
