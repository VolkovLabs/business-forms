# Business Forms for Grafana

![Forms](https://raw.githubusercontent.com/volkovlabs/business-forms/main/src/img/panel.png)

[![Grafana](https://img.shields.io/badge/Grafana-12.0-orange)](https://grafana.com/)
[![YouTube](https://img.shields.io/badge/YouTube-Playlist-red)](https://www.youtube.com/playlist?list=PLPow72ygztmRXSNBxyw0sFnnvNRY_CsSA)
[![CI](https://github.com/volkovlabs/business-forms/workflows/CI/badge.svg)](https://github.com/volkovlabs/business-forms/actions/workflows/ci.yml)
[![E2E](https://github.com/volkovlabs/business-forms/workflows/E2E/badge.svg)](https://github.com/volkovlabs/business-forms/actions/workflows/e2e.yml)
[![Codecov](https://codecov.io/gh/VolkovLabs/business-forms/branch/main/graph/badge.svg)](https://codecov.io/gh/VolkovLabs/business-forms)
[![CodeQL](https://github.com/VolkovLabs/business-forms/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/VolkovLabs/business-forms/actions/workflows/codeql-analysis.yml)

## 🚀 Introduction

The **Business Forms panel** is a groundbreaking plugin for Grafana, designed to empower users by allowing direct interaction with application data and configurations within dashboards. Whether you're managing data or customizing settings, this plugin streamlines workflows with an intuitive interface.

[![Use REST API, Data Source, and Queries to Manipulate Your Data](https://raw.githubusercontent.com/volkovlabs/business-forms/main/img/business-forms.png)](https://youtu.be/ulbe8U8-IFA)

## 📋 Requirements

Ensure your Grafana version meets the following requirements for compatibility with Business Forms:

- **Business Forms 6.X**: Grafana 11 or 12
- **Business Forms 4.X, 5.X**: Grafana 10.3 or 11
- **Data Manipulation 3.X**: Grafana 9 or 10
- **Data Manipulation 2.X**: Grafana 8.5 or 9
- **Data Manipulation 1.X**: Grafana 8

## 🛠️ Getting Started

Install the Business Forms panel easily via the [Grafana Plugins Catalog](https://grafana.com/grafana/plugins/volkovlabs-form-panel/) or using the Grafana CLI.

### Install via Grafana CLI

```bash
grafana cli plugins install volkovlabs-form-panel
```

[![Install Business Suite Plugins in Cloud, OSS, Enterprise](https://raw.githubusercontent.com/volkovlabs/.github/main/started.png)](https://youtu.be/1qYzHfPXJF8)

## ✨ Key Features

- **Customizable Forms**: Create tailored forms to suit your specific needs.
- **Custom Code Support**: Write custom code for initial and update requests.
- **API Integration**: Supports `GET`, `DELETE`, `PATCH`, `POST`, and `PUT` requests for data manipulation.
- **Request Headers**: Add custom headers to initial and update requests.
- **Flexible UI**: Customize Submit/Reset buttons and form layouts.
- **Sectional Layouts**: Organize form elements into distinct sections.
- **User Confirmation**: Prompt users for confirmation before executing updates.
- **Payload Control**: Send all data or only updated elements in requests.
- **Notifications**: Display success/error messages via custom code.
- **Code Suggestions**: Get parameter suggestions in the built-in code editor.

## 📚 Documentation

Explore detailed guides and resources to maximize the potential of Business Forms:

| Section                                                                      | Description                                                 |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------- |
| [Data Flow](https://volkovlabs.io/plugins/business-forms/data-flow/)         | Understand data flow and its specifics.                     |
| [Form Elements](https://volkovlabs.io/plugins/business-forms/form-elements/) | Learn about form element configurations.                    |
| [REST API](https://volkovlabs.io/plugins/business-forms/architecture/)       | Dive into REST API architecture and NGINX usage.            |
| [Custom Code](https://volkovlabs.io/plugins/business-forms/code/)            | Access plugin options, API responses, and Grafana services. |
| [Features](https://volkovlabs.io/plugins/business-forms/features/)           | Explore all plugin capabilities.                            |
| [Servers](https://volkovlabs.io/plugins/business-forms/servers/)             | View examples of API server implementations.                |
| [Tutorials](https://volkovlabs.io/plugins/business-forms/tutorials/)         | Follow step-by-step guides.                                 |
| [Release Notes](https://volkovlabs.io/plugins/business-forms/release/)       | Stay updated with the latest features and fixes.            |

## 🌟 Business Suite for Grafana

Business Forms is part of the **Business Suite**, a collection of open-source plugins by Volkov Labs. These plugins solve common business challenges with user-friendly interfaces, comprehensive documentation, and video tutorials.

[![Business Suite for Grafana](https://raw.githubusercontent.com/VolkovLabs/.github/main/business.png)](https://volkovlabs.io/plugins/)

### Enterprise Support

Upgrade to [Business Suite Enterprise](https://volkovlabs.io/pricing/) for premium support, including:

- Dedicated support via Zendesk.
- Priority feature requests and bug fixes.
- In-person consultations.
- Access to Business Intelligence tools.

## 💬 Get in Touch

We value your feedback and are eager to assist:

- **Ask Questions or Report Issues**: Use [GitHub Issues](https://github.com/volkovlabs/business-forms/issues).
- **Watch Tutorials**: Subscribe to our [YouTube Channel](https://youtube.com/@volkovlabs).

## 📜 License

This project is licensed under the Apache License Version 2.0. See the [LICENSE](https://github.com/volkovlabs/business-forms/blob/main/LICENSE) file for details.
