/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly PORT: number;
    readonly VITE_BACKEND_CLUSTER_URL: string;
    readonly VITE_AUTHMS_URL: string;
    readonly VITE_LISTINGMS_URL: string;
    readonly VITE_BIDMS_URL: string;
    readonly VITE_MEDIAMS_URL: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  