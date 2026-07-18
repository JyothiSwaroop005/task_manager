const CARDS = [
  { key: 'total', label: 'Total tasks', icon: '\u2630', color: 'var(--color-primary)' },
  { key: 'completed', label: 'Completed', icon: '\u2713', color: 'var(--color-success)' },
  { key: 'pending', label: 'Pending', icon: '\u23F3', color: 'var(--color-warning)' },
  { key: 'highPriority', label: 'High priority', icon: '\u2757', color: 'var(--color-danger)' },
];

export default function DashboardCards({ stats }) {
  return (
    <div className="stats-grid">
      {CARDS.map((card) => (
        <div className="stat-card" key={card.key}>
          <div className="stat-accent" style={{ background: `${card.color}1f`, color: card.color }}>
            {card.icon}
          </div>
          <p className="stat-label">{card.label}</p>
          <p className="stat-value">{stats[card.key] ?? 0}</p>
        </div>
      ))}
    </div>
  );
}
