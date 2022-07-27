import { join } from 'path';
import { promises } from 'fs';

import { Framework } from './types';
import { readConfigFile } from './read-config-file';

export * from './types';

const { readdir } = promises;

/**
 * Please note that is extremely important that the `dependency` property needs
 * to reference a CLI. This is needed because you might want (for example) a
 * Gatsby site that is powered by Preact, so you can't look for the `preact`
 * dependency.  Instead, you need to look for `preact-cli` when optimizing Preact
 * CLI projects.
 */

export const frameworks = [
  {
    name: 'Blitz.js',
    slug: 'blitzjs',
    demo: 'https://blitz-template.vercel.app',
    logo: 'https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/blitz.svg',
    tagline: 'Blitz.js: The Fullstack React Framework',
    description:
      'A brand new Blitz.js app - the result of running `npx blitz new`.',
    website: 'https://blitzjs.com',
    envPrefix: 'NEXT_PUBLIC_',
    useRuntime: { src: 'package.json', use: '@vercel/next' },
    detectors: {
      every: [
        {
          path: 'package.json',
          matchContent:
            '"(dev)?(d|D)ependencies":\\s*{[^}]*"blitz":\\s*".+?"[^}]*}',
        },
      ],
    },
    settings: {
      installCommand: {
        placeholder: '`yarn install`, `pnpm install`, or `npm install`',
      },
      buildCommand: {
        placeholder: '`npm run build` or `blitz build`',
        value: 'blitz build',
      },
      devCommand: {
        value: 'blitz start',
      },
      outputDirectory: {
        placeholder: 'Next.js default',
      },
    },
    getOutputDirName: async () => 'public',
  },
  {
    name: 'Next.js',
    slug: 'nextjs',
    demo: 'https://nextjs-template.vercel.app',
    logo: 'https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/next.svg',
    darkModeLogo:
      'https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/next-dark.svg',
    screenshot:
      'https://assets.vercel.com/image/upload/v1647366075/front/import/nextjs.png',
    tagline:
      'Next.js makes you productive with React instantly — whether you want to build static or dynamic sites.',
    description: 'A Next.js app and a Serverless Function API.',
    website: 'https://nextjs.org',
    sort: 1,
    envPrefix: 'NEXT_PUBLIC_',
    useRuntime: { src: 'package.json', use: '@vercel/next' },
    detectors: {
      every: [
        {
          path: 'package.json',
          matchContent:
            '"(dev)?(d|D)ependencies":\\s*{[^}]*"next":\\s*".+?"[^}]*}',
        },
      ],
    },
    settings: {
      installCommand: {
        placeholder: '`yarn install`, `pnpm install`, or `npm install`',
      },
      buildCommand: {
        placeholder: '`npm run build` or `next build`',
        value: 'next build',
      },
      devCommand: {
        value: 'next dev --port $PORT',
        placeholder: 'next',
      },
      outputDirectory: {
        placeholder: 'Next.js default',
      },
    },
    recommendedIntegrations: [
      {
        id: 'oac_5lUsiANun1DEzgLg0NZx5Es3',
        dependencies: ['next-plugin-sentry', 'next-sentry-source-maps'],
      },
    ],
    getOutputDirName: async () => 'public',
    cachePattern: '.next/cache/**',
  },
  {
    name: 'Gatsby.js',
    slug: 'gatsby',
    demo: 'https://gatsby.vercel.app',
    logo: 'https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/gatsby.svg',
    tagline:
      'Gatsby helps developers build blazing fast websites and apps with React.',
    description: 'A Gatsby starter app with an API Route.',
    website: 'https://gatsbyjs.org',
    sort: 5,
    envPrefix: 'GATSBY_',
    useRuntime: { src: 'package.json', use: '@vercel/gatsby' },
    detectors: {
      every: [
        {
          path: 'package.json',
          matchContent:
            '"(dev)?(d|D)ependencies":\\s*{[^}]*"gatsby":\\s*".+?"[^}]*}',
        },
      ],
    },
    settings: {
      installCommand: {
        placeholder: '`yarn install`, `pnpm install`, or `npm install`',
      },
      buildCommand: {
        placeholder: '`npm run build` or `gatsby build`',
        value: 'gatsby build',
      },
      devCommand: {
        value: 'gatsby develop --port $PORT',
        placeholder: 'gatsby develop',
      },
      outputDirectory: {
        value: 'public',
      },
    },
    dependency: 'gatsby',
    getOutputDirName: async () => 'public',
    cachePattern: '{.cache,public}/**',
  },
  {
    name: 'Remix',
    slug: 'remix',
    demo: 'https://remix-run-template.vercel.app',
    logo: 'https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/remix-no-shadow.svg',
    tagline: 'Build Better Websites',
    description: 'A new Remix app — the result of running `npx create-remix`.',
    website: 'https://remix.run',
    sort: 6,
    useRuntime: { src: 'package.json', use: '@vercel/remix' },
    ignoreRuntimes: ['@vercel/node'],
    detectors: {
      every: [
        {
          path: 'remix.config.js',
        },
      ],
    },
    settings: {
      installCommand: {
        placeholder: '`yarn install`, `pnpm install`, or `npm install`',
      },
      buildCommand: {
        value: 'remix build',
        placeholder: '`npm run build` or `remix build`',
      },
      devCommand: {
        value: 'remix dev',
        placeholder: 'remix dev',
      },
      outputDirectory: {
        value: 'public',
      },
    },
    dependency: 'remix',
    getOutputDirName: async () => 'public',
  },
  {
    name: 'Astro',
    slug: 'astro',
    demo: 'https://astro-template.vercel.app',
    logo: 'https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/astro.svg',
    darkModeLogo:
      'https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/astro-dark.svg',
    tagline:
      'Astro is a new kind of static site builder for the modern web. Powerful developer experience meets lightweight output.',
    description: 'An Astro site, using the basics starter kit.',
    website: 'https://astro.build',
    envPrefix: 'PUBLIC_',
    detectors: {
      every: [
        {
          path: 'package.json',
          matchContent:
            '"(dev)?(d|D)ependencies":\\s*{[^}]*"astro":\\s*".+?"[^}]*}',
        },
      ],
    },
    settings: {
      installCommand: {
        placeholder: '`yarn install` or `npm install`',
      },
      buildCommand: {
        value: 'astro build',
        placeholder: '`npm run build` or `astro build`',
      },
      devCommand: {
        value: 'astro dev --port $PORT',
        placeholder: 'astro dev',
      },
      outputDirectory: {
        value: 'dist',
      },
    },
    dependency: 'astro',
    getOutputDirName: async () => 'dist',
    defaultRoutes: [
      {
        src: '^/dist/(.*)$',
        headers: { 'cache-control': 'public, max-age=31536000, immutable' },
        continue: true,
      },
      {
        handle: 'filesystem',
      },
      {
        src: '/(.*)',
        dest: '/index.html',
      },
    ],
  },
  {
    name: 'Hexo',
    slug: 'hexo',
    demo: 'https://hexo-template.vercel.app',
    logo: 'https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/hexo.svg',
    tagline:
      'Hexo is a fast, simple & powerful blog framework powered by Node.js.',
    description: 'A Hexo site, created with the Hexo CLI.',
    website: 'https://hexo.io',
    detectors: {
      every: [
        {
          path: 'package.json',
          matchContent:
            '"(dev)?(d|D)ependencies":\\s*{[^}]*"hexo":\\s*".+?"[^}]*}',
        },
      ],
    },
    settings: {
      installCommand: {
        placeholder: '`yarn install`, `pnpm install`, or `npm install`',
      },
      buildCommand: {
        placeholder: '`npm run build` or `hexo generate`',
        value: 'hexo generate',
      },
      devCommand: {
        value: 'hexo server --port $PORT',
        placeholder: 'hexo server',
      },
      outputDirectory: {
        value: 'public',
      },
    },
    dependency: 'hexo',
    getOutputDirName: async () => 'public',
  },
  {
    name: 'Eleventy',
    slug: 'eleventy',
    demo: 'https://eleventy-template.vercel.app',
    logo: 'https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/eleventy.svg',
    tagline:
      '11ty is a simpler static site generator written in JavaScript, created to be an alternative to Jekyll.',
    description: 'An Eleventy site, created with npm init.',
    website: 'https://www.11ty.dev',
    detectors: {
      every: [
        {
          path: 'package.json',
          matchContent:
            '"(dev)?(d|D)ependencies":\\s*{[^}]*"@11ty\\/eleventy":\\s*".+?"[^}]*}',
        },
      ],
    },
    settings: {
      installCommand: {
        placeholder: '`yarn install`, `pnpm install`, or `npm install`',
      },
      buildCommand: {
        placeholder: '`npm run build` or `npx @11ty/eleventy`',
        value: 'npx @11ty/eleventy',
      },
      devCommand: {
        value: 'npx @11ty/eleventy --serve --watch --port $PORT',
        placeholder: 'npx @11ty/eleventy --serve',
      },
      outputDirectory: {
        value: '_site',
      },
    },
    dependency: '@11ty/eleventy',
    getOutputDirName: async () => '_site',
    cachePattern: '.cache/**',
  },
  {
    name: 'Docusaurus 2',
    slug: 'docusaurus-2',
    demo: 'https://docusaurus-2-template.vercel.app',
    logo: 'https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/docusaurus.svg',
    tagline:
      'Docusaurus makes it easy to maintain Open Source documentation websites.',
    description:
      'A static Docusaurus site that makes it easy to maintain OSS documentation.',
    website: 'https://v2.docusaurus.io',
    detectors: {
      some: [
        {
          path: 'package.json',
          matchContent:
            '"(dev)?(d|D)ependencies":\\s*{[^}]*"@docusaurus\\/core":\\s*".+?"[^}]*}',
        },
      ],
    },
    settings: {
      installCommand: {
        placeholder: '`yarn install`, `pnpm install`, or `npm install`',
      },
      buildCommand: {
        placeholder: '`npm run build` or `docusaurus build`',
        value: 'docusaurus build',
      },
      devCommand: {
        value: 'docusaurus start --port $PORT',
        placeholder: 'docusaurus start',
      },
      outputDirectory: {
        value: 'build',
      },
    },
    dependency: '@docusaurus/core',
    getOutputDirName: async (dirPrefix: string) => {
      const base = 'build';
      try {
        const location = join(dirPrefix, base);
        const content = await readdir(location, { withFileTypes: true });

        // If there is only one file in it that is a dir we'll use it as dist dir
        if (content.length === 1 && content[0].isDirectory()) {
          return join(base, content[0].name);
        }
      } catch (error) {
        console.error(`Error detecting output directory: `, error);
      }

      return base;
    },
    defaultRoutes: [
      {
        src: '^/[^./]+\\.[0-9a-f]{8}\\.(css|js)$',
        headers: { 'cache-control': 'max-age=31536000, immutable' },
        continue: true,
      },
      {
        src: '^/assets/images/[^/]+-[0-9a-f]{32}\\.(ico|svg|jpg|jpeg|png|gif|webp)$',
        headers: { 'cache-control': 'max-age=31536000, immutable' },
        continue: true,
      },
      {
        src: '^/assets/medias/[^/]+-[0-9a-f]{32}\\.(ogv|wav|mp3|m4a|aac|oga|flac)$',
        headers: { 'cache-control': 'max-age=31536000, immutable' },
        continue: true,
      },
      {
        src: '^/assets/files/[^/]+-[0-9a-f]{32}\\.(pdf|doc|docx|xls|xlsx|zip|rar)$',
        headers: { 'cache-control': 'max-age=31536000, immutable' },
        continue: true,
      },
      {
        src: '^/ideal-img/[^/]+\\.[0-9a-f]{7}\\.\\d+\\.(png|jpe?g|gif)$',
        headers: { 'cache-control': 'max-age=31536000, immutable' },
        continue: true,
      },
      {
        handle: 'filesystem',
      },
      {
        src: '.*',
        status: 404,
        dest: '404.html',
      },
    ],
  },
  {
    name: 'Docusaurus 1',
    slug: 'docusaurus',
    demo: 'https://docusaurus-template.vercel.app',
    logo: 'https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/docusaurus.svg',
    tagline:
      'Docusaurus makes it easy to maintain Open Source documentation websites.',
    description:
      'A static Docusaurus site that makes it easy to maintain OSS documentation.',
    website: 'https://docusaurus.io/',
    detectors: {
      some: [
        {
          path: 'package.json',
          matchContent:
            '"(dev)?(d|D)ependencies":\\s*{[^}]*"docusaurus":\\s*".+?"[^}]*}',
        },
      ],
    },
    settings: {
      installCommand: {
        placeholder: '`yarn install`, `pnpm install`, or `npm install`',
      },
      buildCommand: {
        placeholder: '`npm run build` or `docusaurus-build`',
        value: 'docusaurus-build',
      },
      devCommand: {
        value: 'docusaurus-start --port $PORT',
        placeholder: 'docusaurus-start',
      },
      outputDirectory: {
        value: 'build',
      },
    },
    dependency: 'docusaurus',
    getOutputDirName: async (dirPrefix: string) => {
      const base = 'build';
      try {
        const location = join(dirPrefix, base);
        const content = await readdir(location, { withFileTypes: true });

        // If there is only one file in it that is a dir we'll use it as dist dir
        if (content.length === 1 && content[0].isDirectory()) {
          return join(base, content[0].name);
        }
      } catch (error) {
        console.error(`Error detecting output directory: `, error);
      }
      return base;
    },
  },
  {
    name: 'Preact',
    slug: 'preact',
    demo: 'https://preact-template.vercel.app',
    logo: 'https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/preact.svg',
    tagline:
      'Preact is a fast 3kB alternative to React with the same modern API.',
    description: 'A Preact app, created with the Preact CLI.',
    website: 'https://preactjs.com',
    detectors: {
      every: [
        {
          path: 'package.json',
          matchContent:
            '"(dev)?(d|D)ependencies":\\s*{[^}]*"preact-cli":\\s*".+?"[^}]*}',
        },
      ],
    },
    settings: {
      installCommand: {
        placeholder: '`yarn install`, `pnpm install`, or `npm install`',
      },
      buildCommand: {
        placeholder: '`npm run build` or `preact build`',
        value: 'preact build',
      },
      devCommand: {
        value: 'preact watch --port $PORT',
        placeholder: 'preact watch',
      },
      outputDirectory: {
        value: 'build',
      },
    },
    dependency: 'preact-cli',
    getOutputDirName: async () => 'build',
    defaultRoutes: [
      {
        handle: 'filesystem',
      },
      {
        src: '/(.*)',
        dest: '/index.html',
      },
    ],
  },
  {
    name: 'SolidStart',
    slug: 'solidstart',
    demo: 'https://solid-start-template.vercel.app',
    logo: 'https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/solid.svg',
    tagline: 'Simple and performant reactivity for building user interfaces.',
    description: 'A Solid app, created with SolidStart.',
    website: 'https://solidjs.com',
    envPrefix: 'VITE_',
    detectors: {
      every: [
        {
          path: 'package.json',
          matchContent:
            '"(dev)?(d|D)ependencies":\\s*{[^}]*"solid-js":\\s*".+?"[^}]*}',
        },
        {
          path: 'package.json',
          matchContent:
            '"(dev)?(d|D)ependencies":\\s*{[^}]*"solid-start":\\s*".+?"[^}]*}',
        },
      ],
    },
    settings: {
      installCommand: {
        placeholder: '`yarn install`, `pnpm install`, or `npm install`',
      },
      buildCommand: {
        placeholder: '`npm run build` or `solid-start build`',
        value: 'solid-start build',
      },
      devCommand: {
        value: 'solid-start dev',
      },
      outputDirectory: {
        value: '.output',
      },
    },
    getOutputDirName: async () => '.output',
  },
  {
    name: 'Dojo',
    slug: 'dojo',
    demo: 'https://dojo-template.vercel.app',
    logo: 'https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/dojo.png',
    tagline: 'Dojo is a modern progressive, TypeScript first framework.',
    description:
      "A Dojo app, created with the Dojo CLI's cli-create-app command.",
    website: 'https://dojo.io',
    detectors: {
      some: [
        {
          path: 'package.json',
          matchContent:
            '"(dev)?(d|D)ependencies":\\s*{[^}]*"@dojo\\/framework":\\s*".+?"[^}]*}',
        },
        {
          path: '.dojorc',
        },
      ],
    },
    settings: {
      installCommand: {
        placeholder: '`yarn install`, `pnpm install`, or `npm install`',
      },
      buildCommand: {
        placeholder: '`npm run build` or `dojo build`',
        value: 'dojo build',
      },
      devCommand: {
        value: 'dojo build -m dev -w -s -p $PORT',
        placeholder: 'dojo build -m dev -w -s',
      },
      outputDirectory: {
        value: 'output/dist',
      },
    },
    dependency: '@dojo/cli',
    getOutputDirName: async () => join('output', 'dist'),
    defaultRoutes: [
      {
        handle: 'filesystem',
      },
      {
        src: '/service-worker.js',
        headers: { 'cache-control': 's-maxage=0' },
        continue: true,
      },
      {
        src: '/(.*)',
        dest: '/index.html',
      },
    ],
    defaulHeaders: [
      {
        source: '/service-worker.js',
        regex: '/service-worker.js',
        headers: { 'cache-control': 's-maxage=0' },
        continue: true,
      },
    ],
  },
  {
    name: 'Ember.js',
    slug: 'ember',
    demo: 'https://ember-template.vercel.app',
    logo: 'https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/ember.svg',
    tagline:
      'Ember.js helps webapp developers be more productive out of the box.',
    description: 'An Ember app, created with the Ember CLI.',
    website: 'https://emberjs.com/',
    detectors: {
      every: [
        {
          path: 'package.json',
          matchContent:
            '"(dev)?(d|D)ependencies":\\s*{[^}]*"ember-cli":\\s*".+?"[^}]*}',
        },
      ],
    },
    settings: {
      installCommand: {
        placeholder: '`yarn install`, `pnpm install`, or `npm install`',
      },
      buildCommand: {
        placeholder: '`npm run build` or `ember build`',
        value: 'ember build',
      },
      devCommand: {
        value: 'ember serve --port $PORT',
        placeholder: 'ember serve',
      },
      outputDirectory: {
        value: 'dist',
      },
    },
    dependency: 'ember-cli',
    getOutputDirName: async () => 'dist',
    defaultRoutes: [
      {
        handle: 'filesystem',
      },
      {
        src: '/(.*)',
        dest: '/index.html',
      },
    ],
  },
  {
    name: 'Vue.js',
    slug: 'vue',
    demo: 'https://vue-template.vercel.app',
    logo: 'https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/vue.svg',
    tagline:
      'Vue.js is a versatile JavaScript framework that is as approachable as it is performant.',
    description: 'A Vue.js app, created with the Vue CLI.',
    website: 'https://vuejs.org',
    envPrefix: 'VUE_APP_',
    detectors: {
      every: [
        {
          path: 'package.json',
          matchContent:
            '"(dev)?(d|D)ependencies":\\s*{[^}]*"@vue\\/cli-service":\\s*".+?"[^}]*}',
        },
      ],
    },
    settings: {
      installCommand: {
        placeholder: '`yarn install`, `pnpm install`, or `npm install`',
      },
      buildCommand: {
        placeholder: '`npm run build` or `vue-cli-service build`',
        value: 'vue-cli-service build',
      },
      devCommand: {
        value: 'vue-cli-service serve --port $PORT',
        placeholder: 'vue-cli-service serve',
      },
      outputDirectory: {
        value: 'dist',
      },
    },
    dependency: '@vue/cli-service',
    getOutputDirName: async () => 'dist',
    defaultRoutes: [
      {
        src: '^/[^/]*\\.(js|txt|ico|json)',
        headers: { 'cache-control': 'max-age=300' },
        continue: true,
      },
      {
        src: '^/(img|js|css|fonts|media)/[^/]+\\.[0-9a-f]{8}\\.*',
        headers: { 'cache-control': 'max-age=31536000, immutable' },
        continue: true,
      },
      {
        handle: 'filesystem',
      },
      {
        src: '^.*',
        dest: '/index.html',
      },
    ],
  },
  {
    name: 'Scully',
    slug: 'scully',
    demo: 'https://scully-template.vercel.app',
    logo: 'https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/scullyio-logo.png',
    tagline: 'Scully is a static site generator for Angular.',
    description: 'The Static Site Generator for Angular apps.',
    website: 'https://github.com/scullyio/scully',
    detectors: {
      every: [
        {
          path: 'package.json',
          matchContent:
            '"(dev)?(d|D)ependencies":\\s*{[^}]*"@scullyio\\/init":\\s*".+?"[^}]*}',
        },
      ],
    },
    settings: {
      installCommand: {
        placeholder: '`yarn install`, `pnpm install`, or `npm install`',
      },
      buildCommand: {
        placeholder: '`npm run build` or `ng build && scully`',
        value: 'ng build && scully',
      },
      devCommand: {
        value: 'ng serve --port $PORT',
        placeholder: 'ng serve',
      },
      outputDirectory: {
        value: 'dist',
      },
    },
    dependency: '@scullyio/init',
    getOutputDirName: async () => 'dist/static',
  },
  {
    name: 'Ionic Angular',
    slug: 'ionic-angular',
    demo: 'https://ionic-angular-template.vercel.app',
    logo: 'https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/ionic.svg',
    tagline:
      'Ionic Angular allows you to build mobile PWAs with Angular and the Ionic Framework.',
    description: 'An Ionic Angular site, created with the Ionic CLI.',
    website: 'https://ionicframework.com',
    detectors: {
      every: [
        {
          path: 'package.json',
          matchContent:
            '"(dev)?(d|D)ependencies":\\s*{[^}]*"@ionic\\/angular":\\s*".+?"[^}]*}',
        },
      ],
    },
    settings: {
      installCommand: {
        placeholder: '`yarn install`, `pnpm install`, or `npm install`',
      },
      buildCommand: {
        placeholder: '`npm run build` or `ng build`',
        value: 'ng build',
      },
      devCommand: {
        value: 'ng serve --port $PORT',
      },
      outputDirectory: {
        value: 'www',
      },
    },
    dependency: '@ionic/angular',
    getOutputDirName: async () => 'www',
    defaultRoutes: [
      {
        handle: 'filesystem',
      },
      {
        src: '/(.*)',
        dest: '/index.html',
      },
    ],
  },
  {
    name: 'Angular',
    slug: 'angular',
    demo: 'https://angular-template.vercel.app',
    logo: 'https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/angular.svg',
    tagline:
      'Angular is a TypeScript-based cross-platform framework from Google.',
    description: 'An Angular app, created with the Angular CLI.',
    website: 'https://angular.io',
    detectors: {
      every: [
        {
          path: 'package.json',
          matchContent:
            '"(dev)?(d|D)ependencies":\\s*{[^}]*"@angular\\/cli":\\s*".+?"[^}]*}',
        },
      ],
    },
    settings: {
      installCommand: {
        placeholder: '`yarn install`, `pnpm install`, or `npm install`',
      },
      buildCommand: {
        placeholder: '`npm run build` or `ng build`',
        value: 'ng build',
      },
      devCommand: {
        value: 'ng serve --port $PORT',
        placeholder: 'ng serve',
      },
      outputDirectory: {
        value: 'dist',
      },
    },
    dependency: '@angular/cli',
    getOutputDirName: async (dirPrefix: string) => {
      const base = 'dist';
      try {
        const location = join(dirPrefix, base);
        const content = await readdir(location, { withFileTypes: true });

        // If there is only one file in it that is a dir we'll use it as dist dir
        if (content.length === 1 && content[0].isDirectory()) {
          return join(base, content[0].name);
        }
      } catch (error) {
        console.error(`Error detecting output directory: `, error);
      }
      return base;
    },
    defaultRoutes: [
      {
        handle: 'filesystem',
      },
      {
        src: '/(.*)',
        dest: '/index.html',
      },
    ],
  },
  {
    name: 'Polymer',
    slug: 'polymer',
    demo: 'https://polymer-template.vercel.app',
    logo: 'https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/polymer.svg',
    tagline:
      'Polymer is an open-source webapps library from Google, for building using Web Components.',
    description: 'A Polymer app, created with the Polymer CLI.',
    website: 'https://www.polymer-project.org/',
    detectors: {
      every: [
        {
          path: 'package.json',
          matchContent:
            '"(dev)?(d|D)ependencies":\\s*{[^}]*"polymer-cli":\\s*".+?"[^}]*}',
        },
      ],
    },
    settings: {
      installCommand: {
        placeholder: '`yarn install`, `pnpm install`, or `npm install`',
      },
      buildCommand: {
        placeholder: '`npm run build` or `polymer build`',
        value: 'polymer build',
      },
      devCommand: {
        value: 'polymer serve --port $PORT',
        placeholder: 'polymer serve',
      },
      outputDirectory: {
        value: 'build',
      },
    },
    dependency: 'polymer-cli',
    getOutputDirName: async (dirPrefix: string) => {
      const base = 'build';
      try {
        const location = join(dirPrefix, base);
        const content = await readdir(location);
        const paths = content.filter(item => !item.includes('.'));
        return join(base, paths[0]);
      } catch (error) {
        console.error(`Error detecting output directory: `, error);
      }
      return base;
    },
    defaultRoutes: [
      {
        handle: 'filesystem',
      },
      {
        src: '/(.*)',
        dest: '/index.html',
      },
    ],
  },
  {
    name: 'Svelte',
    slug: 'svelte',
    demo: 'https://svelte.vercel.app',
    logo: 'https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/svelte.svg',
    tagline:
      'Svelte lets you write high performance reactive apps with significantly less boilerplate.',
    description: 'A basic Svelte app using the default template.',
    website: 'https://svelte.dev',
    sort: 3,
    detectors: {
      every: [
        {
          path: 'package.json',
          matchContent:
            '"(dev)?(d|D)ependencies":\\s*{[^}]*"svelte":\\s*".+?"[^}]*}',
        },
        {
          path: 'package.json',
          matchContent:
            '"(dev)?(d|D)ependencies":\\s*{[^}]*"sirv-cli":\\s*".+?"[^}]*}',
        },
      ],
    },
    settings: {
      installCommand: {
        placeholder: '`yarn install`, `pnpm install`, or `npm install`',
      },
      buildCommand: {
        placeholder: '`npm run build` or `rollup -c`',
        value: 'rollup -c',
      },
      devCommand: {
        value: 'rollup -c -w',
      },
      outputDirectory: {
        value: 'public',
      },
    },
    dependency: 'sirv-cli',
    getOutputDirName: async () => 'public',
    defaultRoutes: [
      {
        handle: 'filesystem',
      },
      {
        src: '/(.*)',
        dest: '/index.html',
      },
    ],
  },
  {
    name: 'SvelteKit',
    slug: 'sveltekit',
    demo: 'https://sveltekit-template.vercel.app',
    logo: 'https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/svelte.svg',
    screenshot:
      'https://assets.vercel.com/image/upload/v1647366075/front/import/sveltekit.png',
    tagline:
      'SvelteKit is a framework for building web applications of all sizes.',
    description: 'A SvelteKit app optimized Edge-first.',
    website: 'https://kit.svelte.dev',
    envPrefix: 'VITE_',
    detectors: {
      every: [
        {
          path: 'package.json',
          matchContent:
            '"(dev)?(d|D)ependencies":\\s*{[^}]*"@sveltejs\\/kit":\\s*".+?"[^}]*}',
        },
      ],
    },
    settings: {
      installCommand: {
        placeholder: '`yarn install`, `pnpm install`, or `npm install`',
      },
      buildCommand: {
        placeholder: '`npm run build` or `svelte-kit build`',
        value: 'svelte-kit build',
      },
      devCommand: {
        value: 'svelte-kit dev --port $PORT',
        placeholder: 'svelte-kit dev',
      },
      outputDirectory: {
        value: 'public',
      },
    },
    getOutputDirName: async () => 'public',
  },
  {
    name: 'Ionic React',
    slug: 'ionic-react',
    demo: 'https://ionic-react-template.vercel.app',
    logo: 'https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/ionic.svg',
    tagline:
      'Ionic React allows you to build mobile PWAs with React and the Ionic Framework.',
    description: 'An Ionic React site, created with the Ionic CLI.',
    website: 'https://ionicframework.com',
    detectors: {
      every: [
        {
          path: 'package.json',
          matchContent:
            '"(dev)?(d|D)ependencies":\\s*{[^}]*"@ionic\\/react":\\s*".+?"[^}]*}',
        },
      ],
    },
    settings: {
      installCommand: {
        placeholder: '`yarn install`, `pnpm install`, or `npm install`',
      },
      buildCommand: {
        placeholder: '`npm run build` or `react-scripts build`',
        value: 'react-scripts build',
      },
      devCommand: {
        value: 'react-scripts start',
      },
      outputDirectory: {
        value: 'build',
      },
    },
    dependency: '@ionic/react',
    getOutputDirName: async () => 'build',
    defaultRoutes: [
      {
        src: '/static/(.*)',
        headers: { 'cache-control': 's-maxage=31536000, immutable' },
        continue: true,
      },
      {
        src: '/service-worker.js',
        headers: { 'cache-control': 's-maxage=0' },
        continue: true,
      },
      {
        src: '/sockjs-node/(.*)',
        dest: '/sockjs-node/$1',
      },
      {
        handle: 'filesystem',
      },
      { src: '/static/(.*)', status: 404, dest: '/404.html' },
      {
        src: '/(.*)',
        headers: { 'cache-control': 's-maxage=0' },
        dest: '/index.html',
      },
    ],
  },
  {
    name: 'Create React App',
    slug: 'create-react-app',
    demo: 'https://create-react-template.vercel.app',
    logo: 'https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/react.svg',
    tagline: 'Create React App allows you to get going with React in no time.',
    description: 'A client-side React app created with create-react-app.',
    website: 'https://create-react-app.dev',
    sort: 4,
    envPrefix: 'REACT_APP_',
    detectors: {
      some: [
        {
          path: 'package.json',
          matchContent:
            '"(dev)?(d|D)ependencies":\\s*{[^}]*"react-scripts":\\s*".+?"[^}]*}',
        },
        {
          path: 'package.json',
          matchContent:
            '"(dev)?(d|D)ependencies":\\s*{[^}]*"react-dev-utils":\\s*".+?"[^}]*}',
        },
      ],
    },
    settings: {
      installCommand: {
        placeholder: '`yarn install`, `pnpm install`, or `npm install`',
      },
      buildCommand: {
        placeholder: '`npm run build` or `react-scripts build`',
        value: 'react-scripts build',
      },
      devCommand: {
        value: 'react-scripts start',
      },
      outputDirectory: {
        value: 'build',
      },
    },
    dependency: 'react-scripts',
    getOutputDirName: async () => 'build',
    defaultRoutes: [
      {
        src: '/static/(.*)',
        headers: { 'cache-control': 's-maxage=31536000, immutable' },
        continue: true,
      },
      {
        src: '/service-worker.js',
        headers: { 'cache-control': 's-maxage=0' },
        continue: true,
      },
      {
        src: '/sockjs-node/(.*)',
        dest: '/sockjs-node/$1',
      },
      {
        handle: 'filesystem',
      },
      { src: '/static/(.*)', status: 404, dest: '/404.html' },
      {
        src: '/(.*)',
        headers: { 'cache-control': 's-maxage=0' },
        dest: '/index.html',
      },
    ],
  },
  {
    name: 'Gridsome',
    slug: 'gridsome',
    demo: 'https://gridsome-template.vercel.app',
    logo: 'https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/gridsome.svg',
    tagline:
      'Gridsome is a Vue.js-powered framework for building websites & apps that are fast by default.',
    description: 'A Gridsome app, created with the Gridsome CLI.',
    website: 'https://gridsome.org/',
    detectors: {
      every: [
        {
          path: 'package.json',
          matchContent:
            '"(dev)?(d|D)ependencies":\\s*{[^}]*"gridsome":\\s*".+?"[^}]*}',
        },
      ],
    },
    settings: {
      installCommand: {
        placeholder: '`yarn install`, `pnpm install`, or `npm install`',
      },
      buildCommand: {
        placeholder: '`npm run build` or `gridsome build`',
        value: 'gridsome build',
      },
      devCommand: {
        value: 'gridsome develop -p $PORT',
        placeholder: 'gridsome develop',
      },
      outputDirectory: {
        value: 'dist',
      },
    },
    dependency: 'gridsome',
    getOutputDirName: async () => 'dist',
  },
  {
    name: 'UmiJS',
    slug: 'umijs',
    demo: 'https://umijs-template.vercel.app',
    logo: 'https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/umi.svg',
    tagline:
      'UmiJS is an extensible enterprise-level React application framework.',
    description: 'An UmiJS app, created using the Umi CLI.',
    website: 'https://umijs.org',
    detectors: {
      every: [
        {
          path: 'package.json',
          matchContent:
            '"(dev)?(d|D)ependencies":\\s*{[^}]*"umi":\\s*".+?"[^}]*}',
        },
      ],
    },
    settings: {
      installCommand: {
        placeholder: '`yarn install`, `pnpm install`, or `npm install`',
      },
      buildCommand: {
        placeholder: '`npm run build` or `umi build`',
        value: 'umi build',
      },
      devCommand: {
        value: 'umi dev --port $PORT',
        placeholder: 'umi dev',
      },
      outputDirectory: {
        value: 'dist',
      },
    },
    dependency: 'umi',
    getOutputDirName: async () => 'dist',
    defaultRoutes: [
      {
        handle: 'filesystem',
      },
      {
        src: '/(.*)',
        dest: '/index.html',
      },
    ],
  },
  {
    name: 'Sapper',
    slug: 'sapper',
    demo: 'https://sapper-template.vercel.app',
    logo: 'https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/svelte.svg',
    tagline:
      'Sapper is a framework for building high-performance universal web apps with Svelte.',
    description: 'A Sapper app, using the Sapper template.',
    website: 'https://sapper.svelte.dev',
    detectors: {
      every: [
        {
          path: 'package.json',
          matchContent:
            '"(dev)?(d|D)ependencies":\\s*{[^}]*"sapper":\\s*".+?"[^}]*}',
        },
      ],
    },
    settings: {
      installCommand: {
        placeholder: '`yarn install`, `pnpm install`, or `npm install`',
      },
      buildCommand: {
        placeholder: '`npm run build` or `sapper export`',
        value: 'sapper export',
      },
      devCommand: {
        value: 'sapper dev --port $PORT',
        placeholder: 'sapper dev',
      },
      outputDirectory: {
        value: '__sapper__/export',
      },
    },
    dependency: 'sapper',
    getOutputDirName: async () => '__sapper__/export',
  },
  {
    name: 'Saber',
    slug: 'saber',
    demo: 'https://saber-template.vercel.app',
    logo: 'https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/saber.svg',
    tagline:
      'Saber is a framework for building static sites in Vue.js that supports data from any source.',
    description: 'A Saber site, created with npm init.',
    website: 'https://saber.land/',
    detectors: {
      every: [
        {
          path: 'package.json',
          matchContent:
            '"(dev)?(d|D)ependencies":\\s*{[^}]*"saber":\\s*".+?"[^}]*}',
        },
      ],
    },
    settings: {
      installCommand: {
        placeholder: '`yarn install`, `pnpm install`, or `npm install`',
      },
      buildCommand: {
        placeholder: '`npm run build` or `saber build`',
        value: 'saber build',
      },
      devCommand: {
        value: 'saber --port $PORT',
        placeholder: 'saber',
      },
      outputDirectory: {
        value: 'public',
      },
    },
    dependency: 'saber',
    getOutputDirName: async () => 'public',
    defaultRoutes: [
      {
        src: '/_saber/.*',
        headers: { 'cache-control': 'max-age=31536000, immutable' },
      },
      {
        handle: 'filesystem',
      },
      {
        src: '.*',
        status: 404,
        dest: '404.html',
      },
    ],
  },
  {
    name: 'Stencil',
    slug: 'stencil',
    demo: 'https://stencil.vercel.app',
    logo: 'https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/stencil.svg',
    tagline:
      'Stencil is a powerful toolchain for building Progressive Web Apps and Design Systems.',
    description: 'A Stencil site, created with the Stencil CLI.',
    website: 'https://stenciljs.com/',
    detectors: {
      every: [
        {
          path: 'package.json',
          matchContent:
            '"(dev)?(d|D)ependencies":\\s*{[^}]*"@stencil\\/core":\\s*".+?"[^}]*}',
        },
      ],
    },
    settings: {
      installCommand: {
        placeholder: '`yarn install`, `pnpm install`, or `npm install`',
      },
      buildCommand: {
        placeholder: '`npm run build` or `stencil build`',
        value: 'stencil build',
      },
      devCommand: {
        value: 'stencil build --dev --watch --serve --port $PORT',
        placeholder: 'stencil build --dev --watch --serve',
      },
      outputDirectory: {
        value: 'www',
      },
    },
    dependency: '@stencil/core',
    getOutputDirName: async () => 'www',
    defaultRoutes: [
      {
        src: '/assets/(.*)',
        headers: { 'cache-control': 'max-age=2592000' },
        continue: true,
      },
      {
        src: '/build/p-.*',
        headers: { 'cache-control': 'max-age=31536000, immutable' },
        continue: true,
      },
      {
        src: '/sw.js',
        headers: { 'cache-control': 'no-cache' },
        continue: true,
      },
      {
        handle: 'filesystem',
      },
      {
        src: '/(.*)',
        dest: '/index.html',
      },
    ],
  },
  {
    name: 'Nuxt.js',
    slug: 'nuxtjs',
    demo: 'https://nuxtjs-template.vercel.app',
    logo: 'https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/nuxt.svg',
    screenshot:
      'https://assets.vercel.com/image/upload/v1647366075/front/import/nuxtjs.png',
    tagline:
      'Nuxt.js is the web comprehensive framework that lets you dream big with Vue.js.',
    description: 'A Nuxt.js app, bootstrapped with create-nuxt-app.',
    website: 'https://nuxtjs.org',
    sort: 2,
    envPrefix: 'NUXT_ENV_',
    detectors: {
      every: [
        {
          path: 'package.json',
          matchContent:
            '"(dev)?(d|D)ependencies":\\s*{[^}]*"nuxt3?(-edge)?":\\s*".+?"[^}]*}',
        },
      ],
    },
    settings: {
      installCommand: {
        placeholder: '`yarn install`, `pnpm install`, or `npm install`',
      },
      buildCommand: {
        placeholder: '`npm run build` or `nuxt generate`',
        value: 'nuxt generate',
      },
      devCommand: {
        value: 'nuxt',
      },
      outputDirectory: {
        value: 'dist',
      },
    },
    dependency: 'nuxt',
    getOutputDirName: async () => 'dist',
    cachePattern: '.nuxt/**',
    defaultRoutes: [
      {
        src: '/sw.js',
        headers: { 'cache-control': 'no-cache' },
        continue: true,
      },
      {
        src: '/_nuxt/(.*)',
        headers: { 'cache-control': 'public,max-age=31536000,immutable' },
        continue: true,
      },
      {
        handle: 'filesystem',
      },
      {
        src: '/(.*)',
        dest: '/200.html',
      },
    ],
  },
  {
    name: 'RedwoodJS',
    slug: 'redwoodjs',
    demo: 'https://redwood-template.vercel.app',
    logo: 'https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/redwoodjs.svg',
    tagline: 'RedwoodJS is a full-stack framework for the Jamstack.',
    description: 'A RedwoodJS app, bootstraped with create-redwood-app.',
    website: 'https://redwoodjs.com',
    envPrefix: 'REDWOOD_ENV_',
    useRuntime: { src: 'package.json', use: '@vercel/redwood' },
    ignoreRuntimes: ['@vercel/node'],
    detectors: {
      every: [
        {
          path: 'package.json',
          matchContent:
            '"(dev)?(d|D)ependencies":\\s*{[^}]*"@redwoodjs\\/core":\\s*".+?"[^}]*}',
        },
      ],
    },
    settings: {
      installCommand: {
        placeholder: '`yarn install`, `pnpm install`, or `npm install`',
      },
      buildCommand: {
        value: 'yarn rw deploy vercel',
      },
      devCommand: {
        value: 'yarn rw dev --fwd="--port=$PORT --open=false"',
        placeholder: 'yarn rw dev',
      },
      outputDirectory: {
        placeholder: 'RedwoodJS default',
      },
    },
    getOutputDirName: async () => 'public',
  },
  {
    name: 'Hugo',
    slug: 'hugo',
    demo: 'https://hugo-template.vercel.app',
    logo: 'https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/hugo.svg',
    tagline:
      'Hugo is the world’s fastest framework for building websites, written in Go.',
    description: 'A Hugo site, created with the Hugo CLI.',
    website: 'https://gohugo.io',
    detectors: {
      some: [
        {
          path: 'config.yaml',
          matchContent: 'baseURL',
        },
        {
          path: 'config.toml',
          matchContent: 'baseURL',
        },
        {
          path: 'config.json',
          matchContent: 'baseURL',
        },
      ],
    },
    settings: {
      installCommand: {
        placeholder: 'None',
      },
      buildCommand: {
        placeholder: '`npm run build` or `hugo -D --gc`',
        value: 'hugo -D --gc',
      },
      devCommand: {
        value: 'hugo server -D -w -p $PORT',
        placeholder: 'hugo server -D',
      },
      outputDirectory: {
        placeholder: '`public` or `publishDir` from the `config` file',
      },
    },
    getOutputDirName: async (dirPrefix: string): Promise<string> => {
      type HugoConfig = { publishDir?: string };
      const config = await readConfigFile<HugoConfig>(
        ['config.json', 'config.yaml', 'config.toml'].map(fileName => {
          return join(dirPrefix, fileName);
        })
      );

      return (config && config.publishDir) || 'public';
    },
    defaultVersion: '0.58.2', // Must match the build image
  },
  {
    name: 'Jekyll',
    slug: 'jekyll',
    demo: 'https://jekyll-template.vercel.app',
    logo: 'https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/jekyll.svg',
    tagline:
      'Jekyll makes it super easy to transform your plain text into static websites and blogs.',
    description: 'A Jekyll site, created with the Jekyll CLI.',
    website: 'https://jekyllrb.com/',
    detectors: {
      every: [
        {
          path: '_config.yml',
        },
      ],
    },
    settings: {
      installCommand: {
        value: 'bundle install',
      },
      buildCommand: {
        placeholder: '`npm run build` or `jekyll build`',
        value: 'jekyll build',
      },
      devCommand: {
        value: 'bundle exec jekyll serve --watch --port $PORT',
        placeholder: 'bundle exec jekyll serve',
      },
      outputDirectory: {
        placeholder: '`_site` or `destination` from `_config.yml`',
      },
    },
    getOutputDirName: async (dirPrefix: string): Promise<string> => {
      type JekyllConfig = { destination?: string };
      const config = await readConfigFile<JekyllConfig>(
        join(dirPrefix, '_config.yml')
      );
      return (config && config.destination) || '_site';
    },
    cachePattern: '{vendor/bin,vendor/cache,vendor/bundle}/**',
  },
  {
    name: 'Brunch',
    slug: 'brunch',
    demo: 'https://brunch-template.vercel.app',
    logo: 'https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/brunch.svg',
    tagline:
      'Brunch is a fast and simple webapp build tool with seamless incremental compilation for rapid development.',
    description: 'A Brunch app, created with the Brunch CLI.',
    website: 'https://brunch.io/',
    detectors: {
      every: [
        {
          path: 'brunch-config.js',
        },
      ],
    },
    settings: {
      installCommand: {
        placeholder: '`yarn install`, `pnpm install`, or `npm install`',
      },
      buildCommand: {
        placeholder: '`npm run build` or `brunch build --production`',
        value: 'brunch build --production',
      },
      devCommand: {
        value: 'brunch watch --server --port $PORT',
        placeholder: 'brunch watch --server',
      },
      outputDirectory: {
        value: 'public',
      },
    },
    getOutputDirName: async () => 'public',
  },
  {
    name: 'Middleman',
    slug: 'middleman',
    demo: 'https://middleman-template.vercel.app',
    logo: 'https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/middleman.svg',
    tagline:
      'Middleman is a static site generator that uses all the shortcuts and tools in modern web development.',
    description: 'A Middleman app, created with the Middleman CLI.',
    website: 'https://middlemanapp.com/',
    detectors: {
      every: [
        {
          path: 'config.rb',
        },
      ],
    },
    settings: {
      installCommand: {
        value: 'bundle install',
      },
      buildCommand: {
        placeholder: '`npm run build` or `bundle exec middleman build`',
        value: 'bundle exec middleman build',
      },
      devCommand: {
        placeholder: 'bundle exec middleman server',
        value: 'bundle exec middleman server -p $PORT',
      },
      outputDirectory: {
        value: 'build',
      },
    },
    getOutputDirName: async () => 'build',
    cachePattern: '{vendor/bin,vendor/cache,vendor/bundle}/**',
  },
  {
    name: 'Zola',
    slug: 'zola',
    demo: 'https://zola-template.vercel.app',
    logo: 'https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/zola.png',
    tagline: 'Everything you need to make a static site engine in one binary.',
    description: 'A Zola app, created with the "Getting Started" tutorial.',
    website: 'https://www.getzola.org',
    detectors: {
      every: [
        {
          path: 'config.toml',
          matchContent: 'base_url',
        },
      ],
    },
    settings: {
      installCommand: {
        placeholder: 'None',
      },
      buildCommand: {
        value: 'zola build',
      },
      devCommand: {
        placeholder: 'zola serve',
        value: 'zola serve --port $PORT',
      },
      outputDirectory: {
        value: 'public',
      },
    },
    getOutputDirName: async () => 'public',
    defaultVersion: '0.13.0', // Must match the build image
  },
  {
    name: 'Vite',
    slug: 'vite',
    demo: 'https://vite-vue-template.vercel.app',
    logo: 'https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/vite.svg',
    tagline:
      'Vite is a new breed of frontend build tool that significantly improves the frontend development experience.',
    description: 'A Vue.js app, created with Vite.',
    website: 'https://vitejs.dev',
    envPrefix: 'VITE_',
    detectors: {
      every: [
        {
          path: 'package.json',
          matchContent:
            '"(dev)?(d|D)ependencies":\\s*{[^}]*"vite":\\s*".+?"[^}]*}',
        },
      ],
    },
    settings: {
      installCommand: {
        placeholder: '`yarn install`, `pnpm install`, or `npm install`',
      },
      buildCommand: {
        placeholder: '`npm run build` or `vite build`',
        value: 'vite build',
      },
      devCommand: {
        placeholder: 'vite',
        value: 'vite --port $PORT',
      },
      outputDirectory: {
        value: 'dist',
      },
    },
    dependency: 'vite',
    getOutputDirName: async () => 'dist',
  },
  {
    name: 'Parcel',
    slug: 'parcel',
    demo: 'https://parcel-template.vercel.app',
    logo: 'https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/parcel.png',
    tagline:
      'Parcel is a zero configuration build tool for the web that scales to projects of any size and complexity.',
    description: 'A vanilla web app built with Parcel.',
    website: 'https://parceljs.org',
    detectors: {
      every: [
        {
          path: 'package.json',
          matchContent:
            '"(dev)?(d|D)ependencies":\\s*{[^}]*"parcel":\\s*".+?"[^}]*}',
        },
      ],
    },
    settings: {
      installCommand: {
        placeholder: '`yarn install`, `pnpm install`, or `npm install`',
      },
      buildCommand: {
        placeholder: '`npm run build` or `parcel build`',
        value: 'parcel build',
      },
      devCommand: {
        placeholder: 'parcel',
        value: 'parcel',
      },
      outputDirectory: {
        value: 'dist',
      },
    },
    dependency: 'parcel',
    getOutputDirName: async () => 'dist',
    defaultRoutes: [
      {
        src: '^/[^./]+\\.[0-9a-f]{8}\\.(css|js|png|jpg|webp|avif|svg)$',
        headers: { 'cache-control': 's-maxage=31536000, immutable' },
        continue: true,
      },
      {
        handle: 'filesystem',
      },
    ],
  },
  {
    name: 'Sanity',
    slug: 'sanity',
    demo: 'https://sanity-studio-template.vercel.app',
    logo: 'https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/sanity.svg',
    tagline: 'The structured content platform.',
    description: 'A Sanity Studio',
    website: 'https://www.sanity.io',
    envPrefix: 'SANITY_STUDIO_',
    detectors: {
      every: [
        {
          path: 'sanity.json',
        },
      ],
    },
    settings: {
      installCommand: {
        placeholder: '`yarn install`, `pnpm install`, or `npm install`',
      },
      buildCommand: {
        placeholder: '`npm run build` or `sanity build`',
        value: 'sanity build',
      },
      devCommand: {
        value: 'sanity start --port $PORT',
      },
      outputDirectory: {
        value: 'dist',
      },
    },
    dependency: '@sanity/cli',
    getOutputDirName: async () => 'dist',
    defaultRoutes: [
      {
        handle: 'filesystem',
      },
      {
        src: '/(.*)',
        dest: '/index.html',
      },
    ],
  },
  {
    name: 'Hydrogen',
    slug: 'hydrogen',
    demo: 'https://hydrogen-template.vercel.app',
    logo: 'https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/hydrogen.svg',
    tagline: 'React framework for headless commerce',
    description: 'React framework for headless commerce',
    website: 'https://hydrogen.shopify.dev',
    useRuntime: { src: 'package.json', use: '@vercel/hydrogen' },
    detectors: {
      every: [
        {
          path: 'hydrogen.config.js',
        },
      ],
    },
    settings: {
      installCommand: {
        placeholder: '`yarn install`, `pnpm install`, or `npm install`',
      },
      buildCommand: {
        value: 'shopify hydrogen build',
        placeholder: '`npm run build` or `shopify hydrogen build`',
      },
      devCommand: {
        value: 'shopify hydrogen dev',
        placeholder: 'shopify hydrogen dev',
      },
      outputDirectory: {
        value: 'dist',
      },
    },
    dependency: '@shopify/hydrogen',
    getOutputDirName: async () => 'dist',
  },
  {
    name: 'Other',
    slug: null,
    logo: 'https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/other.svg',
    description: 'No framework or an unoptimized framework.',
    settings: {
      installCommand: {
        placeholder: '`yarn install`, `pnpm install`, or `npm install`',
      },
      buildCommand: {
        placeholder: '`npm run vercel-build` or `npm run build`',
        value: null,
      },
      devCommand: {
        placeholder: 'None',
        value: null,
      },
      outputDirectory: {
        placeholder: '`public` if it exists, or `.`',
      },
    },
    getOutputDirName: async () => 'public',
  },
] as const;

const def = frameworks as readonly Framework[];
export default def;
