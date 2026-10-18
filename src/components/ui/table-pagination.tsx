"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Pagination } from "@/hooks/use-pagination";

type PageSlot = number | "gap-start" | "gap-end";

/** First, last, and the current page's neighbours, with gaps collapsed. */
function pageSlots(page: number, pageCount: number): PageSlot[] {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1);

  const slots: PageSlot[] = [1];
  const from = Math.max(2, page - 1);
  const to = Math.min(pageCount - 1, page + 1);
  if (from > 2) slots.push("gap-start");
  for (let p = from; p <= to; p++) slots.push(p);
  if (to < pageCount - 1) slots.push("gap-end");
  slots.push(pageCount);
  return slots;
}

const navButton =
  "inline-flex h-7 min-w-7 items-center justify-center rounded-sm px-1.5 text-xs font-medium tabular-nums transition-colors disabled:pointer-events-none disabled:opacity-40";

interface TablePaginationProps<T> extends Pagination<T> {
  /** Plural noun for the rows, e.g. "residents". */
  label?: string;
}

export function TablePagination<T>({
  page,
  pageCount,
  total,
  start,
  end,
  setPage,
  label = "records",
}: TablePaginationProps<T>) {
  if (total === 0) return null;

  return (
    <div className="flex items-center justify-between gap-3 border-t border-zinc-100 px-3 py-2.5 text-xs text-zinc-500 sm:px-4">
      <p className="min-w-0">
        <span className="hidden sm:inline">Showing </span>
        <span className="font-medium text-zinc-900 tabular-nums">
          {start}–{end}
        </span>{" "}
        of <span className="font-medium text-zinc-900 tabular-nums">{total}</span>
        <span className="hidden sm:inline"> {label}</span>
      </p>

      <nav aria-label="Pagination" className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
          className={`${navButton} text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900`}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <span className="px-1 tabular-nums whitespace-nowrap sm:hidden">
          {page} / {pageCount}
        </span>

        <div className="hidden items-center gap-1 sm:flex">
          {pageSlots(page, pageCount).map((slot) =>
            typeof slot === "number" ? (
              <button
                key={slot}
                type="button"
                onClick={() => setPage(slot)}
                aria-current={slot === page ? "page" : undefined}
                className={`${navButton} ${
                  slot === page
                    ? "bg-brand-700 text-white"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                {slot}
              </button>
            ) : (
              <span key={slot} className="px-1 text-zinc-400">
                …
              </span>
            ),
          )}
        </div>

        <button
          type="button"
          onClick={() => setPage(page + 1)}
          disabled={page === pageCount}
          aria-label="Next page"
          className={`${navButton} text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900`}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </nav>
    </div>
  );
}
