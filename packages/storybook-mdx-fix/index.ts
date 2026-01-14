import type { Plugin } from 'vite';

/**
 * Vite plugin to fix Storybook v10 MDX compiler generating file:// URLs
 *
 * **Problem**: In Storybook v10.1.11, the MDX compiler generates file:// URLs
 * instead of module specifiers when in a monorepo setup, causing Vite to fail
 * with "Failed to resolve import" errors.
 *
 * **Solution**: This plugin intercepts MDX files before Vite's import analysis
 * and transforms file:// URLs back to proper module specifiers.
 *
 * @example
 * ```typescript
 * // In .storybook/main.ts
 * import { fixStorybookMdxImports } from '@repo/storybook-mdx-fix';
 *
 * export default {
 *   async viteFinal(config) {
 *     config.plugins = config.plugins || [];
 *     config.plugins.push(fixStorybookMdxImports());
 *     return config;
 *   },
 * };
 * ```
 *
 * @returns Vite plugin that fixes MDX imports
 */
export function fixStorybookMdxImports(): Plugin {
  return {
    name: 'fix-storybook-mdx-imports',
    enforce: 'pre',
    transform(code, id) {
      // Only process MDX files
      if (!id.endsWith('.mdx')) {
        return null;
      }

      // Transform file:// URLs to module specifiers
      // Example: from "file:///.../node_modules/@storybook/addon-docs/dist/mdx-react-shim.js"
      // To: from "@storybook/addon-docs/mdx-react-shim"
      const fixed = code.replace(
        /from\s+["']file:\/\/\/[^"']*node_modules\/@storybook\/addon-docs\/dist\/mdx-react-shim\.js["']/g,
        'from "@storybook/addon-docs/mdx-react-shim"'
      );

      // Only return if we actually made changes
      if (fixed !== code) {
        return {
          code: fixed,
          map: null,
        };
      }

      return null;
    },
  };
}
