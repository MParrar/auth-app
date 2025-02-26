import React, { useContext, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Heading } from '../components/heading';
import { Divider } from '../components/divider';
import AuthContext from '../contexts/AuthProvider';
import { ArrowUpTrayIcon } from '@heroicons/react/16/solid';
import { useNotification } from '../contexts/NotificationProvider';
import useAxios from '../hook/axiosInstance';
import { Loading } from '../components/Loading';

export const UploadDocuments = () => {
  const { user } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const axiosInstance = useAxios();
  const showNotification = useNotification();
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
      'application/vnd.ms-excel': ['.xls'],
    },
    onDrop: (acceptedFiles) => {
      const selectedFile = acceptedFiles[0];
      setFile(
        Object.assign(selectedFile, {
          preview: URL.createObjectURL(selectedFile),
        })
      );
      uploadFile(selectedFile);
    },
  });

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axiosInstance.post('/files/upload', formData, {
        responseType: 'blob',
      });
      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `processed_${file.name}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        showNotification(
          'success',
          'File processed and downloaded successfully.'
        );
        setFile(null);
      } else {
        setFile(null);
        showNotification(
          'error',
          'An error occurred while processing the file.'
        );
        console.error('File upload failed:', response.statusText);
      }
    } catch (error) {
      if (error.response && error.response.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const errorData = JSON.parse(reader.result);
            setFile(null);
            showNotification(
              'error',
              errorData.message ||
                'An error occurred while processing the file.'
            );
            console.error('Error response:', errorData);
          } catch (jsonError) {
            setFile(null);
            showNotification(
              'error',
              'An error occurred, but the error message could not be parsed.'
            );
            console.error('JSON parse error:', jsonError);
          }
        };
        reader.readAsText(error.response.data);
      } else {
        setFile(null);
        showNotification(
          'error',
          'An error occurred while processing the file.'
        );
        console.error('Error catch:', error);
      }
    }
  };

  return (
    <>
      <Heading data-testid="my-profile-heading">
        Upload Documents - {user?.company_name}
      </Heading>
      <Divider className="mt-4" />
      <div
        {...getRootProps()}
        className="mt-4 flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer"
      >
        <ArrowUpTrayIcon className="h-6 w-6 text-white mb-2" />
        <input {...getInputProps()} />
        <p className="text-white">Drag file here, or click to select</p>
        <p className="text-white">
          Supports CSV (.csv) and Excel (.xlsx, .xls)
        </p>
      </div>
      <div className="mt-4">
        {file && <div className="text-white">{file.path}</div>}
      </div>
      {(file ) && (
        <div
          style={{ marginTop: '-200px', height: '80vh', overflow: 'hidden'}}
          className="overflow-y-hidden"
        >
          <Loading />
        </div>
      )}
    </>
  );
};
