import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import { ClientData } from "@/types/budget";

interface Props {
  clientData: ClientData;
  onChange: (data: ClientData) => void;
}

export const ClientForm = ({ clientData, onChange }: Props) => {
  const set = (field: keyof ClientData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...clientData, [field]: e.target.value });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base text-[hsl(var(--brand-blue))]">
          <User className="w-4 h-4" />
          Dados do Cliente
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        <div className="col-span-2 space-y-1">
          <Label className="text-xs">Nome *</Label>
          <Input value={clientData.name} onChange={set('name')} placeholder="Nome completo / empresa" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">NIF</Label>
          <Input value={clientData.nif} onChange={set('nif')} placeholder="NIF" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Telefone</Label>
          <Input value={clientData.phone} onChange={set('phone')} placeholder="Telemóvel / Telefone" />
        </div>
        <div className="col-span-2 space-y-1">
          <Label className="text-xs">Morada</Label>
          <Input value={clientData.address} onChange={set('address')} placeholder="Rua, número" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Código Postal</Label>
          <Input value={clientData.postalCode} onChange={set('postalCode')} placeholder="0000-000" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Localidade</Label>
          <Input value={clientData.city} onChange={set('city')} placeholder="Cidade" />
        </div>
        <div className="col-span-2 space-y-1">
          <Label className="text-xs">Email</Label>
          <Input type="email" value={clientData.email} onChange={set('email')} placeholder="email@cliente.pt" />
        </div>
      </CardContent>
    </Card>
  );
};
