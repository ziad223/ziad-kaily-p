import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/router";
import jwt_decode from "jwt-decode";
import { toast } from "react-hot-toast";
import { usePostEmail } from "api-manage/hooks/react-query/social-login/useEmailPost";
import CustomModal from "../../../modal";
import PhoneInputForm from "./PhoneInputForm";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import OtpForm from "../../sign-up/OtpForm";
import { useVerifyPhone } from "api-manage/hooks/react-query/forgot-password/useVerifyPhone";
import { google_client_id } from "utils/staticCredential";
import ModalCustom from "./ModalCustom";
import { getLanguage } from "helper-functions/getLanguage";

const GoogleLoginComp = ({ handleSuccess, configData, handleParentModalClose }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [jwtToken, setJwtToken] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openOtpModal, setOpenOtpModal] = useState(false);
  const [otpData, setOtpData] = useState({ phone: "" });
  const [mainToken, setMainToken] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const buttonDiv = useRef(null);
  const router = useRouter();

  const { mutate } = usePostEmail();
  const clientId = google_client_id;

  const handleToken = useCallback(
    (response) => {
      if (response?.token) handleSuccess(response.token);
      else setOpenModal(true);
    },
    [handleSuccess]
  );

  const handlePostRequestOnSuccess = useCallback(
    (response) => {
      if (configData?.customer_verification) {
        if (Number(response?.is_phone_verified) === 1) {
          handleToken(response);
        } else {
          if (response?.phone) setOtpData({ phone: response?.phone });
          if (response?.token) setMainToken(response);
        }
      } else {
        handleToken(response);
      }
    },
    [configData?.customer_verification, handleToken]
  );

  const handleCallBackResponse = useCallback(
    (res) => {
      const userObj = jwt_decode(res.credential);
      setJwtToken(res);
      setUserInfo(userObj);

      mutate(
        {
          email: userObj.email,
          token: res.credential,
          unique_id: res?.clientId,
          medium: "google",
          id_token: true,
        },
        {
          onSuccess: handlePostRequestOnSuccess,
          onError: (error) => {
            error?.response?.data?.errors?.forEach((item) =>
              item.code === "email" ? handleToken() : toast.error(item.message)
            );
          },
        }
      );
    },
    [mutate, handlePostRequestOnSuccess, handleToken]
  );

  useEffect(() => {
    if (otpData?.phone) setOpenOtpModal(true);
  }, [otpData]);

  useEffect(() => {
    if (!isInitialized) {
      window?.google?.accounts?.id?.initialize({
        client_id: clientId,
        callback: handleCallBackResponse,
      });
      setIsInitialized(true);
    }
  }, [clientId, isInitialized, handleCallBackResponse]);

  useEffect(() => {
    if (isInitialized && buttonDiv.current) {
      window?.google?.accounts?.id?.renderButton(buttonDiv.current, {
        theme: "outline",
        size: "large",
        width: "215px",
      });
    }
  }, [isInitialized]);

  const onSuccessHandler = (res) => {
    toast.success(res?.message);
    setOpenOtpModal(false);
    handleToken(mainToken);
    handleParentModalClose();
  };

  const { mutate: signInMutate, isLoading } = useVerifyPhone();

  const formSubmitHandler = (values) => {
    signInMutate(values, { onSuccess: onSuccessHandler, onError: onErrorResponse });
  };

  return (
    <>
      <div ref={buttonDiv} style={{ display: "flex", justifyContent: "center", width: "100%", margin: "auto" }} />
      
      <ModalCustom openModal={openModal} setModalOpen={setOpenModal} handleClose={() => setOpenModal(false)}>
        {userInfo && jwtToken && (
          <PhoneInputForm
            userInfo={userInfo}
            jwtToken={jwtToken}
            medium="google"
            handleRegistrationOnSuccess={(token) => { setOpenModal(false); handleSuccess(token); handleParentModalClose(); }}
            configData={configData}
            lanDirection={getLanguage() || "ltr"}
          />
        )}
      </ModalCustom>

      <CustomModal openModal={openOtpModal} handleClose={() => setOpenOtpModal(false)}>
        <OtpForm data={otpData} formSubmitHandler={formSubmitHandler} isLoading={isLoading} />
      </CustomModal>
    </>
  );
};

export default GoogleLoginComp;
