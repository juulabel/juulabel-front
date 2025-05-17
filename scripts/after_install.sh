#!/bin/bash

set -e

echo "=== [PM2 restart] Restart juulabel-front process ==="

ENV_VERSION=$(grep ENV_VERSION /home/juulabel-front/.env | cut -d '=' -f2)

if [ "$ENV_VERSION" == "dev" ]; then
  echo "=== [PM2 restart] Restart juulabel-front-qa process ==="
  rm -rf /home/juulabel-qa/juulabel-front
  cp -r /home/juulabel-front /home/juulabel-qa/juulabel-front
  cd /home/juulabel-qa/juulabel-front
  pnpm install
  pm2 stop front-qa
  pm2 start npm --name front-qa -- run start:qa
  pm2 reload front-qa
elif [ "$ENV_VERSION" == "production" ]; then
  echo "=== [PM2 restart] Restart juulabel-front process ==="
  rm -rf /home/juulabel/juulabel-front
  rm -rf /home/juulabel-backup/juulabel-front
  cp -r /home/juulabel-front /home/juulabel-backup/juulabel-front
  cp -r /home/juulabel-front /home/juulabel/juulabel-front
  cd /home/juulabel/juulabel-front
  pnpm install
  pm2 stop front-live
  pm2 start npm --name front-live -- run start
  pm2 reload front-live
fi

rm -rf /home/juulabel-front
mkdir /home/juulabel-front