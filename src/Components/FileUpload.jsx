import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleUpload = () => {
    if (selectedFile) {
        // Creating a FormData object to send the file
      const formData = new FormData();
      formData.append('file', selectedFile);

      const backendEndpoint = 'YOUR_BACKEND_ENDPOINT';
     
       // Making a POST request to the backend with the FormData containing the file
      axios.post(backendEndpoint, formData)
        .then(response => {
          console.log('File uploaded successfully:', response.data);
          setSuccessMessage('File uploaded successfully');
        })
        .catch(error => {
          console.error('Error uploading file:', error);
          setErrorMessage('Error in uploading the file. Please upload the file again.');
        });
    } else {
      setErrorMessage('Please choose a file to upload.');
    }
  };

  return (
    <div style={styles.container}>
        {/* <p>provide your file here, we will fetch data for you</p> */}
      <input type="file" onChange={handleFileChange} style={styles.fileInput} />
      <button onClick={handleUpload} style={styles.uploadButton}>
        Upload
      </button>
      {errorMessage && <p style={styles.errorText}>{errorMessage}</p>}
      {successMessage && <p style={styles.successText}>{successMessage}</p>}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    maxWidth: '300px',
    margin: '50px auto',
  },
  fileInput: {
    marginBottom: '10px',
  },
  uploadButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  errorText: {
    color: 'red',
    marginTop: '10px',
  },
  successText: {
    color: 'green',
    marginTop: '10px',
  },
};

export default FileUpload;
