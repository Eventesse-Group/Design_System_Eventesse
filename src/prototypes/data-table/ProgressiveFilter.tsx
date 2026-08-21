import { ChevronDown, ChevronRight, Filter, ListFilter, MoreHorizontal, Search, Settings2, X, Check, ArrowUp, ArrowDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PrototypeHeader } from "./PrototypeHeader";
import { PrototypeTable, tableColumns } from "./PrototypeTable";
import type { SortKey } from "./data";
import type { ParticipantStatus } from "./data";
import { useTablePrototype } from "./useTablePrototype";

type FilterSection = "status" | "profile" | "destination";
const statuses: ParticipantStatus[] = ["Confirmado", "Pendente RSVP", "Cadastro incompleto"];
const profiles = ["Titular", "Acompanhante", "VIP", "Staff"] as const;
const destinations = ["São Paulo", "Rio de Janeiro", "Curitiba", "Recife"];

export function ProgressiveFilter() {
  const table = useTablePrototype();
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<FilterSection>("status");
  const [menu, setMenu] = useState<"sort" | "columns" | "more" | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<Set<SortKey>>(() => new Set(tableColumns.map((column) => column.key)));
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(0);
  const filterAnchorRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open && !menu) return;
    const closeOnOutside = (event: PointerEvent) => {
      if (!(event.target instanceof Node)) return;
      if (open && !filterAnchorRef.current?.contains(event.target)) setOpen(false);
      if (menu && !toolbarRef.current?.contains(event.target)) setMenu(null);
    };
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); setMenu(null); } };
    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => { document.removeEventListener("pointerdown", closeOnOutside); document.removeEventListener("keydown", closeOnEscape); };
  }, [open, menu]);

  useEffect(() => { setPage(0); }, [table.query, table.filterCount, pageSize]);

  const totalPages = Math.max(1, Math.ceil(table.rows.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const visibleRows = table.rows.slice(safePage * pageSize, safePage * pageSize + pageSize);

  const summary = (values: Set<string>) => values.size ? `${values.size} selecionado${values.size > 1 ? "s" : ""}` : "Todos";

  return (
    <main className="pt-page pt-refined">
      <PrototypeHeader />
      <section className="pt-surface">
        <div className="pt-toolbar">
          <label className="pt-search"><Search /><span className="sr-only">Buscar participantes</span><input value={table.query} onChange={(event) => table.setQuery(event.target.value)} placeholder="Buscar por nome, código ou destino..." />{table.query ? <button type="button" aria-label="Limpar busca" onClick={() => table.setQuery("")}><X /></button> : null}</label>
          <div ref={toolbarRef} className="pt-toolbar-actions"><div ref={filterAnchorRef} className="pt-popover-anchor"><button className="pt-button pt-button-secondary" data-active={open || table.filterCount > 0 || undefined} type="button" onClick={() => { setOpen((value) => !value); setMenu(null); }}><Filter />Filtros{table.filterCount ? <span className="pt-count">{table.filterCount}</span> : null}<ChevronDown /></button>{open ? <div className="pt-popover pt-progressive-panel">
            <header><div><strong>Filtros</strong><span>{table.rows.length} resultados</span></div><button className="pt-icon-button" type="button" aria-label="Fechar filtros" onClick={() => setOpen(false)}><X /></button></header>
            <div className="pt-progressive-sections">
              <button type="button" data-open={section === "status" || undefined} onClick={() => setSection("status")}><span><strong>Status</strong><small>{summary(table.statuses as Set<string>)}</small></span>{section === "status" ? <ChevronDown /> : <ChevronRight />}</button>
              {section === "status" ? <fieldset>{statuses.map((status) => <label key={status}><input type="checkbox" checked={table.statuses.has(status)} onChange={() => table.toggleStatus(status)} />{status}</label>)}</fieldset> : null}
              <button type="button" data-open={section === "profile" || undefined} onClick={() => setSection("profile")}><span><strong>Perfil</strong><small>{summary(table.profiles as Set<string>)}</small></span>{section === "profile" ? <ChevronDown /> : <ChevronRight />}</button>
              {section === "profile" ? <fieldset>{profiles.map((profile) => <label key={profile}><input type="checkbox" checked={table.profiles.has(profile)} onChange={() => table.toggleProfile(profile)} />{profile}</label>)}</fieldset> : null}
              <button type="button" data-open={section === "destination" || undefined} onClick={() => setSection("destination")}><span><strong>Destino</strong><small>{summary(table.destinations)}</small></span>{section === "destination" ? <ChevronDown /> : <ChevronRight />}</button>
              {section === "destination" ? <fieldset>{destinations.map((destination) => <label key={destination}><input type="checkbox" checked={table.destinations.has(destination)} onChange={() => table.toggleDestination(destination)} />{destination}</label>)}</fieldset> : null}
            </div>
            <footer><button type="button" onClick={table.clearFilters}>Limpar</button><button className="pt-button" type="button" onClick={() => setOpen(false)}>Aplicar filtros</button></footer>
          </div> : null}</div><div className="pt-popover-anchor"><button className="pt-button pt-button-secondary" data-active={menu === "sort" || undefined} type="button" onClick={() => { setMenu(menu === "sort" ? null : "sort"); setOpen(false); }}><ListFilter />Ordenar</button>{menu === "sort" ? <div className="pt-popover pt-toolbar-popover" role="dialog" aria-label="Ordenar tabela"><strong>Ordenar por</strong><select aria-label="Coluna para ordenar" value={table.sortKey} onChange={(event) => table.setSort(event.target.value as SortKey, table.sortDirection)}>{tableColumns.map((column) => <option key={column.key} value={column.key}>{column.label}</option>)}</select><button type="button" className="pt-menu-option" onClick={() => { table.setSort(table.sortKey, "asc"); setMenu(null); }}><ArrowUp />Crescente{table.sortDirection === "asc" ? <Check /> : null}</button><button type="button" className="pt-menu-option" onClick={() => { table.setSort(table.sortKey, "desc"); setMenu(null); }}><ArrowDown />Decrescente{table.sortDirection === "desc" ? <Check /> : null}</button></div> : null}</div><div className="pt-popover-anchor"><button className="pt-button pt-button-secondary" data-active={menu === "columns" || undefined} type="button" onClick={() => { setMenu(menu === "columns" ? null : "columns"); setOpen(false); }}><Settings2 />Colunas</button>{menu === "columns" ? <div className="pt-popover pt-toolbar-popover" role="dialog" aria-label="Configurar colunas"><strong>Colunas visíveis</strong>{tableColumns.map((column) => <label key={column.key} className="pt-menu-option"><input type="checkbox" checked={visibleColumns.has(column.key)} disabled={visibleColumns.size === 1 && visibleColumns.has(column.key)} onChange={() => setVisibleColumns((current) => { const next = new Set(current); if (next.has(column.key)) next.delete(column.key); else next.add(column.key); return next; })} />{column.label}</label>)}</div> : null}</div><div className="pt-popover-anchor"><button className="pt-icon-button" data-active={menu === "more" || undefined} type="button" aria-label="Mais opções" onClick={() => { setMenu(menu === "more" ? null : "more"); setOpen(false); }}><MoreHorizontal /></button>{menu === "more" ? <div className="pt-popover pt-toolbar-popover" role="dialog" aria-label="Mais opções"><strong>Preferências</strong><label className="pt-menu-option">Linhas por página<select aria-label="Linhas por página" value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))}><option value="10">10</option><option value="25">25</option><option value="50">50</option></select></label></div> : null}</div></div>
        </div>
        <div className="pt-compact-summary"><span><strong>{table.rows.length}</strong> resultados</span>{table.filterCount ? <button type="button" onClick={table.clearFilters}>Limpar {table.filterCount} filtros</button> : <span>Sem filtros aplicados</span>}</div>
        <PrototypeTable {...table} rows={visibleRows} visibleColumns={visibleColumns} onSelectedChange={table.setSelected} roomy />
        <footer className="pt-pagination pt-pagination-simple"><span>{table.rows.length ? `${safePage * pageSize + 1}–${Math.min((safePage + 1) * pageSize, table.rows.length)}` : "0"} de {table.rows.length} resultados filtrados</span><label>Linhas <select aria-label="Linhas por página" value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))}><option value="10">10</option><option value="25">25</option><option value="50">50</option></select></label><div><button type="button" aria-label="Página anterior" disabled={safePage === 0} onClick={() => setPage((value) => Math.max(0, value - 1))}>‹</button><button type="button" aria-label="Próxima página" disabled={safePage >= totalPages - 1} onClick={() => setPage((value) => Math.min(totalPages - 1, value + 1))}>›</button></div></footer>
      </section>
    </main>
  );
}
