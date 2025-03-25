import React, { useEffect, useState } from 'react';
import MediaComponent from './MediaComponent';

const ConversationMessages = ({ conversation }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const fetchedMessages = await conversation.getMessages();
        setMessages(fetchedMessages.items);
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
        {messages.map(msg => (
          <li key={msg.sid}>{msg.body || <MediaComponent media={msg.media} />}</li>
        ))}
      </ul>
    </div>
  );
};

export default ConversationMessages;
