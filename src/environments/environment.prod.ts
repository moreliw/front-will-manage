export const environment = {
  production: true,
  apiUrl: 'https://back-will-manage-production.up.railway.app/api',
  defaultTenant: 'default',
  enableSubdomainDetection: true,
  allowedDomains: ['willmanage.com'],
  authConfig: {
    tokenKey: 'accessToken',
    refreshTokenKey: 'refreshToken',
    tenantKey: 'currentTenant'
  }
};
