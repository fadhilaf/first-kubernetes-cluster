const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const checkCommentStatus = async (event) => {
  const { type, data } = event;

  if (type === 'CommentCreated') {
    const status = data.content.includes('orange') ? 'rejected' : 'approved';

    await axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentModerated',
      data: {
        id: data.id,
        postId: data.postId,
        status,
        content: data.content
      }
    });
  }
};

app.post('/events', async (req, res) => {
  const event = req.body;

  checkCommentStatus(event);

  res.send({});
});

app.listen(4003, async () => {
  console.log('Listening on 4003');

  try {
    const res = await axios.get("http://event-bus-srv:4005/events");

    for (let event of res.data) {
      console.log("Processing event:", event.type);

      checkCommentStatus(event);
    }
  } catch (error) {
    console.log(error.message);
  }
});
