# Template to create a new Grafana panel plugin

[![Grafana 8](https://img.shields.io/badge/Grafana-8-orange)](https://www.grafana.com)
![CI](https://github.com/volkovlabs/volkovlabs-abc-panel/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/VolkovLabs/volkovlabs-abc-panel/branch/main/graph/badge.svg?token=0m6f0ktUar)](https://codecov.io/gh/VolkovLabs/volkovlabs-abc-panel)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/VolkovLabs/volkovlabs-abc-panel.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/VolkovLabs/volkovlabs-abc-panel/context:javascript)

## Introduction

The ABC Panel is a template to create a new panel plugin for Grafana.

### Requirements

Grafana 8.0 is required.

## Getting Started

1. Install packages

```bash
yarn install
```

2. Build the plugin

```bash
yarn build
```

3. Sign the plugins if required

```
export GRAFANA_API_KEY=erXXXX==
yarn sign
```

4. Start Docker container

```bash
yarn run start
```

## Features

- Use `docker-compose` to start development environment with provisioned data source and dashboard.
- Provides unit test configuration.
- Based on the latest version of Grafana.
- Includes GitHub Actions for CI and Release.

## Feedback

We love to hear from users, developers, and the whole community interested in this plugin. These are various ways to get in touch with us:

- Ask a question, request a new feature, and file a bug with [GitHub issues](https://github.com/volkovlabs/volkovlabs-abc-panel/issues/new/choose).
- Star the repository to show your support.

## Contributing

- Fork the repository.
- Find an issue to work on and submit a pull request.
- Could not find an issue? Look for documentation, bugs, typos, and missing features.

## License

- Apache License Version 2.0, see [LICENSE](https://github.com/volkovlabs/volkovlabs-abc-panel/blob/main/LICENSE).
