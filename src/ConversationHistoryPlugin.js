import { FlexPlugin } from '@twilio/flex-plugin';
import { CustomizationProvider } from '@twilio-paste/core/customization';
import React from 'react';
import ConversationsList from './components/ConversationsList';
import { ChatIcon } from '@twilio-paste/icons/esm/ChatIcon';

const PLUGIN_NAME = 'ConversationHistoryPlugin';

const PasteWrapper = ({ RootComponent, ...props }) => {
  const pasteProps = {
    baseTheme: props.theme?.isLight ? 'default' : 'dark',
    theme: props.theme?.tokens,
    style: { minWidth: '100%', height: '100%' },
  };

  return (
    <CustomizationProvider {...pasteProps}>
      <RootComponent {...props} />
    </CustomizationProvider>
  );
};

export default class ConversationHistoryPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  init(flex, manager) {
    flex.setProviders({
      CustomProvider: (RootComponent) => (props) => (
        <PasteWrapper RootComponent={RootComponent} {...props} />
      ),
    });

    flex.TaskCanvasTabs.Content.add(
      <ConversationsList key="conversation-history-tab" />,
      {
        align: "end",
        if: ({ task }) => !!task?.attributes?.customerAddress,
      }
    );
  }
}
