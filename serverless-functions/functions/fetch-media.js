exports.handler = async function (context, event, callback) {
  const { mediaSid, conversationSid } = event;

  if (!mediaSid || !conversationSid) {
    return callback(null, {
      statusCode: 400,
      body: 'Missing mediaSid or conversationSid'
    });
  }

  const client = context.getTwilioClient();

  try {
    const media = await client.conversations
      .conversations(conversationSid)
      .messages
      .media(mediaSid)
      .fetch();

    return callback(null, {
      statusCode: 200,
      mediaUrl: media.links.content_direct_temporary
    });
  } catch (error) {
    console.error('Failed to fetch media:', error);
    return callback(null, {
      statusCode: 500,
      error: 'Failed to fetch media content'
    });
  }
};
