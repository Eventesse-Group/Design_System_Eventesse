import type { ReactNode } from "react";

import { Brand } from "./Brand";

export interface ProductHeaderProps {
  productName?: string;
  actions?: ReactNode;
}

export function ProductHeader({ productName, actions }: ProductHeaderProps) {
  return (
    <header className="eds-product-header">
      <div className="eds-product-header-brand">
        <Brand className="eds-product-header-logo" />
        {productName ? <span className="eds-product-header-name">{productName}</span> : null}
      </div>
      {actions ? <div className="eds-product-header-actions">{actions}</div> : null}
    </header>
  );
}