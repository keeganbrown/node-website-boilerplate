#!/bin/bash
git fetch origin && git reset --hard origin/master
npm install && npm run build && pm2 restart all