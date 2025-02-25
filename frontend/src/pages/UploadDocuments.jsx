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
  const [progress, setProgress] = useState(0);
  const [downloadComplete, setDownloadComplete] = useState(false);
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

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';

    let ws;
    let reconnectTimeout;
  
    const connect = () => {
      ws = new WebSocket(`${protocol}://${import.meta.env.VITE_API_URL_TO_WEB_SOCKET}/progress`);
  
      ws.onopen = () => console.log('WebSocket connection established');
      ws.onmessage = (event) => setProgress(JSON.parse(event.data).progress);
      ws.onclose = () => {
        reconnectTimeout = setTimeout(connect, 3000);
      };
    };
  
    connect();
  
    return () => {
      clearTimeout(reconnectTimeout);
      ws.onmessage = null;
      ws.onerror = null;
      ws.onclose = null;
      ws.close();
    };
  }, [downloadComplete]);

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
        setProgress(0);
        setDownloadComplete(true);
      } else {
        setFile(null);
        setProgress(0);
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
            setProgress(0);
            showNotification(
              'error',
              errorData.message ||
                'An error occurred while processing the file.'
            );
            console.error('Error response:', errorData);
          } catch (jsonError) {
            setFile(null);
            setProgress(0);
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
        setProgress(0);
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
      {file && progress > 0 && (
        <div className="mt-4 w-full bg-gray-200 rounded-full">
          <div
            className="bg-gray-500 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
            style={{ width: `${progress}%` }}
          >
            {progress.toFixed(2)}%
          </div>
        </div>
      )}
      {(file && progress === 0 ) && (
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
