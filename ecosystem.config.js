// eslint-disable-next-line no-undef
module.exports = {
  apps: [
    {
      name: "juulabel-front",
      script: "./node_modules/next/dist/bin/next",
      args: "start",
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
