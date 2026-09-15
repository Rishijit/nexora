function ComingSoon({ title, description, icon = "✦" }) {
  return (
    <section className="coming-soon-page">
      <div className="coming-soon-icon">{icon}</div>

      <p className="eyebrow">NEXORA WORKSPACE</p>

      <h1>{title}</h1>

      <p className="coming-soon-description">
        {description}
      </p>

      <span className="coming-soon-badge">
        Coming soon
      </span>
    </section>
  );
}

export default ComingSoon;