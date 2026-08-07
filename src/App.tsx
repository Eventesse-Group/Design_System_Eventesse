import { useState } from "react";
import { FileText, Home, MessageSquare, Settings, Ticket, Users } from "lucide-react";

import { Brand } from "./components/Brand";
import { ProductHeader } from "./components/ProductHeader";
import { Sidebar } from "./components/Sidebar";

const foundations = [
  ["Tokens semânticos", "Valores nomeados pela intenção de uso, com modos light e dark."],
  ["Acessibilidade", "Contraste, foco visível, alvos adequados e redução de movimento por padrão."],
  ["Composição", "Primitivos pequenos e previsíveis que formam padrões de produto."],
  ["Governança", "Mudanças versionadas, documentadas e validadas antes da adoção."],
];

const swatches = [
  ["Brand", "var(--eds-color-rose-500)"],
  ["Accent", "var(--eds-color-teal-500)"],
  ["Success", "var(--eds-color-green-500)"],
  ["Warning", "var(--eds-color-amber-500)"],
  ["Danger", "var(--eds-color-red-500)"],
  ["Info", "var(--eds-color-blue-500)"],
];

const navigationSections = [
  {
    label: "Produto",
    items: [
      { label: "Início", href: "#inicio", icon: <Home />, active: true },
      { label: "Participantes", href: "#participantes", icon: <Users /> },
      { label: "Form Builder", href: "#formularios", icon: <FileText /> },
      { label: "Vouchers e guias", href: "#vouchers", icon: <Ticket /> },
    ],
  },
  {
    label: "Administração",
    items: [
      { label: "Conversas", href: "#conversas", icon: <MessageSquare />, badge: "3" },
      { label: "Configurações", href: "#configuracoes", icon: <Settings /> },
    ],
  },
];

export function App() {
  const [dark, setDark] = useState(false);

  return (
    <div data-theme={dark ? "dark" : "light"}>
      <button className="eds-button eds-theme-toggle" data-variant="secondary" onClick={() => setDark((value) => !value)}>
        {dark ? "Tema claro" : "Tema escuro"}
      </button>
      <main className="eds-shell">
        <section className="eds-hero">
          <Brand className="eds-brand-logo" />
          <p className="eds-kicker">Eventesse Design System · v0.2</p>
          <h1 className="eds-title">Consistência para produtos que evoluem.</h1>
          <p className="eds-lead">Uma referência compartilhada entre design e engenharia, derivada do ORB RH e preparada para uso em todos os produtos Eventesse.</p>
          <div className="eds-row">
            <button className="eds-button">Ação principal</button>
            <button className="eds-button" data-variant="secondary">Ação secundária</button>
            <button className="eds-button" data-variant="ghost">Ação discreta</button>
          </div>
        </section>

        <section className="eds-section" aria-labelledby="brand-title">
          <h2 id="brand-title">Marca oficial</h2>
          <div className="eds-brand-grid">
            <article className="eds-brand-card"><Brand /><span>Logo colorida</span></article>
            <article className="eds-brand-card eds-brand-card-dark"><Brand tone="white" /><span>Logo branca</span></article>
            <article className="eds-brand-card"><Brand tone="black" /><span>Logo preta</span></article>
            <article className="eds-brand-card"><Brand kind="icon" /><span>Ícone colorido</span></article>
            <article className="eds-brand-card eds-brand-card-dark"><Brand kind="icon" tone="white" /><span>Ícone branco</span></article>
          </div>
        </section>

        <section className="eds-section" aria-labelledby="navigation-title">
          <h2 id="navigation-title">Header e navegação estrutural</h2>
          <p className="eds-section-lead">A marca oficial identifica o produto; a sidebar organiza rotas e permanece sempre recolhível.</p>
          <div className="eds-app-shell-demo">
            <ProductHeader productName="RSVP" actions={<button className="eds-button" data-variant="secondary">Minha conta</button>} />
            <Sidebar sections={navigationSections} />
            <div className="eds-app-shell-content"><span>Área de conteúdo do produto</span></div>
          </div>
        </section>

        <section className="eds-section" aria-labelledby="principles-title">
          <h2 id="principles-title">Princípios</h2>
          <div className="eds-grid">
            {foundations.map(([title, description]) => <article className="eds-card" key={title}><h3>{title}</h3><p>{description}</p></article>)}
          </div>
        </section>

        <section className="eds-section" aria-labelledby="colors-title">
          <h2 id="colors-title">Cores funcionais</h2>
          <div className="eds-swatches">
            {swatches.map(([name, color]) => <div className="eds-swatch" key={name}><div className="eds-swatch-color" style={{ "--swatch": color } as React.CSSProperties} /><div className="eds-swatch-label">{name}</div></div>)}
          </div>
        </section>
      </main>
    </div>
  );
}