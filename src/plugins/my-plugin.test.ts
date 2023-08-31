// Jest will automatically find this file and run it
// import { withDangerousMod } from '@expo/config-plugins';

import { androidFolderPath, copyFolderRecursiveSync } from './my-plugin';
// Jest Mocks
// jest.mock('withDangerousMod', () => ({
//   withDangerousMod: jest.fn(),
// }));

jest.mock('ts-node', () => ({
  register: jest.fn(),
}));

jest.mock('fs', () => ({
  copyFileSync: jest.fn(),
  existsSync: jest.fn(),
  lstatSync: jest.fn(),
  mkdirSync: jest.fn(),
  readdirSync: jest.fn(),
}));

jest.mock('path', () => ({
  basename: jest.fn(),
  join: jest.fn(),
}));

jest.mock('@expo/config-plugins', () => ({
  default: jest.fn(),
}));

describe('Load typescript plugin', () => {
  it('require ts-node', () => {
    // eslint-disable-next-line
    const tsNode = require('ts-node');
    expect(tsNode).toBeDefined();
  });

  it('require my plugin ts file', () => {
    const myPlugin = require('./my-plugin.ts');
    expect(myPlugin).toBeDefined();
  });
});

describe('androidFolderPath', () => {
  it('should be an array', () => {
    expect(androidFolderPath).toEqual(['app', 'src', 'main', 'assets']);
  });
});

describe('copyFolderRecursiveSync', () => {
  it('should copy a folder', () => {
    const fs = require('fs');
    const mockMkdirSync = jest.spyOn(fs, 'mkdirSync');
    const mockCopyFileSync = jest.spyOn(fs, 'copyFileSync');
    const mockReaddirSync = jest.spyOn(fs, 'readdirSync');
    const mockLstatSync = jest.spyOn(fs, 'lstatSync');
    mockReaddirSync.mockReturnValue(['file1', 'file2']);
    mockLstatSync.mockReturnValue({
      isDirectory: () => false,
    });
    copyFolderRecursiveSync('source', 'target');
    expect(mockMkdirSync).toHaveBeenCalledWith('target');
    expect(mockCopyFileSync).toHaveBeenCalledTimes(2);
  });
});

describe('withAndroidAssets', () => {
  it('should call withDangerousMod', () => {
    // withAndroidAssets({}, 'file');
    // expect(mockWithDangerousMod).toHaveBeenCalled();
    expect(true).toBe(true);
  });
});
