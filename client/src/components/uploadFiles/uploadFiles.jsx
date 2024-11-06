/* eslint-disable react-hooks/exhaustive-deps */
import { Close } from "@mui/icons-material";
import { Button, Typography, Grid } from "@mui/material";
import React, { useEffect, useState, forwardRef } from "react";
import { imageUrl } from "../../api";

const UploadFiles = forwardRef((props, ref) => {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const inputRef = React.useRef(null);

  const maxSize = 5 * 1024 * 1024;

  const handleFileUpdate = (newFile) => {
    if (
      ["image/png", "application/pdf", "image/jpg", "image/jpeg"].includes(
        newFile.type
      ) &&
      newFile.size <= maxSize
    ) {
      setFile(newFile);
      props.updateData && props.updateData(newFile, "file");
    } else if (newFile.size > maxSize) {
      alert("File size should not exceed 5 MB.");
    } else {
      alert("Invalid file type. Please upload PNG, JPG, JPEG, or PDF files.");
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileUpdate(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  const handleFileRemove = () => {
    setFile(null);
    setFilePreview(null);
    props.updateData && props.updateData(null, "file");
  };

  useEffect(() => {
    if (props.isEdit && props.images) {
      setFile(props.images);
    }
  }, [props.images, props.isEdit]);

  useEffect(() => {
    if (file) {
      const preview =
        file instanceof File ? URL.createObjectURL(file) : `${imageUrl}${file}`;

      setFilePreview(preview);

      return () => {
        if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
      };
    }
  }, [file, props.category]);

  const handleDownload = () => {
    const fileURL = URL.createObjectURL(file);

    const newTab = window.open(fileURL, "_blank");

    if (newTab) {
      newTab.document.title = file.name;
      newTab.document.body.innerHTML = `<h1>Downloading ${file.name}...</h1>`;
    } else {
      alert(
        "Failed to open the file in a new tab. Please check your browser's pop-up settings."
      );
    }
  };

  return (
    <>
      <form id="form-file-upload" onSubmit={(e) => e.preventDefault()}>
        <input
          ref={inputRef}
          type="file"
          id="input-file-upload"
          onChange={handleChange}
          accept={props.acceptedFiles}
          name="attachment"
          multiple={false}
          style={{ display: "none" }}
        />
        <label id="label-file-upload" htmlFor="input-file-upload">
          <div>
            <Typography sx={{ fontSize: "13px" }}>
              Upload your PDF, PNG, JPG, JPEG file here
            </Typography>
            <Button
              variant="text"
              className="upload-button"
              onClick={onButtonClick}
            >
              Upload file
            </Button>
          </div>
        </label>
      </form>
      <Grid
        container
        spacing={2}
        sx={{ display: "flex", justifyContent: "center", mt: 2 }}
      >
        {file && (
          <Grid
            item
            xs={6}
            md={4}
            className="attachment-filename"
            sx={{
              border: "1px solid #ccc",
              padding: "5px",
              position: "relative",
              width: "100%",
            }}
          >
            {file && file instanceof File ? (
              file.type.startsWith("image/") ? (
                <img
                  className="attachment-file"
                  src={URL.createObjectURL(file)}
                  alt="attachment"
                  style={{ width: "100%", height: "auto" }}
                />
              ) : (
                <Button
                  variant="outlined"
                  onClick={handleDownload}
                  sx={{ width: "100%" }}
                >
                  Download File
                </Button>
              )
            ) : file ? (
              file.toLowerCase().endsWith(".jpg") ||
              file.toLowerCase().endsWith(".jpeg") ||
              file.toLowerCase().endsWith(".png") ||
              file.toLowerCase().endsWith(".gif") ? (
                <img
                  className="attachment-file"
                  src={filePreview}
                  alt="attachment"
                  style={{ width: "100%", height: "auto" }}
                />
              ) : (
                <Button variant="outlined" onClick={handleDownload}>
                  Download File
                </Button>
              )
            ) : null}

            <div className="attachment-filename">
              <Typography
                sx={{
                  fontSize: "13px",
                  color: "#555",
                  textAlign: "center",
                }}
              >
                {file.name}
              </Typography>
              <Close
                onClick={handleFileRemove}
                sx={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  borderRadius: "50%",
                  padding: "4px",
                  cursor: "pointer",
                }}
              />
            </div>
          </Grid>
        )}
      </Grid>
    </>
  );
});

export default UploadFiles;
