import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

export type CardVariant = "default" | "featured" | "interactive";

export interface CardProps extends HTMLAttributes<HTMLElement> {
  variant?: CardVariant;
}

export function Card({ variant = "default", className = "", children, ...props }: CardProps) {
  return <article className={`eds-card-component eds-card-${variant} ${className}`.trim()} {...props}>{children}</article>;
}

export interface StatCardProps {
  label: string;
  value: string;
  detail?: string;
  trend?: string;
  trendTone?: "positive" | "negative" | "neutral";
  icon?: ReactNode;
  variant?: Exclude<CardVariant, "interactive">;
}

export function StatCard({ label, value, detail, trend, trendTone = "neutral", icon, variant = "default" }: StatCardProps) {
  return <Card variant={variant} className="eds-stat-card">
    <div className="eds-stat-card-top"><span>{label}</span>{icon ? <span className="eds-stat-card-icon" aria-hidden="true">{icon}</span> : null}</div>
    <strong>{value}</strong>
    <div className="eds-stat-card-meta">{detail ? <small>{detail}</small> : null}{trend ? <span className={`eds-stat-trend eds-stat-trend-${trendTone}`}>{trend}</span> : null}</div>
  </Card>;
}

export type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md";
  icon?: ReactNode;
}

export function ActionButton({ variant = "primary", size = "md", icon, className = "", children, ...props }: ActionButtonProps) {
  return <button className={`eds-action-button eds-action-button-${variant} eds-action-button-${size} ${className}`.trim()} {...props}>{icon ? <span className="eds-action-button-icon" aria-hidden="true">{icon}</span> : null}{children}</button>;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export function Breadcrumb({ items, label = "Breadcrumb" }: { items: BreadcrumbItem[]; label?: string }) {
  return <nav className="eds-breadcrumb" aria-label={label}><ol>{items.map((item, index) => <li key={`${item.label}-${index}`} aria-current={item.current ? "page" : undefined}>{item.href && !item.current ? <a href={item.href}>{item.label}</a> : <span>{item.label}</span>}{index < items.length - 1 ? <span className="eds-breadcrumb-separator" aria-hidden="true">/</span> : null}</li>)}</ol></nav>;
}

export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  sidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
}

export function AppShell({ sidebar, header, children, className = "", ...props }: AppShellProps) {
  return (
    <div className={`eds-operational-shell ${className}`.trim()} data-density="operational" {...props}>
      <div className="eds-operational-shell-sidebar">{sidebar}</div>
      <div className="eds-operational-shell-main">
        {header}
        <div className="eds-operational-shell-content">{children}</div>
      </div>
    </div>
  );
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  search?: ReactNode;
  actions?: ReactNode;
}

export function PageHeader({ title, description, search, actions }: PageHeaderProps) {
  return (
    <header className="eds-page-header">
      <div className="eds-page-heading">
        <h1>{title}</h1>
        {description ? <span>{description}</span> : null}
      </div>
      <div className="eds-page-header-tools">{search}{actions}</div>
    </header>
  );
}

export interface MetricItem {
  label: string;
  value: string;
  detail?: string;
  icon?: ReactNode;
  tone?: "brand" | "success" | "warning" | "info" | "danger";
}

export function MetricStrip({ items }: { items: MetricItem[] }) {
  return (
    <section className="eds-metric-strip" aria-label="Indicadores">
      {items.map((item) => (
        <article className="eds-metric" data-tone={item.tone ?? "brand"} key={item.label}>
          {item.icon ? <span className="eds-metric-icon" aria-hidden="true">{item.icon}</span> : null}
          <span className="eds-metric-copy"><span>{item.label}</span><strong>{item.value}</strong></span>
          {item.detail ? <small>{item.detail}</small> : null}
        </article>
      ))}
    </section>
  );
}

export function Toolbar({ start, end }: { start: ReactNode; end?: ReactNode }) {
  return <div className="eds-toolbar"><div className="eds-toolbar-group">{start}</div>{end ? <div className="eds-toolbar-group">{end}</div> : null}</div>;
}

export type StatusTone = "neutral" | "brand" | "success" | "warning" | "info" | "danger";

export function StatusBadge({ children, tone = "neutral" }: { children: ReactNode; tone?: StatusTone }) {
  return <span className="eds-status-badge" data-tone={tone}>{children}</span>;
}

export interface DataColumn<Row> {
  key: keyof Row;
  label: string;
  eyebrow?: string;
  width?: string;
  render?: (value: Row[keyof Row], row: Row) => ReactNode;
}

export interface DataGroup<Row> {
  label: string;
  count?: number;
  tone?: StatusTone;
  rows: Row[];
}

export function DataTable<Row extends { id: string }>({ columns, groups }: { columns: DataColumn<Row>[]; groups: DataGroup<Row>[] }) {
  return (
    <div className="eds-data-table-wrap">
      <table className="eds-data-table">
        <thead><tr>{columns.map((column) => <th key={String(column.key)} style={{ width: column.width }}>{column.eyebrow ? <small>{column.eyebrow}</small> : null}{column.label}</th>)}</tr></thead>
        {groups.map((group) => (
          <tbody key={group.label}>
            <tr className="eds-data-group-row"><th colSpan={columns.length}><span data-tone={group.tone ?? "brand"} />{group.label}{group.count !== undefined ? <StatusBadge tone={group.tone}>{group.count}</StatusBadge> : null}</th></tr>
            {group.rows.map((row) => <tr key={row.id}>{columns.map((column) => <td key={String(column.key)}>{column.render ? column.render(row[column.key], row) : String(row[column.key] ?? "")}</td>)}</tr>)}
          </tbody>
        ))}
      </table>
    </div>
  );
}

export function Pagination({ current, total, label }: { current: number; total: number; label: string }) {
  const pages = Array.from({ length: Math.min(total, 5) }, (_, index) => index + 1);
  return <footer className="eds-pagination"><span>{label}</span><nav aria-label="Paginação"><button aria-label="Página anterior">‹</button>{pages.map((page) => <button aria-current={page === current ? "page" : undefined} key={page}>{page}</button>)}<button aria-label="Próxima página">›</button></nav></footer>;
}

export function SidePanel({ title, children, actions }: { title: string; children: ReactNode; actions?: ReactNode }) {
  return <aside className="eds-side-panel"><header><h2>{title}</h2>{actions}</header><div className="eds-side-panel-body">{children}</div></aside>;
}
