# Data Manipulation Panel plugin for Grafana

![Form Panel](https://raw.githubusercontent.com/volkovlabs/volkovlabs-form-panel/main/src/img/panel.png)

[![Grafana 9](https://img.shields.io/badge/Grafana-9-orange)](https://www.grafana.com)
![CI](https://github.com/volkovlabs/volkovlabs-form-panel/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/VolkovLabs/volkovlabs-form-panel/branch/main/graph/badge.svg?token=0m6f0ktUar)](https://codecov.io/gh/VolkovLabs/volkovlabs-form-panel)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/VolkovLabs/volkovlabs-form-panel.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/VolkovLabs/volkovlabs-form-panel/context:javascript)

## Introduction

The Data Manipulation Form Panel is a plugin for Grafana that can be used to insert, update application data, and modify configuration directly from your Grafana dashboard.

<iframe width="728" height="410" src="https://www.youtube.com/embed/DXALVG8GijM" title="Data Manipulation Plugin for Grafana | Manual data entering and User input into Dashboard" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>

### Requirements

- **Grafana 8.3+**, **Grafana 9.0+** is required for version 3.X.
- **Grafana 8.0+** is required for version 2.X.

## Getting Started

Data Manipulation panel is under development and not included in the Grafana Marketplace yet. It can be installed manually from our private repository or downloaded directly from the GitHub repository:

```bash
grafana-cli --repo https://volkovlabs.io/plugins plugins install volkovlabs-form-panel
```

## Features

- Provides functionality to create customizable forms with elements:
  - Code Editor
  - Date and Time
  - Read-only (Disabled)
  - Number Input
  - Number Slider
  - Password Input
  - Radio Group with Boolean options
  - Radio Group with Custom options
  - Select with Custom options
  - String Input
  - Text Area
- Supports the Custom Code for Initial and Update requests.
- Allows to specify GET request to get initial values and POST, PUT, PATCH request to send values updated in the form.
- Allows to add Header fields to Initial and Update requests.
- Allows to customize Submit, Reset buttons and form layout.
- Allows to split form elements into sections.
- Allows to request confirmation before update request.

![API](https://raw.githubusercontent.com/volkovlabs/volkovlabs-form-panel/main/img/form-api.png)

## Custom Code

The custom code has access to the Panel options, the response from the REST API call, form elements, various Grafana services and will be executed after the Initial and Update requests. Dashboard variables will be replaced automatically.

Available Parameters:

- `options` - Panels's options.
- `data` - Result set of panel queries.
- `response` - Request's response.
- `elements` - Form Elements.
- `locationService` - Grafana's `locationService` to work with browser location and history.
- `templateService` - Grafana's `templateService` provides access to variables and allows to up Time Range.

![Panel](https://raw.githubusercontent.com/volkovlabs/volkovlabs-form-panel/main/img/request.png)

To learn more about parameters you can log them in the Browser Console:

```javascript
console.log(options, data, response, elements, locationService, templateService);
```

To reload location after successfully update request do:

```
console.log(response);
if (response && response.ok) {
  location.reload();
}
```

## Feedback

We love to hear from users, developers, and the whole community interested in this plugin. These are various ways to get in touch with us:

- Ask a question, request a new feature, and file a bug with [GitHub issues](https://github.com/volkovlabs/volkovlabs-form-panel/issues/new/choose).
- Star the repository to show your support.

## Contributing

- Fork the repository.
- Find an issue to work on and submit a pull request.
- Could not find an issue? Look for documentation, bugs, typos, and missing features.

## License

- Apache License Version 2.0, see [LICENSE](https://github.com/volkovlabs/volkovlabs-form-panel/blob/main/LICENSE).
