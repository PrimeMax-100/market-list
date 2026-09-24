import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.marketlist.mobile",
  appName: "Market List",
  webDir: "dist-mobile",
  ios: {
    contentInset: "always",
  },
  android: {
    backgroundColor: "#FAF7F2",
  },
};

export default config;
