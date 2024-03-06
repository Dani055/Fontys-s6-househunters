declare global {
    namespace NodeJS {
      interface ProcessEnv {
        DB_CON_STRING: string;
        NODE_ENV: 'development' | 'production' | 'test';
        PORT: string;
        PUBLIC_KEY: string;
        SEED_DATA_E2E: string;
      }
    }
  }
  
export {}