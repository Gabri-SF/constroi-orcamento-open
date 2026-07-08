import { Budget } from "@/types/budget";
import { Logo } from "@/components/Logo";

interface Props {
  budget: Budget;
  hideValues?: boolean;
}

const fmt = (n: number) =>
  n.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const Row = ({ label, children }: { label: string; children?: React.ReactNode }) =>
  children ? <p style={{ margin: '1px 0', fontSize: 10 }}><span style={{ color: '#64748b' }}>{label}: </span>{children}</p> : null;

export const BudgetPreview = ({ budget, hideValues = false }: Props) => {
  const { companyData: co, clientData: cl } = budget;

  const issueDate = budget.issueDate
    ? new Date(budget.issueDate + 'T12:00:00').toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })
    : '';

  return (
    <div
      id="print-document"
      className="document-paper"
      style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", display: 'flex', flexDirection: 'column' }}
    >
      {/* ── Content (flex: 1 pushes footer to bottom) ─────── */}
      <div style={{ flex: 1 }}>

        {/* ── Header: logo + title ────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <Logo variant="onLight" markSize={44} nameSize={20} tagSize={7} />
          <div style={{ textAlign: 'right' }}>
            <p className="doc-title" style={{ marginBottom: 0 }}>ORÇAMENTO</p>
            <p style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>
              {budget.location && `${budget.location}`}
              {budget.location && issueDate && ', '}
              {issueDate}
            </p>
          </div>
        </div>
        <hr className="doc-divider" />

        {/* ── Company + Client ──────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 20 }}>
          <div>
            <p className="doc-section-label">Empresa</p>
            <p style={{ fontWeight: 700, fontSize: 11, marginBottom: 3 }}>{co.name}</p>
            {co.nif && <Row label="NIF">{co.nif}</Row>}
            {co.address && <Row label="Morada">{co.address}</Row>}
            {(co.postalCode || co.city) && (
              <Row label="CP">{[co.postalCode, co.city].filter(Boolean).join(' ')}</Row>
            )}
            {co.phone && <Row label="Tel">{co.phone}</Row>}
            {co.email && <Row label="Email">{co.email}</Row>}
          </div>

          <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: 20 }}>
            <p className="doc-section-label">Cliente</p>
            <p style={{ fontWeight: 700, fontSize: 11, marginBottom: 3 }}>{cl.name || '—'}</p>
            {cl.nif && <Row label="NIF">{cl.nif}</Row>}
            {cl.address && <Row label="Morada">{cl.address}</Row>}
            {(cl.postalCode || cl.city) && (
              <Row label="CP">{[cl.postalCode, cl.city].filter(Boolean).join(' ')}</Row>
            )}
            {cl.phone && <Row label="Tel">{cl.phone}</Row>}
            {cl.email && <Row label="Email">{cl.email}</Row>}
          </div>
        </div>
        <hr className="doc-divider" />

        {/* ── Categories ──────────────────────────────────── */}
        <div style={{ marginBottom: 20 }}>
          {budget.categories.length === 0 && (
            <p style={{ color: '#94a3b8', fontSize: 11, textAlign: 'center', padding: '20px 0' }}>
              Sem categorias definidas.
            </p>
          )}

          {budget.categories.map((category, ci) => (
            <div key={category.id} style={{ marginBottom: 16 }}>
              <p className="doc-category-title">{ci + 1}. {category.name}</p>

              <table className="doc-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', width: '55%' }}>Descrição</th>
                    <th style={{ textAlign: 'center', width: '8%' }}>Un.</th>
                    <th style={{ textAlign: 'right', width: '10%' }}>Qtd</th>
                    <th style={{ textAlign: 'right', width: '13%' }}>P. Unit.</th>
                    <th style={{ textAlign: 'right', width: '14%' }}>Import.</th>
                  </tr>
                </thead>
                <tbody>
                  {category.items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.description}</td>
                      <td style={{ textAlign: 'center' }}>{item.unit}</td>
                      <td style={{ textAlign: 'right' }}>
                        {item.quantity.toLocaleString('pt-PT', { maximumFractionDigits: 3 })}
                      </td>
                      <td style={{ textAlign: 'right' }}>{hideValues ? '' : `${fmt(item.unitPrice)} €`}</td>
                      <td style={{ textAlign: 'right' }}>{hideValues ? '' : `${fmt(item.total)} €`}</td>
                    </tr>
                  ))}
                  <tr className="row-total">
                    <td colSpan={4} style={{ textAlign: 'right' }}>
                      Total {category.name}:
                    </td>
                    <td style={{ textAlign: 'right' }}>{hideValues ? '' : `${fmt(category.total)} €`}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>

        {/* ── Totals ──────────────────────────────────────── */}
        <hr className="doc-divider" />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
          <div style={{ minWidth: 220 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '3px 0' }}>
              <span>Subtotal:</span>
              <span style={{ fontWeight: 600, minWidth: 80, textAlign: 'right' }}>
                {hideValues ? '' : `${fmt(budget.subtotal)} €`}
              </span>
            </div>
            {budget.hasVAT && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '3px 0' }}>
                <span>IVA ({budget.vatPercentage}%):</span>
                <span style={{ fontWeight: 600, minWidth: 80, textAlign: 'right' }}>
                  {hideValues ? '' : `${fmt(budget.vatAmount)} €`}
                </span>
              </div>
            )}
            <div
              style={{
                display: 'flex', justifyContent: 'space-between',
                fontSize: 13, fontWeight: 700, padding: '6px 0',
                borderTop: '1.5px solid #1e293b', marginTop: 4,
                color: 'hsl(142, 60%, 30%)',
              }}
            >
              <span>TOTAL {budget.hasVAT ? '(c/ IVA)' : '(s/ IVA)'}:</span>
              <span style={{ minWidth: 80, textAlign: 'right' }}>
                {hideValues ? '' : `${fmt(budget.total)} €`}
              </span>
            </div>
          </div>
        </div>

        {/* ── Conditions ──────────────────────────────────── */}
        {(budget.conditions || budget.notIncluded) && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24, fontSize: 10 }}>
            {budget.conditions && (
              <div>
                <p style={{ fontWeight: 700, marginBottom: 4, color: '#1e293b' }}>Condições:</p>
                <p style={{ whiteSpace: 'pre-wrap', color: '#374151', lineHeight: 1.5 }}>{budget.conditions}</p>
              </div>
            )}
            {budget.notIncluded && (
              <div>
                <p style={{ fontWeight: 700, marginBottom: 4, color: '#1e293b' }}>Não incluído:</p>
                <p style={{ whiteSpace: 'pre-wrap', color: '#374151', lineHeight: 1.5 }}>{budget.notIncluded}</p>
              </div>
            )}
          </div>
        )}

        {/* ── Signatures ──────────────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40, paddingTop: 8 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 180, borderBottom: '1px solid #1e293b', height: 40, marginBottom: 4 }} />
            <p style={{ fontSize: 9, color: '#64748b' }}>Dono da Obra</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 180, borderBottom: '1px solid #1e293b', height: 40, marginBottom: 4 }} />
            <p style={{ fontSize: 9, color: '#64748b' }}>Empreiteiro</p>
          </div>
        </div>

      </div>{/* end flex: 1 content */}

      {/* ── Footer: lateral da viatura ──────────────────────── */}
      <div
        id="doc-footer"
        style={{
          background: '#102A43',
          marginLeft: -56, marginRight: -56, marginBottom: -48,
          padding: '14px 56px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <Logo variant="onDark" markSize={36} nameSize={15} tagSize={7} />
        <div style={{ textAlign: 'right', fontWeight: 600, fontSize: 10, lineHeight: 1.8 }}>
          {co.phone && <div style={{ color: '#fff' }}>{co.phone}</div>}
          {co.email && <div style={{ color: '#9DB4CC' }}>{co.email}</div>}
        </div>
      </div>
    </div>
  );
};
