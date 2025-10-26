import { Button, IconButton, Paper, Stack, Typography } from '@mui/material';
import React, { useRef, useCallback, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import CloseIcon from "@mui/icons-material/Close";
import { CustomPaperRefer } from './CustomToaster.style';

const CustomToast = ({ title, description, icon }) => (
  <CustomPaperRefer>
    {icon && icon}
    <Stack gap="7px">
      <Typography fontSize="14px" fontWeight={700} sx={{ color: 'primary.main' }}>
        {title}
      </Typography>
      <Typography fontSize="12px" sx={{ width: "100%", maxWidth: "283px" }}>
        {description}
      </Typography>
    </Stack>
    <IconButton sx={{ position: 'absolute', top: 10, right: 15 }} onClick={() => toast.dismiss()}>
      <CloseIcon sx={{ fontSize: "16px" }} />
    </IconButton>
  </CustomPaperRefer>
);

// Function to show the custom toast
const showToast = ({ title, description, icon, position }) => {
  toast.custom(
    (t) => <CustomToast title={title} description={description} icon={icon} />,
    {
      position,
      duration: 5000,
    }
  );
};

const CustomToaster = ({ title, description, icon, position, isOpen }) => {
  const initialRender = useRef(true);

  const handleShowToast = useCallback(() => {
    showToast({ title, description, icon, position });
  }, [title, description, icon, position]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    if (isOpen) {
      handleShowToast();
    }
  }, [isOpen, handleShowToast]);

  return <Toaster />;
};

export default CustomToaster;
