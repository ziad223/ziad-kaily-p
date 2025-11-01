"use client";

import React, { useEffect, useState, useMemo } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import MainLayout from "../../src/components/layout/MainLayout";
import { NoSsr } from "@mui/material";
import { useRouter } from "next/router";
import { useGetCategories } from "../../src/api-manage/hooks/react-query/all-category/all-categorys";
import useGetCategoriesForStore from "../../src/api-manage/hooks/react-query/categories-details/useCategoriesDetailsForStore";
import {
  CustomPaperBigCard,
  CustomStackFullWidth,
} from "../../src/styled-components/CustomStyles.style";
import CategoriesDetails from "../../src/components/categories-details";
import { getServerSideProps } from "../index";
import SEO from "../../src/components/seo";
import CustomContainer from "../../src/components/container";
import { getImageUrl } from "utils/CustomFunctions";

const Index = ({ configData }) => {
  const router = useRouter();
  const id = router.query.id;
  const nameParam = router.query.name || "";

  // ✅ فك الترميز بأمان
  const decodedName = useMemo(() => {
    if (configData && nameParam) {
      try {
        return atob(nameParam);
      } catch (e) {
        console.warn("Invalid Base64 string:", nameParam);
        return nameParam; 
      }
    }
    return "Loading...";
  }, [configData, nameParam]);

  const [type, setType] = useState("all");
  const [offset, setOffset] = useState(1);
  const [page_limit, setPageLimit] = useState(10);
  const [category_id, setCategoryId] = useState(id || null);

  useEffect(() => {
    if (id) setCategoryId(id);
  }, [id]);

  // ✅ استدعاء API (React Query بيتعامل أوتوماتيك)
  const {
    data,
    isFetching: itemIsFetching,
    isLoading: itemIsLoading,
  } = useGetCategories(category_id);

  const {
    data: storeData,
    isFetching: storeIsFetching,
    isLoading: storeIsLoading,
  } = useGetCategoriesForStore({
    category_id,
    page_limit,
    offset,
    type,
  });
  useEffect(() => {
    type && setOffset(1);
  }, [type]);
useEffect(() => {
  refetch();
  storeRefetch();
}, [category_id, type, offset, refetch, storeRefetch]);


  return (
    <>
      <CssBaseline />
      <SEO
        title={decodedName}
        image={`${getImageUrl(
          { value: configData?.logo_storage },
          "business_logo_url",
          configData
        )}/${configData?.fav_icon}`}
        businessName={configData?.business_name}
      />
      <MainLayout configData={configData}>
        <CustomStackFullWidth mt="1rem">
          <CustomContainer>
            <CustomPaperBigCard nopadding="true" sx={{ padding: "1rem" }}>
              <NoSsr>
                <CategoriesDetails
                  id={id}
                  data={data}
                  category_id={category_id}
                  setCategoryId={setCategoryId}
                  storeData={storeData}
                  offset={offset}
                  type={type}
                  setType={setType}
                  page_limit={page_limit}
                  setOffset={setOffset}
                  isLoading={storeIsLoading || itemIsLoading}
                  isRefetching={storeIsFetching || itemIsFetching}
                />
              </NoSsr>
            </CustomPaperBigCard>
          </CustomContainer>
        </CustomStackFullWidth>
      </MainLayout>
    </>
  );
};

export default Index;
export { getServerSideProps };
