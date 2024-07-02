# Business Forms Panel for Grafana

![Form Panel](https://raw.githubusercontent.com/volkovlabs/volkovlabs-form-panel/main/src/img/panel.png)

![Grafana](https://img.shields.io/badge/Grafana-11.1-orange)
[![YouTube](https://img.shields.io/badge/YouTube-Playlist-red)](https://www.youtube.com/playlist?list=PLPow72ygztmRXSNBxyw0sFnnvNRY_CsSA)
![CI](https://github.com/volkovlabs/volkovlabs-form-panel/workflows/CI/badge.svg)
![E2E](https://github.com/volkovlabs/volkovlabs-form-panel/workflows/E2E/badge.svg)
[![codecov](https://codecov.io/gh/VolkovLabs/volkovlabs-form-panel/branch/main/graph/badge.svg?token=0m6f0ktUar)](https://codecov.io/gh/VolkovLabs/volkovlabs-form-panel)
[![CodeQL](https://github.com/VolkovLabs/volkovlabs-form-panel/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/VolkovLabs/volkovlabs-form-panel/actions/workflows/codeql-analysis.yml)

## Introduction

The Business Forms Panel is a conceptually new plugin for Grafana. It is the first plugin that allows inserting and updating application data, as well as modifying configuration directly from your Grafana dashboard.

[![Use REST API, Data Source and Queries to manipulate your data](https://raw.githubusercontent.com/volkovlabs/volkovlabs-form-panel/main/img/tutorial.png)](https://youtu.be/hVy9NfFiI5U)

## Requirements

- Business Forms Panel 4.X requires **Grafana 10** or **Grafana 11**.
- Data Manipulation Panel 3.X requires **Grafana 9** or **Grafana 10**.
- Data Manipulation Panel 2.X requires **Grafana 9** or **Grafana 8.5**.
- Data Manipulation Panel 1.X requires **Grafana 8**.

## Getting Started

You can install the Business Forms Panel from the [Grafana Plugins [catalog](https://grafana.com/grafana/plugins/volkovlabs-form-panel/) or use the Grafana command line tool.

For the latter, please use the following command:

```bash
grafana-cli plugins install volkovlabs-form-panel
```

## Highlights

- Provides functionality to create customizable forms.
- Supports custom code for initial and update requests.
- Supports API requests, including the `GET` request to get initial values and the `DELETE`, `PATCH`, `POST`, and `PUT` requests to send values updated in the form.
- Allows adding request headers to initial and update requests.
- Supports customization of the Submit and Reset buttons as well as the form layout.
- Allows splitting form elements into sections.
- Allows requesting the user's confirmation before running an update request.
- Allows sending all or only updated elements in the request payload.
- Allows displaying success and error notifications through custom code.
- Supports suggestions for available parameters when writing program code in the code editor.

## Documentation

| Section                                                                             | Description                                                                                |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [Data Flow](https://volkovlabs.io/plugins/volkovlabs-form-panel/data-flow/)         | Explains the data flow and its specifics.                                                  |
| [Form Elements](https://volkovlabs.io/plugins/volkovlabs-form-panel/form-elements/) | Explains the specifics of form elements.                                                   |
| [REST API](https://volkovlabs.io/plugins/volkovlabs-form-panel/architecture/)       | Explains the REST API architecture and how to use NGINX.                                   |
| [Custom Code](https://volkovlabs.io/plugins/volkovlabs-form-panel/code/)            | Explains how to access plugin options, API responses, form elements, and Grafana services. |
| [Features](https://volkovlabs.io/plugins/volkovlabs-form-panel/features/)           | Explains the plugin features.                                                              |
| [Servers](https://volkovlabs.io/plugins/volkovlabs-form-panel/servers/)             | Provides examples of API server implementations.                                           |
| [Release Notes](https://volkovlabs.io/plugins/volkovlabs-form-panel/release/)       | Stay up to date with the latest features and updates.                                      |

## Feedback

We're looking forward to hearing from you. You can use different ways to get in touch with us.

- Ask a question, request a new feature, or report an issue at [GitHub issues](https://github.com/volkovlabs/volkovlabs-form-panel/issues).
- Subscribe to our [YouTube Channel](https://www.youtube.com/@volkovlabs) and leave your comments.
- Sponsor our open-source plugins for Grafana at [GitHub Sponsor](https://github.com/sponsors/VolkovLabs).
- Star the repository to show your support.

## License

Apache License Version 2.0, see [LICENSE](https://github.com/volkovlabs/volkovlabs-form-panel/blob/main/LICENSE).
