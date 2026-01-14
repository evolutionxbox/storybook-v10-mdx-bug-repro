import type { StorybookConfig } from "@storybook/react-vite";
import { fixStorybookMdxImports } from "@repo/storybook-mdx-fix";

const config: StorybookConfig = {
  stories: ["../*.mdx", "../**/*.mdx", "../**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@chromatic-com/storybook",
    "@storybook/addon-themes",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(config) {
    // Apply workaround plugin to fix file:// URL bug
    config.plugins = config.plugins || [];
    config.plugins.push(fixStorybookMdxImports());
    return config;
  },
};

export default config;
