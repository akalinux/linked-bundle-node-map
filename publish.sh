#!/bin/bash

set -e
set -x
npm run test
npm run deploy
rm -rf public/js
npm publish
