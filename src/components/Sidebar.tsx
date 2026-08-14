import type { ReactNode } from "react";
import { useState } from "react";
import { ChevronDown, PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { Brand } from "./Brand";

export interface SidebarItem {
  label: string;
  href: string;
  icon: ReactNode;
  active?: boolean;
  badge?: string;
  description?: string;
  children?: SidebarItem[];
}

export interface SidebarSection {
  label?: string;
  items: SidebarItem[];
}

export interface SidebarProps {
  ariaLabel?: string;
  sections: SidebarSection[];
  defaultCollapsed?: boolean;
  footer?: ReactNode;
}

export function Sidebar({
  ariaLabel = "Navegação principal",
  sections,
  defaultCollapsed = false,
  footer,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [closedGroups, setClosedGroups] = useState<Record<string, boolean>>({});

  const renderItem = (item: SidebarItem, nested = false) => {
    const hasChildren = Boolean(item.children?.length);
    const groupClosed = closedGroups[item.href] ?? false;
    return (
      <li key={item.href} data-nested={nested || undefined}>
        <div className="eds-sidebar-item-row">
          <a className="eds-sidebar-item" href={item.href} aria-current={item.active ? "page" : undefined} title={collapsed ? item.label : undefined}>
            <span className="eds-sidebar-icon" aria-hidden="true">{item.icon}</span>
            <span className="eds-sidebar-label"><span>{item.label}</span>{item.description ? <small>{item.description}</small> : null}</span>
            {item.badge ? <span className="eds-sidebar-badge">{item.badge}</span> : null}
          </a>
          {hasChildren && !collapsed ? <button className="eds-sidebar-group-toggle" type="button" aria-label={`${groupClosed ? "Expandir" : "Recolher"} ${item.label}`} aria-expanded={!groupClosed} onClick={() => setClosedGroups((current) => ({ ...current, [item.href]: !groupClosed }))}><ChevronDown aria-hidden="true" /></button> : null}
        </div>
        {hasChildren && !groupClosed && !collapsed ? <ul className="eds-sidebar-children">{item.children?.map((child) => renderItem(child, true))}</ul> : null}
      </li>
    );
  };

  return (
    <aside className="eds-sidebar" data-collapsed={collapsed}>
      <div className="eds-sidebar-header">
        <Brand className="eds-sidebar-brand" kind={collapsed ? "icon" : "logo"} alt="Eventesse" />
        <button
          className="eds-sidebar-toggle"
          type="button"
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          aria-expanded={!collapsed}
          onClick={() => setCollapsed((current) => !current)}
        >
          {collapsed ? <PanelLeftOpen aria-hidden="true" /> : <PanelLeftClose aria-hidden="true" />}
        </button>
      </div>

      <nav className="eds-sidebar-nav" aria-label={ariaLabel}>
        {sections.map((section, sectionIndex) => (
          <section className="eds-sidebar-section" key={section.label ?? sectionIndex}>
            {section.label ? <h3>{section.label}</h3> : null}
            <ul>
              {section.items.map((item) => renderItem(item))}
            </ul>
          </section>
        ))}
      </nav>
      {footer ? <div className="eds-sidebar-footer">{footer}</div> : null}
    </aside>
  );
}
