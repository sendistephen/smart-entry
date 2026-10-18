"use client";

import { useState } from "react";

export const DEFAULT_PAGE_SIZE = 15;

export interface Pagination<T> {
  /** Current page, 1-based and always within range. */
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
  /** 1-based index of the first row on this page (0 when empty). */
  start: number;
  /** 1-based index of the last row on this page. */
  end: number;
  pageItems: T[];
  setPage: (page: number) => void;
}

function signatureOf<T>(items: T[]) {
  const first = items[0] as { id?: unknown } | undefined;
  return `${items.length}:${String(first?.id ?? "")}`;
}

/**
 * Client-side pagination over an already filtered list.
 * Jumps back to page 1 whenever the result set changes (search, filters,
 * added/removed records), detected via its length and first row id.
 */
export function usePagination<T>(
  items: T[],
  pageSize: number = DEFAULT_PAGE_SIZE,
): Pagination<T> {
  const [page, setPageState] = useState(1);
  const signature = signatureOf(items);
  const [lastSignature, setLastSignature] = useState(signature);

  if (signature !== lastSignature) {
    setLastSignature(signature);
    setPageState(1);
  }

  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(page, pageCount);
  const offset = (current - 1) * pageSize;
  const pageItems = items.slice(offset, offset + pageSize);

  return {
    page: current,
    pageCount,
    pageSize,
    total,
    start: total === 0 ? 0 : offset + 1,
    end: offset + pageItems.length,
    pageItems,
    setPage: (next) => setPageState(Math.min(Math.max(1, next), pageCount)),
  };
}
