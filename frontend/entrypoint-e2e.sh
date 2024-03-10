#!/usr/bin/env bash

# Define the backend URL
BACKEND_HEALTH_URL="http://localhost:9997/api/ping"

RETRY_DELAY=5
MAX_ATTEMPTS=5

# Health check function
health_check() {
  local http_code
  local attempts=0

  echo "Performing health check for backend..."

  until [ "$http_code" == "200" ]; do
    http_code=$(curl -LI -X GET "$BACKEND_HEALTH_URL" -o /dev/null -w '%{http_code}\n' -s)

    if [ "$http_code" == "200" ]; then
      echo "Backend is healthy."
    else
      echo "Health check failed. Retrying in $RETRY_DELAY seconds..."
      sleep $RETRY_DELAY
      ((attempts++))
      if [ "$attempts" -ge "$MAX_ATTEMPTS" ]; then
        echo "Max retry attempts reached. Exiting script."
        exit 1
      fi
    fi
  done
}
# Execute the health check function
health_check

# Run frontend once backend is healthy
npm run preview