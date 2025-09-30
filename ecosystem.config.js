module.exports = {
  apps: [
    {
      name: "assistants-front-build",
      script: "npm",
      args: "run build",
      cwd: "/var/www/assistants_front",
      interpreter: "none",
      autorestart: false,
    },
  ],

  deploy: {
    production: {
      user: "ubuntu",
      host: "assistants_production",
      ref: "origin/main",
      key: "~/.ssh/assistants-backend-prod.pem",
      repo: "git@assistants-front:cybertechglobal/website_myAutohouse.git",
      path: "/var/www/assistants-front",
      "pre-deploy-local": "",
      "post-deploy":
        "npm install && pm2 startOrRestart ecosystem.config.js --only assistants-front-build",
      "pre-setup": "",
    },
  },
};
