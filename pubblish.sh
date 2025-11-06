#!/bin/bash

set -e
set -x
npm run test
npm run deploy
npm run publish
