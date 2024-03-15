const Twit = require('twit');

const T = new Twit({
  consumer_key:         'your_consumer_key',
  consumer_secret:      'your_consumer_secret',
  access_token:         'your_access_token',
  access_token_secret:  'your_access_token_secret',
  timeout_ms:           60*1000,
  strictSSL:            true,
});

const params = {
  screen_name: 'twitter_account_username',
  count: 10, // number of tweets to retrieve
  tweet_mode: 'extended' // to get full text of the tweet
};

T.get('statuses/user_timeline', params, (err, data, response) => {
  if (err) {
    console.log(err);
  } else {
    data.forEach(tweet => {
      console.log(tweet.full_text); // print the full text of each tweet
    });
  }
});