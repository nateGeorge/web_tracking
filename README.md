# web_tracking

## Summary
Track computers/devices/users with javascript and node.js.

This uses [fingerprintjs2](https://github.com/Valve/fingerprintjs2), [js-cookie](https://github.com/js-cookie/js-cookie), and [SwfStore](https://github.com/nfriedly/Javascript-Flash-Cookies) for flash cookies.

It can detect the same device cross-browser, except for chrome.  It does this via flash cookies, but chrome stores flash cookies in [a separate location](http://askubuntu.com/questions/40080/where-are-flash-cookies-stored).

I was also trying to use [evercookie](https://github.com/samyk/evercookie), but ended up just using
Flash LSOs (https://github.com/faisalman/flash-cookie-js) instead, because evercookie is a huge, complicated piece of code, and it was causing my page to drag and load infinitely.

## To install:
There are a number of dependencies for nodejs for this.  Do `npm install` to get 'em.

## To run server:
`node track_node_express.js`

Go to localhost:3001, press ctrl+shift+i in Chrome to see console output (dev tools).

## Rationale
This works by first checking from the browser javascript if they have cookies (flash and regular), then sends this and the fingerprint to the server.  The server checks for the fingerprint as an \_id in the mongodb, and also checks for the fingerprint and cookies in the db.  If none of these are found, it creates a new entry with the fingerprint as the \_id.
