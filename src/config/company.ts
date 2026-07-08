import { CompanyData } from "@/types/budget";

// Edit this file with your own company details. It fills in the "Empresa"
// fields whenever a new budget is created — see README.md for details.
export const DEFAULT_COMPANY: CompanyData = {
  name: "ACME Construções, Lda",
  nif: "999999990",
  address: "Rua do Exemplo, nº 123",
  postalCode: "1000-000",
  city: "Lisboa",
  email: "geral@acmeconstrucoes.pt",
  phone: "912345678",
};

// Text shown next to the logo mark in the app header and printed document
// (header + footer). See src/components/Logo.tsx for the logo mark itself.
export const BRAND = {
  shortName: "ACME",
  tagline: "CONSTRUÇÃO CIVIL",
};
