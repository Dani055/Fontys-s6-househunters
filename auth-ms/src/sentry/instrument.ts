import * as Sentry from '@sentry/node'
import {nodeProfilingIntegration } from "@sentry/profiling-node";
if(!process.env.SENTRY_DSN && process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development'){
    console.log(`Sentry DSN is missing. Make sure it's correct for mode ${process.env.NODE_ENV}`);
}
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    nodeProfilingIntegration(),
  ],
  // Performance Monitoring
  enableTracing: true,
  maxBreadcrumbs: 10,
});