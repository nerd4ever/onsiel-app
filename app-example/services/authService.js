import * as AuthSession from 'expo-auth-session';
import { Platform } from 'react-native';

// Defina a configuração do Keycloak
const discovery = {
    authorizationEndpoint: 'https://idp.sandbox.nerd4ever.com.br/auth/realms/sandbox/protocol/openid-connect/auth',
    tokenEndpoint: 'https://idp.sandbox.nerd4ever.com.br/auth/realms/sandbox/protocol/openid-connect/token',
    revocationEndpoint: 'https://idp.sandbox.nerd4ever.com.br/auth/realms/sandbox/protocol/openid-connect/revoke',
};

// Configurações do cliente
const config = {
    clientId: 'kaya-test',
    redirectUri: AuthSession.makeRedirectUri({
        useProxy: true,
    }),
    scopes: ['openid', 'profile', 'email'],
};

export const login = async () => {
    try {
      const redirectUri = AuthSession.makeRedirectUri({
        useProxy: Platform.select({ web: false, default: true }),
      });
  
      const authUrl = `${discovery.authorizationEndpoint}?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(config.scopes.join(' '))}`;
  
      const authResult = Platform.select({
        web: () => window.location.href = authUrl, // Redirecionar manualmente no ambiente web
        default: () => AuthSession.startAsync({ authUrl }),
      });
  
      if (authResult.type === 'success') {
        console.log('Login bem-sucedido:', authResult);
        return authResult;
      } else {
        console.error('Login falhou ou foi cancelado:', authResult);
      }
    } catch (error) {
      console.error('Failed to login', error);
      throw error;
    }
  };

export const refreshAuth = async (refreshToken) => {
    try {
        const tokenResult = await AuthSession.refreshAsync(
            {
                clientId: config.clientId,
                scopes: config.scopes,
            },
            {
                refreshToken,
                tokenEndpoint: discovery.tokenEndpoint,
            }
        );

        console.log('Token refreshed:', tokenResult);
        return tokenResult;
    } catch (error) {
        console.error('Failed to refresh token', error);
        throw error;
    }
};

export const logout = async (token) => {
    try {
        const revokeUrl = `${discovery.revocationEndpoint}?token=${token}&client_id=${config.clientId}`;
        await fetch(revokeUrl, { method: 'POST' });
        console.log('Logout successful');
    } catch (error) {
        console.error('Failed to revoke token', error);
        throw error;
    }
};
