/**
 * Document Upload Modal Component
 * 
 * Modal for uploading documents with drag-and-drop support.
 */

'use client';

import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Icon, Button } from '@/components/ui';
import toast from 'react-hot-toast';

interface DocumentUploadModalProps {
  onClose: () => void;
}

interface UploadFile {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
}

export function DocumentUploadModal({ onClose }: DocumentUploadModalProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [category, setCategory] = useState('');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    addFiles(selectedFiles);
  };

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} is not a supported file type`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 10MB limit`);
        return false;
      }
      return true;
    });

    const uploadFiles: UploadFile[] = validFiles.map(file => ({
      file,
      id: Math.random().toString(36).substring(7),
      progress: 0,
      status: 'pending',
    }));

    setFiles(prev => [...prev, ...uploadFiles]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    // Simulate upload process
    for (const file of files) {
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, status: 'uploading' } : f
      ));

      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, progress } : f
        ));
      }

      // Simulate processing
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, status: 'processing', progress: 100 } : f
      ));
      
      await new Promise(resolve => setTimeout(resolve, 1000));

      setFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, status: 'completed' } : f
      ));
    }

    toast.success('Documents uploaded successfully! They will appear in Pending Approval.');
    setTimeout(onClose, 1500);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Upload Documents
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Add PDF or DOCX files to the knowledge base
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Icon name="close" size="lg" className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Drop zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              'border-2 border-dashed rounded-xl p-8 text-center transition-colors',
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            )}
          >
            <input
              type="file"
              multiple
              accept=".pdf,.docx,.txt"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="h-16 w-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                <Icon name="cloud_upload" size="xl" className="text-gray-400" />
              </div>
              <p className="text-gray-900 dark:text-white font-medium mb-1">
                Drag and drop files here
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                or <span className="text-primary font-medium">browse</span> to select files
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                PDF, DOCX, TXT up to 10MB
              </p>
            </label>
          </div>

          {/* Category selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Document Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            >
              <option value="">Select a category</option>
              <option value="adoption">Adoption</option>
              <option value="grants">Grants</option>
              <option value="legal">Legal</option>
              <option value="healthcare">Healthcare</option>
              <option value="policy">Policy</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Selected Files ({files.length})
              </h4>
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
                >
                  <div className="h-10 w-10 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center shrink-0">
                    <Icon
                      name={file.file.type.includes('pdf') ? 'picture_as_pdf' : 'description'}
                      className={file.file.type.includes('pdf') ? 'text-red-500' : 'text-blue-500'}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {file.file.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {formatFileSize(file.file.size)}
                      </span>
                      {file.status === 'uploading' && (
                        <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                      )}
                      {file.status === 'processing' && (
                        <span className="text-xs text-orange-600 flex items-center gap-1">
                          <Icon name="progress_activity" size="sm" className="animate-spin" />
                          Processing...
                        </span>
                      )}
                      {file.status === 'completed' && (
                        <span className="text-xs text-green-600 flex items-center gap-1">
                          <Icon name="check_circle" size="sm" />
                          Complete
                        </span>
                      )}
                    </div>
                  </div>
                  {file.status === 'pending' && (
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Icon name="close" size="md" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Files will be auto-chunked and vectorized for AI search
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={files.length === 0 || files.some(f => f.status === 'uploading' || f.status === 'processing')}
              icon="cloud_upload"
            >
              Upload {files.length > 0 && `(${files.length})`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentUploadModal;
