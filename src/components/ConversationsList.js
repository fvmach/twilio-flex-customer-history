import React, { useEffect, useState } from 'react';
import { withTaskContext } from '@twilio/flex-ui';
import { Box } from '@twilio-paste/core/box';
import { Button } from '@twilio-paste/core/button';
import { Card } from '@twilio-paste/core/card';
import { Heading } from '@twilio-paste/core/heading';
import { Text } from '@twilio-paste/core/text';
import { List, ListItem } from '@twilio-paste/core/list';
import { Disclosure, DisclosureHeading, DisclosureContent } from '@twilio-paste/core/disclosure';

const ConversationsList = ({ task }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const customerAddress = task?.attributes?.customerAddress;

  const conversationLimit = 10;

  useEffect(() => {
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

        if (data.conversations) {
          setConversations(data.conversations);
        } else {
          console.warn('No conversations found in response:', data);
        }
      } catch (err) {
        console.error('Error fetching conversations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [customerAddress]);

  return (
    <Box padding="space60">
      <Heading as="h4" variant="heading40">
        Past Conversations
      </Heading>
      {loading && <Text as="p">Loading...</Text>}
      {!loading && conversations.length === 0 && <Text as="p">No conversations found.</Text>}

      <List>
        {conversations.map((conv) => (
          <ListItem key={conv.conversationSid}>
            <Disclosure>
              <DisclosureHeading as="h3" variant="heading30">
                <Button variant="secondary" fullWidth>
                  {conv.conversationSid} (Participant: {conv.participantSid})
                </Button>
              </DisclosureHeading>

              <DisclosureContent>
                <Card padding="space50">
                  {conv.messages && conv.messages.length > 0 ? (
                    <List>
                        {conv.messages.map((msg) => (
                          <ListItem key={msg.sid}>
                            <Text as="span" fontWeight="fontWeightBold">
                              {msg.author}:
                            </Text>{' '}
                            {msg.body}
                            <Text as="span" color="colorTextWeak">
                              ({new Date(msg.dateCreated).toLocaleString()})
                            </Text>

                            {msg.media && msg.media.sid && (
                              <MediaRenderer mediaSid={msg.media.sid} conversationSid={conv.conversationSid} />
                            )}
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
