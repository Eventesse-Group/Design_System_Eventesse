import { Download, Plus } from "lucide-react";

export function PrototypeHeader() {
  const fromCatalog = new URLSearchParams(window.location.search).get("from") === "catalog";
  return (
    <header className="pt-page-header pt-page-header-compact">
      <div className="pt-compact-heading">
        <nav className="pt-breadcrumb" aria-label="Breadcrumb"><a href="#evento">Convenção 2026</a><span>/</span><a href="#operacao">Operação</a><span>/</span><strong>Participantes</strong></nav>
        <div><h1>Participantes</h1><span>750 registros</span></div>
      </div>
      <div className="pt-actions">{fromCatalog ? <a className="pt-button pt-button-secondary" href="/prototypes/components/#patterns">Voltar ao catálogo</a> : null}<button className="pt-button pt-button-secondary" type="button"><Download />Exportar</button><button className="pt-button" type="button"><Plus />Adicionar</button></div>
    </header>
  );
}
