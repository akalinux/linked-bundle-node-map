# How To Contribute

Please submit pull requests on the official github project page [here](https://github.com/akalinux/linked-bundle-node-map).

## Pull Request Rules

1. Please explain what your change does.
2. Provide updated unit tests if required.
3. Update the documentation as required.
4. Provide the updates that belong in CHANGELOG.md file.
5. Project white space is 2 spaces cuddle braces..
6. All code must be in TypeScript
7. Eslint must pass


## Things on the todo list

- Better documentation
- Better examples


## The demo app

The source code for the demo app is contained in the demo_pp folder. 

To run the demo app do the following ( assumes Linux with bash ).


### To initalize the project 

```bash
  # install the required packages
  npm install

  ## install the app and setup the deps
  cd demo_app
  ./setup.sh
  cd ..

```

### Development builds

Typically development builds are run locally.

To spin up the sand box env for port 5000 and start the builds run the following.

```
./launch_dev.sh
```

If you want to run these commands by hand.

Launching the webserver on http://localhost:5000
- npm run server &

Launch the main project in watch mode
- npm run watch &

Launch the demo app
- npm run tw &

### Dev Container support

To make it easier to contribute to this project, a .devcontainer folder has been added. 
