import { dateTime } from '@grafana/data';
import React, { useState } from 'react';

const actual = jest.requireActual('@grafana/ui');

/**
 * Mock Code Editor
 */
const CodeEditorMock = ({ onBlur, getSuggestions, ...restProps }: any) => {
  return (
    <input
      aria-label={restProps['aria-label']}
      value={restProps.value}
      autoComplete={getSuggestions?.()}
      onChange={(event) => {
        if (onBlur) {
          onBlur(event.target.value);
        }
      }}
      onBlur={(event) => {
        if (onBlur) {
          onBlur(event.target.value);
        }
      }}
    />
  );
};

const CodeEditor = jest.fn(CodeEditorMock);

/**
 * Mock PageToolbar component, especially for test AutosizeCodeEditor editor component
 */
const PageToolbarMock = ({ leftItems, children }: any) => {
  return (
    <>
      {leftItems}
      {children}
    </>
  );
};

const PageToolbar = jest.fn(PageToolbarMock);

/**
 * Mock ColorPickerInput component
 */
const ColorPickerMock = ({ onChange, value, ...restProps }: any) => {
  return (
    <input
      data-testid={restProps['data-testid']}
      value={value}
      onChange={(event) => {
        if (onChange) {
          onChange(event.target.value);
        }
      }}
    />
  );
};

const ColorPicker = jest.fn(ColorPickerMock);
const ColorPickerInput = jest.fn(ColorPickerMock);

/**
 * Mock DatetimePicker component
 */
const DateTimePickerMock = ({ onChange, ...restProps }: any) => {
  return (
    <input
      data-testid={restProps['data-testid']}
      value={restProps.value}
      onChange={(event) => {
        if (onChange) {
          onChange(dateTime(event.target.value));
        }
      }}
    />
  );
};

const DateTimePicker = jest.fn(DateTimePickerMock);

/**
 * Mock DatePickerWithInput component
 */
const DatePickerWithInputMock = ({ onChange, ...restProps }: any) => {
  return (
    <input
      data-testid={restProps['data-testid']}
      value={restProps.value}
      onChange={(event) => {
        if (onChange) {
          /**
           * Mock for check Date
           */
          if (event.target.value === '2024-11-11T00:00:00.000Z') {
            onChange(new Date(event.target.value));
            return;
          }
          onChange(event.target.value);
        }
      }}
    />
  );
};

const DatePickerWithInput = jest.fn(DatePickerWithInputMock);

/**
 * Mock TimeOfDayPicker component
 */
const TimeOfDayPickerMock = ({ onChange, ...restProps }: any) => {
  return (
    <input
      data-testid={restProps['data-testid']}
      value={restProps.value}
      onChange={(event) => {
        if (onChange) {
          onChange(dateTime(event.target.value));
        }
      }}
    />
  );
};

const TimeOfDayPicker = jest.fn(TimeOfDayPickerMock);

/**
 * Mock Select component
 */
const SelectMock = ({ options, onChange, value, isMulti, isClearable, allowCustomValue, ...restProps }: any) => (
  <select
    onChange={(event: any) => {
      if (onChange) {
        if (isMulti) {
          onChange(options.filter((option: any) => event.target.values.includes(option.value)));
        } else {
          onChange(options.find((option: any) => option.value == event.target.value));
        }
      }
    }}
    /**
     * Fix jest warnings because null value.
     * For Select component in @grafana/ui should be used null to reset value.
     */
    value={value === null ? '' : value?.value || value}
    multiple={isMulti}
    {...restProps}
  >
    {isClearable && (
      <option key="clear" value="">
        Clear
      </option>
    )}
    {options.map(({ label, value }: any) => (
      <option key={value} value={value}>
        {label}
      </option>
    ))}
  </select>
);

const Select = jest.fn(SelectMock);

/**
 * Mock FileDropzone
 */
const FileDropzoneMock = ({ onChange, options, onFileRemove, ...props }: any) => {
  const { onDrop } = options;
  const [files, setFiles] = useState<File[]>([]);

  return (
    <>
      <input
        type="file"
        onChange={(event) => {
          if (onDrop) {
            onDrop(event.target.files);
            setFiles(event.target.files as any);
          }
        }}
        data-testid={props['data-testid']}
      />
      {files.map((file) => (
        <button
          key={file.name}
          aria-label="Remove File"
          onClick={() => {
            setFiles((files) => files.filter((item) => item.name !== file.name));
            onFileRemove({ file });
          }}
        />
      ))}
    </>
  );
};

const FileDropzone = jest.fn(FileDropzoneMock);

/**
 * useTheme2
 */
const useTheme2 = () => ({
  colors: {
    text: {},
    background: {},
  },
  typography: {},
  spacing: jest.fn(),
  shape: {
    radius: {
      default: 0,
    },
  },
  visualization: {
    getColorByName: (color: unknown) => color,
  },
});

/**
 * Text Link
 */
const TextLinkMock = ({ children, href, external, ...restProps }: any) => (
  <a href={href} target={external ? '_blank' : '_self'} {...restProps}>
    {children}
  </a>
);

const TextLink = jest.fn(TextLinkMock);

/**
 * Set mocks
 */
beforeEach(() => {
  CodeEditor.mockImplementation(CodeEditorMock);
  Select.mockImplementation(SelectMock);
  DateTimePicker.mockImplementation(DateTimePickerMock);
  FileDropzone.mockImplementation(FileDropzoneMock);
  TimeOfDayPicker.mockImplementation(TimeOfDayPickerMock);
  ColorPicker.mockImplementation(ColorPickerMock);
  ColorPickerInput.mockImplementation(ColorPickerMock);
  TextLink.mockImplementation(TextLinkMock);
  DatePickerWithInput.mockImplementation(DatePickerWithInputMock);
});

module.exports = {
  ...actual,
  useTheme2,
  CodeEditor,
  ColorPicker,
  ColorPickerInput,
  DateTimePicker,
  Select,
  FileDropzone,
  TextLink,
  TimeOfDayPicker,
  PageToolbar,
  DatePickerWithInput,
};
