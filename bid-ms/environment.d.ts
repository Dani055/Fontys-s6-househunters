declare global {
    namespace NodeJS {
      interface ProcessEnv {
        DB_CON_STRING: string;
        NODE_ENV: 'development' | 'production' | 'test';
        PORT: string;
        PRIVATE_KEY: string;
        PUBLIC_KEY: string;
      }
    }
  }
  
export {}