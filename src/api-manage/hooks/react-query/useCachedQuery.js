import { useQuery } from "react-query";
import { onErrorResponse } from "../api-error-response/ErrorResponses";
import MainApi from "../MainApi";


export const useCachedQuery = (key, apiUrl, handleOnSuccess, options = {}) => {
  const { searchKey } = options;

  const cacheKey = `${key}_cache`;
  const getCache = () => {
    if (typeof window === "undefined") return null;
    try {
      const cached = localStorage.getItem(cacheKey);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  };

  const setCache = (data) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(cacheKey, JSON.stringify(data));
  };

  const fetchFromAPI = async () => {
    const url =
      searchKey && searchKey !== "" ? `${apiUrl}/${searchKey}` : apiUrl;
    const { data } = await MainApi.get(url);
    return data;
  };

  return useQuery(
    [key, searchKey],
    async () => {
      const cached = getCache();
      if (cached) {
        fetchFromAPI().then((fresh) => {
          setCache(fresh);
          handleOnSuccess?.(fresh);
        });
        return cached;
      } else {
        const fresh = await fetchFromAPI();
        setCache(fresh);
        return fresh;
      }
    },
    {
      enabled: true,
      cacheTime: 1000 * 60 * 10, 
      staleTime: 1000 * 60 * 5, 
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      onError: onErrorResponse,
      onSuccess: handleOnSuccess,
    }
  );
};
