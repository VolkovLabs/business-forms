import React, { ChangeEvent, useCallback, useMemo } from 'react';
import { StandardEditorProps } from '@grafana/data';
import { Button, InlineField, InlineFieldRow, Input } from '@grafana/ui';
import { TestIds } from '../../constants';
import { LayoutSection } from '../../types';
import { GetLayoutUniqueId, IsSectionCollisionExists } from '../../utils';

/**
 * Properties
 */
interface Props extends StandardEditorProps<LayoutSection[] | undefined> {}

/**
 * Layout Section Editor
 */
export const LayoutSectionsEditor: React.FC<Props> = ({ value, onChange }) => {
  /**
   * Sections
   */
  const sections = useMemo(() => {
    if (Array.isArray(value)) {
      return value.map((section) => ({
        ...section,
        id: GetLayoutUniqueId(section),
      }));
    }
    return [];
  }, [value]);

  /**
   * Change Section
   */
  const onChangeSection = useCallback(
    (updatedSection: LayoutSection, id = updatedSection.id) => {
      onChange(sections.map((section) => (section.id === id ? updatedSection : section)));
    },
    [onChange, sections]
  );

  /**
   * Remove Section
   */
  const onRemoveSection = useCallback(
    (removedSection: LayoutSection) => {
      onChange(sections.filter((section) => section.id !== removedSection.id));
    },
    [onChange, sections]
  );

  /**
   * Is Adding Disabled
   */
  const isAddingDisabled = useMemo(() => {
    return sections.some((section) => section.id === '');
  }, [sections]);

  /**
   * Return
   */
  return (
    <div data-testid={TestIds.layoutSectionsEditor.root}>
      {sections.map((section, id) => (
        <InlineFieldRow key={id} data-testid={TestIds.layoutSectionsEditor.section(section.id)}>
          <InlineField label="Id" grow labelWidth={8} invalid={section.id === ''}>
            <Input
              placeholder="id"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                const updatedSection = {
                  ...section,
                  id: event.target.value || '',
                };
                const isValid = !IsSectionCollisionExists(sections, updatedSection);

                if (isValid) {
                  onChangeSection(updatedSection, section.id);
                }
              }}
              value={section.id}
              data-testid={TestIds.layoutSectionsEditor.fieldId}
            />
          </InlineField>
          <InlineField label="Name" grow labelWidth={8}>
            <Input
              placeholder="name"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                onChangeSection({
                  ...section,
                  name: event.target.value,
                });
              }}
              value={section.name}
              data-testid={TestIds.layoutSectionsEditor.fieldName}
            />
          </InlineField>
          <Button
            variant="secondary"
            onClick={() => {
              onRemoveSection(section);
            }}
            icon="trash-alt"
            data-testid={TestIds.layoutSectionsEditor.buttonRemove}
          />
        </InlineFieldRow>
      ))}

      <Button
        variant="secondary"
        onClick={() => {
          onChange(
            sections.concat({
              id: '',
              name: '',
            })
          );
        }}
        icon="plus"
        data-testid={TestIds.layoutSectionsEditor.buttonAdd}
        disabled={isAddingDisabled}
      >
        Add Section
      </Button>
    </div>
  );
};
