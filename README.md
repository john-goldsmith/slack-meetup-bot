# Meetup Slack Bot
This app is meant to be run periodically to fetch relevant and upcoming events from [Meetup](https://www.meetup.com) and display them in the Slack channel of your choice.

## Prerequisites
- [Node 6.x & NPM](https://nodejs.org) (or `brew install node`)

## Environment Variables

| Name | Purpose | Example | Required |
|------|---------|---------|----------|
| `MEETUP_API_KEY` | The Meetup API auth token. | `Abc123` | Yes
| `SLACK_WEBHOOK_URL` | The Slack endpoint to call that triggers the web hook. | `https://hooks.slack.com/services/ABC123/DEF456` | Yes
| `MEETUP_TOPIC_MEMBER_COUNT_MINIMUM` | The minimum number of members who belong to groups under each topic | `1000` | Yes
| `COUNTRY` | The country in which Meetup events should occur. | `US` | Yes
| `STATE` | The state in which Meetup events should occur. | `CA` | Yes
| `CITY` | The city in which Meetup events should occur. | `Irvine` | Yes
| `TOPICS` | A list of comma-separated topics of interest. | `javascript,php,ruby` | Yes

## Running Locally
1. Duplicate `.env.sample`, rename it to `.env` and provide values for each key (see above)
1. [Obtain an API key](http://www.meetup.com/meetup_api/auth/#keys)
1. Setup an [incoming webhook for Slack](https://api.slack.com/incoming-webhooks)
1. `npm i`
1. `npm start`

## Resources
- [Meetup API Console](https://secure.meetup.com/meetup_api/console/)
- [Slack API - Incoming Web Hooks](https://api.slack.com/incoming-webhooks)
- [Fetching Meetup topics](http://www.meetup.com/meetup_api/docs/topics/)
- [Fetching Meetup open events](http://www.meetup.com/meetup_api/docs/2/open_events/)