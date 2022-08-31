import { shallow } from 'enzyme';
import React from 'react';
import { FormElementDefault, FormElementType } from '../../constants';
import { FormElements } from './FormElements';

/**
 * Panel
 */
describe('Panel', () => {
  const onOptionsChange = jest.fn();

  it('Should find component with elements', async () => {
    const options = {
      submit: {},
      initial: { highlightColor: false },
      update: {},
      reset: {},
      elements: [
        FormElementDefault,
        { id: 'password', type: FormElementType.PASSWORD },
        { id: 'number', type: FormElementType.NUMBER },
        { id: 'textarea', type: FormElementType.TEXTAREA },
        { id: 'code', type: FormElementType.CODE },
        { id: 'boolean', type: FormElementType.BOOLEAN },
        { id: 'datetime', type: FormElementType.DATETIME },
      ],
    };

    const getComponent = ({ options = {}, ...restProps }: any) => {
      return <FormElements options={options} {...restProps} />;
    };

    const wrapper = shallow(getComponent({ options, onOptionsChange }));
    const div = wrapper.find('div');
    expect(div.exists()).toBeTruthy();

    /**
     * Input
     */
    const text = wrapper.find('Input[type="text"]');
    expect(text.exists()).toBeTruthy();
    text.simulate('change', { target: { value: 'text' } });

    /**
     * Input number
     */
    const number = wrapper.find('Input[type="number"]');
    expect(number.exists()).toBeTruthy();
    number.simulate('change', { target: { value: 1 } });

    /**
     * Password
     */
    const password = wrapper.find('Input[type="password"]');
    expect(password.exists()).toBeTruthy();
    password.simulate('change', { target: { value: 'secret' } });

    /**
     * Textarea
     */
    const textarea = wrapper.find('TextArea');
    expect(textarea.exists()).toBeTruthy();
    textarea.simulate('change', { target: { value: 'hello' } });

    /**
     * CodeEditor
     */
    const code = wrapper.find('[language="javascript"]');
    expect(code.exists()).toBeTruthy();
    code.simulate('blur', { value: 'alert();' });

    /**
     * RadioButtonGroup
     */
    const radio = wrapper.find('RadioButtonGroup');
    expect(radio.exists()).toBeTruthy();
    radio.simulate('change', { value: true });

    /**
     * DateTime
     */
    const dateTime = wrapper.find('DateTimePicker');
    expect(dateTime.exists()).toBeTruthy();
    dateTime.simulate('change', { value: new Date() });
  });

  it('Should find component with Slider', async () => {
    const options = {
      submit: {},
      initial: { highlightColor: false },
      update: {},
      reset: {},
      elements: [{ id: 'slider', type: FormElementType.SLIDER, value: 0 }],
    };

    const getComponent = ({ options = {}, ...restProps }: any) => {
      return <FormElements options={options} {...restProps} />;
    };

    const wrapper = shallow(getComponent({ options, onOptionsChange }));
    const div = wrapper.find('div');
    expect(div.exists()).toBeTruthy();

    const slider = wrapper.find('[step]');
    expect(slider.exists()).toBeTruthy();
    slider.simulate('change', { value: 1 });

    /**
     * Input
     */
    const input = wrapper.find('Input');
    expect(input.exists()).toBeTruthy();
    input.simulate('change', { currentTarget: { value: 1 } });
  });

  it('Should find component with Radio', async () => {
    const options = {
      submit: {},
      initial: { highlightColor: false },
      update: {},
      reset: {},
      elements: [{ id: 'radio', type: FormElementType.RADIO }],
    };

    const getComponent = ({ options = {}, ...restProps }: any) => {
      return <FormElements options={options} {...restProps} />;
    };

    const wrapper = shallow(getComponent({ options, onOptionsChange }));
    const div = wrapper.find('div');
    expect(div.exists()).toBeTruthy();

    /**
     * Radio
     */
    const radio = wrapper.find('RadioButtonGroup');
    expect(radio.exists()).toBeTruthy();
    radio.simulate('change', { value: 'abc' });
  });

  it('Should find component with Select', async () => {
    const options = {
      submit: {},
      initial: { highlightColor: false },
      update: {},
      reset: {},
      elements: [{ id: 'select', type: FormElementType.SELECT }],
    };

    const getComponent = ({ options = {}, ...restProps }: any) => {
      return <FormElements options={options} {...restProps} />;
    };

    const wrapper = shallow(getComponent({ options, onOptionsChange }));
    const div = wrapper.find('div');
    expect(div.exists()).toBeTruthy();

    /**
     * Select
     */
    const select = wrapper.find('[options]');
    expect(select.exists()).toBeTruthy();
    select.simulate('change', { value: 'abc' });
  });

  it('Should not find component without section', async () => {
    const options = {
      submit: {},
      initial: { highlightColor: false },
      update: {},
      reset: {},
      elements: [{ id: 'select', type: FormElementType.SELECT }],
    };

    const getComponent = ({ options = {}, ...restProps }: any) => {
      return <FormElements options={options} {...restProps} />;
    };

    const wrapper = shallow(getComponent({ options, onOptionsChange, section: { name: 'left' } }));
    const div = wrapper.find('div');
    expect(div.exists()).toBeTruthy();

    /**
     * Select
     */
    const select = wrapper.find('[options]');
    expect(select.exists()).toBeFalsy();
  });
});
