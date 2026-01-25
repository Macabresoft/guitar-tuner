# Guitar Tuner by macabrett

A guitar tuner built for the web.

# Features

* Tune guitar to both Standard and Drop D tuning
* See exact frequency of current audio input
* Free
* Serverless

# Algorithm

Uses an Average Magnitude Difference Function to determine the frequency from a set of samples.

## Deployment

1. Build using Angular: `ng build --output-path docs --base-href /guitar-tuner/`
2. Copy the contents of `/docs/browser` and place it in `/docs` (removing the browser subfolder): `mv ./docs/browser/* ./docs`, `rm ./docs/browser/`
3. In `/docs/` copy `index.html` and rename the copy `404.html` for compatibility with GitHub Pages: `cp ./docs/index.html ./docs/404.html`

More on deploying Angular apps can be found [here](https://angular.io/guide/deployment).

## Testing

To test, you must first run `ng serve` from a terminal.

## Installation

### Android

* Open `https://www.macabrett.com/guitar-tuner/` in Chrome
* Tap the three dots in the upper right corner for options
* Select `Install app` from the drop-down

You can now pin a standalone version of the app to your home screen. This will continue to work offline.

### Windows
* Open `https://www.macabrett.com/guitar-tuner/` in Chrome
* In the address bar, click an icon with a down arrow in front of a computer monitor
* Follow instructions to install the app

You now have a standalone version of the app installed on windows. This will continue to work offline.