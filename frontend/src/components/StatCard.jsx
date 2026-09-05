const StatCard = ({ title, value, subtitle, icon, trend }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-card-icon">{icon}</span>
        {trend && <span className={`stat-card-trend ${trend > 0 ? 'positive' : 'negative'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>}
      </div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-title">{title}</div>
      {subtitle && <div className="stat-card-subtitle">{subtitle}</div>}
    </div>
  );
};

export default StatCard;
