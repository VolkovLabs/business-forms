# Data Manipulation Panel plugin for Grafana

![Form Panel](https://raw.githubusercontent.com/volkovlabs/volkovlabs-form-panel/main/src/img/panel.png)

[![Grafana 9](https://img.shields.io/badge/Grafana-9.0.6-orange)](https://www.grafana.com)
![CI](https://github.com/volkovlabs/volkovlabs-form-panel/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/VolkovLabs/volkovlabs-form-panel/branch/main/graph/badge.svg?token=0m6f0ktUar)](https://codecov.io/gh/VolkovLabs/volkovlabs-form-panel)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/VolkovLabs/volkovlabs-form-panel.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/VolkovLabs/volkovlabs-form-panel/context:javascript)

## Introduction

The Data Manipulation Form Panel is a plugin for Grafana that can be used to insert, update application data, and modify configuration directly from your Grafana dashboard.

[![Data Manipulation Plugin for Grafana | Manual data entering and User input into Dashboard](https://raw.githubusercontent.com/volkovlabs/volkovlabs-form-panel/main/img/video.png)](https://youtu.be/DXALVG8GijM)

### Requirements

- **Grafana 8.5+**, **Grafana 9.0+** is required for version 2.X.
- **Grafana 8.0+** is required for version 1.X.

## Getting Started

Data Manipulation panel is not included in the Grafana Marketplace. It can be installed manually from our Private Repository or downloaded directly from the GitHub repository:

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

- `options` - Panels' options.
- `data` - Result set of panel queries.
- `response` - Request's response.
- `elements` - Form Elements.
- `locationService` - Grafana's `locationService` to work with browser location and history.
- `templateService` - Grafana's `templateService` provides access to variables and allows to up Time Range.
- `onOptionsChange` - Panel options Change handler.

![Panel](https://raw.githubusercontent.com/volkovlabs/volkovlabs-form-panel/main/src/img/request.png)

To learn more about parameters you can log them in the Browser Console:

```javascript
console.log(options, data, response, elements, locationService, templateService);
```

For example, to reload location after update request do:

```
console.log(response);
if (response && response.ok) {
  location.reload();
}
```

Clear elements' values after Submit or on Reset button click:

```
elements.map((element) => {
   if (element.id === 'name') {
     element.value = '';
   };
})
```

## Dynamic form elements

Using the custom code you can update elements or element's value and options from any data source.

[![Static and dynamic interface elements of Data Manipulation plugin | DML using data source in Grafana](https://raw.githubusercontent.com/volkovlabs/volkovlabs-form-panel/main/img/elements.png)](https://youtu.be/RSVH1bSBNl8)

For example, to fill options of the `icon` Select element from series `icons` with `icon_id` and `title` columns.

```
const icons = data.series.find((serie) => serie.refId === 'icons');
const iconSelect = elements.find((element) => element.id === 'icon');

if (icons?.fields.length) {
  const ids = icons.fields.find((f) => f.name === 'icon_id').values.buffer;
  const titles = icons.fields.find((f) => f.name === 'title').values.buffer;

  iconSelect.options = titles.map((value, index) => { return { label: value, value: ids[index] } });
}
```

## NGINX

We recommend running Grafana behind NGINX reverse proxy for an additional security layer. The reverse proxy also allows us to expose additional API endpoints and static files in the same domain, which makes it CORS-ready.

![NGINX](https://raw.githubusercontent.com/volkovlabs/volkovlabs-form-panel/main/img/form-nginx-api.png)

Read more in [How to connect the Data Manipulation plugin for Grafana to API Server](https://volkovlabs.com/how-to-connect-the-data-manipulation-plugin-for-grafana-to-api-server-1abe5f60c904).

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
