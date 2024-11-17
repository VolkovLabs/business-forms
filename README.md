# Business Forms for Grafana

![Forms](https://raw.githubusercontent.com/volkovlabs/business-forms/main/src/img/panel.png)

![Grafana](https://img.shields.io/badge/Grafana-11.3-orange)
[![YouTube](https://img.shields.io/badge/YouTube-Playlist-red)](https://www.youtube.com/playlist?list=PLPow72ygztmRXSNBxyw0sFnnvNRY_CsSA)
![CI](https://github.com/volkovlabs/business-forms/workflows/CI/badge.svg)
![E2E](https://github.com/volkovlabs/business-forms/workflows/E2E/badge.svg)
[![codecov](https://codecov.io/gh/VolkovLabs/business-forms/branch/main/graph/badge.svg)](https://codecov.io/gh/VolkovLabs/business-forms)
[![CodeQL](https://github.com/VolkovLabs/business-forms/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/VolkovLabs/business-forms/actions/workflows/codeql-analysis.yml)

## Introduction

The Business Forms panel is a conceptually new plugin for Grafana. It is the first plugin that allows inserting and updating application data, as well as modifying configuration directly from your Grafana dashboard.

[![Use REST API, Data Source and Queries to manipulate your data](https://raw.githubusercontent.com/volkovlabs/business-forms/main/img/business-forms.png)](https://youtu.be/ulbe8U8-IFA)

## Requirements

- Business Forms panel 4.X requires **Grafana 10.3** or **Grafana 11**.
- Data Manipulation panel 3.X requires **Grafana 9** or **Grafana 10**.
- Data Manipulation panel 2.X requires **Grafana 9** or **Grafana 8.5**.
- Data Manipulation panel 1.X requires **Grafana 8**.

## Getting Started

You can install the Business Forms panel from the [Grafana Plugins catalog](https://grafana.com/grafana/plugins/volkovlabs-form-panel/) or use the Grafana command line tool.

For the latter, please use the following command:

```bash
grafana cli plugins install volkovlabs-form-panel
```

[![Install Business Suite plugins in Cloud, OSS, Enterprise | Open source community plugins](https://raw.githubusercontent.com/volkovlabs/.github/main/started.png)](https://youtu.be/1qYzHfPXJF8)

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

| Section                                                                      | Description                                                                                |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [Data Flow](https://volkovlabs.io/plugins/business-forms/data-flow/)         | Explains the data flow and its specifics.                                                  |
| [Form Elements](https://volkovlabs.io/plugins/business-forms/form-elements/) | Explains the specifics of form elements.                                                   |
| [REST API](https://volkovlabs.io/plugins/business-forms/architecture/)       | Explains the REST API architecture and how to use NGINX.                                   |
| [Custom Code](https://volkovlabs.io/plugins/business-forms/code/)            | Explains how to access plugin options, API responses, form elements, and Grafana services. |
| [Features](https://volkovlabs.io/plugins/business-forms/features/)           | Explains the plugin features.                                                              |
| [Servers](https://volkovlabs.io/plugins/business-forms/servers/)             | Provides examples of API server implementations.                                           |
| [Tutorials](https://volkovlabs.io/plugins/business-forms/tutorials/)         | Easy to follow tutorials                                                                   |
| [Release Notes](https://volkovlabs.io/plugins/business-forms/release/)       | Stay up to date with the latest features and updates.                                      |

## Business Suite for Grafana

The Business Suite is a collection of open source plugins created and actively maintained by Volkov Labs.

The collection aims to solve the most frequent business tasks by providing an intuitive interface with detailed written documentation, examples, and video tutorials.

[![Business Suite for Grafana](https://raw.githubusercontent.com/VolkovLabs/.github/main/business.png)](https://volkovlabs.io/plugins/)

### Enterprise Support

With the [Business Suite Enterprise](https://volkovlabs.io/pricing/), you're not just getting a product, you're getting a complete support system. You'll have a designated support team ready to tackle any issues.

You can contact us via Zendesk, receive priority in feature requests and bug fixes, meet with us for in-person consultation, and get access to the Business Intelligence. It's a package that's designed to make your life easier.

## Always happy to hear from you

- Ask a question, request a new feature, or report an issue at [GitHub issues](https://github.com/volkovlabs/business-forms/issues).
- Subscribe to our [YouTube Channel](https://youtube.com/@volkovlabs) and leave your comments.
- Become a [Business Suite sponsor](https://github.com/sponsors/VolkovLabs).

## License

Apache License Version 2.0, see [LICENSE](https://github.com/volkovlabs/business-forms/blob/main/LICENSE).
