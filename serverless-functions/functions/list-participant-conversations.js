exports.handler = async function (context, event, callback) {
    const { address } = event;
  
    if (!address) {
      return callback(null, {
        success: false,
        message: "Missing 'address' parameter (e.g., whatsapp:+5511993387765)",
      });
    }
  
    const client = context.getTwilioClient();
  
    try {
      const conversations = await client.conversations.v1
        .participantConversations
        .list({ address, limit: 50 });
  
      const formatted = conversations.map((c) => ({
        conversationSid: c.conversationSid,
        participantSid: c.participantSid,
        chatServiceSid: c.chatServiceSid,
      }));
  
      return callback(null, {
        success: true,
        count: formatted.length,
        conversations: formatted,
      });
    } catch (err) {
      console.error("Error listing participant conversations:", err);
      return callback(null, {
        success: false,
        message: "Failed to fetch conversations",
        error: err.message,
      });
    }
  };
  