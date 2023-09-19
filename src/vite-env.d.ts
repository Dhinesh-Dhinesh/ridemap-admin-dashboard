/// <reference types="vite/client" />

interface ImportMetaEnv {
    // Firebase configuration
    readonly VITE_API_API_KEY: string
    readonly VITE_API_AUTH_DOMAIN: string
    readonly VITE_API_DATABASE_URL: string
    readonly VITE_API_PROJECT_ID: string
    readonly VITE_API_STORAGE_BUCKET: string
    readonly VITE_API_MESSAGING_SENDER_ID: string
    readonly VITE_API_APP_ID: string
    readonly VITE_API_MEASUREMENT_ID: string

    // Api URL
    readonly VITE_API_API_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}