/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SAMPLE: string,
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
