# Data Manipulation Panel for Grafana

![Form Panel](https://raw.githubusercontent.com/volkovlabs/volkovlabs-form-panel/main/src/img/panel.png)

![Grafana](https://img.shields.io/badge/Grafana-10.0.0-orange)
[![YouTube](https://img.shields.io/badge/YouTube-Playlist-red)](https://www.youtube.com/playlist?list=PLPow72ygztmRXSNBxyw0sFnnvNRY_CsSA)
![CI](https://github.com/volkovlabs/volkovlabs-form-panel/workflows/CI/badge.svg)
![E2E](https://github.com/volkovlabs/volkovlabs-form-panel/workflows/E2E/badge.svg)
[![codecov](https://codecov.io/gh/VolkovLabs/volkovlabs-form-panel/branch/main/graph/badge.svg?token=0m6f0ktUar)](https://codecov.io/gh/VolkovLabs/volkovlabs-form-panel)
[![CodeQL](https://github.com/VolkovLabs/volkovlabs-form-panel/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/VolkovLabs/volkovlabs-form-panel/actions/workflows/codeql-analysis.yml)

## Introduction

The Data Manipulation Panel is a conceptually new plugin for Grafana. It is the first plugin that allows inserting and updating application data, as well as modifying configuration directly from your Grafana dashboard.

[![Data Manipulation Plugin for Grafana | Manual data entering and User input into Dashboard](https://raw.githubusercontent.com/volkovlabs/volkovlabs-form-panel/main/img/video.png)](https://youtu.be/DXALVG8GijM)

## Requirements

- **Grafana 8.5** and **Grafana 9** are required for major version 2.
- **Grafana 8** is required for major version 1.

## Getting Started

The Data Manipulation panel can be installed from the [Grafana Catalog](https://grafana.com/grafana/plugins/volkovlabs-form-panel/) or utilizing the Grafana command line tool.

For the latter, use the following command.

```bash
grafana-cli plugins install volkovlabs-form-panel
```

## Highlights

- Provides functionality to create customizable forms.
- Supports the Custom Code for the Initial and Update requests.
- Allows specifying a `GET` request to get initial values and `DELETE`, `PATCH`, `POST`, and `PUT` requests to send values updated in the form.
- Allows adding Header fields to the Initial and Update requests.
- Allows customizing Submit, Reset buttons, and form layout.
- Allows splitting form elements into sections.
- Allows requesting confirmation before Update request.
- Allows sending all or only updated elements in the Payload.
- Allows displaying Success and Error notifications from the Custom Code.
- Supports Code Editor suggestions for available parameters.

## Documentation

| Section | Description |
| -- | -- |
| [Architecture](https://volkovlabs.io/plugins/volkovlabs-form-panel/architecture/) | Explains the Architecture and how to use Grafana and API behind NGINX. |
| [Custom Code](https://volkovlabs.io/plugins/volkovlabs-form-panel/code/) | Demonstrates how to access panel options, API responses, form elements, Grafana services. |
| [Features](https://volkovlabs.io/plugins/volkovlabs-form-panel/features/)         | Demonstrates panel features.                                                                  |
| [Servers](https://volkovlabs.io/plugins/volkovlabs-form-panel/servers/)           | Demonstrates various server API implementations                                               |
| [Release Notes](https://volkovlabs.io/plugins/volkovlabs-form-panel/release/)     | Stay up to date with the latest features and updates.                                         |

## Tutorials

[![How to Manipulate Data using Grafana dashboard | API Node.js Server and Deno Deploy Project](https://raw.githubusercontent.com/volkovlabs/volkovlabs-form-panel/main/img/server.png)](https://youtu.be/SHN2S-dRIEM)

[![Static and dynamic interface elements of Data Manipulation plugin | DML using data source in Grafana](https://raw.githubusercontent.com/volkovlabs/volkovlabs-form-panel/main/img/elements.png)](https://youtu.be/RSVH1bSBNl8)

Three plugins that make Grafana complete. Dynamic Text, Data Manipulation, and Apache ECharts are all you need to create functional real-world web applications.

[![Magic JavaScript trio for Grafana | Dynamic Text, Data Manipulation and Apache ECharts plugins](https://raw.githubusercontent.com/volkovlabs/volkovlabs-form-panel/main/img/magic-trio.png)](https://youtu.be/wPr4gZYzUVA)

## Feedback

We love to hear from you. There are various ways to get in touch with us.

- Ask a question, request a new feature, and file a bug with [GitHub issues](https://github.com/volkovlabs/volkovlabs-form-panel/issues/new/choose).
- Subscribe to our [YouTube Channel](https://www.youtube.com/@volkovlabs) and add a comment.
- Sponsor our open-source plugins for Grafana with [GitHub Sponsor](https://github.com/sponsors/VolkovLabs).
- Star the repository to show your support.

## License

Apache License Version 2.0, see [LICENSE](https://github.com/volkovlabs/volkovlabs-form-panel/blob/main/LICENSE).
