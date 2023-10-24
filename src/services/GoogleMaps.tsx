import { useEffect, useState } from 'react';

const useGooglePlaces = (question: string) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const abortController = new AbortController();

    (async () => {
      try {
        const response = await fetch(
          'https://places.googleapis.com/v1/places:searchText',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Goog-Api-Key': 'AIzaSyBfA8snPSRFtL3IN99IlscknLiUM5E852A',
              'X-Goog-FieldMask': 'places.location,places.formattedAddress',
            },
            body: JSON.stringify({
              textQuery: question,
            }),
            signal: abortController.signal,
          },
        );
        await setData(await response.json());
        setLoading(false);
      } catch (e) {
        console.error('Places API error: ', e);
      }
    })();

    return () => abortController.abort();
  }, [question]);

  return [data, loading];
};

export { useGooglePlaces };
