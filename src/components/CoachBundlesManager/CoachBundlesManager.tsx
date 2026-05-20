"use client";

import { useState } from "react";
import type { CoachBundle, CoachingOption } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import styles from "./CoachBundlesManager.module.css";

interface Props {
  bundles: CoachBundle[];
  options: CoachingOption[];
  token: string;
  onChange: () => void;
}

export default function CoachBundlesManager({ bundles, options, token, onChange }: Props) {
  const [adding, setAdding] = useState<string | null>(null); // coachingOptionId being added
  const [newSessions, setNewSessions] = useState<number>(3);
  const [newPriceEuros, setNewPriceEuros] = useState<number>(0);
  const [busy, setBusy] = useState(false);

  const individualOptions = options.filter(o => o.type !== "group_coaching");

  async function createBundle(coachingOptionId: string) {
    if (newSessions < 2 || newPriceEuros < 0) return;
    setBusy(true);
    try {
      const res = await fetch("/api/coach/bundles", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          coachingOptionId,
          sessions: newSessions,
          priceCents: Math.round(newPriceEuros * 100),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setAdding(null);
        setNewSessions(3);
        setNewPriceEuros(0);
        onChange();
      } else {
        alert(`Error: ${data.error}`);
      }
    } finally {
      setBusy(false);
    }
  }

  async function updateBundle(id: string, patch: { sessions?: number; priceCents?: number; active?: boolean }) {
    setBusy(true);
    try {
      const res = await fetch(`/api/coach/bundles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(patch),
      });
      if (res.ok) onChange();
      else alert("Error al actualizar");
    } finally {
      setBusy(false);
    }
  }

  async function deleteBundle(id: string) {
    if (!confirm("¿Eliminar este bono? Las compras ya realizadas seguirán siendo válidas.")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/coach/bundles/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) onChange();
      else alert("Error al eliminar");
    } finally {
      setBusy(false);
    }
  }

  if (individualOptions.length === 0) {
    return (
      <div className={styles.empty}>
        Crea primero opciones de coaching individuales (no de grupo) para poder ofrecer bonos.
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {individualOptions.map(opt => {
        const optBundles = bundles.filter(b => b.coachingOptionId === opt.id);
        return (
          <div key={opt.id} className={`glass-card ${styles.optionBlock}`}>
            <div className={styles.optionHeader}>
              <div>
                <strong>{opt.name}</strong>
                <span className={styles.optionMeta}>
                  · 1 sesión: {formatPrice(opt.priceCents)} · {opt.durationMinutes} min
                </span>
              </div>
              {adding !== opt.id && (
                <button className={styles.addBtn} onClick={() => setAdding(opt.id)} disabled={busy}>
                  + Añadir bono
                </button>
              )}
            </div>

            {optBundles.length === 0 && adding !== opt.id && (
              <div className={styles.noBundles}>No hay bonos configurados.</div>
            )}

            {optBundles.length > 0 && (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Sesiones</th>
                    <th>Precio total</th>
                    <th>Precio/sesión</th>
                    <th>Estado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {optBundles.map(b => (
                    <tr key={b.id}>
                      <td>{b.sessions}</td>
                      <td>{formatPrice(b.priceCents)}</td>
                      <td className={styles.muted}>{formatPrice(Math.round(b.priceCents / b.sessions))}</td>
                      <td>
                        <button
                          className={b.active ? styles.activeBadge : styles.inactiveBadge}
                          onClick={() => updateBundle(b.id, { active: !b.active })}
                          disabled={busy}
                        >
                          {b.active ? "Activo" : "Inactivo"}
                        </button>
                      </td>
                      <td>
                        <button className={styles.deleteBtn} onClick={() => deleteBundle(b.id)} disabled={busy}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {adding === opt.id && (
              <div className={styles.addForm}>
                <label>
                  Sesiones
                  <input
                    type="number"
                    min={2}
                    max={50}
                    value={newSessions}
                    onChange={e => setNewSessions(parseInt(e.target.value, 10) || 0)}
                  />
                </label>
                <label>
                  Precio total (€)
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={newPriceEuros}
                    onChange={e => setNewPriceEuros(parseFloat(e.target.value) || 0)}
                  />
                </label>
                <button className={styles.addBtn} onClick={() => createBundle(opt.id)} disabled={busy}>
                  Guardar
                </button>
                <button className={styles.cancelBtn} onClick={() => setAdding(null)} disabled={busy}>
                  Cancelar
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
