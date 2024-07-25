export interface AuthorizationData {
  id: string;
  codigoSmsRequerido: boolean;
  token: string;
  refreshTokenHash: string;
  firstAccess: boolean;
  nome: string;
  email: string;
  authenticated: boolean;
  message?: any;
  acessos?: any;
  localizacaoClientId: string;
  localizacaoSecretId: string;
}
