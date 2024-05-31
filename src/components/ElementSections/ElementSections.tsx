import { InterpolateFunction, PanelData } from '@grafana/data';
import { CollapsableSection, FieldSet, useTheme2 } from '@grafana/ui';
import React from 'react';

import { LayoutOrientation, LayoutVariant, SectionVariant, TEST_IDS } from '../../constants';
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
  sectionsExpandedState: Record<string, boolean>;

  /**
   * On Change Section Expanded State
   */
  onChangeSectionExpandedState: (id: string, isExpanded: boolean) => void;
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
  sectionsExpandedState,
  onChangeSectionExpandedState,
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
  ) : options.layout.sectionVariant === SectionVariant.COLLAPSABLE ? (
    <>
      {options.layout?.sections?.map((section, id) => {
        const isOpen = sectionsExpandedState[section.id];

        return (
          <tr key={id}>
            <td className={styles.tdCollapse} data-testid={TEST_IDS.panel.splitLayoutContent(section.name)}>
              <CollapsableSection
                headerDataTestId={TEST_IDS.formElementsSection.sectionLabel(section.id, section.name)}
                contentDataTestId={TEST_IDS.formElementsSection.sectionContent(section.id, section.name)}
                isOpen={isOpen}
                onToggle={() => onChangeSectionExpandedState(section.id, !isOpen)}
                label={
                  <>
                    {section.name} [{section.id}]
                  </>
                }
              >
                <FormElements
                  options={options}
                  elements={elements}
                  onChangeElement={onChangeElement}
                  initial={initial}
                  section={section}
                  replaceVariables={replaceVariables}
                  data={data}
                />
              </CollapsableSection>
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
