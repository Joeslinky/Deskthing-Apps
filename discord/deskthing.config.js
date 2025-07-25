// @ts-check
import { defineConfig } from '@deskthing/cli';
import { config } from 'dotenv'

config()

export default defineConfig({
  development: {
    logging: {
      level: "debug",
    },
    client: {
      logging: {
        level: "debug",
      },
    },
    server: {
      editCooldownMs: 8000,
      mockData: {
        settings: {
          "client_id": process.env.DISCORD_CLIENT_ID,
          "client_secret": process.env.DISCORD_CLIENT_SECRET,
          "set_main_text": 'DiscordThing',
          "set_secondary_text": 'The ultimate deskthing app',
          "have_timer": true,
          "left_dashboard_panel": "guild_list",
          "right_dashboard_panel": "chat",
          "dashboard_elements": [
            "clock",
            "notifications",]
        }
      }
    },
  }
});
