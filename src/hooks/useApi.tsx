import { useState } from 'react';

export type ApiResponse = [
  any,
  (url: string, options?: RequestInit) => void,
  boolean,
  any,
  Number,
  String,
];

export type ApiProps = {
  url: string;
  options?: RequestInit;
};

const useApi = (): ApiResponse => {
  const [status, setStatus] = useState<Number>(0);
  const [statusText, setStatusText] = useState<String>('');
  const [data, setData] = useState<any>();
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  const getData = async (url: string, options?: RequestInit) => {
    try {
      const response = await fetch(url, options || {});
      const json = await response.json();
      setStatus(response.status);
      setStatusText(response.statusText);
      setData(json);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  return [data, getData, loading, error, status, statusText];
};

export default useApi;
