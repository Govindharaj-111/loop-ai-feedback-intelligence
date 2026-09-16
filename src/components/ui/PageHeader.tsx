"use client";

import React from "react";
import { Badge } from "./Badge";

export interface PageHeaderProps {
  title: string;
  description?: string;
  roleBadge?: string;
  breadcrumbs?: { label: string; href?: string }[];
  action?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  roleBadge,
  breadcrumbs,
  action,
  className = "",
}) => {
  return (
    <div className={`w-full pb-6 border-b border-slate-200/80 mb-6 ${className}`}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
          {breadcrumbs.map((b, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span>/</span>}
              {b.href ? (
                <a href={b.href} className="hover:text-slate-600 transition-colors">
                  {b.label}
                </a>
              ) : (
                <span className="text-slate-600 font-medium">{b.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {title}
            </h1>
            {roleBadge && (
              <Badge variant="primary" size="sm">
                {roleBadge}
              </Badge>
            )}
          </div>
          {description && (
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">{description}</p>
          )}
        </div>

        {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
      </div>
    </div>
  );
};
