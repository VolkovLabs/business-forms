import { StandardEditorProps } from '@grafana/data';
import { Button, Checkbox, InlineField, InlineFieldRow, Input, useStyles2 } from '@grafana/ui';
import React, { ChangeEvent, useCallback, useMemo } from 'react';

import { LayoutOrientation, SectionVariant, TEST_IDS } from '../../constants';
import { useFormElements } from '../../hooks';
import { LayoutSection, PanelOptions } from '../../types';
import { isSectionCollisionExists } from '../../utils';
import { getStyles } from './LayoutSectionsEditor.styles';

/**
 * Properties
 */
type Props = StandardEditorProps<LayoutSection[] | undefined, null, PanelOptions>;

/**
 * Layout Section Editor
 */
export const LayoutSectionsEditor: React.FC<Props> = ({ value, onChange, context }) => {
  /**
   * Styles
   */
  const styles = useStyles2(getStyles);

  /**
   * Sections
   */
  const { sections, onChangeSections } = useFormElements({
    onChangeSectionsOption: onChange,
    layoutSections: value,
  });

  /**
   * Change Section
   */
  const onChangeSection = useCallback(
    (updatedSection: LayoutSection, id = updatedSection.id) => {
      onChangeSections(sections.map((section) => (section.id === id ? updatedSection : section)));
    },
    [onChangeSections, sections]
  );

  /**
   * Remove Section
   */
  const onRemoveSection = useCallback(
    (removedSection: LayoutSection) => {
      onChangeSections(sections.filter((section) => section.id !== removedSection.id));
    },
    [onChangeSections, sections]
  );

  /**
   * Is Adding Disabled
   */
  const isAddingDisabled = useMemo(() => {
    return sections.some((section) => section.id === '');
  }, [sections]);

  /**
   * Is Expanded Field Shown
   */
  const isExpandedFieldShown =
    context.options?.layout.orientation === LayoutOrientation.VERTICAL &&
    context.options?.layout.sectionVariant === SectionVariant.COLLAPSABLE;

  /**
   * Return
   */
  return (
    <div data-testid={TEST_IDS.layoutSectionsEditor.root}>
      {sections.map((section, id) => (
        <InlineFieldRow
          key={id}
          data-testid={TEST_IDS.layoutSectionsEditor.section(section.id)}
          className={styles.item}
        >
          <InlineField label="Id" grow invalid={section.id === ''}>
            <Input
              placeholder="id"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                const updatedSection = {
                  ...section,
                  id: event.target.value || '',
                };
                const isValid = !isSectionCollisionExists(sections, updatedSection);

                if (isValid) {
                  onChangeSection(updatedSection, section.id);
                }
              }}
              value={section.id}
              data-testid={TEST_IDS.layoutSectionsEditor.fieldId}
            />
          </InlineField>
          <InlineField label="Name" grow>
            <Input
              placeholder="name"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                onChangeSection({
                  ...section,
                  name: event.target.value,
                });
              }}
              value={section.name}
              data-testid={TEST_IDS.layoutSectionsEditor.fieldName}
            />
          </InlineField>
          {isExpandedFieldShown && (
            <div className={styles.checkbox}>
              <Checkbox
                label="Expanded"
                value={section.expanded}
                onClick={(event) => {
                  onChangeSection({
                    ...section,
                    expanded: event.currentTarget.checked,
                  });
                }}
                aria-label={TEST_IDS.layoutSectionsEditor.fieldExpanded}
              />
            </div>
          )}
          <Button
            variant="secondary"
            onClick={() => {
              onRemoveSection(section);
            }}
            icon="trash-alt"
            data-testid={TEST_IDS.layoutSectionsEditor.buttonRemove}
          />
        </InlineFieldRow>
      ))}

      <Button
        variant="secondary"
        onClick={() => {
          onChangeSections(
            sections.concat({
              id: '',
              name: '',
            })
          );
        }}
        icon="plus"
        data-testid={TEST_IDS.layoutSectionsEditor.buttonAdd}
        disabled={isAddingDisabled}
      >
        Add Section
      </Button>
    </div>
  );
};
