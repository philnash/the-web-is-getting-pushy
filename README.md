# Push notifications with Service Worker

This repo is an example of push notifications in the browser based on getting notified of new tweets to a chosen hashtag.

This currently works in Chrome version 42 and above and requires Node.js to run.

## Preparing the application

Clone this repo and install the dependencies.

    $ git clone https://github.com/philnash/the-web-is-getting-pushy.git
    $ cd the-web-is-getting-pushy
    $ npm install

Copy the `.env.example` file to `.env`.

    $ cp .env.example .env

Fill in your credentials in `.env`.

To do this, you will need a [Twitter application](https://apps.twitter.com) and a [Google Project](https://console.developers.google.com/project).

### Twitter

Create an [application](https://apps.twitter.com/app/new) (it only needs read capabilities) and generate an access token too. Then copy the consumer key, consumer secret, access token and access token secret to the `.env` file.

### Google

Log in to the [Google Developers Console](https://console.developers.google.com/project) and create a project. Once the project is created, go to the APIs menu item, under APIs & auth, search for "messaging" and enable "Google Cloud Messaging for Chrome". Then go to the Credentials menu item and find the API key. Copy that into the `.env` file too.

You will also need the project number. To find this go to the project overview and the project number is at the top of the screen. Copy that and enter it as the `gcm_sender_id` in `public/manifest.json`.

### Hashtag

Choose a hashtag to follow, something reasonably popular will give you a good number of notifications to test with. Enter the hashtag in `.env`.

## Run the application

Run the app by typing on the command line:

    $ npm start

The application should be running at [http://localhost:3000/](http://localhost:3000/). Click the button to give your permission to receive notifications and wait for them to start.
