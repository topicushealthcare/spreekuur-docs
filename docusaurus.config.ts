import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import type * as Redocusaurus from 'redocusaurus';


// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
    title: 'Spreekuur.nl API documentation',
    favicon: 'img/favicon.svg',

    // Set the production url of your site here
    url: 'https://docs.spreekuur.nl',
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: '/',

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'Topicus.Healthcare', // Usually your GitHub org/user name.
    projectName: 'spreekuur-docs', // Usually your repo name.

    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',

    // Even if you don't use internationalization, you can use this field to set
    // useful metadata like html lang. For example, if your site is Chinese, you
    // may want to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },
    markdown: {
        mermaid: true,
    },
    themes: ['@docusaurus/theme-mermaid'],
    presets: [
        [
            'classic',
            {
                docs: {
                    routeBasePath: '/',
                    sidebarPath: './sidebars.ts',
                },
                blog: false,
                pages: false,
                theme: {
                    customCss: './src/css/custom.css',
                },
            } satisfies Preset.Options,
        ],
        // Redocusaurus config
        [
            'redocusaurus',
            {
                // Plugin Options for loading OpenAPI files
                specs: [
                    // You can also pass it a OpenAPI spec URL
                    {
                        spec: 'openapi/xis/appointment-xis.yaml',
                        id: 'appointment-xis',
                        route: '/openapi/appointment-xis',
                    },
                    {
                        spec: 'openapi/xis/appointment-xis_v2.yaml',
                        id: 'appointment-xis-v2',
                        route: '/openapi/appointment-xis-v2',
                    },
                    {
                        spec: 'openapi/spreekuur/appointment-spreekuur.yaml',
                        id: 'appointment-spreekuur',
                        route: '/openapi/appointment-spreekuur',
                    },
                    {
                        spec: 'openapi/xis/chat-xis.yaml',
                        id: 'chat-xis',
                        route: '/openapi/chat-xis',
                    },
                    {
                        spec: 'openapi/spreekuur/chat-spreekuur.yaml',
                        id: 'chat-spreekuur',
                        route: '/openapi/chat-spreekuur',
                    },
                    {
                        spec: 'openapi/xis/medication-xis.yaml',
                        id: 'medication-xis',
                        route: '/openapi/medication-xis',
                    },
                    {
                        spec: 'openapi/spreekuur/medication-spreekuur.yaml',
                        id: 'medication-spreekuur',
                        route: '/openapi/medication-spreekuur',
                    },
                    {
                        spec: 'openapi/xis/patient-xis.yaml',
                        id: 'patient-xis',
                        route: '/openapi/patient-xis'
                    },
                    {
                        spec: 'openapi/spreekuur/patient-spreekuur.yaml',
                        id: 'patient-spreekuur',
                        route: '/openapi/patient-spreekuur',
                    },
                    {
                        spec: 'openapi/spreekuur/notification-spreekuur.yaml',
                        id: 'notification-spreekuur',
                        route: '/openapi/notification-spreekuur',
                    },
                    {
                        spec: 'openapi/xis/econsult-triage-xis.yaml',
                        id: 'econsult-triage-xis',
                        route: '/openapi/econsult-triage-xis'
                    },
                ],
                // Theme Options for modifying how redoc renders them
                theme: {
                    // Change with your site colors
                    primaryColor: '#1890ff',
                },
            },
        ] satisfies Redocusaurus.PresetEntry,
    ],

    themeConfig: {
        // Replace with your project's social card
        image: 'img/logo-spreekuur-light.svg',
        navbar: {
            logo: {
                alt: 'Spreekuur.nl Logo',
                src: 'img/logo-spreekuur-light.svg',
            },
            items: [
                {
                    type: 'docSidebar',
                    sidebarId: 'tutorialSidebar',
                    position: 'left',
                    label: 'Docs',
                },
            ],
        },
        footer: {
            style: 'dark',
            copyright: `Copyright © ${new Date().getFullYear()} Spreekuur.nl <br> <a href="https://creativecommons.org/licenses/by-nd/4.0/" target="_blank"><img alt="License: CC BY-ND 4.0" src="https://licensebuttons.net/l/by-nd/4.0/88x31.png" /></a>`,
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
        },
    } satisfies Preset.ThemeConfig,
};

export default config;
