import React from 'react';

const StatCard = ({
  label,
  value,
  icon,
  iconBg = 'rgba(79, 70, 229, 0.15)',
  iconColor = '#818cf8',
  subtitle,
}) => {
  return (
    <div className="glass-card stat-card glass-card-hover">
      <div className="stat-info">
        <span className="stat-label">{label}</span>
        <div className="stat-value">{value}</div>
        {subtitle && (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem', display: 'block' }}>
            {subtitle}
          </span>
        )}
      </div>
      <div
        className="stat-icon"
        style={{
          background: iconBg,
          color: iconColor,
        }}
      >
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
