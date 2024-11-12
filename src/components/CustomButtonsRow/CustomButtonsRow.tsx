import { InterpolateFunction, PanelData } from '@grafana/data';
import React, { useMemo } from 'react';

import { CustomButtonShow, ExecuteCustomCodeParams, FormElementType, LocalFormElement } from '@/types';

import { CustomButtonElement } from '../FormElement/components';

/**
 * Properties
 */
interface Props {
  /**
   * Elements
   */
  elements: LocalFormElement[];

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
   * Execute Custom Code
   */
  executeCustomCode: (params: ExecuteCustomCodeParams) => Promise<unknown>;
}

/**
 * Custom Buttons Row
 */
export const CustomButtonsRow: React.FC<Props> = ({ elements, initial, replaceVariables, data, executeCustomCode }) => {
  /**
   * Visible Elements
   */
  const visibleElements = useMemo(() => {
    return elements
      .filter((element) => {
        return element.helpers.showIf({ elements, replaceVariables });
      })
      .map((element) => ({
        ...element,
        disabled: element.helpers.disableIf({ elements, replaceVariables }),
        options: element.helpers.getOptions({ elements, replaceVariables, data }),
      }));
  }, [data, elements, replaceVariables]);

  return (
    <>
      {!!visibleElements.length &&
        visibleElements.map((element) => {
          /**
           * Return
           */
          if (element.type === FormElementType.BUTTON && element.show === CustomButtonShow.BOTTOM) {
            return (
              <CustomButtonElement
                key={element.id}
                element={element}
                executeCustomCode={executeCustomCode}
                initial={initial}
                elements={elements}
                replaceVariables={replaceVariables}
              />
            );
          }

          return null;
        })}
    </>
  );
};
