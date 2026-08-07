import type { ReactNode } from "react";
import { useState } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { Brand } from "./Brand";

export interface SidebarItem {
  label: string;
  href: string;
  icon: ReactNode;
  active?: boolean;
  badge?: string;
}

export interface SidebarSection {
  label?: string;
  items: SidebarItem[];
}

export interface SidebarProps {
  ariaLabel?: string;
  sections: SidebarSection[];
  defaultCollapsed?: boolean;
}

export function Sidebar({
  ariaLabel = "Navegação principal",
  sections,
  defaultCollapsed = false,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

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
              {section.items.map((item) => (
                <li key={item.href}>
                  <a
                    className="eds-sidebar-item"
                    href={item.href}
                    aria-current={item.active ? "page" : undefined}
                    title={collapsed ? item.label : undefined}
                  >
                    <span className="eds-sidebar-icon" aria-hidden="true">{item.icon}</span>
                    <span className="eds-sidebar-label">{item.label}</span>
                    {item.badge ? <span className="eds-sidebar-badge">{item.badge}</span> : null}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </nav>
    </aside>
  );
}