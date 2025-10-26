import { useQuery } from "react-query";
import { categories_api } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";
import { onErrorResponse } from "../../../api-error-response/ErrorResponses";

const getData = async (searchKey) => {
  if (searchKey && searchKey !== "") {
    return await MainApi.get(`${categories_api}/${searchKey}`);
  } else {
    return await MainApi.get(`${categories_api}`);
  }
};

export const useGetCategories = (searchKey, handleRequestOnSuccess, queryKey) => {
  return useQuery(
    queryKey ? queryKey : ["categories-list", searchKey],
    () => getData(searchKey),
    {
      enabled: false,
      retry: 0,
      onSuccess: handleRequestOnSuccess,
      onError: onErrorResponse,
      cacheTime: 1000 * 60 * 5, // 5 دقايق
      staleTime: 1000 * 60 * 5, // 5 دقايق
    }
  );
};

const getFeaturedData = async () => {
  const { data } = await MainApi.get(`${categories_api}`);
  return data;
};

// ✅ Hook لجلب الكاتيجوريز المميزة
export const useGetFeaturedCategories = (enabled = false) => {
  return useQuery(
    ["featured-categories-list"],
    () => getFeaturedData(),
    {
      enabled, 
      staleTime: 1000 * 60 * 8,
      cacheTime: 1000 * 60 * 8,
      onError: onErrorResponse,
    }
  );
};
