#!/bin/bash

set -e

echo "=== [PM2 restart] Restart juulabel-front process ==="

ENV_VERSION=$(grep ENV_VERSION /home/juulabel-front/.env | cut -d '=' -f2)

PM2_SCRIPT=$(cat <<EOF
  export NVM_DIR="/home/ubuntu/.nvm"
  [ -s "\$NVM_DIR/nvm.sh" ] && . "\$NVM_DIR/nvm.sh"
  export PATH="/home/ubuntu/.nvm/versions/node/v22.4.0/bin:\$PATH"
  export PM2_HOME="/home/ubuntu/.pm2"
EOF
)

if [ "$ENV_VERSION" == "dev" ]; then
  echo "=== [PM2 restart] Restart juulabel-front-qa process ==="

  rm -rf /home/juulabel-qa/juulabel-front
  cp -r /home/juulabel-front /home/juulabel-qa/juulabel-front

  sudo -u ubuntu -H bash -c "
    $PM2_SCRIPT
    cd /home/juulabel-qa/juulabel-front
    pnpm install
    pm2 delete front-qa || true
    pm2 start npm --name front-qa -- run start:qa
  "

elif [ "$ENV_VERSION" == "production" ]; then
  echo "=== [PM2 restart] Restart juulabel-front process ==="

  rm -rf /home/juulabel/juulabel-front
  rm -rf /home/juulabel-backup/juulabel-front
  cp -r /home/juulabel-front /home/juulabel-backup/juulabel-front
  cp -r /home/juulabel-front /home/juulabel/juulabel-front

  sudo -u ubuntu -H bash -c "
    $PM2_SCRIPT
    cd /home/juulabel/juulabel-front
    pnpm install
    pm2 delete front-live || true
    pm2 start npm --name front-live -- run start
  "
fi

rm -rf /home/juulabel-front
mkdir /home/juulabel-front
