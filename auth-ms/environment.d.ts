declare global {
    namespace NodeJS {
      interface ProcessEnv {
        DB_CON_STRING: string;
        DB_NAME: string;
        NODE_ENV: 'development' | 'production' | 'test';
        PORT: string;
        PRIVATE_KEY: string;
        PUBLIC_KEY: string;
        RABBITMQ_HOST: string;
        RABBITMQ_USERNAME: string;
        RABBITMQ_PASSWORD: string;
      }
    }
  }
  
export {}