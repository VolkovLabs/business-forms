import { AlertPayload, DataQueryResponse, EventBus, PanelData } from '@grafana/data';
import { BackendSrv, FetchResponse, LocationService, TemplateSrv, toDataQueryResponse } from '@grafana/runtime';
import { CodeEditorSuggestionItemKind } from '@grafana/ui';
import { CodeParameterItem, CodeParametersBuilder } from '@volkovlabs/components';

import { FormElement, LayoutSection, LayoutSectionWithElements, LocalFormElement, PanelOptions } from '@/types';

import { fileToBase64 } from './request';

/**
 * Sections Utils
 */
const sectionsUtils = {
  detail: 'Section Helpers',
  items: {
    add: new CodeParameterItem<({ name, id, elements }: { name: string; id: string; elements: string[] }) => void>(
      'Add new Section',
      CodeEditorSuggestionItemKind.Method
    ),
    update: new CodeParameterItem<(sections: LayoutSection[]) => void>(
      'Change sections',
      CodeEditorSuggestionItemKind.Method
    ),
    remove: new CodeParameterItem<(id: string) => void>('Remove section', CodeEditorSuggestionItemKind.Method),
    assign: new CodeParameterItem<(id: string, elements: string[]) => void>(
      'Assign elements to section',
      CodeEditorSuggestionItemKind.Method
    ),
    unassign: new CodeParameterItem<(elements: string[]) => void>(
      'Unassign elements from section',
      CodeEditorSuggestionItemKind.Method
    ),
    get: new CodeParameterItem<(id: string) => LayoutSectionWithElements | undefined>(
      'Get section',
      CodeEditorSuggestionItemKind.Method
    ),
    getAll: new CodeParameterItem<() => LayoutSectionWithElements[]>(
      'Get all sections',
      CodeEditorSuggestionItemKind.Method
    ),
    toggle: new CodeParameterItem<(id: string) => void>('Toggle section', CodeEditorSuggestionItemKind.Method),
    collapse: new CodeParameterItem<(id: string) => void>('Collapse section', CodeEditorSuggestionItemKind.Method),
    expand: new CodeParameterItem<(id: string) => void>('Expand section', CodeEditorSuggestionItemKind.Method),
    expandedState: new CodeParameterItem<Record<string, boolean>>('Sections Expanded State'),
  },
};

/**
 * Request Code Parameters
 */
export const requestCodeParameters = new CodeParametersBuilder({
  detail: 'All properties and methods.',
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
        patchFormValue: new CodeParameterItem<(objectValues: Record<string, unknown>) => void>(
          'Patch panel elements.',
          CodeEditorSuggestionItemKind.Method
        ),
        setFormValue: new CodeParameterItem<(objectValues: Record<string, unknown>) => void>(
          'Set panel elements.',
          CodeEditorSuggestionItemKind.Method
        ),
        formValue: new CodeParameterItem<Record<string, unknown>>(
          'Return current form value.',
          CodeEditorSuggestionItemKind.Method
        ),
        initial: new CodeParameterItem<unknown>('Initial values.'),
        setInitial: new CodeParameterItem<(value: { [id: string]: unknown }) => void>(
          'Allows to specify the initial values.',
          CodeEditorSuggestionItemKind.Method
        ),
        initialRequest: new CodeParameterItem<(() => Promise<void>) | undefined>(
          'Run Initial request.',
          CodeEditorSuggestionItemKind.Method
        ),
        enableSubmit: new CodeParameterItem<() => void>('Enable submit button.', CodeEditorSuggestionItemKind.Method),
        disableSubmit: new CodeParameterItem<() => void>('Disable submit button.', CodeEditorSuggestionItemKind.Method),
        response: new CodeParameterItem<FetchResponse | Response | DataQueryResponse | null | undefined>(
          'Response object.'
        ),
        sectionsUtils,
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
      detail: 'Utils and helpers functions.',
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
export const elementValueChangedCodeParameters = new CodeParametersBuilder({
  detail: 'All properties and methods.',
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
        patchFormValue: new CodeParameterItem<(objectValues: Record<string, unknown>) => void>(
          'Patch panel elements.',
          CodeEditorSuggestionItemKind.Method
        ),
        setFormValue: new CodeParameterItem<(objectValues: Record<string, unknown>) => void>(
          'Set panel elements.',
          CodeEditorSuggestionItemKind.Method
        ),
        formValue: new CodeParameterItem<() => Record<string, unknown>>(
          'Return current form value.',
          CodeEditorSuggestionItemKind.Method
        ),
        initial: new CodeParameterItem<unknown>('Initial values.'),
        initialRequest: new CodeParameterItem<(() => Promise<void>) | undefined>(
          'Run Initial request.',
          CodeEditorSuggestionItemKind.Method
        ),
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
        sectionsUtils,
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
      detail: 'Utils and helpers functions.',
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
export const showIfCodeParameters = new CodeParametersBuilder({
  detail: 'All properties and methods.',
  items: {
    panel: {
      detail: 'Panel instance properties.',
      items: {
        elements: new CodeParameterItem<FormElement[]>('Panel elements.'),
      },
    },
  },
});

/**
 * Disable If Code Parameters
 */
export const disableIfCodeParameters = new CodeParametersBuilder({
  detail: 'All properties and methods.',
  items: {
    panel: {
      detail: 'Panel instance properties.',
      items: {
        elements: new CodeParameterItem<FormElement[]>('Panel elements.'),
      },
    },
  },
});

/**
 * Get Options Code Parameters
 */
export const getOptionsCodeParameters = new CodeParametersBuilder({
  detail: 'All properties and methods.',
  items: {
    panel: {
      detail: 'Panel instance properties.',
      items: {
        data: new CodeParameterItem<PanelData>('Panel data.'),
        elements: new CodeParameterItem<FormElement[]>('Panel elements.'),
      },
    },
  },
});

/**
 * Get Payload Code Parameters
 */
export const getPayloadCodeParameters = new CodeParametersBuilder({
  detail: 'All properties and methods.',
  items: {
    panel: {
      detail: 'Panel instance properties.',
      items: {
        initial: new CodeParameterItem<unknown>('Initial values.'),
        elements: new CodeParameterItem<LocalFormElement[]>('Panel elements.'),
      },
    },
    utils: {
      detail: 'Utils and helpers functions.',
      items: {
        fileToBase64: new CodeParameterItem<typeof fileToBase64>(
          'Converts File to Base64 string.',
          CodeEditorSuggestionItemKind.Method
        ),
      },
    },
  },
});
