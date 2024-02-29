import { CodeEditorSuggestionItemKind } from '@grafana/ui';

import { CodeParameterItem, CodeParameters } from './code-parameters';

describe('CodeParameters', () => {
  const parameters = new CodeParameters({
    detail: 'all object and methods',
    items: {
      grafana: {
        detail: 'grafana object',
        items: {
          method: new CodeParameterItem<() => null>('grafana method', CodeEditorSuggestionItemKind.Method),
          value: new CodeParameterItem<string>('grafana value', CodeEditorSuggestionItemKind.Property),
        },
      },
      panel: {
        detail: 'panel object',
        items: {
          id: new CodeParameterItem<number>('panel id', CodeEditorSuggestionItemKind.Property),
        },
      },
      element: new CodeParameterItem<HTMLElement>('element', CodeEditorSuggestionItemKind.Property),
    },
  });

  it('Should build suggestions', () => {
    expect(parameters.suggestions).toEqual([
      {
        detail: 'all object and methods',
        kind: CodeEditorSuggestionItemKind.Constant,
        label: 'context',
      },
      {
        detail: 'grafana object',
        kind: CodeEditorSuggestionItemKind.Property,
        label: 'context.grafana',
      },
      {
        detail: 'grafana method',
        kind: CodeEditorSuggestionItemKind.Method,
        label: 'context.grafana.method',
      },
      {
        detail: 'grafana value',
        kind: CodeEditorSuggestionItemKind.Property,
        label: 'context.grafana.value',
      },
      {
        detail: 'panel object',
        kind: CodeEditorSuggestionItemKind.Property,
        label: 'context.panel',
      },
      {
        detail: 'panel id',
        kind: CodeEditorSuggestionItemKind.Property,
        label: 'context.panel.id',
      },
      {
        detail: 'element',
        kind: CodeEditorSuggestionItemKind.Property,
        label: 'context.element',
      },
    ]);
  });

  it('Should validate types', () => {
    const payload = {
      grafana: {
        method: () => null,
        value: 'hello',
      },
      panel: {
        id: 123,
      },
      element: document.createElement('div'),
    };

    expect(parameters.create(payload)).toEqual(payload);
  });
});
