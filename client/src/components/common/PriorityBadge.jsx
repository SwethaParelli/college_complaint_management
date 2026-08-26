import React from 'react';
import { ArrowDown, ArrowRight, ArrowUp, AlertTriangle } from 'lucide-react';

const PriorityBadge = ({ priority }) => {
  const getPriorityConfig = (p) => {
    switch (p) {
      case 'Low':
        return {
          className: 'badge-priority-low',
          icon: <ArrowDown size={13} />,
          label: 'Low',
        };
      case 'Medium':
        return {
          className: 'badge-priority-medium',
          icon: <ArrowRight size={13} />,
          label: 'Medium',
        };
      case 'High':
        return {
          className: 'badge-priority-high',
          icon: <ArrowUp size={13} />,
          label: 'High',
        };
      case 'Critical':
        return {
          className: 'badge-priority-critical',
          icon: <AlertTriangle size={13} />,
          label: 'Critical',
        };
      default:
        return {
          className: 'badge-priority-medium',
          icon: <ArrowRight size={13} />,
          label: p || 'Medium',
        };
    }
  };

  const config = getPriorityConfig(priority);

  return (
    <span className={`badge ${config.className}`}>
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};

export default PriorityBadge;
