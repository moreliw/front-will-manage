# Implementação Multi-Tenant no Angular

Este documento descreve a implementação da arquitetura multi-tenant (Database-per-Tenant) no lado do Angular.

## Visão Geral

A arquitetura utiliza a abordagem Database-per-Tenant, onde cada cliente (tenant) possui seu próprio banco de dados físico. O Angular foi adaptado para:

1. Identificar o tenant do usuário (via subdomínio ou entrada manual)
2. Enviar essa informação ao backend em cada requisição
3. Processar tokens JWT que contêm informações do tenant

## Componentes Implementados

### 1. TenantService

Serviço responsável por gerenciar informações do tenant atual:

- Detecta automaticamente o tenant a partir do subdomínio
- Armazena e recupera as informações do tenant no localStorage
- Fornece métodos para obter/definir o tenant atual

### 2. Autenticação Adaptada

O processo de login foi adaptado para incluir informações do tenant:

- O modelo `LoginModel` foi atualizado para incluir `TenantIdentifier`
- O componente de login permite especificar manualmente o identificador do tenant
- Detecta automaticamente o tenant pelo subdomínio quando disponível

### 3. HTTP Interceptor

O `AuthInterceptor` foi atualizado para:

- Adicionar o token JWT em todas as requisições
- Incluir um cabeçalho `X-Tenant` com o identificador do tenant em todas as requisições
- Garantir que as chamadas à API tenham as informações necessárias para o backend conectar ao banco de dados correto

## Fluxo de Funcionamento

1. **Detecção do Tenant**:
   - Ao acessar a aplicação via URL tipo `clienteA.sua-app.com`, o tenant é detectado automaticamente
   - Alternativamente, o usuário pode fornecer o identificador do tenant no login

2. **Processo de Login**:
   - O login envia email, senha e identificador do tenant
   - O backend resolve o tenant, conecta ao banco de dados específico e valida as credenciais
   - Retorna um JWT contendo informações do tenant

3. **Requisições Autenticadas**:
   - Todas as requisições incluem o token JWT e o cabeçalho `X-Tenant`
   - O backend usa essas informações para rotear a requisição ao banco de dados correto

## Configuração

Quando a detecção de subdomínio está habilitada (`subdomainDetectionEnabled = true`), o sistema obtém o identificador do tenant diretamente da URL. 

Para desenvolvimento local ou ambientes que não suportam subdomínios, é possível desabilitar essa opção e exigir a entrada manual do identificador do tenant.

## Considerações de Segurança

- O token JWT contém a informação do tenant, impedindo que um usuário acesse dados de outro tenant
- Validações no backend garantem que cada usuário só tenha acesso aos dados de seu próprio tenant
- A conexão ao banco de dados correto é gerenciada inteiramente pelo backend, sem exposição de connection strings no frontend 