// __tests__/DateText.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import DateText from '../../src/components/DateText';

const MOCK_CURRENT_DATE = new Date(2025, 4, 13); // May 13, 2025 (Tuesday)
const RealDate = Date;

beforeAll(() => {
  global.Date = class extends RealDate {
    constructor(...args: any[]) {
        super();
      if (args.length === 0) {
        return MOCK_CURRENT_DATE;
      }
      // @ts-ignore
      return new RealDate(...args);
    }

    static now() {
      return MOCK_CURRENT_DATE.getTime();
    }

    static parse(...args: Parameters<typeof RealDate.parse>) {
      return RealDate.parse(...args);
    }
    static UTC(...args: Parameters<typeof RealDate.UTC>) {
      return RealDate.UTC(...args);
    }
  } as any;
});

afterAll(() => {
  global.Date = RealDate;
});

describe('<DateText /> - Core Date Display', () => {
  it('should display the current (mocked) date formatted as "Weekday, Month Day"', () => {
    render(<DateText />);
    const expectedDateString = 'Tuesday, May 13';
    expect(screen.getByText(expectedDateString)).toBeTruthy();
  });

  it('should match snapshot', () => {
    const { toJSON } = render(<DateText />);
    expect(toJSON()).toMatchSnapshot();
  });
});