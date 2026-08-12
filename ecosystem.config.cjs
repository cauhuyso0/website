module.exports = {
  apps: [
    {
      name: "strapi",
      cwd: "/var/www/website/apps/cms",
      script: "node_modules/@strapi/strapi/bin/strapi.js",
      args: "start",
      interpreter: "node",
      instances: 1,
      autorestart: true,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "web",
      cwd: "/var/www/website/apps/web",
      script: "node_modules/next/dist/bin/next",
      args: "start -H 127.0.0.1 -p 3000",
      interpreter: "node",
      instances: 1,
      autorestart: true,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
