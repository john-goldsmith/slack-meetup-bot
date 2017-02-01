const dotenv = require('dotenv');
dotenv.config();

const popsicle = require('popsicle'),
      moment = require('moment'),
      topics = process.env.TOPICS.split(',');

topics.forEach(topic => {
  popsicle.request({
    method: 'GET',
    url: 'https://api.meetup.com/topics',
    query: {
      search: topic,
      key: process.env.MEETUP_API_KEY
    }
  })
  .use(popsicle.plugins.parse('json'))
  .then(
    topicsResponse => {
      const filteredTopics = topicsResponse.body.results.filter(topic => Number.parseInt(topic.members) > Number.parseInt(process.env.MEETUP_TOPIC_MEMBER_COUNT_MINIMUM));
      const eventPromises = [];
      filteredTopics.forEach(result => {
        const request = popsicle.request({
          method: 'GET',
          url: 'https://api.meetup.com/2/open_events',
          query: {
            country: process.env.COUNTRY,
            topic: result.urlkey,
            city: process.env.CITY,
            state: process.env.STATE,
            time: `${Date.now()},1w`, // Events happening between now and 1 week from now
            key: process.env.MEETUP_API_KEY,
            status: 'upcoming'
          }
        })
        .use(popsicle.plugins.parse('json'));
        eventPromises.push(request);
      });
      return Promise.all(eventPromises);
    },
    error => {
      console.error('Error fetching topics:', error);
      process.exit();
    }
  )
  .then(
    eventResponses => {
      const upcomingEvents = [];
      eventResponses.forEach(eventResponse => {
        const upcomingEvent = eventResponse.body.results.filter(event => event.yes_rsvp_count > 0);
        upcomingEvents.push(upcomingEvent);
      });
      const flattened = upcomingEvents.reduce((a, b) => a.concat(b));
      return flattened;
    },
    error => {
      console.log('Error fetching events:', error);
      process.exit();
    }
  )
  .then(
    upcomingEvents => {
      const attachments = [];
      upcomingEvents.forEach(upcomingEvent => {
        attachments.push({
          fallback: `<${upcomingEvent.event_url}|${upcomingEvent.name}> on ${moment(upcomingEvent.time).format('ddd MMM do')} at ${moment(upcomingEvent.time).format('h:mma')} (${upcomingEvent.fee ? `$${upcomingEvent.fee.amount} ${upcomingEvent.fee.description}` :'free'})`,
          text: `<${upcomingEvent.event_url}|${upcomingEvent.name}> on ${moment(upcomingEvent.time).format('ddd MMM do')} at ${moment(upcomingEvent.time).format('h:mma')} (${upcomingEvent.fee ? `$${upcomingEvent.fee.amount} ${upcomingEvent.fee.description}` :'free'})`,
          // pretext: `Meetups happening around ${process.env.CITY} for the week of ${moment().format('LL')}`,
          color: '#ed1c40'
          // fields: [
          //   {
          //     title: 'Title',
          //     value: 'Value',
          //     short: false
          //   }
          // ]
        });
      });
      return popsicle.request({
        method: 'POST',
        url: process.env.SLACK_WEBHOOK_URL,
        body: {
          attachments
        }
      });
    },
    error => {
      console.error('Error fetching upcoming events:', error);
      process.exit();
    }
  )
  .then(
    () => {
      console.log('Successfully sent to Slack');
    },
    error => {
      console.error('Slack error:', error);
      process.exit();
    }
  );
});