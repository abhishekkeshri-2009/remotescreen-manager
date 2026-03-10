#!/bin/sh
set -e

echo "Syncing database schema (Prisma db push)..."
./node_modules/.bin/prisma db push

echo "Starting server..."
node dist/main.js

