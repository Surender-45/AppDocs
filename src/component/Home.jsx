import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardContent,
  Alert, Stack
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import "./Home.css";

const Home = () => {
   const { getRootProps, getInputProps } = useDropzone({
   your options for dropzone here
   });
  const [applicants, setApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [newApplicantName, setNewApplicantName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [docNameDialogOpen, setDocNameDialogOpen] = useState(false);
  const [newDocName, setNewDocName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedApplicantIndex, setSelectedApplicantIndex] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  const handleUpload = () => {
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false); // Auto-hide the alert after 3 seconds
    }, 3000);
  };

  const openDialog = () => setDialogOpen(true);
  const closeDialog = () => setDialogOpen(false);

  const openDocNameDialog = (file, applicantIndex) => {
    setSelectedFile(file);
    setSelectedApplicantIndex(applicantIndex);
    setDocNameDialogOpen(true);
  };

  const closeDocNameDialog = () => setDocNameDialogOpen(false);

  const handleAddApplicant = () => {
    if (newApplicantName.trim()) {
      setApplicants([...applicants, { name: newApplicantName, documents: [] }]);
      setNewApplicantName("");
      closeDialog();
    }
  };

  const handleSelectApplicant = (index) => {
    setSelectedApplicant(index);
  };

  const handleDeleteApplicant = (index) => {
    setApplicants(applicants.filter((_, i) => i !== index));
    if (selectedApplicant === index) {
      setSelectedApplicant(null);
    }
  };

  const handleFileUpload = (files, applicantIndex) => {
    files.forEach((file) => {
      openDocNameDialog(file, applicantIndex);
    });
  };

  const handleSaveDocumentName = () => {
    if (newDocName.trim() && selectedFile) {
      const updatedApplicants = [...applicants];
      updatedApplicants[selectedApplicantIndex].documents.push({
        file: selectedFile,
        fileName: newDocName,
        fileType: selectedFile.type,
      });
      setApplicants(updatedApplicants);
      setDocNameDialogOpen(false);
      setNewDocName("");
      setSelectedFile(null);
      setSelectedApplicantIndex(null);
    }
  };

  const handleDeleteDocument = (docIndex, applicantIndex) => {
    const updatedApplicants = [...applicants];
    updatedApplicants[applicantIndex].documents = updatedApplicants[applicantIndex].documents.filter(
      (_, i) => i !== docIndex
    );
    setApplicants(updatedApplicants);
  };

  const renderDocument = (file, docIndex) => {
    const isImage = file.fileType.startsWith("image/");

    return (
      <div className="document-item-container" key={docIndex}>
        <span className="document-name">{file.fileName}</span>
        {isImage ? (
          <img
            src={URL.createObjectURL(file.file)}
            alt={`Document ${docIndex}`}
            className="document-preview"
          />
        ) : (
          <span>{file.fileName}</span>
        )}
      </div>
    );
  };

  return (
    <div className="app-container">
      <header className="header">Document Upload</header>

      <div className="navigation-buttons">
        <Button
          variant="contained"
          color="primary"
          onClick={openDialog}
          startIcon={<AddIcon />}
        >
          Add Applicant
        </Button>
      </div>

      <div className="applicant-list">
        {applicants.map((applicant, index) => (
          <Card
            key={index}
            className={`applicant-card ${
              selectedApplicant === index ? "selected" : ""
            }`}
          >
            <CardContent className="applicant-card-content">
              <div className="applicant-name">{applicant.name}</div>
              <Button
                size="small"
                color="error"
                onClick={() => handleDeleteApplicant(index)}
                className="delete-button"
                startIcon={<DeleteIcon />}
                sx={{ fontSize: "0.75rem", padding: "4px 8px" }}
              >
                Delete
              </Button>
              <Button
                size="small"
                onClick={() => handleSelectApplicant(index)}
                className="view-button"
                sx={{ fontSize: "0.75rem", padding: "4px 8px" }}
                startIcon={<AddIcon />}
              >
                Add
              </Button>
            </CardContent>

            {selectedApplicant === index && (
              <div className="document-upload">
                <h3>Documents for {applicant.name}</h3>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<AddIcon />}
                >
                  Choose Document
                  <input
                    type="file"
                    hidden
                    multiple
                    onChange={(e) =>
                      handleFileUpload([...e.target.files], index)
                    }
                  />
                </Button>

                <ul>
                  {applicant.documents.map((file, docIndex) => (
                    <li key={docIndex} className="document-item">
                      {renderDocument(file, docIndex)}
                      <Button
                        size="large"
                        color="error"
                        onClick={() => handleDeleteDocument(docIndex, index)}
                        startIcon={<DeleteIcon />}
                      ></Button>
                    </li>
                  ))}
                </ul>
                <Stack spacing={2}>
      {showAlert && (
        <Alert severity="success">
          Document uploaded successfully for {applicant.name}.
        </Alert>
      )}
      <Button
        variant="contained"
        color="primary"
        disabled={applicant.documents.length === 0}
        onClick={handleUpload}
        className="upload-button"
        sx={{ marginTop: "16px" }}
      >
        Upload
      </Button>
    </Stack>

              </div>
            )}
          </Card>
        ))}
      </div>

      {applicants.length > 0 && (
        <div className="footer-navigation">
          <Button
            variant="outlined"
            disabled={selectedApplicant === null || selectedApplicant === 0}
            onClick={() => handleSelectApplicant(selectedApplicant - 1)}
          >
            Back
          </Button>
          <Button
            variant="outlined"
            disabled={
              selectedApplicant === null ||
              selectedApplicant === applicants.length - 1
            }
            onClick={() => handleSelectApplicant(selectedApplicant + 1)}
          >
            Next
          </Button>
        </div>
      )}

      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        sx={{
          ".MuiDialog-paper": {
            padding: "16px",
            borderRadius: "12px",
          },
        }}
      >
        <DialogTitle>Add New Applicant</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Applicant Name"
            type="text"
            fullWidth
            value={newApplicantName}
            onChange={(e) => setNewApplicantName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={handleAddApplicant} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={docNameDialogOpen}
        onClose={closeDocNameDialog}
        sx={{
          ".MuiDialog-paper": {
            padding: "16px",
            borderRadius: "12px",
          },
        }}
      >
        <DialogTitle>Enter Document Name</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Document Name"
            type="text"
            fullWidth
            value={newDocName}
            onChange={(e) => setNewDocName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDocNameDialog}>Cancel</Button>
          <Button onClick={handleSaveDocumentName} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Home;


