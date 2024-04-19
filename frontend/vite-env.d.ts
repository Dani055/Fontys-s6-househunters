/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_PORT: number;
    readonly VITE_BACKEND_CLUSTER_URL: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  