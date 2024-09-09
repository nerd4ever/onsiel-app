import {
    ActivityIndicator,
    ScrollView,
    Text,
    View,
} from "react-native";
import * as AuthSession from "expo-auth-session";
import { useEffect, useState } from "react";

const redirectUri = AuthSession.makeRedirectUri();

// Keycloak details
const keycloakUri = "https://idp.sandbox.nerd4ever.com.br";
const keycloakRealm = "sandbox";
const clientId = "onsiel-app";

export function generateShortUUID() {
    return Math.random().toString(36).substring(2, 15);
}

export default function LoginScreen() {
    const [accessToken, setAccessToken] = useState<string>();
    const [idToken, setIdToken] = useState<string>();
    const [refreshToken, setRefreshToken] = useState<string>();
    const [discoveryResult, setDiscoveryResult] =
        useState<AuthSession.DiscoveryDocument>();

    // Fetch OIDC discovery document once
    useEffect(() => {
        const getDiscoveryDocument = async () => {
            const discoveryDocument = await AuthSession.fetchDiscoveryAsync(
                `${keycloakUri}/realms/${keycloakRealm}`
            );
            setDiscoveryResult(discoveryDocument);
        };
        getDiscoveryDocument();
    }, []);

    const login = async () => {
        const state = generateShortUUID();
        // Get Authorization code
        const authRequestOptions: AuthSession.AuthRequestConfig = {
            responseType: AuthSession.ResponseType.Code,
            clientId,
            redirectUri: redirectUri,
            prompt: AuthSession.Prompt.Login,
            scopes: ["openid", "profile", "email", "offline_access"],
            state: state,
            usePKCE: true,
        };
        const authRequest = new AuthSession.AuthRequest(authRequestOptions);
        const authorizeResult = await authRequest.promptAsync(discoveryResult!); // Remove useProxy

        if (authorizeResult.type === "success") {
            // If successful, get tokens

            const tokenResult = await AuthSession.exchangeCodeAsync(
                {
                    code: authorizeResult.params.code,
                    clientId: clientId,
                    redirectUri: redirectUri,
                    extraParams: {
                        code_verifier: authRequest.codeVerifier || "",
                    },
                },
                discoveryResult!
            );
            setAccessToken(tokenResult.accessToken);
            setIdToken(tokenResult.idToken);
            setRefreshToken(tokenResult.refreshToken);
        }
    };

    useEffect(() => {
        if (discoveryResult && !refreshToken) {
            login();
        }
    }, [discoveryResult]);

    if (!discoveryResult) return <ActivityIndicator />;

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            {refreshToken ? (
                <View
                    style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                >
                    <View>
                        <ScrollView style={{ flex: 1 }}>
                            <Text>AccessToken: {accessToken}</Text>
                            <Text>idToken: {idToken}</Text>
                            <Text>refreshToken: {refreshToken}</Text>
                        </ScrollView>
                    </View>
                </View>
            ) : (
                <ActivityIndicator /> // Mostra um indicador de carregamento durante o processo de login
            )}
        </View>
    );
}
