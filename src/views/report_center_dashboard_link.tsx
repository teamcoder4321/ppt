import React from 'react';

interface GeneratedReportCenterDashboardLinkViewProps {
  isContainer?: boolean;
}

export default function GeneratedReportCenterDashboardLinkView({ isContainer = false }: GeneratedReportCenterDashboardLinkViewProps){
  return (
      <div className="rtext-content" dangerouslySetInnerHTML={{__html: "<a href=\"javascript:void(0)\" onclick=\"window.postMessage({ 'navigate': 'cff1b357-2149-4552-98e8-47173002b73c' })\" style=\"color: #6366f1; text-decoration: none; font-family: Inter; font-size: 0.875rem; transition: color 0.2s;\">← Back to Admin Dashboard</a>" }} />
  );
}