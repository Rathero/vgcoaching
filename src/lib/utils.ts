// Client-safe utility helpers (no firebase-admin imports)

export const rankColors: Record<string, string> = {
  challenger: "#f4c874",
  grandmaster: "#e84057",
  master: "#9d48c4",
  diamond: "#576cce",
};

export const rankImages: Record<string, string> = {
  challenger: "/ranks/challenger.png",
  grandmaster: "/ranks/grandmaster.png",
  master: "/ranks/master.png",
  diamond: "/ranks/diamond.png",
};

export function getMinPrice(options: { priceCents: number }[]): number {
  if (options.length === 0) return 0;
  return Math.min(...options.map(o => o.priceCents));
}

export function formatPrice(cents: number): string {
  return `${(cents / 100).toFixed(0)}€`;
}
