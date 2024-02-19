# Guitar Tuner by Macabresoft

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
2. In `/docs/` copy `index.html` and rename the copy `404.html` for compatibility with GitHub Pages: `cp ./docs/index.html ./docs/404.html`

More on deploying Angular apps can be found [here](https://angular.io/guide/deployment).