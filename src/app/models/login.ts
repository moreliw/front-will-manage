export class LoginModel {
  Email: string;
  Password: string;
  TenantIdentifier?: string; // Could be subdomain or other tenant identifier
}
