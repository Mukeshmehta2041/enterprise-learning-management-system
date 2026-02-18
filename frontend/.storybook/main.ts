import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding"
  ],
  "framework": "@storybook/react-vite",
  async viteFinal(config) {
    if (config.plugins) {
      config.plugins = config.plugins.filter((plugin) => {
        if (!plugin) return true;
        // The PWA plugin's internal name as defined in its manifest
        // can be 'vite-plugin-pwa', 'vite-plugin-pwa:build', etc.
        const name = (plugin as any).name;
        return typeof name !== 'string' || !name.startsWith('vite-plugin-pwa');
      });
    }
    return config;
  },
};
export default config;