import {
  BedDouble,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  FileChartColumn,
  History,
  Home,
  ListChecks,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Plane,
  Plus,
  Radar,
  Search,
  ShieldCheck,
  TrendingUp,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { KeyboardEvent, PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { Brand } from "../../components/Brand";

interface NavItem {
  id: string;
  label: string;
  description?: string;
  icon: ReactNode;
  badge?: string;
  children?: NavItem[];
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const sections: NavSection[] = [
  { label: "Principal", items: [{ id: "overview", label: "Visão geral", icon: <Home /> }] },
  {
    label: "Operação",
    items: [
      { id: "operation", label: "Operação", description: "Planilha mãe", icon: <ListChecks />, children: [
        { id: "participants", label: "Participantes", icon: <Users />, badge: "750" },
        { id: "rsvp", label: "RSVP", icon: <ShieldCheck /> },
        { id: "lodging", label: "Hospedagem", icon: <BedDouble /> },
        { id: "insurance", label: "Seguro", icon: <ShieldCheck /> },
      ] },
      { id: "schedule", label: "Cronograma", description: "Agenda operacional", icon: <CalendarDays />, children: [
        { id: "activities", label: "Atividades", icon: <ListChecks /> },
      ] },
      { id: "air", label: "Aéreo", description: "Planilha mãe", icon: <Plane />, children: [
        { id: "radar", label: "Radar", icon: <Radar /> },
        { id: "blocks", label: "Bloqueios", icon: <Plane /> },
        { id: "finance", label: "Financeiro", icon: <WalletCards /> },
      ] },
    ],
  },
  { label: "Gestão", items: [
    { id: "reports", label: "Listas e relatórios", icon: <FileChartColumn /> },
    { id: "history", label: "Histórico e auditoria", icon: <History /> },
  ] },
];

const pageNames = new Map<string, string>();
sections.forEach((section) => section.items.forEach((item) => {
  pageNames.set(item.id, item.label);
  item.children?.forEach((child) => pageNames.set(child.id, child.label));
}));

const participants = [
  ["Ana Martins", "EV-1042", "Titular", "Confirmado", "São Paulo"],
  ["Bruno Nogueira", "EV-1058", "Acompanhante", "Pendente RSVP", "Rio de Janeiro"],
  ["Camila Duarte", "EV-1071", "VIP", "Confirmado", "Belo Horizonte"],
  ["Diego Ribeiro", "EV-1096", "Staff", "Cadastro incompleto", "Curitiba"],
  ["Elisa Mendonça", "EV-1114", "Titular", "Pendente RSVP", "Recife"],
  ["Felipe Cardoso", "EV-1132", "Titular", "Confirmado", "Salvador"],
];

function OverviewDashboard({ onNotice }: { onNotice: (message: string) => void }) {
  return <div className="ns-overview">
    <section className="ns-overview-kpis" aria-label="Indicadores do evento">
      <article className="ns-kpi-card ns-kpi-featured"><div className="ns-kpi-card-top"><span>Participantes confirmados</span><span className="ns-kpi-trend"><TrendingUp aria-hidden="true" />12,4%</span></div><strong>582</strong><small>de 750 participantes previstos</small><div className="ns-kpi-progress"><span style={{ width: "77.6%" }} /></div></article>
      <article className="ns-kpi-card"><div className="ns-kpi-card-top"><span>RSVP pendente</span><span className="ns-kpi-icon"><Clock3 aria-hidden="true" /></span></div><strong>147</strong><small>19,6% da base total</small></article>
      <article className="ns-kpi-card"><div className="ns-kpi-card-top"><span>Prontos para emissão</span><span className="ns-kpi-icon ns-kpi-icon-success"><CheckCircle2 aria-hidden="true" /></span></div><strong>0</strong><small>aguardando conclusão cadastral</small></article>
      <article className="ns-kpi-card"><div className="ns-kpi-card-top"><span>Próxima atividade</span><span className="ns-kpi-icon ns-kpi-icon-brand"><CalendarDays aria-hidden="true" /></span></div><strong className="ns-kpi-date">18 jun</strong><small>fechamento de rooming list</small></article>
    </section>

    <section className="ns-overview-grid">
      <article className="ns-overview-card ns-chart-card">
        <header className="ns-overview-card-header"><div><h2>Evolução do evento</h2><p>Confirmações acumuladas nos últimos 30 dias</p></div><button className="ns-icon-button" type="button" aria-label="Mais opções do gráfico" onClick={() => onNotice("Mais opções do gráfico disponíveis no produto consumidor.")}><MoreHorizontal aria-hidden="true" /></button></header>
        <div className="ns-chart-legend"><span><i data-tone="brand" />Confirmados</span><span><i data-tone="muted" />Meta acumulada</span></div>
        <div className="ns-chart" role="img" aria-label="Gráfico de confirmações acumuladas subindo de 340 para 582 em 30 dias"><div className="ns-chart-grid"><span /><span /><span /><span /></div><svg viewBox="0 0 760 210" preserveAspectRatio="none" aria-hidden="true"><path className="ns-chart-area" d="M0 185 C48 179 65 164 104 168 S170 139 208 146 S272 112 316 120 S370 93 414 104 S470 76 516 84 S574 58 620 66 S690 30 760 38 L760 210 L0 210 Z" /><path className="ns-chart-line" d="M0 185 C48 179 65 164 104 168 S170 139 208 146 S272 112 316 120 S370 93 414 104 S470 76 516 84 S574 58 620 66 S690 30 760 38" /></svg><div className="ns-chart-axis"><span>20 mai</span><span>27 mai</span><span>03 jun</span><span>10 jun</span><span>18 jun</span></div></div>
      </article>
      <article className="ns-overview-card ns-priority-card"><header className="ns-overview-card-header"><div><h2>Prioridades</h2><p>O que precisa da sua atenção</p></div><button className="ns-text-button" type="button" onClick={() => onNotice("A lista completa será aberta no produto consumidor.")}>Ver tudo</button></header><ul className="ns-priority-list"><li><span className="ns-priority-marker ns-priority-danger"><ShieldCheck aria-hidden="true" /></span><div><strong>147 participantes com RSVP pendente</strong><small>Última atualização há 18 min</small></div><ChevronRight aria-hidden="true" /></li><li><span className="ns-priority-marker ns-priority-warning"><Users aria-hidden="true" /></span><div><strong>23 cadastros incompletos</strong><small>Conferir antes da emissão</small></div><ChevronRight aria-hidden="true" /></li><li><span className="ns-priority-marker ns-priority-neutral"><Plane aria-hidden="true" /></span><div><strong>Rooming list fecha em 2 dias</strong><small>18 jun · 18:00</small></div><ChevronRight aria-hidden="true" /></li></ul></article>
    </section>

    <section className="ns-overview-card ns-activity-card"><header className="ns-overview-card-header"><div><h2>Atividade recente</h2><p>Últimas movimentações na operação</p></div><button className="ns-text-button" type="button" onClick={() => onNotice("Histórico completo disponível no produto consumidor.")}>Abrir histórico</button></header><div className="ns-activity-list"><div><span className="ns-activity-avatar">AM</span><p><strong>Ana Martins</strong> confirmou presença no evento<small>há 8 minutos</small></p><span className="ns-status" data-tone="success">Confirmado</span></div><div><span className="ns-activity-avatar ns-activity-avatar-teal">DR</span><p><strong>Diego Ribeiro</strong> atualizou dados de viagem<small>há 42 minutos</small></p><span className="ns-status" data-tone="warning">Em revisão</span></div><div><span className="ns-activity-avatar ns-activity-avatar-sand">MC</span><p><strong>Marina Costa</strong> adicionou 12 participantes<small>ontem, 16:24</small></p><span className="ns-status">Atualizado</span></div></div></section>
  </div>;
}

function SidebarContent({ collapsed, active, onNavigate, onToggle, onNotice, onCloseMobile }: {
  collapsed: boolean;
  active: string;
  onNavigate: (id: string) => void;
  onToggle: () => void;
  onNotice: (message: string) => void;
  onCloseMobile?: () => void;
}) {
  const [closedGroups, setClosedGroups] = useState<Set<string>>(new Set());

  function navigate(id: string) {
    onNavigate(id);
    onCloseMobile?.();
  }

  function renderItem(item: NavItem, nested = false) {
    const hasChildren = Boolean(item.children?.length);
    const closed = closedGroups.has(item.id);
    const activeWithin = active === item.id || item.children?.some((child) => child.id === active);
    return <li key={item.id} data-nested={nested || undefined}>
      <div className="ns-nav-row">
        <button className="ns-nav-item" type="button" aria-current={active === item.id ? "page" : undefined} data-parent-active={activeWithin && active !== item.id || undefined} title={collapsed ? item.label : undefined} onClick={() => navigate(hasChildren ? item.children![0].id : item.id)}>
          <span className="ns-nav-icon" aria-hidden="true">{item.icon}</span>
          <span className="ns-nav-copy"><strong>{item.label}</strong>{item.description ? <small>{item.description}</small> : null}</span>
          {item.badge ? <span className="ns-nav-badge">{item.badge}</span> : null}
        </button>
        {hasChildren && !collapsed ? <button className="ns-group-toggle" type="button" aria-label={`${closed ? "Expandir" : "Recolher"} ${item.label}`} aria-expanded={!closed} onClick={() => setClosedGroups((current) => { const next = new Set(current); if (next.has(item.id)) next.delete(item.id); else next.add(item.id); return next; })}><ChevronDown aria-hidden="true" /></button> : null}
      </div>
      {hasChildren && !closed && !collapsed ? <ul className="ns-nav-children">{item.children?.map((child) => renderItem(child, true))}</ul> : null}
    </li>;
  }

  return <>
    <header className="ns-sidebar-header">
      <a className="ns-brand-home" href="#inicio" aria-label="Ir para o início"><Brand kind={collapsed ? "icon" : "logo"} alt="Eventesse" /></a>
      <button className="ns-collapse" type="button" aria-label={collapsed ? "Expandir sidebar" : "Recolher sidebar"} onClick={onToggle}>{collapsed ? <ChevronRight aria-hidden="true" /> : <ChevronLeft aria-hidden="true" />}</button>
    </header>
    {active === "participants" ? <div className="ns-quick-actions"><button className="ns-quick-create" type="button" title={collapsed ? "Criar" : undefined} onClick={() => onNotice("Escolha o que deseja criar no produto consumidor.")}><Plus aria-hidden="true" /><span>Criar</span></button></div> : null}
    <nav className="ns-sidebar-content" aria-label="Navegação principal">
      {sections.map((section) => <section className="ns-nav-section" key={section.label}><h2>{section.label}</h2><ul>{section.items.map((item) => renderItem(item))}</ul></section>)}
    </nav>
    <footer className="ns-sidebar-footer"><span className="ns-avatar" aria-hidden="true">MC</span><span className="ns-user-copy"><strong>Marina Costa</strong><small>Coordenadora</small></span><button type="button" aria-label="Notificações" onClick={() => onNotice("Você não tem novas notificações.")}><Bell aria-hidden="true" /><span className="ns-notification-dot" /></button></footer>
  </>;
}

export function NavigationShellPrototype() {
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(236);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("participants");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const pageTitle = pageNames.get(active) ?? "Participantes";
  const filteredParticipants = useMemo(() => participants.filter((row) => row.join(" ").toLocaleLowerCase("pt-BR").includes(query.toLocaleLowerCase("pt-BR"))), [query]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 2400);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") setMobileOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function startResize(event: ReactPointerEvent<HTMLButtonElement>) {
    if (collapsed) return;
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = sidebarWidth;
    const move = (moveEvent: PointerEvent) => setSidebarWidth(Math.min(288, Math.max(208, startWidth + moveEvent.clientX - startX)));
    const stop = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", stop); };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop, { once: true });
  }

  function resizeWithKeyboard(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    setSidebarWidth((value) => Math.min(288, Math.max(208, value + (event.key === "ArrowRight" ? 8 : -8))));
  }

  const fromCatalog = new URLSearchParams(window.location.search).get("from") === "catalog";
  return <main className="ns-shell" data-density="operational" style={{ "--ns-sidebar-width": `${collapsed ? 64 : sidebarWidth}px` } as React.CSSProperties}>
    <aside className="ns-sidebar" data-collapsed={collapsed || undefined}><SidebarContent collapsed={collapsed} active={active} onNavigate={setActive} onToggle={() => setCollapsed((value) => !value)} onNotice={setNotice} /></aside>
    {!collapsed ? <button className="ns-resize-rail" type="button" role="separator" aria-label="Redimensionar sidebar" aria-orientation="vertical" aria-valuemin={208} aria-valuemax={288} aria-valuenow={sidebarWidth} onPointerDown={startResize} onKeyDown={resizeWithKeyboard}><span /></button> : null}

    {mobileOpen ? <div className="ns-mobile-layer"><button className="ns-mobile-backdrop" type="button" aria-label="Fechar navegação" onClick={() => setMobileOpen(false)} /><aside className="ns-mobile-sidebar" role="dialog" aria-modal="true" aria-label="Menu de navegação"><SidebarContent collapsed={false} active={active} onNavigate={setActive} onToggle={() => setMobileOpen(false)} onNotice={setNotice} onCloseMobile={() => setMobileOpen(false)} /></aside></div> : null}

    <section className="ns-main">
      <header className="ns-page-header">
        <div className="ns-heading-cluster">
          <button className="ns-mobile-trigger" type="button" aria-label="Abrir navegação" aria-expanded={mobileOpen} onClick={() => setMobileOpen(true)}><PanelLeftOpen aria-hidden="true" /></button>
          <Brand className="ns-mobile-brand" kind="icon" alt="Eventesse" />
          <div className="ns-heading-copy">
            <nav className="ns-breadcrumb" aria-label="Breadcrumb"><ol><li><a href="#evento">Convenção 2026</a></li><li aria-hidden="true">/</li><li><a href="#operacao">Operação</a></li><li aria-hidden="true">/</li><li aria-current="page">{pageTitle}</li></ol></nav>
            <div className="ns-title-line"><h1>{pageTitle}</h1><span>{active === "participants" ? "750 registros" : "Visão operacional"}</span></div>
          </div>
        </div>
        <div className="ns-page-actions">
          <label className="ns-search"><Search aria-hidden="true" /><span className="sr-only">Buscar participantes</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar..." />{query ? <button type="button" aria-label="Limpar busca" onClick={() => setQuery("")}><X aria-hidden="true" /></button> : null}</label>
          {fromCatalog ? <a className="ns-button" href="/prototypes/components/#patterns">Voltar ao catálogo</a> : null}<button className="ns-button" type="button" onClick={() => setNotice("Exportação preparada para o produto consumidor.")}><Download aria-hidden="true" />Exportar</button>
          <button className="ns-button ns-button-primary" type="button" onClick={() => setNotice("A ação de criação abrirá o formulário do produto.")}><Plus aria-hidden="true" />Novo participante</button>
        </div>
      </header>

      <div className="ns-content">
        {active === "overview" ? <OverviewDashboard onNotice={setNotice} /> : <>
        <section className="ns-metrics" aria-label="Resumo dos participantes">
          <article><span className="ns-metric-icon" data-tone="brand"><ShieldCheck /></span><div><small>RSVP pendente</small><strong>147 <span>19,6%</span></strong></div></article>
          <article><span className="ns-metric-icon" data-tone="warning"><ListChecks /></span><div><small>Cadastro pendente</small><strong>147 <span>19,6%</span></strong></div></article>
          <article><span className="ns-metric-icon" data-tone="success"><ShieldCheck /></span><div><small>Prontos para emissão</small><strong>0 <span>0%</span></strong></div></article>
          <article><span className="ns-metric-icon" data-tone="accent"><Plane /></span><div><small>Emitidos</small><strong>748 <span>99,7%</span></strong></div></article>
        </section>

        <section className="ns-data-surface" aria-label="Prévia do conteúdo">
          <div className="ns-table-scroll"><table><thead><tr><th>Participante</th><th>Código</th><th>Perfil</th><th>Status</th><th>Destino</th></tr></thead><tbody>{filteredParticipants.map((row) => <tr key={row[1]}><td><strong>{row[0]}</strong><small>{row[1]}</small></td><td>{row[1]}</td><td>{row[2]}</td><td><span className="ns-status" data-tone={row[3] === "Confirmado" ? "success" : row[3] === "Pendente RSVP" ? "warning" : "danger"}>{row[3]}</span></td><td>{row[4]}</td></tr>)}</tbody></table></div>
          {filteredParticipants.length === 0 ? <div className="ns-empty"><strong>Nenhum resultado</strong><span>Revise o termo usado na busca.</span></div> : null}
        </section>
        </>}
      </div>
    </section>
    {notice ? <div className="ns-toast" role="status">{notice}</div> : null}
  </main>;
}
