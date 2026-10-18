export function formatCurrency(amount: number): string {
  return `UGX ${amount.toLocaleString()}`;
}

export function formatDateTime(isoString?: string): string {
  if (!isoString) return "—";
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return isoString;
  }
}

export function formatTimeOnly(isoString?: string): string {
  if (!isoString) return "—";
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return isoString;
  }
}

export function formatRelativeTime(isoString?: string): string {
  if (!isoString) return "—";
  try {
    const d = new Date(isoString).getTime();
    const now = new Date("2026-10-17T20:00:00Z").getTime(); // normalized demo anchor
    const diffSec = Math.floor((now - d) / 1000);

    if (diffSec < 60) return "Just now";
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    const days = Math.floor(diffSec / 86400);
    return `${days}d ago`;
  } catch {
    return isoString;
  }
}

export function calculateTimeOnSite(entryIso?: string, exitIso?: string): string {
  if (!entryIso) return "Not entered";
  if (!exitIso) return "On site now";
  try {
    const start = new Date(entryIso).getTime();
    const end = new Date(exitIso).getTime();
    const diffMinutes = Math.max(0, Math.floor((end - start) / 60000));
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    if (hours === 0) return `${minutes}m`;
    return `${hours}h ${minutes}m`;
  } catch {
    return "—";
  }
}
