import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { CompanyData } from "@/types/budget";

interface Props {
  companyData: CompanyData;
  onChange: (data: CompanyData) => void;
}

export const CompanyForm = ({ companyData, onChange }: Props) => {
  const set = (field: keyof CompanyData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...companyData, [field]: e.target.value });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base text-[hsl(var(--brand-blue))]">
          <Building2 className="w-4 h-4" />
          Dados da Empresa
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        <div className="col-span-2 space-y-1">
          <Label className="text-xs">Empresa *</Label>
          <Input value={companyData.name} onChange={set('name')} placeholder="Nome da empresa" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">NIF</Label>
          <Input value={companyData.nif} onChange={set('nif')} placeholder="NIF" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Telefone</Label>
          <Input value={companyData.phone} onChange={set('phone')} placeholder="Telemóvel / Telefone" />
        </div>
        <div className="col-span-2 space-y-1">
          <Label className="text-xs">Morada</Label>
          <Input value={companyData.address} onChange={set('address')} placeholder="Rua, número" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Código Postal</Label>
          <Input value={companyData.postalCode} onChange={set('postalCode')} placeholder="0000-000" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Localidade</Label>
          <Input value={companyData.city} onChange={set('city')} placeholder="Cidade" />
        </div>
        <div className="col-span-2 space-y-1">
          <Label className="text-xs">Email</Label>
          <Input type="email" value={companyData.email} onChange={set('email')} placeholder="email@empresa.pt" />
        </div>
      </CardContent>
    </Card>
  );
};
