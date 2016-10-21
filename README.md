# web_tracking

## Quick start
`npm install`
`node track_node_express.js`
Navigate to [localhost:3001](localhost:3001)

## Summary
Track computers/devices/users with javascript and node.js.

Some background:
[fingerprinting](https://wiki.mozilla.org/Fingerprinting)
[client id-ing](https://www.chromium.org/Home/chromium-security/client-identification-mechanisms)

Fonts, screen resolution, and timezone should give us about 22 bits of information, meaning we could uniquely id about 4 million devices.  However, we might expect [50 billion devices](http://www.statista.com/statistics/471264/iot-number-of-connected-devices-worldwide/) to be connected to the internet soon.  With from plugins, fonts, user agent, and http accept, we should be able to hit over 40 bits, or about 1 trillion unique ids.  To unambiguously id a device, we could use [clock skew](https://www.usenix.org/legacy/event/sec08/tech/full_papers/zander/zander_html/).

## Dependencies
This uses [fingerprintjs2](https://github.com/Valve/fingerprintjs2), [js-cookie](https://github.com/js-cookie/js-cookie), and [SwfStore](https://github.com/nfriedly/Javascript-Flash-Cookies) for flash cookies.

It can detect the same device cross-browser, except for chrome.  It does this via flash cookies, but chrome stores flash cookies in [a separate location](http://askubuntu.com/questions/40080/where-are-flash-cookies-stored).

I was also trying to use [evercookie](https://github.com/samyk/evercookie), but ended up just using
Flash LSOs (https://github.com/faisalman/flash-cookie-js) instead, because evercookie is a huge, complicated piece of code, and it was causing my page to drag and load infinitely.

However, it still wasn't syncing the flash cookie between firefox and opera--go figure.  [Chrome stores their flash cookies in another place anyway](http://askubuntu.com/questions/40080/where-are-flash-cookies-stored), so that was never even a possibility for cross-browser syncing.

## Cross browser detection
For cross-browser detection, I chose to use fonts, screen resolution, and timezone.  This, coupled with the IP address, is what I use to figure out if two browsers are on the same machine.

## To install:
There are a number of dependencies for nodejs for this.  Do `npm install` to get 'em.

## To run server:
`node track_node_express.js`

Go to localhost:3001, press ctrl+shift+i in your browser to see console output (dev tools).

## Rationale
This works by first checking from the browser javascript if they have cookies (flash and regular), then sends this and the fingerprint to the server.  The server checks for the fingerprint as an \_id in the mongodb, and also checks for the fingerprint and cookies in the db.  If none of these are found, it creates a new entry with the fingerprint as the \_id.

## To do:
* need to update ip when it changes
* I found the installed fonts were a bit different on my FF than opera or chrome.  Need to deal with that (3 extra installed fonts on FF compared with others)

## Running on the server:
Install the dependencies (also can be done by ./install_these.sh):

nodejs from the default package manager is super old!  It will throw a `ReferenceError: Set is not defined` !
Instead, install from their [instructions](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions):
```bash
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Installing mongodb from the ubuntu repos seemed to work for me:
```bash
sudo apt-get install mongodb
```

I actually used some instructions from  [digitalocean](https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-14-04).

Also, install npm:
```bash
sudo apt-get install npm
```

Finally, install node_packages:
```bash
npm install
```

and then you can start the server:
```bash
npm start
```

Get your ip from the AWS dashboard (make sure to add an incoming rule in 'Security Groups' to allow incoming connections to port 3001 from anywhere), and visit [your_ip]:3001
