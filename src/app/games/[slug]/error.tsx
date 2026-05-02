"use client";

export default function GameError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        className="glass-card"
        style={{
          maxWidth: "500px",
          width: "100%",
          padding: "var(--space-2xl)",
          textAlign: "center",
        }}
      >
        <span
          style={{ fontSize: "3rem", display: "block", marginBottom: "1rem" }}
        >
          ⚠️
        </span>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            marginBottom: "0.5rem",
          }}
        >
          Algo salió mal
        </h2>
        <p
          style={{
            color: "var(--color-text-secondary)",
            marginBottom: "1.5rem",
            lineHeight: 1.6,
          }}
        >
          No pudimos cargar esta página. Inténtalo de nuevo o vuelve a la página
          principal.
        </p>
        {error.digest && (
          <p
            style={{
              fontSize: "0.75rem",
              color: "var(--color-text-muted)",
              marginBottom: "1rem",
              fontFamily: "monospace",
            }}
          >
            Error: {error.digest}
          </p>
        )}
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
          <button className="btn btn-primary" onClick={reset}>
            Reintentar
          </button>
          <a href="/games" className="btn btn-secondary">
            Ver juegos
          </a>
        </div>
      </div>
    </div>
  );
}
