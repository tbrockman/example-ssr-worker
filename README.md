# @emotion + Cloudflare Workers + SSR

Simple repository illustrating issues faced when attempting to server-side render React applications within a web worker environment, while relying on `@emotion` for styling.

## Pre-requisites
`wrangler` (tested with version `1.19.4`) which can be installed using npm:

```bash
npm i @cloudflare/wrangler -g
```
You will also need a Cloudflare account to authenticate with `wrangler`. Once you do, you can authenticate by running:

```bash
wrangler login
```

## Starting the backend
```bash
# will npm install, compile, and start the worker

wrangler dev

# which should spit out something like the following:

   Running npm install && npm run build

up to date, audited 201 packages in 842ms

13 packages are looking for funding
  run `npm fund` for details

2 vulnerabilities (1 moderate, 1 high)

To address all issues, run:
  npm audit fix

Run `npm audit` for details.

> example@1.0.0 build
> rollup -c

# ... followed by warnings we can ignore until...

created dist/index.mjs in 3.4s
Error: Something went wrong with the request to Cloudflare...
Uncaught Error: No such module "stream".
  at line 0
 [API code: 10021]
```

Which of course makes sense, because `stream` isn't available in Workers.

After removing code which references `stream`, the Worker will now compile and start properly, sending a request to the Worker which triggers server-side rendering will, however, fail.

```bash
curl localhost:8787/

# ... in the Worker logs

ReferenceError: document is not defined
    at createCache (./index.mjs:1173:38)
    at handleRequest (./index.mjs:2241:19)
    at Object.fetch (./index.mjs:2236:22) at line 1172, col 36
```

This is due to the Worker bundler targeting the `browser`. Rollup (webpack untested) will optimize away `isBrowser` checks (as it *should* always be true), which still leaves references to `document`, which is undefined in the Worker environment. This issue is also described [here](https://github.com/emotion-js/emotion/issues/1455). Hardcoding `isBrowser = false` results in successful rendering.

## Ideal behavior

```bash
curl localhost:8787/
# which if application is configured properly should return something like...
<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>My site</title>
      <style data-emotion="custom-global 1qxtz39">.custom-1qxtz39{font-size:12px;}</style><style data-emotion="custom "></style>
  </head>
  <body>
      <div id="root"><div class="custom-1qxtz39">example</div></div>
  
      <script src="./bundle.js"></script>
  </body>
  </html>
```

## Note
The worker isn't configured to generate or serve `bundle.js`, so don't expect any client-side hydration. 