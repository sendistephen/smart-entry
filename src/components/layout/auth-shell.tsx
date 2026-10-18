import Link from "next/link";

export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      <aside className="hidden lg:flex flex-col justify-between bg-brand-800 p-10 text-white">
        <Link href="/login" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-white text-sm font-bold text-brand-800">
            SE
          </span>
          <span className="text-base font-semibold">Smart Entry</span>
        </Link>
        <div className="max-w-md space-y-3">
          <h2 className="text-3xl font-semibold leading-tight">
            Every gate, visitor and service in one place.
          </h2>
          <p className="text-sm leading-relaxed text-brand-100">
            Manage residential properties, approve arrivals and keep a complete
            audit trail without leaving your workspace.
          </p>
        </div>
        <p className="text-xs text-brand-200">© Smart Entry</p>
      </aside>

      <main className="flex items-center justify-center bg-zinc-50 p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <Link href="/login" className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-brand-700 text-sm font-bold text-white">
              SE
            </span>
            <span className="text-base font-semibold text-zinc-900">Smart Entry</span>
          </Link>
          <div className="mb-6 space-y-1">
            <h1 className="text-2xl font-semibold text-zinc-900">{title}</h1>
            <p className="text-sm text-zinc-600">{description}</p>
          </div>
          {children}
          {footer && <div className="mt-6 text-center text-sm text-zinc-600">{footer}</div>}
        </div>
      </main>
    </div>
  );
}

export const authLinkClass =
  "font-medium text-brand-700 hover:text-brand-900 hover:underline underline-offset-4";
