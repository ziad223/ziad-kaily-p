import React, { useState } from "react";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";
import CustomPhoneInput from "../../custom-component/CustomPhoneInput";
import CustomTextFieldWithFormik from "../../form-fields/CustomTextFieldWithFormik";
import { t } from "i18next";
import { getLanguage } from "../../../helper-functions/getLanguage";
import LockIcon from "@mui/icons-material/Lock";
import {
  InputAdornment,
  alpha,
  useTheme,
  Switch,
  Typography,
  Box,
} from "@mui/material";

const SignInForm = ({
  loginFormik,
  configData,
  handleOnChange,
  passwordHandler,
}) => {
  const lanDirection = getLanguage() ? getLanguage() : "ltr";
  const theme = useTheme();

  const [useEmail, setUseEmail] = useState(false);

  const handleSwitchChange = (event) => {
    const isEmail = event.target.checked;
    setUseEmail(isEmail);
    loginFormik.setFieldValue("phone", "");
    loginFormik.setFieldValue("email", "");
  };

  return (
    <CustomStackFullWidth alignItems="center" spacing={{ xs: 2, md: 2 }}>
       <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{ mt: 1, mb: 1 }}
      >
        <Switch
          checked={useEmail}
          onChange={handleSwitchChange}
          color="primary"
          sx={{
            transform: "scale(1.2)",
          }}
        />
        <Typography sx={{ fontWeight: 500, mt: 0.5 }}>
          {useEmail ? t("Login with Email") : t("Login with Phone")}
        </Typography>
      </Box>
      {!useEmail && (
        <CustomPhoneInput
          value={loginFormik.values.phone}
          onHandleChange={handleOnChange}
          initCountry={configData?.country}
          touched={loginFormik.touched.phone}
          errors={loginFormik.errors.phone}
          lanDirection={lanDirection}
          height="45px"
        />
      )}

      {/* 📧 إدخال البريد الإلكتروني */}
      {useEmail && (
        <CustomTextFieldWithFormik
          height="45px"
          required="true"
          type="email"
          label={t("Email")}
          touched={loginFormik.touched.email}
          errors={loginFormik.errors.email}
          fieldProps={loginFormik.getFieldProps("email")}
          value={loginFormik.values.email}
        />
      )}

     

      <CustomTextFieldWithFormik
        height="45px"
        required="true"
        type="password"
        label={t("Password")}
        touched={loginFormik.touched.password}
        errors={loginFormik.errors.password}
        fieldProps={loginFormik.getFieldProps("password")}
        onChangeHandler={passwordHandler}
        value={loginFormik.values.password}
        startIcon={
          <InputAdornment position="start">
            <LockIcon
              sx={{
                color:
                  loginFormik.touched.password && !loginFormik.errors.password
                    ? theme.palette.primary.main
                    : alpha(theme.palette.neutral[500], 0.4),
              }}
            />
          </InputAdornment>
        }
      />
    </CustomStackFullWidth>
  );
};

export default SignInForm;
