import React, { ChangeEvent } from 'react';
import { StandardEditorProps } from '@grafana/data';
import { Button, InlineField, InlineFieldRow, Input } from '@grafana/ui';
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
    <div>
      {sections.map((section, id) => (
        <InlineFieldRow key={id}>
          <InlineField label="Name" grow labelWidth={8}>
            <Input
              placeholder="name"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                section.name = event.target.value;
                onChange(sections);
              }}
              value={section.name}
            />
          </InlineField>
          <Button
            variant="secondary"
            onClick={(e) => {
              sections = sections?.filter((s) => s.name !== section.name);
              onChange(sections);
            }}
            icon="minus"
          ></Button>
        </InlineFieldRow>
      ))}

      <Button
        variant="secondary"
        onClick={(e) => {
          if (sections) {
            sections.push({ name: '' });
          } else {
            sections = [{ name: '' }];
          }

          onChange(sections);
        }}
        icon="plus"
      >
        Add Section
      </Button>
    </div>
  );
};
