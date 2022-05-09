/**
 * Capitalize First Letter
 */
function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Request Methods
 */
export const enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
}

/**
 * Request Method Options
 */
export const RequestMethodOptions = [
  {
    value: RequestMethod.GET,
    label: RequestMethod.GET,
  },
  {
    value: RequestMethod.POST,
    label: RequestMethod.POST,
  },
];

/**
 * Content Types
 */
export const enum ContentType {
  JSON = 'application/json',
  PLAIN = 'text/plain',
}

/**
 * Content Type Options
 */
export const ContentTypeOptions = [
  { label: capitalizeFirstLetter(ContentType.JSON), value: ContentType.JSON },
  { label: capitalizeFirstLetter(ContentType.PLAIN), value: ContentType.PLAIN },
];

/**
 * Button Variants
 */
export const enum ButtonVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  DESTRUCTIVE = 'destructive',
  CUSTOM = 'custom',
}

/**
 * Button Variant
 */
export const ButtonVariantOptions = [
  {
    value: ButtonVariant.PRIMARY,
    label: capitalizeFirstLetter(ButtonVariant.PRIMARY),
  },
  {
    value: ButtonVariant.SECONDARY,
    label: capitalizeFirstLetter(ButtonVariant.SECONDARY),
  },
  {
    value: ButtonVariant.DESTRUCTIVE,
    label: capitalizeFirstLetter(ButtonVariant.DESTRUCTIVE),
  },
  {
    value: ButtonVariant.CUSTOM,
    label: capitalizeFirstLetter(ButtonVariant.CUSTOM),
  },
];

/**
 * Button Orientations
 */
export const enum ButtonOrientation {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right',
}

/**
 * Button Orientation Options
 */
export const ButtonOrientationOptions = [
  {
    value: ButtonOrientation.LEFT,
    label: capitalizeFirstLetter(ButtonOrientation.LEFT),
  },
  {
    value: ButtonOrientation.CENTER,
    label: capitalizeFirstLetter(ButtonOrientation.CENTER),
  },
  {
    value: ButtonOrientation.RIGHT,
    label: capitalizeFirstLetter(ButtonOrientation.RIGHT),
  },
];

/**
 * Input Parameter Type
 */
export const enum InputParameterType {
  NUMBER = 'number',
  STRING = 'string',
  RADIO = 'radio',
  SLIDER = 'slider',
  DROPDOWN = 'dropdown',
}

/**
 * Input Parameter Type Options
 */
export const InputParameterTypeOptions = [
  {
    value: InputParameterType.NUMBER,
    label: capitalizeFirstLetter(InputParameterType.NUMBER),
  },
  {
    value: InputParameterType.STRING,
    label: capitalizeFirstLetter(InputParameterType.STRING),
  },
  {
    value: InputParameterType.RADIO,
    label: capitalizeFirstLetter(InputParameterType.RADIO),
  },
  {
    value: InputParameterType.SLIDER,
    label: capitalizeFirstLetter(InputParameterType.SLIDER),
  },
  {
    value: InputParameterType.DROPDOWN,
    label: capitalizeFirstLetter(InputParameterType.DROPDOWN),
  },
];
