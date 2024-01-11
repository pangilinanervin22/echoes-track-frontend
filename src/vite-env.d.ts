/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SAMPLE: string,
    VITE_SAMPLE: string;
    VITE_API_KEY: string;
    VITE_AUTH_DOMAIN: string;
    VITE_PROJECT_ID: string;
    VITE_STORAGE_BUCKET: string;
    VITE_MESSAGING_SENDER_ID: string;
    VITE_APP_ID: string;
    VITE_MEASUREMENT_ID: string;
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
