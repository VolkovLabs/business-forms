import { cx } from '@emotion/css';
import { InterpolateFunction, PanelData } from '@grafana/data';
import { FieldSet, useTheme2 } from '@grafana/ui';
import { CollapsableSection } from '@volkovlabs/components';
import React from 'react';

import { LayoutOrientation, SectionVariant, TEST_IDS } from '../../constants';
import { ExecuteCustomCodeParams, LayoutSection, LocalFormElement, PanelOptions } from '../../types';
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

  /**
   * Execute Custom Code
   */
  executeCustomCode: (params: ExecuteCustomCodeParams) => Promise<unknown>;

  /**
   * Time Zone
   *
   * @type {string}
   */
  timeZone: string;

  /**
   * Sections
   *
   * @type {string}
   */
  sections: LayoutSection[];
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
  executeCustomCode,
  timeZone,
  sections,
}) => {
  /**
   * Theme and Styles
   */
  const theme = useTheme2();
  const styles = getStyles(theme);

  return (
    <div
      className={cx(styles.root, {
        vertical: options.layout.orientation === LayoutOrientation.VERTICAL,
      })}
    >
      {sections?.map((section, id) => {
        const isOpen = sectionsExpandedState[section.id];

        const renderContainer = (children: React.ReactNode) => {
          if (options.layout.sectionVariant === SectionVariant.COLLAPSABLE) {
            return (
              <CollapsableSection
                headerDataTestId={TEST_IDS.formElementsSection.sectionHeader(section.id, section.name)}
                contentDataTestId={TEST_IDS.formElementsSection.sectionContent(section.id, section.name)}
                isOpen={isOpen}
                onToggle={() => onChangeSectionExpandedState(section.id, !isOpen)}
                label={
                  <>
                    {replaceVariables(section.name)} [{section.id}]
                  </>
                }
              >
                {children}
              </CollapsableSection>
            );
          }

          return <FieldSet label={replaceVariables(section.name)}>{children}</FieldSet>;
        };

        return (
          <div
            key={id}
            className={cx(styles.section, {
              collapsable: options.layout.sectionVariant === SectionVariant.COLLAPSABLE,
            })}
            data-testid={TEST_IDS.panel.splitLayoutContent(section.name)}
          >
            {renderContainer(
              <FormElements
                options={options}
                elements={elements}
                onChangeElement={onChangeElement}
                initial={initial}
                section={section}
                replaceVariables={replaceVariables}
                data={data}
                executeCustomCode={executeCustomCode}
                timeZone={timeZone}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
