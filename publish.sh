#!/bin/bash

set -e
set -x
npm run test
npm run deploy
rm -rf public/js
npm run clean
npm run build
NPM_TOKEN=$(cat token.txt) npm publish
