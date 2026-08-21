import { ArrowDown, ArrowUp, Check, ChevronRight, Filter, ListFilter, Search, Settings2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PrototypeHeader } from "./PrototypeHeader";
import { PrototypeTable, tableColumns } from "./PrototypeTable";
import type { ParticipantStatus, SortKey } from "./data";
import { useTablePrototype } from "./useTablePrototype";

type FieldKey = "status" | "profile" | "destination";
const fieldLabels: Record<FieldKey, string> = { status: "Status", profile: "Perfil", destination: "Destino" };
const statuses: ParticipantStatus[] = ["Confirmado", "Pendente RSVP", "Cadastro incompleto"];
const profiles = ["Titular", "Acompanhante", "VIP", "Staff"] as const;
const destinations = ["São Paulo", "Rio de Janeiro", "Curitiba", "Recife", "Salvador", "Brasília"];

export function CommandFilter() {
  const table = useTablePrototype();
  const [open, setOpen] = useState(false);
  const [field, setField] = useState<FieldKey>("status");
  const [fieldQuery, setFieldQuery] = useState("");
  const [menu, setMenu] = useState<"sort" | "view" | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<Set<SortKey>>(() => new Set(tableColumns.map((column) => column.key)));
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(0);
  const fields = useMemo(() => (Object.keys(fieldLabels) as FieldKey[]).filter((key) => fieldLabels[key].toLocaleLowerCase("pt-BR").includes(fieldQuery.toLocaleLowerCase("pt-BR"))), [fieldQuery]);
  const totalPages = Math.max(1, Math.ceil(table.rows.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const visibleRows = table.rows.slice(safePage * pageSize, safePage * pageSize + pageSize);

  useEffect(() => { setPage(0); }, [table.query, table.filterCount, pageSize]);

  useEffect(() => {
    if (!open && !menu) return;
    const closeOnOutside = (event: PointerEvent) => { if (event.target instanceof Node && !(event.target as HTMLElement).closest(".pt-command-dialog") && !(event.target as HTMLElement).closest(".pt-toolbar-actions")) { setOpen(false); setMenu(null); } };
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); setMenu(null); } };
    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => { document.removeEventListener("pointerdown", closeOnOutside); document.removeEventListener("keydown", closeOnEscape); };
  }, [open, menu]);

  return (
    <main className="pt-page pt-refined">
      <PrototypeHeader />
      <section className="pt-surface">
        <div className="pt-toolbar"><label className="pt-search"><Search /><span className="sr-only">Buscar participantes</span><input value={table.query} onChange={(event) => table.setQuery(event.target.value)} placeholder="Buscar participantes..." /></label><div className="pt-toolbar-actions"><button className="pt-button pt-button-secondary" data-active={table.filterCount > 0 || open || undefined} type="button" onClick={() => { setOpen(true); setMenu(null); }}><Filter />Filtro avançado{table.filterCount ? <span className="pt-count">{table.filterCount}</span> : null}</button><div className="pt-popover-anchor"><button className="pt-button pt-button-secondary" data-active={menu === "sort" || undefined} type="button" onClick={() => { setMenu(menu === "sort" ? null : "sort"); setOpen(false); }}><ListFilter />Ordenar</button>{menu === "sort" ? <div className="pt-popover pt-toolbar-popover" role="dialog" aria-label="Ordenar tabela"><strong>Ordenar por</strong><select aria-label="Coluna para ordenar" value={table.sortKey} onChange={(event) => table.setSort(event.target.value as SortKey, table.sortDirection)}>{tableColumns.map((column) => <option key={column.key} value={column.key}>{column.label}</option>)}</select><button type="button" className="pt-menu-option" onClick={() => { table.setSort(table.sortKey, "asc"); setMenu(null); }}><ArrowUp />Crescente{table.sortDirection === "asc" ? <Check /> : null}</button><button type="button" className="pt-menu-option" onClick={() => { table.setSort(table.sortKey, "desc"); setMenu(null); }}><ArrowDown />Decrescente{table.sortDirection === "desc" ? <Check /> : null}</button></div> : null}</div><div className="pt-popover-anchor"><button className="pt-button pt-button-secondary" data-active={menu === "view" || undefined} type="button" onClick={() => { setMenu(menu === "view" ? null : "view"); setOpen(false); }}><Settings2 />Visualização</button>{menu === "view" ? <div className="pt-popover pt-toolbar-popover" role="dialog" aria-label="Configurar visualização"><strong>Visualização</strong>{tableColumns.map((column) => <label key={column.key} className="pt-menu-option"><input type="checkbox" checked={visibleColumns.has(column.key)} disabled={visibleColumns.size === 1 && visibleColumns.has(column.key)} onChange={() => setVisibleColumns((current) => { const next = new Set(current); if (next.has(column.key)) next.delete(column.key); else next.add(column.key); return next; })} />{column.label}</label>)}<label className="pt-menu-option">Linhas por página<select aria-label="Linhas por página" value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))}><option value="10">10</option><option value="25">25</option><option value="50">50</option></select></label></div> : null}</div></div></div>
        <div className="pt-compact-summary"><span><strong>{table.rows.length}</strong> resultados nesta visualização</span>{table.filterCount ? <button type="button" onClick={table.clearFilters}>Remover filtros</button> : <span>Todos os participantes</span>}</div>
        <PrototypeTable {...table} rows={visibleRows} visibleColumns={visibleColumns} onSelectedChange={table.setSelected} />
        <footer className="pt-pagination"><span>{table.rows.length ? `${safePage * pageSize + 1}–${Math.min((safePage + 1) * pageSize, table.rows.length)}` : "0"} de {table.rows.length} resultados · página {safePage + 1} de {totalPages}</span><div><button type="button" disabled={safePage === 0} onClick={() => setPage((value) => Math.max(0, value - 1))}>Anterior</button><strong>{safePage + 1}</strong><button type="button" disabled={safePage >= totalPages - 1} onClick={() => setPage((value) => Math.min(totalPages - 1, value + 1))}>Próxima</button></div></footer>
      </section>

      {open ? <div className="pt-dialog-backdrop" role="presentation"><section className="pt-command-dialog" role="dialog" aria-modal="true" aria-labelledby="command-filter-title">
        <header><div><span className="pt-eyebrow">Construtor de consulta</span><h2 id="command-filter-title">Filtrar participantes</h2></div><button className="pt-icon-button" type="button" aria-label="Fechar filtro avançado" onClick={() => setOpen(false)}><X /></button></header>
        <div className="pt-command-body">
          <aside><label className="pt-command-search"><Search /><span className="sr-only">Buscar campo</span><input value={fieldQuery} onChange={(event) => setFieldQuery(event.target.value)} placeholder="Buscar campo..." /></label><nav aria-label="Campos de filtro">{fields.map((key) => <button type="button" key={key} data-active={field === key || undefined} onClick={() => setField(key)}><span><strong>{fieldLabels[key]}</strong><small>{key === "status" ? table.statuses.size : key === "profile" ? table.profiles.size : table.destinations.size} selecionado(s)</small></span><ChevronRight /></button>)}</nav></aside>
          <div className="pt-command-values"><header><div><strong>{fieldLabels[field]}</strong><span>Selecione um ou mais valores</span></div><button type="button" onClick={() => field === "status" ? table.setStatuses(new Set()) : field === "profile" ? table.setProfiles(new Set()) : table.setDestinations(new Set())}>Limpar campo</button></header>
            {field === "status" ? statuses.map((status) => <button type="button" key={status} data-selected={table.statuses.has(status) || undefined} onClick={() => table.toggleStatus(status)}><span>{status}</span>{table.statuses.has(status) ? <Check /> : null}</button>) : null}
            {field === "profile" ? profiles.map((profile) => <button type="button" key={profile} data-selected={table.profiles.has(profile) || undefined} onClick={() => table.toggleProfile(profile)}><span>{profile}</span>{table.profiles.has(profile) ? <Check /> : null}</button>) : null}
            {field === "destination" ? destinations.map((destination) => <button type="button" key={destination} data-selected={table.destinations.has(destination) || undefined} onClick={() => table.toggleDestination(destination)}><span>{destination}</span>{table.destinations.has(destination) ? <Check /> : null}</button>) : null}
          </div>
        </div>
        <footer><span>{table.filterCount} condição(ões) · {table.rows.length} resultados</span><div><button className="pt-button pt-button-ghost" type="button" onClick={table.clearFilters}>Limpar tudo</button><button className="pt-button" type="button" onClick={() => setOpen(false)}>Aplicar filtros</button></div></footer>
      </section></div> : null}
    </main>
  );
}
