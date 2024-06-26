import { EmotionMatchers } from '@emotion/jest';

declare global {
  namespace jest {
    interface CustomMatchers extends EmotionMatchers {}
  }
}
