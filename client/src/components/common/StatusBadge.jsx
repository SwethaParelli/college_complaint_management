import React from 'react';
import {
  Clock,
  Eye,
  UserCheck,
  RotateCw,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';

const StatusBadge = ({ status }) => {
  const getStatusConfig = (st) => {
    switch (st) {
      case 'Pending':
        return {
          className: 'badge-pending',
          icon: <Clock size={13} />,
          label: 'Pending',
        };
      case 'Under Review':
        return {
          className: 'badge-under-review',
          icon: <Eye size={13} />,
          label: 'Under Review',
        };
      case 'Assigned':
        return {
          className: 'badge-assigned',
          icon: <UserCheck size={13} />,
          label: 'Assigned',
        };
      case 'In Progress':
        return {
          className: 'badge-in-progress',
          icon: <RotateCw size={13} />,
          label: 'In Progress',
        };
      case 'Resolved':
        return {
          className: 'badge-resolved',
          icon: <CheckCircle size={13} />,
          label: 'Resolved',
        };
      case 'Rejected':
        return {
          className: 'badge-rejected',
          icon: <XCircle size={13} />,
          label: 'Rejected',
        };
      case 'Reopened':
        return {
          className: 'badge-reopened',
          icon: <AlertCircle size={13} />,
          label: 'Reopened',
        };
      default:
        return {
          className: 'badge-pending',
          icon: <Clock size={13} />,
          label: st || 'Unknown',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`badge ${config.className}`}>
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;
