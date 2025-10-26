import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";
import { useDispatch, useSelector } from "react-redux";
import { useGetFeaturedCategories } from "api-manage/hooks/react-query/all-category/all-categorys";
import { ModuleTypes } from "helper-functions/moduleTypes";
import { setFeaturedCategories } from "redux/slices/storedData";
import { HomeComponentsWrapper } from "../HomePageComponents";
import FoodCategoryCard from "../../cards/FoodCategoryCard";
import PharmacyCategoryCard from "../../cards/PharmacyCategoryCard";
import FeaturedItemCard from "./card";

const FeaturedCategories = ({ configData }) => {
  const dispatch = useDispatch();
  const { featuredCategories } = useSelector((state) => state.storedData);
  const { modules } = useSelector((state) => state.configData);
  const [defaultModule, setDefaultModule] = useState(null);
  const { data, refetch, isFetching } = useGetFeaturedCategories();

  // جلب البيانات من API
  useEffect(() => {
    refetch();
  }, []);

  // حفظ البيانات في Redux
  useEffect(() => {
    if (data) {
      dispatch(setFeaturedCategories(data?.data));
    }
  }, [data]);

  // اختيار أول موديول تلقائي فقط
  useEffect(() => {
    if (modules?.length > 0) {
      setDefaultModule(modules[0]?.module_type);
    }
  }, [modules]);

  // عرض المنتجات حسب أول موديول فقط (من غير كروت أو سلايدر)
  const renderContent = () => {
    if (!defaultModule) return null;

    switch (defaultModule) {
      case ModuleTypes.GROCERY:
        return featuredCategories?.map((item) => (
          <FeaturedItemCard
            key={item?.id}
            image={item?.image_full_url}
            title={item?.name}
            id={item?.id}
            slug={item?.slug}
          />
        ));
      case ModuleTypes.PHARMACY:
        return featuredCategories?.map((item) => (
          <PharmacyCategoryCard
            key={item?.id}
            image={item?.image_full_url}
            title={item?.name}
            slug={item?.slug}
            id={item?.id}
          />
        ));
      case ModuleTypes.FOOD:
        return featuredCategories?.map((item) => (
          <FoodCategoryCard
            key={item?.id}
            id={item?.id}
            categoryImage={item?.image}
            name={item?.name}
            slug={item?.slug}
            categoryImageUrl={item?.image_full_url}
          />
        ));
      default:
        return null;
    }
  };

  return (
    <CustomBoxFullWidth sx={{ mt: "20px" }}>
      {isFetching ? (
        null
      ) : (
        featuredCategories?.length > 0 && (
          <HomeComponentsWrapper>{renderContent()}</HomeComponentsWrapper>
        )
      )}
    </CustomBoxFullWidth>
  );
};

export default FeaturedCategories;
