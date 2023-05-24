import React, { ChangeEvent } from 'react';
import { StandardEditorProps } from '@grafana/data';
import { Button, InlineField, InlineFieldRow, Input } from '@grafana/ui';
import { TestIds } from '../../constants';
import { LayoutSection } from '../../types';

/**
 * Properties
 */
interface Props extends StandardEditorProps<LayoutSection[]> {}

/**
 * Layout Section Editor
 */
export const LayoutSectionsEditor: React.FC<Props> = ({ value: sections, onChange }) => {
  if (!sections || !sections.length) {
    sections = [];
  }

  /**
   * Return
   */
  return (
    <div data-testid={TestIds.layoutSectionsEditor.root}>
      {sections.map((section, id) => (
        <InlineFieldRow key={id} data-testid={TestIds.layoutSectionsEditor.section(section.name)}>
          <InlineField label="Name" grow labelWidth={8} invalid={section.name === ''}>
            <Input
              placeholder="name"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                section.name = event.target.value;
                onChange(sections);
              }}
              value={section.name}
              data-testid={TestIds.layoutSectionsEditor.fieldName}
            />
          </InlineField>
          <Button
            variant="secondary"
            onClick={() => {
              sections = sections.filter((s) => s.name !== section.name);
              onChange(sections);
            }}
            icon="trash-alt"
            data-testid={TestIds.layoutSectionsEditor.buttonRemove}
          />
        </InlineFieldRow>
      ))}

      <Button
        variant="secondary"
        onClick={() => {
          sections.push({ name: '' });
          onChange(sections);
        }}
        icon="plus"
        data-testid={TestIds.layoutSectionsEditor.buttonAdd}
      >
        Add Section
      </Button>
    </div>
  );
};
