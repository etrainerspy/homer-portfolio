Pull from GitHub.
Run npm install.
Run npm run build.
Restart PM2.
Verify the API.
Verify the React frontend.
Check the database.


One thing I would improve

On a production server, I recommend creating a simple setup script so that if you ever rebuild the server, you only have to run one command.

For example:

#!/bin/bash

apt update
apt install -y sqlite3 build-essential

cd /var/www/homer-portfolio
npm install
npm run build

pm2 restart homer-portfolio --update-env

That way, if you ever create a new droplet or restore from backup, you can get the application back up in minutes.