#!/bin/bash

## this setup script initalizes the npm folder for us.. as npm link does not like this!
target=$(cd $(pwd)/..;pwd)
rm -rf ./node_modules
mkdir ./node_modules
ln -s $target node_modules/linked-bundle-node-map
npm install
rm -f node_modules/linked-bundle-node-map
ln -s $target node_modules/linked-bundle-node-map
