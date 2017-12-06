# What is this?

A Chrome extension so that you can hover on a YouTube link and see a popup giving the title, duration, upvotes and downvotes. Here's a screenshot.

![screenshot](./ngrry.png)


# Are you going to publish it to the Chrome extension store?

No.

# Why not?

 * It's just an exercise for my benefit, to learn the basics of creating Chrome extensions.
 * I'm not going to publish my Google API key.
 * The requirement to configure the extension with your API key is probably too high a barrier for the average Chrome user.

# Well then, how do I use it?

* Git-clone this repo.
* Go to your Chrome extensions page: chrome://extensions (Only works in the Chrome browser, obviously)
* Check the Developer mode checkbox.
* Click the "Load unpacked extension..." button.
* Navigate to the root directory of this repo and click OK.
* Click on this extension's Options link and enter your API key.

# But I don't have an API key!

Get one by following the directions [here](https://developers.google.com/youtube/v3/getting-started).

# How do I test this?
```
node test_ngrry.js
```
