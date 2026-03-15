export type Transaction = {
  id: string;
  type: "sent" | "received";
  amount: string;
  coin: string;
  address: string;
  note: string;
  network: string;
  hash: string;
  date: string;
  time: string;
  status: "confirmed" | "pending" | "failed";
};

const STORAGE_KEY = "stableflow_transactions";

export function saveTransaction(tx: Transaction): void {
  const existing = getTransactions();
  const updated = [tx, ...existing];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function getTransactions(): Transaction[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearTransactions(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function generateTxId(): string {
  return `tx_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function formatTxDate(): { date: string; time: string } {
  const now = new Date();
  const date = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return { date, time };
}