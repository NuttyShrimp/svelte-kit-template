import { join } from 'path';
import type { Config } from 'tailwindcss';

import { skeleton } from '@skeletonlabs/tw-plugin';
import typographyPlugin from '@tailwindcss/typography';
import formsPlugin from '@tailwindcss/forms';

const config = {
  // 2. Opt for dark mode to be handled via the class method
  darkMode: 'class',
  content: [
    './src/**/*.{html,js,svelte,ts}',
    // 3. Append the path to the Skeleton package
    join(require.resolve(
      '@skeletonlabs/skeleton'),
      '../**/*.{html,js,svelte,ts}'
    )
  ],
  theme: {
    extend: {},
  },
  plugins: [
    typographyPlugin,
    formsPlugin,
    skeleton({
      // TODO: Use this until we have our own custom theme
      themes: { preset: ["wintry"] }
    })
  ]
} satisfies Config;

export default config;
