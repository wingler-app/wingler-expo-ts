import { GOOGLE_MAPS_API_KEY } from '@env';
import { useEffect, useState } from 'react';

const useGooglePlaces = (question: string) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);

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
              'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
              'X-Goog-FieldMask':
                'places.location,places.formattedAddress,places.address_components,places.name',
            },
            body: JSON.stringify({
              textQuery: question,
            }),
            signal: abortController.signal,
          },
        );

        setData(await response.json());
      } catch (e) {
        console.error('Places API error: ', e);
        setError(e);
      } finally {
        setLoading(false);
      }
    })();

    return () => abortController.abort();
  }, [question]);

  return [data, loading, error];
};

export { useGooglePlaces };
