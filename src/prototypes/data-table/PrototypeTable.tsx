import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, MoreHorizontal } from "lucide-react";
import { Fragment, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import type { EditableKey, ParticipantProfile, ParticipantRow, ParticipantStatus, SortDirection, SortKey } from "./data";
import { statusTone } from "./data";

type ColumnKind = "text" | "select" | "number" | "date";
type Aggregation = "count" | "distinct" | "empty" | "sum" | "average" | "minimum" | "maximum" | "earliest" | "latest";
export type ParticipantSubline = "none" | "code" | "profile" | "status" | "destination" | "updatedAt";

interface PrototypeTableProps {
  rows: ParticipantRow[];
  selected: Set<string>;
  onSelectedChange: (selection: Set<string>) => void;
  sortKey: SortKey;
  sortDirection: SortDirection;
  onSort: (key: SortKey) => void;
  roomy?: boolean;
  compact?: boolean;
  spreadsheet?: boolean;
  showAggregations?: boolean;
  aggregationRows?: ParticipantRow[];
  visibleColumns?: Set<SortKey>;
  columnOrder?: SortKey[];
  freezeFirstColumn?: boolean;
  participantSubline?: ParticipantSubline;
  groupBy?: SortKey | null;
  collapsedGroups?: Set<string>;
  onToggleGroup?: (group: string) => void;
  headerMenus?: boolean;
  columnFilters?: Partial<Record<SortKey, ColumnFilterConfig>>;
  onSortDirection?: (key: SortKey, direction: SortDirection) => void;
  onCellChange?: <K extends EditableKey>(id: string, key: K, value: ParticipantRow[K]) => void;
}

export interface ColumnFilterConfig {
  options: string[];
  selected: Set<string>;
  onToggle: (value: string) => void;
  onClear: () => void;
}

export const tableColumns: Array<{ key: SortKey; label: string; kind: ColumnKind }> = [
  { key: "name", label: "Participante", kind: "text" },
  { key: "code", label: "Código", kind: "text" },
  { key: "profile", label: "Perfil", kind: "select" },
  { key: "status", label: "Status", kind: "select" },
  { key: "destination", label: "Destino", kind: "select" },
  { key: "fee", label: "Valor", kind: "number" },
  { key: "updatedAt", label: "Atualização", kind: "date" },
];

const defaultVisibleColumns = new Set(tableColumns.map((column) => column.key));
const defaultColumnOrder = tableColumns.map((column) => column.key);
const emptyCollapsedGroups = new Set<string>();
const tableColumnMap = new Map(tableColumns.map((column) => [column.key, column]));
const editableKeys = new Set<SortKey>(["name", "profile", "status", "destination", "fee"]);
const profiles: ParticipantProfile[] = ["Titular", "Acompanhante", "VIP", "Staff"];
const statuses: ParticipantStatus[] = ["Confirmado", "Pendente RSVP", "Cadastro incompleto"];
const destinations = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Recife", "Salvador", "Brasília", "Porto Alegre", "Florianópolis"];
const currencyFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

const aggregationLabels: Record<Aggregation, string> = {
  count: "Contagem",
  distinct: "Valores únicos",
  empty: "Campos vazios",
  sum: "Soma",
  average: "Média",
  minimum: "Mínimo",
  maximum: "Máximo",
  earliest: "Mais antiga",
  latest: "Mais recente",
};

function aggregationOptions(kind: ColumnKind): Aggregation[] {
  if (kind === "number") return ["sum", "average", "minimum", "maximum", "count"];
  if (kind === "date") return ["latest", "earliest", "count", "empty"];
  return ["count", "distinct", "empty"];
}

function aggregate(rows: ParticipantRow[], key: SortKey, aggregation: Aggregation) {
  const values = rows.map((row) => row[key]);
  if (aggregation === "count") return String(rows.length);
  if (aggregation === "distinct") return String(new Set(values.map(String)).size);
  if (aggregation === "empty") return String(values.filter((value) => value === "").length);
  if (rows.length === 0) return "—";
  if (aggregation === "latest") return String(values[0]);
  if (aggregation === "earliest") return String(values[values.length - 1]);

  const numbers = values.filter((value): value is number => typeof value === "number");
  if (numbers.length === 0) return "—";
  if (aggregation === "sum") return currencyFormatter.format(numbers.reduce((total, value) => total + value, 0));
  if (aggregation === "average") return currencyFormatter.format(numbers.reduce((total, value) => total + value, 0) / numbers.length);
  if (aggregation === "minimum") return currencyFormatter.format(Math.min(...numbers));
  return currencyFormatter.format(Math.max(...numbers));
}

function CellEditor({ row, field, label, onChange, onFinish, onNavigate }: {
  row: ParticipantRow;
  field: EditableKey;
  label: string;
  onChange: NonNullable<PrototypeTableProps["onCellChange"]>;
  onFinish: (restoreFocus: boolean) => void;
  onNavigate: (direction: 1 | -1) => void;
}) {
  const originalValue = String(row[field]);
  const [draft, setDraft] = useState(originalValue);
  const cancelled = useRef(false);
  const ariaLabel = `Editar ${label.toLocaleLowerCase("pt-BR")} de ${row.name}`;

  function commit() {
    if (field === "fee") onChange(row.id, field, Number(draft) || 0);
    else if (field === "profile") onChange(row.id, field, draft as ParticipantProfile);
    else if (field === "status") onChange(row.id, field, draft as ParticipantStatus);
    else onChange(row.id, field, (draft.trim() || originalValue) as ParticipantRow[typeof field]);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement | HTMLSelectElement>) {
    if (event.key === "Tab") {
      event.preventDefault();
      commit();
      cancelled.current = true;
      onNavigate(event.shiftKey ? -1 : 1);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      commit();
      cancelled.current = true;
      onFinish(true);
    }
    if (event.key === "Escape") {
      event.preventDefault();
      cancelled.current = true;
      onFinish(true);
    }
  }

  function handleBlur() {
    if (!cancelled.current) commit();
    onFinish(false);
  }

  if (field === "profile") return <select autoFocus className="pt-cell-editor" aria-label={ariaLabel} value={draft} onKeyDown={handleKeyDown} onChange={(event) => setDraft(event.target.value)} onBlur={handleBlur}>{profiles.map((value) => <option key={value}>{value}</option>)}</select>;
  if (field === "status") return <select autoFocus className="pt-cell-editor" aria-label={ariaLabel} value={draft} onKeyDown={handleKeyDown} onChange={(event) => setDraft(event.target.value)} onBlur={handleBlur}>{statuses.map((value) => <option key={value}>{value}</option>)}</select>;
  if (field === "destination") return <select autoFocus className="pt-cell-editor" aria-label={ariaLabel} value={draft} onKeyDown={handleKeyDown} onChange={(event) => setDraft(event.target.value)} onBlur={handleBlur}>{destinations.map((value) => <option key={value}>{value}</option>)}</select>;
  return <input autoFocus className={`pt-cell-editor ${field === "fee" ? "pt-cell-editor-number" : ""}`} aria-label={ariaLabel} type={field === "fee" ? "number" : "text"} min={field === "fee" ? 0 : undefined} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={handleKeyDown} onBlur={handleBlur} />;
}

export function PrototypeTable({ rows, selected, onSelectedChange, sortKey, sortDirection, onSort, roomy = false, compact = false, spreadsheet = false, showAggregations = false, aggregationRows = rows, visibleColumns = defaultVisibleColumns, columnOrder = defaultColumnOrder, freezeFirstColumn = false, participantSubline = "code", groupBy = null, collapsedGroups = emptyCollapsedGroups, onToggleGroup, headerMenus = false, columnFilters, onSortDirection, onCellChange }: PrototypeTableProps) {
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [openColumnMenu, setOpenColumnMenu] = useState<SortKey | null>(null);
  const [columnMenuPosition, setColumnMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [openAggregation, setOpenAggregation] = useState<SortKey | null>(null);
  const [aggregations, setAggregations] = useState<Partial<Record<SortKey, Aggregation>>>({});
  const [rowMenu, setRowMenu] = useState<{ rowId: string; top: number; left: number } | null>(null);
  const allSelected = rows.length > 0 && rows.every((row) => selected.has(row.id));
  const activeColumns = columnOrder.flatMap((key) => {
    const column = tableColumnMap.get(key);
    return column && visibleColumns.has(key) ? [column] : [];
  });
  const openColumn = tableColumns.find((column) => column.key === openColumnMenu);
  const openColumnFilter = openColumnMenu ? columnFilters?.[openColumnMenu] : undefined;
  const rowMenuRow = rowMenu ? rows.find((row) => row.id === rowMenu.rowId) : undefined;
  const rowGroups = (() => {
    if (!groupBy) return [{ key: "all", rows }];
    const groups = new Map<string, ParticipantRow[]>();
    rows.forEach((row) => {
      const key = String(row[groupBy]);
      groups.set(key, [...(groups.get(key) ?? []), row]);
    });
    return Array.from(groups, ([key, groupRows]) => ({ key, rows: groupRows }));
  })();

  function toggleAll() {
    onSelectedChange(allSelected ? new Set() : new Set(rows.map((row) => row.id)));
  }

  function toggleRow(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectedChange(next);
  }

  function focusCell(cellId: string) {
    requestAnimationFrame(() => document.querySelector<HTMLElement>(`[data-cell-id="${cellId}"]`)?.focus());
  }

  function moveFromCell(rowId: string, key: EditableKey, direction: 1 | -1) {
    const editableColumns = activeColumns.filter((column) => editableKeys.has(column.key));
    const editableRows = groupBy ? rows.filter((row) => !collapsedGroups.has(String(row[groupBy]))) : rows;
    const cellIds = editableRows.flatMap((row) => editableColumns.map((column) => `${row.id}:${column.key}`));
    const currentIndex = cellIds.indexOf(`${rowId}:${key}`);
    const nextCell = cellIds[(currentIndex + direction + cellIds.length) % cellIds.length];
    setEditingCell(null);
    focusCell(nextCell);
  }

  function finishEditing(cellId: string, restoreFocus: boolean) {
    setEditingCell(null);
    if (restoreFocus) focusCell(cellId);
  }

  function renderCell(row: ParticipantRow, key: SortKey, label: string, isEditing: boolean) {
    if (isEditing && onCellChange) return <CellEditor row={row} field={key as EditableKey} label={label} onChange={onCellChange} onFinish={(restoreFocus) => finishEditing(`${row.id}:${key}`, restoreFocus)} onNavigate={(direction) => moveFromCell(row.id, key as EditableKey, direction)} />;
    if (key === "name") {
      const subline = participantSubline === "none" ? null : String(row[participantSubline]);
      return <span className="pt-person"><strong>{row.name}</strong>{subline ? <small>{subline}</small> : null}</span>;
    }
    if (key === "status") return <span className="pt-status" data-tone={statusTone(row.status)}><span aria-hidden="true" />{row.status}</span>;
    if (key === "fee") return currencyFormatter.format(row.fee);
    if (key === "updatedAt") return <span className="pt-muted">{row.updatedAt}</span>;
    return row[key];
  }

  return (
    <div className="pt-table-shell" data-roomy={roomy || undefined} data-compact={compact || undefined} data-spreadsheet={spreadsheet || undefined} data-freeze-first={freezeFirstColumn || undefined}>
      <table className="pt-table">
        <thead>
          <tr>
            <th className="pt-checkbox-cell"><input type="checkbox" aria-label="Selecionar todos" checked={allSelected} onChange={toggleAll} /></th>
            {activeColumns.map((column) => (
              <th key={column.key}>
                <div className="pt-column-menu-anchor">
                  <button className="pt-sort" data-menu-open={openColumnMenu === column.key || undefined} type="button" onClick={(event) => {
                    if (!headerMenus) {
                      onSort(column.key);
                      return;
                    }
                    if (openColumnMenu === column.key) {
                      setOpenColumnMenu(null);
                      setColumnMenuPosition(null);
                      return;
                    }
                    const bounds = event.currentTarget.getBoundingClientRect();
                    setColumnMenuPosition({ top: bounds.bottom + 7, left: Math.min(bounds.left - 8, window.innerWidth - 232) });
                    setOpenColumnMenu(column.key);
                  }}>
                    {column.label}
                    {sortKey === column.key ? sortDirection === "asc" ? <ArrowUp aria-hidden="true" /> : <ArrowDown aria-hidden="true" /> : null}
                    {headerMenus ? <ChevronDown aria-hidden="true" /> : null}
                  </button>
                </div>
              </th>
            ))}
            <th><span className="sr-only">Ações</span></th>
          </tr>
        </thead>
        <tbody>
          {rowGroups.map((group) => <Fragment key={group.key}>
            {groupBy ? <tr className="pt-group-row"><td colSpan={activeColumns.length + 2}><button type="button" aria-expanded={!collapsedGroups.has(group.key)} onClick={() => onToggleGroup?.(group.key)}><ChevronRight aria-hidden="true" /><strong>{group.key}</strong><span>{group.rows.length} {group.rows.length === 1 ? "item" : "itens"}</span></button></td></tr> : null}
            {!collapsedGroups.has(group.key) ? group.rows.map((row) => (
              <tr key={row.id} data-selected={selected.has(row.id) || undefined} data-editing-row={editingCell?.startsWith(`${row.id}:`) || undefined}>
                <td className="pt-checkbox-cell"><input type="checkbox" aria-label={`Selecionar ${row.name}`} checked={selected.has(row.id)} onChange={() => toggleRow(row.id)} /></td>
                {activeColumns.map((column) => {
                  const cellId = `${row.id}:${column.key}`;
                  const isEditable = spreadsheet && editableKeys.has(column.key) && Boolean(onCellChange);
                  const isEditing = editingCell === cellId;
                  return <td
                    key={column.key}
                    className={isEditable ? "pt-spreadsheet-cell" : undefined}
                    data-cell-id={isEditable ? cellId : undefined}
                    data-editing={isEditing || undefined}
                    tabIndex={isEditable ? 0 : undefined}
                    title={isEditable ? "Clique, Enter ou F2 para editar" : undefined}
                    onClick={isEditable && !isEditing ? () => setEditingCell(cellId) : undefined}
                    onKeyDown={isEditable ? (event) => {
                      if (event.key === "Enter" || event.key === "F2") {
                        event.preventDefault();
                        setEditingCell(cellId);
                      }
                      if (event.key === "Escape") event.currentTarget.blur();
                    } : undefined}
                  >{renderCell(row, column.key, column.label, isEditing)}</td>;
                })}
                <td><button className="pt-icon-button" type="button" aria-label={`Ações de ${row.name}`} aria-haspopup="menu" aria-expanded={rowMenu?.rowId === row.id} onClick={(event) => { const bounds = event.currentTarget.getBoundingClientRect(); setRowMenu((current) => current?.rowId === row.id ? null : { rowId: row.id, top: bounds.bottom + 4, left: Math.max(8, Math.min(bounds.right - 184, window.innerWidth - 192)) }); }}><MoreHorizontal aria-hidden="true" /></button></td>
              </tr>
            )) : null}
          </Fragment>)}
        </tbody>
        {showAggregations ? <tfoot>
          <tr>
            <td className="pt-checkbox-cell" />
            {activeColumns.map((column) => {
              const selectedAggregation = aggregations[column.key];
              return <td key={column.key}>
                <div className="pt-column-total">
                  <button type="button" title={`Selecionar resumo de ${column.label}`} aria-label={`Totalizador de ${column.label}`} data-configured={selectedAggregation || undefined} onClick={() => setOpenAggregation((current) => current === column.key ? null : column.key)}>
                    {selectedAggregation ? <><span>{aggregationLabels[selectedAggregation]}</span><strong>{aggregate(aggregationRows, column.key, selectedAggregation)}</strong></> : <span className="sr-only">Selecionar resumo</span>}
                    <ChevronDown aria-hidden="true" />
                  </button>
                  {openAggregation === column.key ? <><button className="pt-aggregation-dismiss" type="button" aria-label="Fechar opções do resumo" onClick={() => setOpenAggregation(null)} /><div className="pt-aggregation-menu" role="menu" aria-label={`Cálculo de ${column.label}`}>
                    <strong>{column.label}</strong>
                    {aggregationOptions(column.kind).map((option) => <button key={option} role="menuitem" type="button" data-active={selectedAggregation === option || undefined} onClick={() => { setAggregations((current) => ({ ...current, [column.key]: option })); setOpenAggregation(null); }}>{aggregationLabels[option]}<span>{selectedAggregation === option ? "✓" : ""}</span></button>)}
                    {selectedAggregation ? <button className="pt-aggregation-remove" role="menuitem" type="button" onClick={() => { setAggregations((current) => ({ ...current, [column.key]: undefined })); setOpenAggregation(null); }}>Remover cálculo</button> : null}
                  </div></> : null}
                </div>
              </td>;
            })}
            <td />
          </tr>
        </tfoot> : null}
      </table>
      {rowMenu && rowMenuRow ? createPortal(<><button className="pt-column-menu-dismiss" type="button" aria-label="Fechar ações da linha" onClick={() => setRowMenu(null)} /><div className="pt-row-action-menu" role="menu" aria-label={`Ações de ${rowMenuRow.name}`} style={{ top: rowMenu.top, left: rowMenu.left }}><strong>{rowMenuRow.name}</strong><button role="menuitem" type="button" onClick={() => { setEditingCell(`${rowMenuRow.id}:name`); setRowMenu(null); }}>Editar participante</button><button role="menuitem" type="button" onClick={() => { toggleRow(rowMenuRow.id); setRowMenu(null); }}>{selected.has(rowMenuRow.id) ? "Remover seleção" : "Selecionar linha"}</button></div></>, document.body) : null}
      {headerMenus && openColumn && columnMenuPosition ? createPortal(<><button className="pt-column-menu-dismiss" type="button" aria-label="Fechar opções da coluna" onClick={() => { setOpenColumnMenu(null); setColumnMenuPosition(null); }} /><div className="pt-column-header-menu" data-portaled role="menu" aria-label={`Opções de ${openColumn.label}`} style={{ top: columnMenuPosition.top, left: columnMenuPosition.left }}>
        <strong>{openColumn.label}</strong>
        <button role="menuitem" type="button" data-active={sortKey === openColumn.key && sortDirection === "asc" || undefined} onClick={() => { onSortDirection?.(openColumn.key, "asc"); setOpenColumnMenu(null); }}>Ordenar crescente<span>↑</span></button>
        <button role="menuitem" type="button" data-active={sortKey === openColumn.key && sortDirection === "desc" || undefined} onClick={() => { onSortDirection?.(openColumn.key, "desc"); setOpenColumnMenu(null); }}>Ordenar decrescente<span>↓</span></button>
        {openColumnFilter ? <fieldset><legend>Filtrar por</legend>{openColumnFilter.options.map((option) => <label key={option}><input type="checkbox" checked={openColumnFilter.selected.has(option)} onChange={() => openColumnFilter.onToggle(option)} />{option}</label>)}<button type="button" onClick={openColumnFilter.onClear}>Limpar filtro</button></fieldset> : null}
      </div></>, document.body) : null}
      {rows.length === 0 ? <div className="pt-empty"><strong>Nenhum participante encontrado</strong><span>Revise a busca ou remova alguns filtros.</span></div> : null}
    </div>
  );
}
