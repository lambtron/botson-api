# Botbusters API

Server for the [botson extension](http://botson.net). [Source code](https://github.com/lambtron/botson-extension) for botson extension.

## Usage

The endpoint is `https://askbotson.herokuapp.com/api/` (the trailing `/` is required).

Here is a sample request:

```
curl -X POST -H "Content-Type: application/json" -H "x-twitter-oauth-token: 1234567-xxxx" -H "x-twitter-oauth-secret: yyyyy" -d '{"user_id": "3629421", "screen_name": "andyjiang"}' https://askbotson.herokuapp.com/api/
```

Note the twitter oauth keys are important, and these are the keys you get from authenticating with this specific twitter app. Also note that both `user_id` and `screen_name` are required.

To get the twitter oauth keys, you would have to grab them from installing and authenticating with the [chrome extension](https://github.com/lambtron/botbusters-extension), then looking at the `chrome.storage.local` of the background page.

