export const rolePermissions = {
  'Operations Admin': ['*'], // Full access to all 25 pages

  'Hospital Manager': [
    '/', '/appointments', '/animals', '/owners', '/medical-records', '/diagnostics', '/treatments', '/vaccinations', '/follow-ups',
    '/workflow-queues', '/alerts', '/notifications', '/anomalies', '/tasks', '/billing',
    '/analytics', '/forecast', '/risk-analysis', '/scenario-planning', '/reports',
    '/configurations', '/ai'
  ],

  'Veterinarian': [
    '/', '/appointments', '/animals', '/owners', '/medical-records', '/diagnostics', '/treatments', '/vaccinations', '/follow-ups',
    '/workflow-queues', '/alerts', '/notifications', '/anomalies',
    '/ai', '/reports', '/tasks'
  ],

  'Receptionist': [
    '/', '/appointments', '/animals', '/owners', '/billing', '/tasks', '/follow-ups', '/notifications', '/alerts'
  ],

  'Technician': [
    '/', '/animals', '/medical-records', '/diagnostics', '/treatments', '/vaccinations', '/tasks', '/workflow-queues', '/notifications', '/alerts'
  ],

  'Analyst': [
    '/', '/analytics', '/forecast', '/risk-analysis', '/scenario-planning', '/reports', '/anomalies', '/alerts', '/ai', '/notifications'
  ],

  'Field Staff': [
    '/', '/tasks', '/appointments', '/animals', '/owners', '/follow-ups', '/notifications', '/alerts'
  ]
};

export function isPathAllowed(role, path) {
  if (!role) return true;
  const allowed = rolePermissions[role] || rolePermissions['Operations Admin'];
  if (allowed.includes('*')) return true;
  return allowed.includes(path);
}
