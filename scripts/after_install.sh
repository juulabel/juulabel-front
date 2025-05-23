#!/bin/bash

set -e

echo "=== [PM2 restart] Restart juulabel-front process ==="

ENV_VERSION=$(grep ENV_VERSION /home/juulabel-front/.env | cut -d '=' -f2)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
export PATH="/home/ubuntu/.nvm/versions/node/v22.4.0/bin:$PATH" 
export PM2_HOME="/home/ubuntu/.pm2"

if [ "$ENV_VERSION" == "dev" ]; then
  TARGET_DIR="/home/juulabel-qa/juulabel-front"
  PROCESS_NAME="front-qa"
  START_SCRIPT="start:qa"
elif [ "$ENV_VERSION" == "production" ]; then
  TARGET_DIR="/home/juulabel/juulabel-front"
  BACKUP_DIR="/home/juulabel-backup/juulabel-front"
  PROCESS_NAME="front-live"
  START_SCRIPT="start"
fi

rm -rf "$TARGET_DIR"
cp -r /home/juulabel-front "$TARGET_DIR"

if [ "$ENV_VERSION" == "production" ]; then
  rm -rf "$BACKUP_DIR"
  cp -r /home/juulabel-front "$BACKUP_DIR"
fi

cd "$TARGET_DIR"
pnpm install

sudo -u ubuntu -H bash -c "
  source /home/ubuntu/.nvm/nvm.sh
  pm2 delete $PROCESS_NAME
  pm2 start npm --name $PROCESS_NAME -- run $START_SCRIPT
"

rm -rf /home/juulabel-front
mkdir /home/juulabel-front