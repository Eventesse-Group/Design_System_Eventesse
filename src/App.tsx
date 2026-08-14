import { useState } from "react";
import { CalendarDays, Columns3, Download, FileText, Filter, History, Home, ListFilter, Plane, Plus, Search, Shield, SlidersHorizontal, Users } from "lucide-react";

import { Brand } from "./components/Brand";
import { AppShell, DataTable, MetricStrip, PageHeader, Pagination, StatusBadge, Toolbar, type DataColumn } from "./components/Operational";
import { Sidebar } from "./components/Sidebar";

type Participant = { id: string; name: string; sap: string; profile: string; rsvp: string; operation: string; pending: string };

const confirmed: Participant[] = [
  { id: "1", name: "PARTICIPANTE EXEMPLO A", sap: "ID-001", profile: "Acompanhante", rsvp: "Confirmado", operation: "Atenção", pending: "Sem ação" },
  { id: "2", name: "PARTICIPANTE EXEMPLO B", sap: "ID-002", profile: "Titular", rsvp: "Confirmado", operation: "Atenção", pending: "Sem ação" },
];

const pending: Participant[] = [
  { id: "3", name: "PARTICIPANTE EXEMPLO C", sap: "ID-003", profile: "VIP", rsvp: "Pendente RSVP", operation: "Atenção", pending: "Concluir cadastro" },
  { id: "4", name: "PARTICIPANTE EXEMPLO D", sap: "ID-004", profile: "Staff Eventesse", rsvp: "Pendente RSVP", operation: "Atenção", pending: "Concluir cadastro" },
  { id: "5", name: "PARTICIPANTE EXEMPLO E", sap: "ID-005", profile: "Staff Eventesse", rsvp: "Pendente RSVP", operation: "Atenção", pending: "Concluir cadastro" },
];

const columns: DataColumn<Participant>[] = [
  { key: "name", eyebrow: "Identificação", label: "Participante", width: "30%", render: (value) => <strong>{String(value)}</strong> },
  { key: "sap", eyebrow: "Identificação", label: "SAP" },
  { key: "profile", eyebrow: "Identificação", label: "Perfil" },
  { key: "rsvp", eyebrow: "Jornada", label: "Status RSVP", render: (value) => <StatusBadge tone={value === "Confirmado" ? "success" : "warning"}>{String(value)}</StatusBadge> },
  { key: "operation", eyebrow: "Jornada", label: "Status operacional", render: (value) => <StatusBadge tone="warning">{String(value)}</StatusBadge> },
  { key: "pending", eyebrow: "Jornada", label: "Próxima pendência" },
];

const navigation = [{ label: "Principal", items: [
  { label: "Geral", href: "#geral", icon: <Home /> },
  { label: "Operação", description: "Planilha mãe", href: "#operacao", icon: <Columns3 />, children: [
    { label: "Passageiros", href: "#passageiros", icon: <Users />, active: true, badge: "750" },
    { label: "RSVP", href: "#rsvp", icon: <Shield /> },
    { label: "Hospedagem", href: "#hospedagem", icon: <Home /> },
  ] },
  { label: "Cronograma", description: "Agenda operacional", href: "#cronograma", icon: <CalendarDays />, children: [{ label: "Atividades", href: "#atividades", icon: <ListFilter /> }] },
  { label: "Aéreo", description: "Planilha mãe", href: "#aereo", icon: <Plane /> },
] }, { label: "Gestão", items: [
  { label: "Listas e relatórios", href: "#relatorios", icon: <FileText /> },
  { label: "Histórico e auditoria", href: "#historico", icon: <History /> },
] }];

export function App() {
  const [dark, setDark] = useState(false);
  return (
    <div data-theme={dark ? "dark" : "light"}>
      <button className="eds-button eds-theme-toggle" data-variant="secondary" onClick={() => setDark((value) => !value)}>{dark ? "Tema claro" : "Tema escuro"}</button>
      <main className="eds-shell">
        <section className="eds-hero">
          <Brand className="eds-brand-logo" />
          <p className="eds-kicker">Eventesse Design System · v0.3</p>
          <h1 className="eds-title">Interfaces operacionais, sem perder a marca.</h1>
          <p className="eds-lead">A nova densidade operacional transforma os padrões validados no protótipo Vibra em componentes reutilizáveis, mantendo a biblioteca anterior compatível.</p>
        </section>

        <section className="eds-section" aria-labelledby="operational-title">
          <h2 id="operational-title">Aplicação operacional</h2>
          <p className="eds-section-lead">Use <code>data-density="operational"</code> em produtos com alto volume de dados e tarefas recorrentes.</p>
          <AppShell
            sidebar={<Sidebar sections={navigation} footer={<div className="eds-user-summary"><span className="eds-user-avatar">MC</span><span className="eds-user-copy"><strong>Marina Costa</strong><span>Coordenadora</span></span></div>} />}
            header={<PageHeader title="Participantes" description="750 participantes" search={<label><span className="sr-only">Buscar</span><input className="eds-search" placeholder="Buscar..." /></label>} actions={<><button className="eds-button" data-variant="secondary"><Download size={15} />Exportar</button><button className="eds-button"><Plus size={15} />Novo participante</button></>} />}
          >
            <MetricStrip items={[
              { label: "RSVP pendente", value: "147", detail: "19,6%", icon: <FileText />, tone: "brand" },
              { label: "Cadastro pendente", value: "147", detail: "19,6%", icon: <Shield />, tone: "warning" },
              { label: "Prontos para emissão", value: "0", detail: "0%", icon: <Search />, tone: "info" },
              { label: "Emitidos", value: "748", detail: "99,7%", icon: <Plane />, tone: "success" },
            ]} />
            <Toolbar start={<><button className="eds-button" data-variant="secondary"><Columns3 size={15} />Visões</button><button className="eds-button" data-variant="secondary"><Columns3 size={15} />Colunas <StatusBadge tone="info">9</StatusBadge></button><button className="eds-button" data-variant="secondary"><Filter size={15} />Filtrar</button><button className="eds-button" data-variant="secondary" data-active="true"><ListFilter size={15} />Agrupar: Fase</button><button className="eds-button" data-variant="secondary"><SlidersHorizontal size={15} />Ordenar</button></>} end={<button className="eds-button" data-variant="ghost">Limpar</button>} />
            <div><DataTable columns={columns} groups={[{ label: "Confirmado", count: 2, tone: "success", rows: confirmed }, { label: "Pendente RSVP", count: 147, tone: "brand", rows: pending }]} /><Pagination current={1} total={5} label="Mostrando 1–5 de 750 registros" /></div>
          </AppShell>
        </section>
      </main>
    </div>
  );
}
