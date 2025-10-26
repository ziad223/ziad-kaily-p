import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import useGetModule from "../../../../api-manage/hooks/react-query/useGetModule";
import { setModules } from "../../../../redux/slices/configData";
import { setSelectedModule } from "../../../../redux/slices/utils";

export const ModuleSelection = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data, refetch, isFetched } = useGetModule();

  useEffect(() => {
    refetch(); 
  }, []);

  useEffect(() => {
    if (isFetched && data?.length > 0) {
      dispatch(setModules(data));

      const firstModule = data[0];
      localStorage.setItem("module", JSON.stringify(firstModule));
      dispatch(setSelectedModule(firstModule));

      router.push("/home");
    }
  }, [data, isFetched]);

  return null;
};
