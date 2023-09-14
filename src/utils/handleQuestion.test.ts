import { promptOpenAI } from './handleQuestion';

describe('promptOpenAI', () => {
  it('should handle fetch with then and catch', async () => {
    const mockResponse = {
      success: true,
      choices: [{ text: 'This is a test response.' }],
    };
    const mockJsonPromise = Promise.resolve(mockResponse);
    const mockFetchPromise = Promise.resolve({
      status: 400,
      json: () => mockJsonPromise,
    });
    // @ts-ignore
    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);

    const result = await promptOpenAI('Apples are good');
    expect(result).toBe(undefined);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
