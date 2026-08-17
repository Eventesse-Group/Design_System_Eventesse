import type { ReactNode } from "react";

import { Brand } from "./Brand";

export interface ProductHeaderProps {
  homeHref?: string;
  productName?: string;
  actions?: ReactNode;
}

export function ProductHeader({ homeHref = "/", productName, actions }: ProductHeaderProps) {
  return (
    <header className="eds-product-header">
      <div className="eds-product-header-brand">
        <a className="eds-product-header-home" href={homeHref} aria-label="Ir para o início">
          <Brand className="eds-product-header-logo" />
        </a>
        {productName ? <span className="eds-product-header-name" aria-label={`Produto: ${productName}`}>{productName}</span> : null}
      </div>
      {actions ? <div className="eds-product-header-actions">{actions}</div> : null}
    </header>
  );
}
