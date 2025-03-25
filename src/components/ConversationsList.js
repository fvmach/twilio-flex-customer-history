import React, { useEffect, useState } from 'react';
import { withTaskContext } from '@twilio/flex-ui';
import { Box } from '@twilio-paste/core/box';
import { Card } from '@twilio-paste/core/card';
import { Heading } from '@twilio-paste/core/heading';
import { Text } from '@twilio-paste/core/text';
import { List, ListItem } from '@twilio-paste/core/list';
import {
  Disclosure,
  DisclosureHeading,
  DisclosureContent,
} from '@twilio-paste/core/disclosure';
import InlineMediaRenderer from './InlineMediaRenderer';

const ConversationsList = ({ task }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const customerAddress = task?.attributes?.customerAddress;

  const conversationLimit = 10;

  useEffect(() => {
    let isMounted = true;

    const fetchConversations = async () => {
      if (!customerAddress) {
        console.warn('No customerAddress found in task attributes');
        setLoading(false);
        return;
      }

      try {
        const url = `https://customer-history-8319.twil.io/list-participant-conversations?address=${encodeURIComponent(
          customerAddress
        )}&limit=${conversationLimit}`;
        const res = await fetch(url);
        const data = await res.json();

        if (isMounted && data.conversations) {
          setConversations(data.conversations);
        }
      } catch (err) {
        console.error('Error fetching conversations:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchConversations();

    return () => {
      isMounted = false;
    };
  }, [customerAddress]);

  return (
    <Box name= "conversations-list" padding="space60">
      <Heading as="h4" variant="heading40">
        Past Conversations
      </Heading>
      {loading && <Text as="p">Loading...</Text>}
      {!loading && conversations.length === 0 && <Text as="p">No conversations found.</Text>}

      <List as="ul">
        {conversations.map((conv) => (
          <ListItem key={conv.conversationSid}>
            <Disclosure>
              <DisclosureHeading as="h3" variant="heading40" icon={null}>
                <Box>
                  <Text as="span" fontWeight="fontWeightBold">{conv.conversationFriendlyName || 'Untitled Conversation'}</Text>
                  <Text as="span" color="colorTextWeak" display="block" fontSize="fontSize20">
                    Started: {new Date(conv.messages?.[0]?.dateCreated).toLocaleString()}
                  </Text>
                  <Text as="span" color="colorTextWeak" display="block" fontSize="fontSize20">
                    Last Message: {new Date(conv.messages?.[conv.messages.length - 1]?.dateCreated).toLocaleString()}
                  </Text>
                  <Text as="span" fontSize="fontSize10" color="colorTextWeak">
                    {conv.conversationSid}
                  </Text>
                </Box>
              </DisclosureHeading>

              <DisclosureContent>
                <Card padding="space50">
                  {conv.messages && conv.messages.length > 0 ? (
                    <List as="ul">
                      {conv.messages.map((msg) => (
                        <ListItem key={msg.sid}>
                          <Text as="span" fontWeight="fontWeightBold">
                            {msg.author}:
                          </Text>{' '}
                          {msg.body}
                          <Text as="span" color="colorTextWeak">
                            ({new Date(msg.dateCreated).toLocaleString()})
                          </Text>
                          <InlineMediaRenderer mediaList={msg.media} />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Text as="p">No messages</Text>
                  )}
                </Card>
              </DisclosureContent>
            </Disclosure>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default withTaskContext(ConversationsList);
