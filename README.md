# Syncano Socket to manage mailchimp subscriptions

[![Syncano Socket](https://img.shields.io/badge/syncano-socket-blue.svg)](https://syncano.io)
[![CircleCI branch](https://img.shields.io/circleci/project/github/eyedea-io/syncano-socket-mailchimp/master.svg)](https://circleci.com/gh/eyedea-io/syncano-socket-mailchimp/tree/master)
![Codecov branch](https://img.shields.io/codecov/c/github/eyedea-io/syncano-socket-mailchimp/master.svg)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![npm](https://img.shields.io/npm/dw/@eyedea-sockets/mailchimp.svg)](https://www.npmjs.com/package/@eyedea-sockets/mailchimp)
![license](https://img.shields.io/github/license/eyedea-io/syncano-socket-mailchimp.svg)

Main Socket features:

* **mailchimp/signup** — sign up email to the mailchimp list

## Getting Started

Install package in your project:

```sh
cd my_project
npm install @syncano/cli --save-dev
npm install @eyedea-sockets/mailchimp --save
export SOCKET_MAILCHIMP_API_KEY=<mailchimp api key> // or you will be asked during deploy
npx s deploy
```

Use it:

```js
import Syncano from @syncano/client

const s = new Syncano(<instaneName>)

// List and email
const params = {
  listId: 12345
  email: 'test@test.pl'
}
const signupStatus = await s.get('mailchimp/signup', params)
```
