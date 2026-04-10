export default function Loading() {
  return (
    <main className="page-shell">
      <section className="form-hero">
        <div className="hero-copy loading-card">
          <div className="loading-line loading-line-short" />
          <div className="loading-line loading-line-title" />
          <div className="loading-line" />
          <div className="loading-line loading-line-medium" />
        </div>

        <aside className="hero-panel loading-card">
          <div className="loading-line loading-line-short" />
          <div className="loading-line" />
          <div className="loading-line loading-line-medium" />
          <div className="loading-line loading-line-short" />
        </aside>
      </section>

      <section className="form-section loading-card loading-section">
        <div className="loading-line loading-line-short" />
        <div className="loading-line loading-line-title" />
        <div className="loading-line loading-line-medium" />
        <div className="loading-grid">
          <div className="loading-block" />
          <div className="loading-block" />
          <div className="loading-block" />
          <div className="loading-block" />
        </div>
      </section>
    </main>
  );
}
