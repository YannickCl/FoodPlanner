"use client";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print rounded-full border border-ink px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-parchment"
    >
      🖨️ Imprimer / Enregistrer en PDF
    </button>
  );
}
