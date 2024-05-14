import { InterpolateFunction, PanelData } from '@grafana/data';
import { FieldSet, useTheme2 } from '@grafana/ui';
import { Collapse } from '@volkovlabs/components';
import React from 'react';

import { LayoutCollapse, LayoutOrientation, LayoutVariant, TEST_IDS } from '../../constants';
import { LocalFormElement, PanelOptions } from '../../types';
import { FormElements } from '../FormElements';
import { getStyles } from './ElementSections.styles';

/**
 * Properties
 */
interface Props {
  /**
   * Options
   *
   * @type {PanelOptions}
   */
  options: PanelOptions;

  /**
   * Elements
   *
   * @type {LocalFormElement[]}
   */
  elements: LocalFormElement[];

  /**
   * On Element Change
   *
   */
  onChangeElement: <T extends LocalFormElement>(element: T) => void;

  /**
   * Initial values
   *
   * @type {[id: string]: unknown}
   */
  initial: { [id: string]: unknown };

  /**
   * Template variables interpolation function
   */
  replaceVariables: InterpolateFunction;

  /**
   * Data
   */
  data: PanelData;

  /**
   * Collapse Sections
   */
  expandSectionsState: Record<string, boolean>;

  /**
   * Toggle Sections
   */
  onToggleSection: (id: string) => void;
}

/**
 * Panel
 */
export const ElementSections: React.FC<Props> = ({
  options,
  elements,
  onChangeElement,
  initial,
  replaceVariables,
  data,
  expandSectionsState,
  onToggleSection,
}) => {
  /**
   * Theme and Styles
   */
  const theme = useTheme2();
  const styles = getStyles(theme);

  /**
   * Return
   */
  return options.layout.variant === LayoutVariant.SPLIT && options.layout.orientation !== LayoutOrientation.VERTICAL ? (
    <tr>
      {options.layout?.sections?.map((section, id) => {
        return (
          <td className={styles.td} key={id} data-testid={TEST_IDS.panel.splitLayoutContent(section.name)}>
            <FieldSet label={section.name}>
              <FormElements
                data={data}
                options={options}
                elements={elements}
                onChangeElement={onChangeElement}
                initial={initial}
                section={section}
                replaceVariables={replaceVariables}
              />
            </FieldSet>
          </td>
        );
      })}
    </tr>
  ) : options.layout.collapse === LayoutCollapse.COLLAPSE ? (
    <>
      {options.layout?.sections?.map((section, id) => {
        const isOpen = expandSectionsState[section.id];

        return (
          <tr key={id}>
            <td className={styles.tdCollapse} data-testid={TEST_IDS.panel.splitLayoutContent(section.name)}>
              <Collapse
                fill="solid"
                headerTestId={TEST_IDS.formElementsSection.sectionLabel(section.id, section.name)}
                contentTestId={TEST_IDS.formElementsSection.sectionContent(section.id, section.name)}
                isOpen={isOpen}
                onToggle={() => onToggleSection(section.id)}
                title={
                  <>
                    {section.name} [{section.id}]
                  </>
                }
              >
                <FieldSet label={section.name}>
                  <FormElements
                    options={options}
                    elements={elements}
                    onChangeElement={onChangeElement}
                    initial={initial}
                    section={section}
                    replaceVariables={replaceVariables}
                    data={data}
                  />
                </FieldSet>
              </Collapse>
            </td>
          </tr>
        );
      })}
    </>
  ) : (
    <>
      {options.layout?.sections?.map((section, id) => {
        return (
          <tr key={id}>
            <td className={styles.td} data-testid={TEST_IDS.panel.splitLayoutContent(section.name)}>
              <FieldSet label={section.name}>
                <FormElements
                  options={options}
                  elements={elements}
                  onChangeElement={onChangeElement}
                  initial={initial}
                  section={section}
                  replaceVariables={replaceVariables}
                  data={data}
                />
              </FieldSet>
            </td>
          </tr>
        );
      })}
    </>
  );
};
