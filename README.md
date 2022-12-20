# Data Manipulation Panel for Grafana

![Form Panel](https://raw.githubusercontent.com/volkovlabs/volkovlabs-form-panel/main/src/img/panel.png)

[![Grafana](https://img.shields.io/badge/Grafana-9.3.1-orange)](https://www.grafana.com)
[![YouTube](https://img.shields.io/badge/YouTube-Playlist-red)](https://www.youtube.com/playlist?list=PLPow72ygztmRXSNBxyw0sFnnvNRY_CsSA)
[![Documentation](https://img.shields.io/badge/Documentation-blue)](https://volkovlabs.io/plugins/volkovlabs-form-panel/)
![CI](https://github.com/volkovlabs/volkovlabs-form-panel/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/VolkovLabs/volkovlabs-form-panel/branch/main/graph/badge.svg?token=0m6f0ktUar)](https://codecov.io/gh/VolkovLabs/volkovlabs-form-panel)
[![CodeQL](https://github.com/VolkovLabs/volkovlabs-form-panel/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/VolkovLabs/volkovlabs-form-panel/actions/workflows/codeql-analysis.yml)

## Introduction

The Data Manipulation Form Panel is a plugin for Grafana that can be used to insert, update application data, and modify configuration directly from your Grafana dashboard.

[![Data Manipulation Plugin for Grafana | Manual data entering and User input into Dashboard](https://raw.githubusercontent.com/volkovlabs/volkovlabs-form-panel/main/img/video.png)](https://youtu.be/DXALVG8GijM)

### Requirements

- **Grafana 8.5+**, **Grafana 9.0+** is required for version 2.X.
- **Grafana 8.0+** is required for version 1.X.

## Getting Started

Data Manipulation panel can be installed from the [Grafana Catalog](https://grafana.com/grafana/plugins/volkovlabs-form-panel/) or use the `grafana-cli` tool to install from the command line:

```bash
grafana-cli plugins install volkovlabs-form-panel
```

## Features

- Provides functionality to create customizable forms with elements:
  - Code Editor
  - Date and Time
  - Read-only (Disabled) with support for lookup
  - Number Input
  - Number Slider
  - Password Input
  - Radio Group with Boolean options
  - Radio Group with Custom options
  - Select with Custom options
  - String Input
  - Text Area
- Supports the Custom Code for Initial and Update requests.
- Allows to specify GET request to get initial values and DELETE, PATCH, POST, PUT request to send values updated in the form.
- Allows to add Header fields to Initial and Update requests.
- Allows to customize Submit, Reset buttons and form layout.
- Allows to split form elements into sections.
- Allows to request confirmation before update request.
- Allows to send all or only updated elements in the Payload.
- Allows to display Success and Error notifications from the Custom Code.
- Supports Code Editor suggestions for Available Parameters.

## Documentation

- [Architecture](https://volkovlabs.io/plugins/volkovlabs-form-panel/architecture)
- [Custom Code](https://volkovlabs.io/plugins/volkovlabs-form-panel/code)
- [Control Panel](https://volkovlabs.io/plugins/volkovlabs-form-panel/control)
- [Custom Requests](https://volkovlabs.io/plugins/volkovlabs-form-panel/request)
- [Dynamic form elements](https://volkovlabs.io/plugins/volkovlabs-form-panel/dynamic)
- [Variables](https://volkovlabs.io/plugins/volkovlabs-form-panel/variables)

## Tutorials

[![How to Manipulate Data using Grafana dashboard | API Node.js Server and Deno Deploy Project](https://raw.githubusercontent.com/volkovlabs/volkovlabs-form-panel/main/img/server.png)](https://youtu.be/SHN2S-dRIEM)

[![Static and dynamic interface elements of Data Manipulation plugin | DML using data source in Grafana](https://raw.githubusercontent.com/volkovlabs/volkovlabs-form-panel/main/img/elements.png)](https://youtu.be/RSVH1bSBNl8)

## Feedback

We love to hear from users, developers, and the whole community interested in this plugin. These are various ways to get in touch with us:

- Ask a question, request a new feature, and file a bug with [GitHub issues](https://github.com/volkovlabs/volkovlabs-form-panel/issues/new/choose).
- Sponsor our open-source plugins for Grafana with [GitHub Sponsor](https://github.com/sponsors/VolkovLabs).
- Star the repository to show your support.

## License

- Apache License Version 2.0, see [LICENSE](https://github.com/volkovlabs/volkovlabs-form-panel/blob/main/LICENSE).
