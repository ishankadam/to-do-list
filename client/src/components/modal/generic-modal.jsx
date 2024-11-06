import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  CircularProgress,
  Modal,
  Stack,
  Typography,
} from "@mui/material";

function ModalComponent(props) {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    props.secondaryButton && props.secondaryButton.handler();
    setOpen(false);
  };

  const primaryButtonHandler = (e) => {
    let errorEle = document.querySelector("div.Mui-error input");
    if (errorEle) {
      errorEle.focus();
    } else {
      props.primaryButton && props.primaryButton.handler(e);
    }
  };

  const secondaryButtonHandler = (sameSecondaryButtonAction) => {
    props.secondaryButton &&
      props.secondaryButton.handler(sameSecondaryButtonAction);
    setOpen(false);
  };

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      id="modal-surface"
    >
      <Box className={`common-modal ${props.className ? props.className : ""}`}>
        <div className="header-wrapper">
          <div className="header-text">
            <Typography
              variant="h3"
              className="modal-title"
              id={props.title.id}
              sx={props.title.sx}
            >
              {props.title.label}
            </Typography>
            {props.datePicker?.isRequired ? props.datePicker.content : null}
          </div>
          <CloseIcon
            className="modal-close-icon"
            onClick={handleClose}
            id="close-icon"
          />
        </div>
        <div
          className={`modal-body ${
            !(props.isEdit || props.isUpload)
              ? props.modalBodyClass
                ? props.modalBodyClass
                : ""
              : ""
          }`}
        >
          {props.children}
        </div>
        <Stack
          marginTop="0.9rem"
          justifyContent="flex-start"
          spacing={2}
          direction="row"
          flexWrap="wrap"
          paddingTop={!props.isConfirmation ? "1.625rem" : "0"}
          borderTop={!props.isConfirmation ? "2px solid #ccc" : "none"}
        >
          {props.contentOnSideOfButton?.isRequired ? (
            <Stack
              className="modal-action-content"
              justifyContent="start"
              spacing={0}
              direction="row"
              sx={{
                "> .MuiTypography-root": { marginRight: "16px" },
                "> .MuiTypography-root:last-child": { marginRight: 0 },
              }}
            >
              {props.contentOnSideOfButton.content}
            </Stack>
          ) : null}
          <div className="modal-btm-btn-container">
            {props.secondaryButton?.isRequired ? (
              <Button
                id="secondary-button"
                color={props.secondaryButton.color || "primary"}
                onClick={() =>
                  secondaryButtonHandler(
                    props.secondaryButton.isActionAvailable
                  )
                }
                variant="text"
                size="small"
                className={props.secondaryButton?.className}
                disabled={props.disabled}
              >
                {props.secondaryButton.label}
              </Button>
            ) : null}
            {props.primaryButton?.isRequired ? (
              <Button
                id="primary-button"
                color={props.primaryButton.color || "primary"}
                onClick={primaryButtonHandler}
                variant="contained"
                size="small"
                className={props.primaryButton?.className}
                disabled={props.primaryButton.disabled}
                sx={{ marginLeft: "1rem" }}
                startIcon={
                  props.primaryButton.loading ? (
                    <CircularProgress size={16} color="secondary" />
                  ) : null
                }
              >
                {props.primaryButton.label}
              </Button>
            ) : null}
          </div>
        </Stack>
      </Box>
    </Modal>
  );
}

export default ModalComponent;
