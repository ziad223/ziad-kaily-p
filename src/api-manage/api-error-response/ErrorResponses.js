// import toast from "react-hot-toast";
// import { t } from "i18next";
// import Router from "next/router";

// const handleTokenExpire = (item, status) => {
//   if (status === 401) {
//     if (window.localStorage.getItem("token")) {
//       toast.error(t("Your account is inactive or Your token has been expired"));
//       window?.localStorage.removeItem("token");
//       Router.push("/auth/sign-in", undefined, { shallow: true });
//     }
//   } else {
//     toast.error(item?.message, {
//       id: "error",
//     });
//   }
// };

// export const onErrorResponse = (error) => {
//   error?.response?.data?.errors?.forEach((item) => {
//     handleTokenExpire(item);
//   });
// };
// export const onSingleErrorResponse = (error) => {
//   toast.error(error?.response?.data?.message, {
//     id: "error",
//   });
//   handleTokenExpire(error, error?.response?.status);
// };
import toast from "react-hot-toast";
import { t } from "i18next";
import Router from "next/router";

const handleTokenExpire = (item, status) => {
  if (status === 401) {
    // لو التوكن منتهي أو الحساب غير نشط
    if (window.localStorage.getItem("token")) {
      toast.error(t("Your account is inactive or Your token has been expired"));
      window.localStorage.removeItem("token");
      Router.push("/auth/sign-in", undefined, { shallow: true });
    }
  } else {
    // أي خطأ تاني
    toast.error(item?.message || t("Something went wrong"), {
      id: "error",
    });
  }
};

export const onErrorResponse = (error) => {
  const errors = error?.response?.data?.errors;

  if (Array.isArray(errors)) {
    // لو errors مصفوفة
    errors.forEach((item) => {
      handleTokenExpire(item, error?.response?.status);
    });
  } else if (errors) {
    // لو errors كائن واحد
    handleTokenExpire(errors, error?.response?.status);
  } else {
    // لو مفيش errors أصلاً، استخدم الرسالة العامة
    handleTokenExpire(error, error?.response?.status);
  }
};

export const onSingleErrorResponse = (error) => {
  toast.error(error?.response?.data?.message || t("Something went wrong"), {
    id: "error",
  });
  handleTokenExpire(error, error?.response?.status);
};
