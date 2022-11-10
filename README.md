# Data Manipulation Panel for Grafana

![Form Panel](https://raw.githubusercontent.com/volkovlabs/volkovlabs-form-panel/main/src/img/panel.png)

[![Grafana](https://img.shields.io/badge/Grafana-9.2.2-orange)](https://www.grafana.com)
[![YouTube](https://img.shields.io/badge/YouTube-Playlist-red)](https://www.youtube.com/playlist?list=PLPow72ygztmRXSNBxyw0sFnnvNRY_CsSA)
![CI](https://github.com/volkovlabs/volkovlabs-form-panel/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/VolkovLabs/volkovlabs-form-panel/branch/main/graph/badge.svg?token=0m6f0ktUar)](https://codecov.io/gh/VolkovLabs/volkovlabs-form-panel)

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
- Allows to send all or only updated elements in the Payload.
- Allows to display Success and Error notifications from the Custom Code.
- Supports Code Editor suggestions for Available Parameters.

## Architecture

[![How to Manipulate Data using Grafana dashboard | API Node.js Server and Deno Deploy Project](https://raw.githubusercontent.com/volkovlabs/volkovlabs-form-panel/main/img/server.png)](https://youtu.be/SHN2S-dRIEM)

### Diagram

![API](https://raw.githubusercontent.com/volkovlabs/volkovlabs-form-panel/main/img/form-api.png)

## Custom Code

The custom code has access to the Panel options, the response from the REST API call, form elements, various Grafana services and will be executed after the Initial and Update requests.

### Available Parameters

- `options` - Panels' options.
- `data` - Result set of panel queries.
- `response` - Request's response.
- `initial` - Parsed values from the Initial Request.
- `elements` - Form Elements.
- `locationService` - Grafana's `locationService` to work with browser location and history.
- `templateService` - Grafana's `templateService` provides access to variables and allows to update Time Range.
- `onOptionsChange()` - Change handler to refresh panel.
- `initialRequest()` - Perform the Initial Request to reload panel.
- `setInitial({})` - Allows to specify the initial values for Custom Initial Requests to `Highlight changed values` and `Require Confirmation`.
- `notifySuccess(['Header', 'Message'])` - Display successful notification.
- `notifyError(['Header', 'Error Message'])` - Display error notification.

![Panel](https://raw.githubusercontent.com/volkovlabs/volkovlabs-form-panel/main/src/img/request.png)

To learn more about parameters you can log them in the Browser Console:

```javascript
console.log(options, data, response, elements, locationService, templateService);
```

### Refresh Dashboard after update request or show error

```javascript
if (response && response.ok) {
  notifySuccess(['Update', 'Values updated successfully.']);
  locationService.reload();
} else {
  notifyError(['Update', `An error occured updating values: ${response.status}`]);
}
```

### Update variable after update request to interact with other panels

```javascript
if (response && response.ok) {
  response.json().then((resp) => {
    locationService.partial({ 'var-name': resp['name'] }, true);
  });
}
```

### Perform Initial Request after update request or show error

```javascript
if (response && response.ok) {
  notifySuccess(['Update', 'Values updated successfully.']);
  initialRequest();
} else {
  notifyError(['Update', `An error occured updating values: ${response.status}`]);
}
```

### Clear elements' values after Submit or on Reset button click

```javascript
elements.map((element) => {
  if (element.id === 'name') {
    element.value = '';
  }
});

onOptionsChange(options);
```

`onOptionsChange` handler is required to update the panel.

## Dashboard Variables

Dashboard and Global variables will be replaced automatically in:

- URL for Initial and Update requests
- Header Parameters' values
- Request body, which contains elements' values

You can find [global built-in variables](https://grafana.com/docs/grafana/latest/variables/variable-types/global-variables/) in the Grafana documentation.

## Dynamic form elements

Using the custom code you can update elements or element's value and options from any data source.

[![Static and dynamic interface elements of Data Manipulation plugin | DML using data source in Grafana](https://raw.githubusercontent.com/volkovlabs/volkovlabs-form-panel/main/img/elements.png)](https://youtu.be/RSVH1bSBNl8)

### Fill options of the `icon` element from series `icons` with `icon_id` and `title` columns

```javascript
const icons = data.series.find((serie) => serie.refId === 'icons');
const iconSelect = elements.find((element) => element.id === 'icon');

if (icons?.fields.length) {
  const ids = icons.fields.find((f) => f.name === 'icon_id').values.buffer;
  const titles = icons.fields.find((f) => f.name === 'title').values.buffer;

  iconSelect.options = titles.map((value, index) => {
    return { label: value, value: ids[index] };
  });
}

onOptionsChange(options);
```

### Update all form elements from data sources

```javascript
const feedback = data.series.find((serie) => serie.refId === 'Feedback');
const typeOptions = data.series.find((serie) => serie.refId === 'Types');

if (feedback?.fields.length) {
  const ids = feedback.fields.find((f) => f.name === 'id').values.buffer;
  const titles = feedback.fields.find((f) => f.name === 'title').values.buffer;
  const types = feedback.fields.find((f) => f.name === 'type').values.buffer;

  /**
   * Set Elements
   */
  elements = ids.map((id, index) => {
    return { id, title: titles[index], type: types[index] };
  });

  /**
   * Find Type element
   */
  const typeSelect = elements.find((element) => element.id === 'type');
  if (typeSelect && typeOptions?.fields.length) {
    const labels = typeOptions.fields.find((f) => f.name === 'label').values.buffer;
    const values = typeOptions.fields.find((f) => f.name === 'value').values.buffer;

    /**
     * Update Types
     */
    typeSelect.options = labels.map((label, index) => {
      return { label, value: values[index] };
    });
  }

  /**
   * Update Panel Options
   */
  onOptionsChange({ ...options, elements });
}
```

## Custom Requests

Data Manipulation panel allows to create your own Initial and Update requests using Custom Code.

### Initial Request

Select Initial Request as `-` and set Custom Code:

```javascript
const bucketsSelect = elements.find((element) => element.id === 'buckets');

/**
 * Set URL
 */
const url = `http://localhost:3001/test`;

/**
 * Fetch
 */
const resp = fetch(url, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'PRIVATE-TOKEN': '$token',
  },
})
  .catch((error) => {
    console.error(error);
  })
  .then(async (resp) => {
    const body = await resp.json();

    bucketsSelect.options = body.buckets.map((value) => {
      return { label: value, value };
    });

    onOptionsChange(options);
  });
```

To support `Highlight changed values` and `Require Confirmation` the Custom Code should use `setInitial({})` function to update `initial` values:

```
  setInitial({value: 99, name: 'Test'})
```

### Update Request

Select Update Request as `-` and set Custom Code. Depends on the selected Payload options it will add all or only updated values.

```javascript
/**
 * Set body
 */
const body = {};
options.elements.forEach((element) => {
  if (!options.update.updatedOnly) {
    body[element.id] = element.value;
    return;
  }

  /**
   * Skip not updated elements
   */
  if (element.value === initial[element.id]) {
    return;
  }

  body[element.id] = element.value;
});

/**
 * Set URL
 */
const url = `http://localhost:3001/${body['name']}`;

/**
 * Fetch
 */
const resp = fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'PRIVATE-TOKEN': '$token',
  },
  body: JSON.stringify(body),
})
  .catch((error) => {
    console.error(error);
  })
  .then((resp) => {
    console.log(resp);
  });
```

## NGINX

We recommend running Grafana behind NGINX reverse proxy for an additional security layer. The reverse proxy also allows us to expose additional API endpoints and static files in the same domain, which makes it CORS-ready.

![NGINX](https://raw.githubusercontent.com/volkovlabs/volkovlabs-form-panel/main/img/form-nginx-api.png)

Read more in [How to connect the Data Manipulation plugin for Grafana to API Server](https://volkovlabs.com/how-to-connect-the-data-manipulation-plugin-for-grafana-to-api-server-1abe5f60c904).

## Feedback

We love to hear from users, developers, and the whole community interested in this plugin. These are various ways to get in touch with us:

- Ask a question, request a new feature, and file a bug with [GitHub issues](https://github.com/volkovlabs/volkovlabs-form-panel/issues/new/choose).
- Sponsor our open-source plugins for Grafana with [GitHub Sponsor](https://github.com/sponsors/VolkovLabs).
- Star the repository to show your support.

## License

- Apache License Version 2.0, see [LICENSE](https://github.com/volkovlabs/volkovlabs-form-panel/blob/main/LICENSE).
