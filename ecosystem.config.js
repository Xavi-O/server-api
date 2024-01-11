module.exports = {
  apps : [{
    name   : "serverapi",
    script : "./index.js",
    cron_restart: '00 09,13,15,18 * * *',
    env_production: {
      NODE_ENV: "production"
   },
  }]
}
