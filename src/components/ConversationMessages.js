import React, { useEffect, useState } from 'react';
import InlineMediaRenderer from './InlineMediaRenderer';

const ConversationMessages = ({ conversation }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const fetchedMessages = await conversation.getMessages();
        // Only enrich if media exists and no direct URL is available
        const items = await Promise.all(
          fetchedMessages.items.map(async (msg) => {
            if (msg.hasMedia && typeof msg.getMedia === 'function') {
              try {
                const mediaList = await msg.getMedia();
                const enriched = await Promise.all(
                  mediaList.map(async (media) => {
                    const url = await media.getContentTemporaryUrl();
                    return {
                      sid: media.sid,
                      filename: media.filename,
                      content_type: media.contentType,
                      links: {
                        content_direct_temporary: url,
                      },
                    };
                  })
                );
                return { ...msg, media: enriched };
              } catch (err) {
                console.error('Error fetching media for message:', msg.sid, err);
              }
            }
            return msg;
          })
        );

        setMessages(items);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [conversation]);

  return (
    <div>
      <h4>Messages</h4>
      <ul>
        {messages.map((msg) => (
          <li key={msg.sid}>
            {msg.body && <span>{msg.body}</span>}
            {msg.media && <InlineMediaRenderer media={msg.media} />}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConversationMessages;
