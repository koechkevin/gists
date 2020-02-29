import React from 'react';

import { getFileExtension } from '../utils';

describe('Utils Test', () => {
  test('getFileExtension function', () => {
    const extension = getFileExtension('test file.pdf');
    expect(extension).toBe('pdf');
  });
});
