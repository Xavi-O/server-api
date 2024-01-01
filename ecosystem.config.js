module.exports = {
  apps : [{
    name   : "serverapi",
    script : "./index.js",
    cron_restart: '00 06,10,12,16 * * *',
    env_production: {
      NODE_ENV: "production"
   },
  }]
}
