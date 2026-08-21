import { ArrowDown, ArrowUp, Check, ChevronDown, Columns3, Filter, FolderKanban, GripVertical, LayoutList, ListFilter, MoreHorizontal, RotateCcw, Search, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PrototypeHeader } from "./PrototypeHeader";
import { PrototypeTable, tableColumns } from "./PrototypeTable";
import type { ParticipantSubline } from "./PrototypeTable";
import type { ParticipantProfile, ParticipantStatus, SortKey } from "./data";
import { useTablePrototype } from "./useTablePrototype";

const statuses: ParticipantStatus[] = ["Confirmado", "Pendente RSVP", "Cadastro incompleto"];
const profiles: ParticipantProfile[] = ["Titular", "Acompanhante", "VIP", "Staff"];
const destinations = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Recife", "Salvador", "Brasília", "Porto Alegre", "Florianópolis"];
type BulkField = "status" | "profile" | "destination";
type ToolbarMenu = "views" | "sort" | "columns" | "group" | "more" | null;
type GroupKey = "status" | "profile" | "destination";
type Density = "compact" | "comfortable";
interface SavedView {
  id: string;
  name: string;
  query: string;
  statuses: Set<ParticipantStatus>;
  profiles: Set<ParticipantProfile>;
  destinations: Set<string>;
}

export function AnchoredRules() {
  const table = useTablePrototype();
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const filterPanelRef = useRef<HTMLDivElement>(null);
  const toolbarMenusRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<ToolbarMenu>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showDestination, setShowDestination] = useState(false);
  const [savedViews, setSavedViews] = useState<SavedView[]>([]);
  const [activeView, setActiveView] = useState("all");
  const [visibleColumns, setVisibleColumns] = useState<Set<SortKey>>(() => new Set(tableColumns.map((column) => column.key)));
  const [columnOrder, setColumnOrder] = useState<SortKey[]>(() => tableColumns.map((column) => column.key));
  const [freezeFirstColumn, setFreezeFirstColumn] = useState(false);
  const [participantSubline, setParticipantSubline] = useState<ParticipantSubline>("code");
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(0);
  const [groupBy, setGroupBy] = useState<GroupKey | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [density, setDensity] = useState<Density>("compact");
  const [showSummary, setShowSummary] = useState(true);
  const [bulkField, setBulkField] = useState<BulkField>("status");
  const [bulkValue, setBulkValue] = useState("Confirmado");
  const [bulkMessage, setBulkMessage] = useState("");

  const totalPages = Math.max(1, Math.ceil(table.rows.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const pageStart = safePage * pageSize;
  const visibleRows = table.rows.slice(pageStart, pageStart + pageSize);
  const bulkOptions = bulkField === "status" ? statuses : bulkField === "profile" ? profiles : destinations;
  const canCreateView = table.filterCount > 0 || table.query.trim().length > 0;

  useEffect(() => {
    if (!open && !openMenu) return;

    function closePopoversOnOutsidePointer(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (open && !filterButtonRef.current?.contains(target) && !filterPanelRef.current?.contains(target)) setOpen(false);
      if (openMenu && !toolbarMenusRef.current?.contains(target)) setOpenMenu(null);
    }

    function closePopoversOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      setOpenMenu(null);
    }

    document.addEventListener("pointerdown", closePopoversOnOutsidePointer);
    document.addEventListener("keydown", closePopoversOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closePopoversOnOutsidePointer);
      document.removeEventListener("keydown", closePopoversOnEscape);
    };
  }, [open, openMenu]);

  function toggleColumn(key: SortKey) {
    setVisibleColumns((current) => {
      const next = new Set(current);
      if (next.has(key) && next.size > 1) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function moveColumn(key: SortKey, direction: -1 | 1) {
    setColumnOrder((current) => {
      const index = current.indexOf(key);
      const destination = index + direction;
      if (index < 0 || destination < 0 || destination >= current.length) return current;
      const next = [...current];
      [next[index], next[destination]] = [next[destination], next[index]];
      return next;
    });
  }

  function changeBulkField(field: BulkField) {
    setBulkField(field);
    setBulkValue(field === "status" ? statuses[0] : field === "profile" ? profiles[0] : destinations[0]);
    setBulkMessage("");
  }

  function applyBulkEdit() {
    if (bulkField === "status") table.bulkUpdate(table.selected, bulkField, bulkValue as ParticipantStatus);
    if (bulkField === "profile") table.bulkUpdate(table.selected, bulkField, bulkValue as ParticipantProfile);
    if (bulkField === "destination") table.bulkUpdate(table.selected, bulkField, bulkValue);
    setBulkMessage(`${table.selected.size} linha${table.selected.size === 1 ? "" : "s"} atualizada${table.selected.size === 1 ? "" : "s"}`);
  }

  function clearFilters() {
    table.clearFilters();
    setActiveView("all");
    setPage(0);
    setOpenMenu(null);
  }

  function createView() {
    if (!canCreateView) return;
    const name = table.statuses.size === 1
      ? Array.from(table.statuses)[0]
      : table.profiles.size === 1
        ? Array.from(table.profiles)[0]
        : table.query.trim()
          ? `Busca: ${table.query.trim()}`
          : `Visão filtrada ${savedViews.length + 1}`;
    const view: SavedView = {
      id: `view-${savedViews.length + 1}`,
      name,
      query: table.query,
      statuses: new Set(table.statuses),
      profiles: new Set(table.profiles),
      destinations: new Set(table.destinations),
    };
    setSavedViews((current) => [...current, view]);
    setActiveView(view.id);
    setOpenMenu(null);
  }

  function applyView(view: SavedView) {
    table.setQuery(view.query);
    table.setStatuses(new Set(view.statuses));
    table.setProfiles(new Set(view.profiles));
    table.setDestinations(new Set(view.destinations));
    setActiveView(view.id);
    setPage(0);
    setOpenMenu(null);
  }

  function chooseGrouping(key: GroupKey | null) {
    setGroupBy(key);
    setCollapsedGroups(new Set());
    setPage(0);
    setOpenMenu(null);
  }

  function toggleGroup(group: string) {
    setCollapsedGroups((current) => {
      const next = new Set(current);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  }

  function restoreTableView() {
    setVisibleColumns(new Set(tableColumns.map((column) => column.key)));
    setColumnOrder(tableColumns.map((column) => column.key));
    setFreezeFirstColumn(false);
    setParticipantSubline("code");
    setPageSize(25);
    setPage(0);
    setGroupBy(null);
    setCollapsedGroups(new Set());
    setDensity("compact");
    setShowSummary(true);
    table.setSort("name", "asc");
    setOpenMenu(null);
  }

  return (
    <main className="pt-page pt-refined">
      <PrototypeHeader />
      <section className="pt-surface pt-filter-stage">
        <div className="pt-utility-toolbar">
          <label className="pt-search pt-search-quiet"><Search /><span className="sr-only">Buscar participantes</span><input value={table.query} onChange={(event) => table.setQuery(event.target.value)} placeholder="Pesquisar..." />{table.query ? <button type="button" aria-label="Limpar busca" onClick={() => table.setQuery("")}><X /></button> : null}</label>
          <div ref={toolbarMenusRef} className="pt-utility-actions">
            <div className="pt-popover-anchor">
              <button className="pt-utility-button" data-active={activeView !== "all" || openMenu === "views" || undefined} type="button" aria-haspopup="dialog" aria-expanded={openMenu === "views"} onClick={() => { setOpenMenu((value) => value === "views" ? null : "views"); setOpen(false); }}><LayoutList />Visões{savedViews.length ? <span className="pt-inline-count">{savedViews.length}</span> : null}<ChevronDown /></button>
              {openMenu === "views" ? <div className="pt-popover pt-views-popover pt-toolbar-popover" role="dialog" aria-label="Visões da tabela"><strong>Visões desta tabela</strong><button className="pt-view-option" data-active={activeView === "all" || undefined} type="button" onClick={clearFilters}><span>Todos os participantes</span><small>Sem filtros</small></button>{savedViews.map((view) => <button className="pt-view-option" data-active={activeView === view.id || undefined} key={view.id} type="button" onClick={() => applyView(view)}><span>{view.name}</span><small>{view.statuses.size + view.profiles.size + view.destinations.size} filtros</small></button>)}<div className="pt-popover-footer"><button type="button" disabled={!canCreateView} onClick={createView}>+ Criar visão com os filtros atuais</button></div></div> : null}
            </div>
            <button ref={filterButtonRef} className="pt-utility-button" data-active={open || table.filterCount > 0 || undefined} type="button" aria-expanded={open} onClick={() => { setOpen((value) => !value); setOpenMenu(null); }}><Filter />Filtro{table.filterCount ? <span className="pt-inline-count">{table.filterCount}</span> : null}<ChevronDown /></button>
            <div className="pt-popover-anchor">
              <button className="pt-utility-button" data-active={openMenu === "sort" || undefined} type="button" aria-haspopup="dialog" aria-expanded={openMenu === "sort"} onClick={() => { setOpenMenu((value) => value === "sort" ? null : "sort"); setOpen(false); }}><ListFilter />Ordenar<ChevronDown /></button>
              {openMenu === "sort" ? <div className="pt-popover pt-sort-popover pt-toolbar-popover" role="dialog" aria-label="Ordenar tabela"><strong>Ordenar tabela</strong><label className="pt-menu-select"><span>Coluna</span><select aria-label="Coluna para ordenar" value={table.sortKey} onChange={(event) => table.setSort(event.target.value as SortKey, table.sortDirection)}>{tableColumns.map((column) => <option key={column.key} value={column.key}>{column.label}</option>)}</select></label><span className="pt-popover-section-label">Direção</span><button className="pt-menu-option" data-active={table.sortDirection === "asc" || undefined} type="button" onClick={() => { table.setSort(table.sortKey, "asc"); setOpenMenu(null); }}><ArrowUp />Crescente{table.sortDirection === "asc" ? <Check /> : null}</button><button className="pt-menu-option" data-active={table.sortDirection === "desc" || undefined} type="button" onClick={() => { table.setSort(table.sortKey, "desc"); setOpenMenu(null); }}><ArrowDown />Decrescente{table.sortDirection === "desc" ? <Check /> : null}</button></div> : null}
            </div>
            <div className="pt-popover-anchor">
              <button className="pt-utility-button" data-active={openMenu === "columns" || undefined} type="button" aria-haspopup="dialog" aria-expanded={openMenu === "columns"} onClick={() => { setOpenMenu((value) => value === "columns" ? null : "columns"); setOpen(false); }}><Columns3 />Colunas<ChevronDown /></button>
              {openMenu === "columns" ? <div className="pt-popover pt-columns-popover pt-toolbar-popover" role="dialog" aria-label="Configurar colunas"><strong>Configurar colunas</strong><div className="pt-column-settings"><label><input type="checkbox" checked={freezeFirstColumn} onChange={(event) => setFreezeFirstColumn(event.target.checked)} /><span><strong>Congelar primeira coluna</strong><small>Mantém a seleção e a primeira coluna visíveis</small></span></label><label className="pt-subline-setting"><span><strong>Sublinha do participante</strong><small>Informação abaixo do nome</small></span><select aria-label="Sublinha do participante" value={participantSubline} onChange={(event) => setParticipantSubline(event.target.value as ParticipantSubline)}><option value="none">Nenhuma</option><option value="code">Código</option><option value="profile">Perfil</option><option value="status">Status</option><option value="destination">Destino</option><option value="updatedAt">Atualização</option></select></label></div><span className="pt-popover-section-label">Exibição e ordem</span><div className="pt-column-order-list">{columnOrder.map((key, index) => { const column = tableColumns.find((item) => item.key === key); if (!column) return null; return <div className="pt-column-order-row" key={key}><label><input type="checkbox" checked={visibleColumns.has(key)} onChange={() => toggleColumn(key)} /><span>{column.label}</span></label><div><button type="button" aria-label={`Mover ${column.label} para cima`} disabled={index === 0} onClick={() => moveColumn(key, -1)}><ArrowUp /></button><button type="button" aria-label={`Mover ${column.label} para baixo`} disabled={index === columnOrder.length - 1} onClick={() => moveColumn(key, 1)}><ArrowDown /></button></div></div>; })}</div><div className="pt-popover-footer"><span>{visibleColumns.size} visíveis</span><button type="button" onClick={() => { setVisibleColumns(new Set(tableColumns.map((column) => column.key))); setColumnOrder(tableColumns.map((column) => column.key)); setFreezeFirstColumn(false); setParticipantSubline("code"); }}>Restaurar colunas</button></div></div> : null}
            </div>
            <div className="pt-popover-anchor">
              <button className="pt-utility-button" data-active={groupBy || openMenu === "group" || undefined} type="button" aria-haspopup="dialog" aria-expanded={openMenu === "group"} onClick={() => { setOpenMenu((value) => value === "group" ? null : "group"); setOpen(false); }}><FolderKanban />Agrupar{groupBy ? <span className="pt-inline-count">1</span> : null}<ChevronDown /></button>
              {openMenu === "group" ? <div className="pt-popover pt-group-popover pt-toolbar-popover" role="dialog" aria-label="Agrupar linhas"><strong>Agrupar linhas</strong>{([['status', 'Status'], ['profile', 'Perfil'], ['destination', 'Destino']] as const).map(([key, label]) => <button className="pt-menu-option" data-active={groupBy === key || undefined} type="button" key={key} onClick={() => chooseGrouping(key)}><FolderKanban />{label}{groupBy === key ? <Check /> : null}</button>)}{groupBy ? <div className="pt-popover-footer"><button type="button" onClick={() => chooseGrouping(null)}>Remover agrupamento</button></div> : null}</div> : null}
            </div>
            <div className="pt-popover-anchor">
              <button className="pt-icon-button" data-active={openMenu === "more" || undefined} type="button" aria-label="Mais opções" aria-haspopup="dialog" aria-expanded={openMenu === "more"} onClick={() => { setOpenMenu((value) => value === "more" ? null : "more"); setOpen(false); }}><MoreHorizontal /></button>
              {openMenu === "more" ? <div className="pt-popover pt-more-popover pt-toolbar-popover" role="dialog" aria-label="Mais opções da tabela"><strong>Preferências da tabela</strong><span className="pt-popover-section-label">Densidade</span><button className="pt-menu-option" data-active={density === "compact" || undefined} type="button" onClick={() => setDensity("compact")}><span>Compacta</span>{density === "compact" ? <Check /> : null}</button><button className="pt-menu-option" data-active={density === "comfortable" || undefined} type="button" onClick={() => setDensity("comfortable")}><span>Confortável</span>{density === "comfortable" ? <Check /> : null}</button><label className="pt-menu-toggle"><input type="checkbox" checked={showSummary} onChange={(event) => setShowSummary(event.target.checked)} /><span>Mostrar resumo por coluna</span></label><div className="pt-popover-footer"><button type="button" onClick={restoreTableView}><RotateCcw />Restaurar visualização</button></div></div> : null}
            </div>
          </div>
        </div>

        {open ? <div ref={filterPanelRef} className="pt-anchored-panel">
          <header><div><strong>Filtros avançados</strong><span>Mostrando {table.rows.length} de 750 elementos</span></div><div><button type="button" onClick={clearFilters}>Limpar todos</button><button className="pt-save-view" type="button" disabled={!canCreateView} onClick={createView}>Criar visão com estes filtros</button></div></header>
          <label className="pt-ai-toggle"><input type="checkbox" /><span aria-hidden="true" /><Sparkles />Filtrar com IA</label>
          <div className="pt-rule-stack">
            <div className="pt-rule-row"><GripVertical /><span className="pt-rule-prefix">Onde</span><select aria-label="Campo do primeiro filtro" defaultValue="status"><option value="status">Status</option></select><select aria-label="Operador do primeiro filtro" defaultValue="is"><option value="is">é um de</option></select><div className="pt-multi-value">{statuses.map((status) => <label key={status}><input type="checkbox" checked={table.statuses.has(status)} onChange={() => table.toggleStatus(status)} />{status}</label>)}</div></div>
            {showProfile ? <div className="pt-rule-row"><GripVertical /><span className="pt-rule-prefix">E</span><select aria-label="Campo do segundo filtro" defaultValue="profile"><option value="profile">Perfil</option></select><select aria-label="Operador do segundo filtro" defaultValue="is"><option value="is">é um de</option></select><div className="pt-multi-value">{profiles.map((profile) => <label key={profile}><input type="checkbox" checked={table.profiles.has(profile)} onChange={() => table.toggleProfile(profile)} />{profile}</label>)}</div><button className="pt-icon-button" type="button" aria-label="Remover filtro de perfil" onClick={() => { setShowProfile(false); table.setProfiles(new Set()); }}><X /></button></div> : null}
            {showDestination ? <div className="pt-rule-row"><GripVertical /><span className="pt-rule-prefix">E</span><select aria-label="Campo do terceiro filtro" defaultValue="destination"><option value="destination">Destino</option></select><select aria-label="Operador do terceiro filtro" defaultValue="is"><option value="is">é</option></select><select aria-label="Valor do terceiro filtro" value={Array.from(table.destinations)[0] ?? ""} onChange={(event) => { table.setDestinations(event.target.value ? new Set([event.target.value]) : new Set()); }}><option value="">Selecione...</option>{destinations.map((destination) => <option key={destination}>{destination}</option>)}</select><button className="pt-icon-button" type="button" aria-label="Remover filtro de destino" onClick={() => { setShowDestination(false); table.setDestinations(new Set()); }}><X /></button></div> : null}
          </div>
          <div className="pt-rule-actions"><button type="button" onClick={() => setShowProfile(true)}>+ Novo filtro</button><button type="button" onClick={() => setShowDestination(true)}>+ Novo grupo</button></div>
        </div> : null}

        {table.selected.size ? <div className="pt-bulk-edit" role="region" aria-label="Edição em massa"><strong>{table.selected.size} selecionado{table.selected.size === 1 ? "" : "s"}</strong><span>Alterar</span><select aria-label="Campo da edição em massa" value={bulkField} onChange={(event) => changeBulkField(event.target.value as BulkField)}><option value="status">Status</option><option value="profile">Perfil</option><option value="destination">Destino</option></select><span>para</span><select aria-label="Valor da edição em massa" value={bulkValue} onChange={(event) => { setBulkValue(event.target.value); setBulkMessage(""); }}>{bulkOptions.map((option) => <option key={option}>{option}</option>)}</select><button type="button" onClick={applyBulkEdit}>Aplicar</button>{bulkMessage ? <em role="status">{bulkMessage}</em> : null}<button className="pt-icon-button" type="button" aria-label="Limpar seleção" onClick={() => { table.setSelected(new Set()); setBulkMessage(""); }}><X /></button></div> : null}
        <PrototypeTable
          {...table}
          rows={visibleRows}
          aggregationRows={table.rows}
          onSelectedChange={table.setSelected}
          compact={density === "compact"}
          roomy={density === "comfortable"}
          spreadsheet
          showAggregations={showSummary}
          headerMenus
          visibleColumns={visibleColumns}
          columnOrder={columnOrder}
          freezeFirstColumn={freezeFirstColumn}
          participantSubline={participantSubline}
          groupBy={groupBy}
          collapsedGroups={collapsedGroups}
          onToggleGroup={toggleGroup}
          onSortDirection={table.setSort}
          columnFilters={{
            status: { options: statuses, selected: new Set<string>(table.statuses), onToggle: (value) => table.toggleStatus(value as ParticipantStatus), onClear: () => table.setStatuses(new Set()) },
            profile: { options: profiles, selected: new Set<string>(table.profiles), onToggle: (value) => table.toggleProfile(value as ParticipantProfile), onClear: () => table.setProfiles(new Set()) },
            destination: { options: destinations, selected: table.destinations, onToggle: table.toggleDestination, onClear: () => table.setDestinations(new Set()) },
          }}
          onCellChange={table.updateCell}
        />
        <footer className="pt-pagination pt-pagination-simple"><span>{table.rows.length ? `${pageStart + 1}–${pageStart + visibleRows.length}` : "0"} de {table.rows.length} resultados filtrados</span><label>Linhas <select aria-label="Quantidade de linhas por página" value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(0); setCollapsedGroups(new Set()); }}><option value="10">10</option><option value="25">25</option><option value="50">50</option><option value="100">100</option></select></label><div><button type="button" aria-label="Página anterior" disabled={safePage === 0} onClick={() => { setPage((value) => Math.max(0, value - 1)); setCollapsedGroups(new Set()); }}>‹</button><button type="button" aria-label="Próxima página" disabled={safePage >= totalPages - 1} onClick={() => { setPage((value) => Math.min(totalPages - 1, value + 1)); setCollapsedGroups(new Set()); }}>›</button></div></footer>
      </section>
    </main>
  );
}
