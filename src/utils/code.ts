/* eslint-disable no-console */

/**
 * Create Execution Code with error handling
 * @param args
 */
export const createExecutionCode = (...args: string[]) => {
  try {
    return new Function(...args);
  } catch (error) {
    console.error('Code Error', error);
    console.log(args[args.length - 1]);

    return () => {};
  }
};
