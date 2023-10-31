import { useCallback, useEffect, useState } from 'react';

export type ApiResponse = {
  status: Number;
  statusText: String;
  data: any;
  error: any;
  loading: Boolean;
  refetch: () => void;
};

export type ApiProps = {
  url: string;
  options?: ApiOptions;
};

export type ApiOptions = {
  method?: string;
  headers?: any;
  body?: any;
};

const useApi = ({ url, options }: ApiProps): ApiResponse => {
  const [status, setStatus] = useState<Number>(0);
  const [statusText, setStatusText] = useState<String>('');
  const [data, setData] = useState<any>();
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  const refetch = useCallback(async () => {
    try {
      const response = await fetch(url, options);
      const json = await response.json();
      setStatus(response.status);
      setStatusText(response.statusText);
      setData(json);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { status, statusText, data, error, loading, refetch };
};

export default useApi;
