#!/bin/bash

echo "🔄 [AUTOBOB] Watchdog started..."

while true; do
  git fetch origin
  if ! git diff --quiet HEAD origin/main; then
    echo "🆕 [AUTOBOB] Update detected!"
    git reset --hard origin/main
    npm install || yarn install
    pkill -f "node" || true
    echo "🔁 [AUTOBOB] Restarting..."
    npm start &
  fi
  sleep 60
done