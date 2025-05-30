export const environment = {
  production: false,
  apiUrl: 'http://localhost:44328/api',
  defaultTenant: 'default',
  enableSubdomainDetection: true,
  allowedDomains: ['localhost', 'willmanage.com'],
  authConfig: {
    tokenKey: 'auth_token',
    userKey: 'user',
    tenantKey: 'tenant'
  }
};
