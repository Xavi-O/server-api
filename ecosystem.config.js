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
/*
---COMMANDS---
set cron time: pm2 restart APIserver --cron-restart="00 09,13,15,18 * * *"
rename process id 1: pm2 restart 1 --name APIserver
delete saved process: pm2 cleardump
*/