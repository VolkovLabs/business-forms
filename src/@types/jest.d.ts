import { EmotionMatchers } from '@emotion/jest';

declare global {
  namespace jest {
    type CustomMatchers = EmotionMatchers;
  }
}
