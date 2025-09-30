module.exports = {
  apps: [],

  deploy: {
    production: {
      user: "ubuntu",
      host: "assistants_production",
      ref: "origin/main",
      key: "~/.ssh/assistants-backend-prod.pem",
      repo: "git@assistants-front:cybertechglobal/website_myAutohouse.git",
      path: "/var/www/assistants-front",
      "pre-deploy-local": "Deploying...",
      "post-deploy": "npm install && npm run build:prod",
      "pre-setup": "",
    },
  },
};
