import { dateTime } from '@grafana/data';
import React, { useState } from 'react';

const actual = jest.requireActual('@grafana/ui');

/**
 * Mock Code Editor
 */
const CodeEditorMock = ({ onBlur, getSuggestions, ...restProps }) => {
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
 * Mock ColorPickerInput component
 */
const ColorPickerMock = ({ onChange, value, ...restProps }) => {
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

/**
 * Mock DatetimePicker component
 */
const DateTimePickerMock = ({ onChange, ...restProps }) => {
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
 * Mock TimeOfDayPicker component
 */
const TimeOfDayPickerMock = ({ onChange, ...restProps }) => {
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
const SelectMock = ({ options, onChange, value, isMulti, isClearable, ...restProps }) => (
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
const FileDropzoneMock = ({ onChange, options, onFileRemove, ...props }) => {
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
const TextLinkMock = ({ children, href, external, ...restProps }) => (
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
  TextLink.mockImplementation(TextLinkMock);
});

module.exports = {
  ...actual,
  useTheme2,
  CodeEditor,
  ColorPicker,
  DateTimePicker,
  Select,
  FileDropzone,
  TextLink,
  TimeOfDayPicker,
};
