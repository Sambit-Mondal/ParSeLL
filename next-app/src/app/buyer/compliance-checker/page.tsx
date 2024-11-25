'use client';
import { useState } from 'react';
import axios from 'axios';

const ComplianceChecker = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedFile) {
      alert('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('/api/upload-invoice', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
      setResult('Error occurred while checking compliance.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ParSell - Import/Export Compliance Checker</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} className="w-full p-2 mb-2 border border-gray-300 rounded" />
        <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded">Check Compliance</button>
      </form>
      {result && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Compliance Check Result:</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default ComplianceChecker;