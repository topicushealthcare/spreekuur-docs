# Spreekuur.nl docs

This repository contains the documentation for the Spreekuur.nl external (FHIR) API. The documentation is intended for
developers who want to integrate with the Spreekuur.nl platform. 

See https://docs.spreekuur.nl for the live documentation.

### Installation

```
npm install
```

### Local Development

```
npm run start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Deployment

Deployment is done using GitHub Actions and GitHub Pages. See `.github/workflows/build.yml` for the deployment configuration.

Every merge to master is deployed directly to GitHub pages.