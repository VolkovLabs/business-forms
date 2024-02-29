import { AlertPayload, EventBus, InterpolateFunction, PanelData } from '@grafana/data';
import { BackendSrv, FetchResponse, LocationService, TemplateSrv, toDataQueryResponse } from '@grafana/runtime';
import { CodeEditorSuggestionItem, CodeEditorSuggestionItemKind } from '@grafana/ui';

import { FormElement, LocalFormElement, PanelOptions } from '../types';
import { fileToBase64 } from './request';

/**
 * Code Parameter Group
 */
interface CodeParameterGroup {
  /**
   * Detail
   *
   * @type {string}
   */
  detail: string;

  /**
   * Items
   */
  items: Record<string, CodeParameterGroup | CodeParameterItem>;
}

/**
 * Parameter Item
 */
export class CodeParameterItem<TValue = unknown> {
  /**
   * Specify for type validation
   */
  value: TValue = {} as TValue;

  constructor(
    public detail: string,
    public kind: CodeEditorSuggestionItemKind = CodeEditorSuggestionItemKind.Property
  ) {}
}

/**
 * Convert group to payload object
 */
type PayloadForGroup<TGroup extends CodeParameterGroup> = {
  [Key in keyof TGroup['items']]: TGroup['items'][Key] extends CodeParameterGroup
    ? PayloadForGroup<TGroup['items'][Key]>
    : TGroup['items'][Key] extends CodeParameterItem
      ? TGroup['items'][Key]['value']
      : unknown;
};

/**
 * Code Parameters
 */
export class CodeParameters<TGroup extends CodeParameterGroup> {
  /**
   * Built Suggestions based on config
   */
  suggestions: CodeEditorSuggestionItem[] = [];

  constructor(group: TGroup, basePath = 'context') {
    /**
     * Add base suggestion
     */
    this.suggestions.push({
      label: basePath,
      kind: CodeEditorSuggestionItemKind.Constant,
      detail: group.detail,
    });

    /**
     * Add all suggestions
     */
    this.addSuggestions(basePath, group);
  }

  /**
   * Add suggestions
   * @param path
   * @param group
   * @private
   */
  private addSuggestions(path: string, group: CodeParameterGroup) {
    Object.entries(group.items).forEach(([key, item]) => {
      const itemPath = `${path}.${key}`;

      /**
       * Group
       */
      if ('items' in item) {
        this.suggestions.push({
          label: itemPath,
          detail: item.detail,
          kind: CodeEditorSuggestionItemKind.Property,
        });

        this.addSuggestions(itemPath, item);

        return;
      }

      /**
       * Item
       */
      this.suggestions.push({
        label: itemPath,
        detail: item.detail,
        kind: item.kind,
      });
    });
  }

  /**
   * Create payload method for type validation
   * @param payload
   */
  create(payload: PayloadForGroup<TGroup>) {
    return payload;
  }
}

/**
 * Request Code Parameters
 */
export const requestCodeParameters = new CodeParameters({
  detail: 'All passed possible properties and methods.',
  items: {
    panel: {
      detail: 'Panel instance properties.',
      items: {
        data: new CodeParameterItem<PanelData>('Panel data.'),
        options: new CodeParameterItem<PanelOptions>('Panel options.'),
        onOptionsChange: new CodeParameterItem<(options: PanelOptions) => void>(
          'Update panel options on dashboard.',
          CodeEditorSuggestionItemKind.Method
        ),
        elements: new CodeParameterItem<LocalFormElement[]>('Panel elements.'),
        onChangeElements: new CodeParameterItem<(elements: LocalFormElement[]) => void>(
          'Update panel elements.',
          CodeEditorSuggestionItemKind.Method
        ),
        initial: new CodeParameterItem<unknown>('Initial values.'),
        setInitial: new CodeParameterItem<(value: { [id: string]: unknown }) => void>(
          'Allows to specify the initial values.',
          CodeEditorSuggestionItemKind.Method
        ),
        initialRequest: new CodeParameterItem<(() => Promise<void>) | undefined>(
          'Run Initial Request.',
          CodeEditorSuggestionItemKind.Method
        ),
        enableSubmit: new CodeParameterItem<() => void>('Enable submit button.', CodeEditorSuggestionItemKind.Method),
        disableSubmit: new CodeParameterItem<() => void>('Disable submit button.', CodeEditorSuggestionItemKind.Method),
        response: new CodeParameterItem<FetchResponse | Response | null | undefined>('Response object.'),
      },
    },
    grafana: {
      detail: 'Grafana properties and methods.',
      items: {
        backendService: new CodeParameterItem<BackendSrv>('Backend service.'),
        locationService: new CodeParameterItem<LocationService>('Location service.'),
        templateService: new CodeParameterItem<TemplateSrv>('Template variables service.'),
        notifyError: new CodeParameterItem<(payload: AlertPayload) => void>(
          'Show error notification.',
          CodeEditorSuggestionItemKind.Method
        ),
        notifySuccess: new CodeParameterItem<(payload: AlertPayload) => void>(
          'Show success notification.',
          CodeEditorSuggestionItemKind.Method
        ),
        notifyWarning: new CodeParameterItem<(payload: AlertPayload) => void>(
          'Show warning notification.',
          CodeEditorSuggestionItemKind.Method
        ),
        eventBus: new CodeParameterItem<EventBus>('Panels events.'),
        appEvents: new CodeParameterItem<EventBus>('Application events.'),
        refresh: new CodeParameterItem<() => void>('Refresh dashboard.', CodeEditorSuggestionItemKind.Method),
      },
    },
    utils: {
      detail: 'Utils/helpers functions.',
      items: {
        toDataQueryResponse: new CodeParameterItem<typeof toDataQueryResponse>(
          'Parse the results from /api/ds/query.',
          CodeEditorSuggestionItemKind.Method
        ),
        fileToBase64: new CodeParameterItem<typeof fileToBase64>(
          'Converts File to Base64 string.',
          CodeEditorSuggestionItemKind.Method
        ),
      },
    },
  },
});

/**
 * Element Value Changed Code Parameters
 */
export const elementValueChangedCodeParameters = new CodeParameters({
  detail: 'All passed possible properties and methods.',
  items: {
    panel: {
      detail: 'Panel instance properties.',
      items: {
        data: new CodeParameterItem<PanelData>('Panel data.'),
        options: new CodeParameterItem<PanelOptions>('Panel options.'),
        onOptionsChange: new CodeParameterItem<(options: PanelOptions) => void>(
          'Update panel options on dashboard.',
          CodeEditorSuggestionItemKind.Method
        ),
        elements: new CodeParameterItem<LocalFormElement[]>('Panel elements.'),
        onChangeElements: new CodeParameterItem<(elements: LocalFormElement[]) => void>(
          'Update panel elements.',
          CodeEditorSuggestionItemKind.Method
        ),
        initial: new CodeParameterItem<unknown>('Initial values.'),
        enableSubmit: new CodeParameterItem<() => void>('Enable submit button.', CodeEditorSuggestionItemKind.Method),
        disableSubmit: new CodeParameterItem<() => void>('Disable submit button.', CodeEditorSuggestionItemKind.Method),
        setError: new CodeParameterItem<(error: string) => void>(
          'Set panel error.',
          CodeEditorSuggestionItemKind.Method
        ),
        enableReset: new CodeParameterItem<() => void>('Enable reset button.', CodeEditorSuggestionItemKind.Method),
        disableReset: new CodeParameterItem<() => void>('Disable reset button.', CodeEditorSuggestionItemKind.Method),
        enableSaveDefault: new CodeParameterItem<() => void>(
          'Enable save default button.',
          CodeEditorSuggestionItemKind.Method
        ),
        disableSaveDefault: new CodeParameterItem<() => void>(
          'Disable save default button.',
          CodeEditorSuggestionItemKind.Method
        ),
      },
    },
    grafana: {
      detail: 'Grafana properties and methods.',
      items: {
        locationService: new CodeParameterItem<LocationService>('Location service.'),
        templateService: new CodeParameterItem<TemplateSrv>('Template variables service.'),
        notifyError: new CodeParameterItem<(payload: AlertPayload) => void>(
          'Show error notification.',
          CodeEditorSuggestionItemKind.Method
        ),
        notifySuccess: new CodeParameterItem<(payload: AlertPayload) => void>(
          'Show success notification.',
          CodeEditorSuggestionItemKind.Method
        ),
        notifyWarning: new CodeParameterItem<(payload: AlertPayload) => void>(
          'Show warning notification.',
          CodeEditorSuggestionItemKind.Method
        ),
        eventBus: new CodeParameterItem<EventBus>('Panels events.'),
        appEvents: new CodeParameterItem<EventBus>('Application events.'),
        refresh: new CodeParameterItem<() => void>('Refresh dashboard.', CodeEditorSuggestionItemKind.Method),
      },
    },
    utils: {
      detail: 'Utils/helpers functions.',
      items: {
        toDataQueryResponse: new CodeParameterItem<typeof toDataQueryResponse>(
          'Parse the results from /api/ds/query.',
          CodeEditorSuggestionItemKind.Method
        ),
      },
    },
    element: new CodeParameterItem<LocalFormElement>('Form Element which value has been changed.'),
  },
});

/**
 * Show If Code Parameters
 */
export const showIfCodeParameters = new CodeParameters({
  detail: 'All passed possible properties and methods.',
  items: {
    panel: {
      detail: 'Panel instance properties.',
      items: {
        elements: new CodeParameterItem<FormElement[]>('Panel elements.'),
      },
    },
    grafana: {
      detail: 'Grafana properties and methods.',
      items: {
        replaceVariables: new CodeParameterItem<InterpolateFunction>(
          'Interpolate variables.',
          CodeEditorSuggestionItemKind.Method
        ),
      },
    },
  },
});

/**
 * Disable If Code Parameters
 */
export const disableIfCodeParameters = new CodeParameters({
  detail: 'All passed possible properties and methods.',
  items: {
    panel: {
      detail: 'Panel instance properties.',
      items: {
        elements: new CodeParameterItem<FormElement[]>('Panel elements.'),
      },
    },
    grafana: {
      detail: 'Grafana properties and methods.',
      items: {
        replaceVariables: new CodeParameterItem<InterpolateFunction>(
          'Interpolate variables.',
          CodeEditorSuggestionItemKind.Method
        ),
      },
    },
  },
});

/**
 * Get Options Code Parameters
 */
export const getOptionsCodeParameters = new CodeParameters({
  detail: 'All passed possible properties and methods.',
  items: {
    panel: {
      detail: 'Panel instance properties.',
      items: {
        data: new CodeParameterItem<PanelData>('Panel data.'),
        elements: new CodeParameterItem<FormElement[]>('Panel elements.'),
      },
    },
    grafana: {
      detail: 'Grafana properties and methods.',
      items: {
        replaceVariables: new CodeParameterItem<InterpolateFunction>(
          'Interpolate variables.',
          CodeEditorSuggestionItemKind.Method
        ),
      },
    },
  },
});

/**
 * Get Payload Code Parameters
 */
export const getPayloadCodeParameters = new CodeParameters({
  detail: 'All passed possible properties and methods.',
  items: {
    panel: {
      detail: 'Panel instance properties.',
      items: {
        initial: new CodeParameterItem<unknown>('Initial values.'),
        elements: new CodeParameterItem<LocalFormElement[]>('Panel elements.'),
      },
    },
    utils: {
      detail: 'Utils/helpers functions.',
      items: {
        fileToBase64: new CodeParameterItem<typeof fileToBase64>(
          'Converts File to Base64 string.',
          CodeEditorSuggestionItemKind.Method
        ),
      },
    },
  },
});
