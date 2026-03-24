import React from 'react';

// Shared inline SVG icons to replace all emojis across the app.
// Every icon accepts optional size (default 20) and color (default 'currentColor') props,
// plus any extra SVG props via ...rest.

const d = { strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' };

export const IconAlertTriangle = ({ size = 20, color = 'currentColor', ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...d} {...r}>
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export const IconTrendingUp = ({ size = 20, color = 'currentColor', ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...d} {...r}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

export const IconTrendingDown = ({ size = 20, color = 'currentColor', ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...d} {...r}>
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
);

export const IconArrowRight = ({ size = 20, color = 'currentColor', ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...d} {...r}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export const IconStar = ({ size = 20, color = 'currentColor', ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...d} {...r}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export const IconCrosshair = ({ size = 20, color = 'currentColor', ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...d} {...r}>
    <circle cx="12" cy="12" r="10" /><line x1="22" y1="12" x2="18" y2="12" />
    <line x1="6" y1="12" x2="2" y2="12" /><line x1="12" y1="6" x2="12" y2="2" />
    <line x1="12" y1="22" x2="12" y2="18" />
  </svg>
);

export const IconMonitor = ({ size = 20, color = 'currentColor', ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...d} {...r}>
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

export const IconBarChart = ({ size = 20, color = 'currentColor', ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...d} {...r}>
    <line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>
);

export const IconPlusSquare = ({ size = 20, color = 'currentColor', ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...d} {...r}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

export const IconUsers = ({ size = 20, color = 'currentColor', ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...d} {...r}>
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);

export const IconBuilding = ({ size = 20, color = 'currentColor', ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...d} {...r}>
    <rect x="4" y="2" width="16" height="20" rx="1" /><line x1="9" y1="6" x2="9" y2="6.01" />
    <line x1="15" y1="6" x2="15" y2="6.01" /><line x1="9" y1="10" x2="9" y2="10.01" />
    <line x1="15" y1="10" x2="15" y2="10.01" /><line x1="9" y1="14" x2="9" y2="14.01" />
    <line x1="15" y1="14" x2="15" y2="14.01" /><path d="M9 22v-4h6v4" />
  </svg>
);

export const IconMapPin = ({ size = 20, color = 'currentColor', ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...d} {...r}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);

export const IconShield = ({ size = 20, color = 'currentColor', ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...d} {...r}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export const IconSearch = ({ size = 20, color = 'currentColor', ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...d} {...r}>
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export const IconFileText = ({ size = 20, color = 'currentColor', ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...d} {...r}>
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
  </svg>
);

export const IconCpu = ({ size = 20, color = 'currentColor', ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...d} {...r}>
    <rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" />
    <line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
    <line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />
    <line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" />
    <line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" />
  </svg>
);

export const IconSparkles = ({ size = 20, color = 'currentColor', ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...d} {...r}>
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
    <path d="M19 13l.75 2.25L22 16l-2.25.75L19 19l-.75-2.25L16 16l2.25-.75L19 13z" />
  </svg>
);

export const IconBookOpen = ({ size = 20, color = 'currentColor', ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...d} {...r}>
    <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
    <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
  </svg>
);

export const IconBriefcase = ({ size = 20, color = 'currentColor', ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...d} {...r}>
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
  </svg>
);

export const IconScale = ({ size = 20, color = 'currentColor', ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...d} {...r}>
    <line x1="12" y1="3" x2="12" y2="21" />
    <polyline points="1 12 5 8 9 12" /><polyline points="15 12 19 8 23 12" />
    <path d="M1 12a4 4 0 008 0" /><path d="M15 12a4 4 0 008 0" />
    <line x1="5" y1="8" x2="19" y2="8" />
  </svg>
);

export const IconGlobe = ({ size = 20, color = 'currentColor', ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...d} {...r}>
    <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </svg>
);

export const IconZap = ({ size = 20, color = 'currentColor', ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...d} {...r}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

export const IconMicroscope = ({ size = 20, color = 'currentColor', ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...d} {...r}>
    <path d="M6 18h8" /><path d="M3 22h18" /><path d="M14 22a7 7 0 100-14h-1" />
    <path d="M9 14h2" /><path d="M8 6h4" />
    <path d="M13 3.5A2.5 2.5 0 0110.5 6v5A2.5 2.5 0 0113 13.5" />
    <path d="M10 6V3.5a2.5 2.5 0 015 0V6" />
  </svg>
);

export const IconMap = ({ size = 20, color = 'currentColor', ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...d} {...r}>
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
    <line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" />
  </svg>
);

export const IconTarget = ({ size = 20, color = 'currentColor', ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...d} {...r}>
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

export const IconAward = ({ size = 20, color = 'currentColor', ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...d} {...r}>
    <circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);

export const IconCheck = ({ size = 20, color = 'currentColor', ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...d} {...r}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const IconX = ({ size = 20, color = 'currentColor', ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...d} {...r}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const IconChevronRight = ({ size = 20, color = 'currentColor', ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...d} {...r}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export const IconMinus = ({ size = 20, color = 'currentColor', ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...d} {...r}>
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
