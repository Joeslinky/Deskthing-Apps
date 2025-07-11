import { DeskThing } from "@deskthing/server";
import { DESKTHING_EVENTS, Action } from "@deskthing/types";
import StoreProvider from "./storeProvider";
import { AppSettingIDs } from "../shared/types/discord"
import { DISCORD_ACTIONS } from "../shared/types/discord"

// Organize actions by category
const voiceActions: Action[] = [
  {
    name: "Mute",
    description: "Toggles the mute status of the current user",
    id: "mute",
    icon: "mute_icon", // or unmute_icon
    value: "toggle",
    value_options: ["mute", "unmute", "toggle"],
    value_instructions: "Choose whether to mute or unmute the user",
    version: "v0.10.4",
    tag: "basic",
    enabled: true,
  },
  {
    name: "Deafen",
    description: "Toggles the deaf state of the current user",
    id: "deafen",
    icon: "deafen_icon", // or undeafen_icon
    value: "toggle",
    value_options: ["deafen", "undeafen", "toggle"],
    value_instructions: "Choose whether to deafen or undeafen the user",
    version: "v0.10.4",
    tag: "basic",
    enabled: true,
  },
  {
    name: "Disconnect",
    description: "Disconnects the user from the call",
    id: "disconnect",
    icon: "disconnect_icon",
    version: "v0.10.4",
    tag: "basic",
    enabled: true,
  },
];

const chatActions: Action[] = [
  {
    name: "Expand Chat",
    description: "Expands the chat window",
    id: "expandChat",
    icon: "expand_chat_icon",
    version: "v0.10.4",
    tag: "basic",
    enabled: true,
  },
  {
    name: "Collapse Chat",
    description: "Collapses the chat window",
    id: "collapseChat",
    icon: "collapse_chat_icon",
    version: "v0.10.4",
    tag: "basic",
    enabled: true,
  },
  {
    name: "Select Text Channel",
    description: "Selects a text channel by ID",
    id: "selectTextChannel",
    icon: "select_text_channel_icon",
    version: "v0.10.4",
    tag: "basic",
    enabled: true,
    value: "",
    value_instructions: "Input the channel ID",
  },
];

const notificationActions: Action[] = [
  {
    name: "Mark Notification As Read",
    description: "Marks a notification as read by ID",
    id: "markNotificationAsRead",
    icon: "mark_notification_as_read_icon",
    version: "v0.10.4",
    tag: "basic",
    enabled: true,
    value: "",
    value_instructions: "Input the notification ID",
  },
  {
    name: "Mark All Notifications As Read",
    description: "Marks all notifications as read",
    id: "markAllNotificationsAsRead",
    icon: "mark_all_notifications_as_read_icon",
    version: "v0.10.4",
    tag: "basic",
    enabled: true,
  },
];


const authActions: Action[] = [
  {
    name: "Re Auth",
    description: "Reinitializes the auth process for the user",
    id: "reauth",
    icon: "reauth_icon",
    version: "v0.10.4",
    tag: "basic",
    enabled: true,
  },
];

const presenceActions: Action[] = [
  {
    name: "Restart Rich Presence",
    description: "Enables and reinitializes the rich presence",
    id: "represence",
    icon: "represence_icon",
    version: "v0.10.4",
    tag: "basic",
    enabled: true,
  },
];

// Register actions by category
export const setupActions = () => {
  voiceActions.forEach((action) => DeskThing.registerAction(action));
  authActions.forEach((action) => DeskThing.registerAction(action));
  presenceActions.forEach((action) => DeskThing.registerAction(action));
  chatActions.forEach((action) => DeskThing.registerAction(action));
  notificationActions.forEach((action) => DeskThing.registerAction(action));
};

type actionHandler = (value: string | undefined) => void;

const actionHandlers: Record<string, actionHandler> = {
  // Voice
  [DISCORD_ACTIONS.MUTE]: (value) => {
    switch (value) {
      case "mute":
        return StoreProvider.getCallControls().mute();
      case "unmute":
        return StoreProvider.getCallControls().unmute();
      case "toggle":
      default:
        return StoreProvider.getCallControls().toggleMute();
    }
  },
  [DISCORD_ACTIONS.DEAFEN]: (value) => {
    switch (value) {
      case "deafen":
        return StoreProvider.getCallControls().deafen();
      case "undeafen":
        return StoreProvider.getCallControls().undeafen();
      case "toggle":
      default:
        return StoreProvider.getCallControls().toggleDeafen();
    }
  },
  [DISCORD_ACTIONS.DISCONNECT]: () => {
    return StoreProvider.getCallControls().disconnect();
  },

  // Utility
  [DISCORD_ACTIONS.REAUTH]: async () => {
    StoreProvider.getAuth().authenticate();
  },

  [DISCORD_ACTIONS.REPRESENCE]: async () => {
    return StoreProvider.getRichPresence().resetActivity();
  },

  // Actions
  [DISCORD_ACTIONS.EXPAND_CHAT]: () => {
    return StoreProvider.getChatStatus().setChatExpand(true);
  },
  [DISCORD_ACTIONS.COLLAPSE_CHAT]: () => {
    return StoreProvider.getChatStatus().setChatExpand(false);
  },
  [DISCORD_ACTIONS.SELECT_TEXT_CHANNEL]: (value) => {
    return StoreProvider.getChatStatus().selectTextChannel(value);
  },
  // Notifications
  [DISCORD_ACTIONS.MARK_NOTIFICATION_AS_READ]: (value) => {
    return StoreProvider.getNotificationStatus().markNotificationAsRead(value || '');
  },
  [DISCORD_ACTIONS.MARK_ALL_NOTIFICATIONS_AS_READ]: () => {
    return StoreProvider.getNotificationStatus().markAllNotificationsAsRead();
  },
};

DeskThing.on(DESKTHING_EVENTS.ACTION, (actionData) => {
  const { id, value } = actionData.payload;
  const handler = actionHandlers[id];

  if (handler) {
    console.log(`Received ${id} action`);
    handler(value);
  }
});