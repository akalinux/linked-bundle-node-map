#!/bin/bash

#Launch the main project in watch mode
npm run watch &
cd demo_app

# Start the webserver
npm run server &


# Launch the demo app
npm run watch &
