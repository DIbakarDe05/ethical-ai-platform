/**
 * User Document Upload Component
 * 
 * Private page for users to upload verification documents.
 * Supports ID proof, income proof, and NGO certificates.
 */

'use client';

import React, { useState, useCallback } from 'react';
import { Icon, Card, Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface UploadedFile {
    name: string;
    size: number;
    type: string;
    status: 'uploading' | 'uploaded' | 'error';
    progress: number;
}

interface DocumentSection {
    id: string;
    title: string;
    description: string;
    icon: string;
    iconColor: string;
    required: boolean;
    accept: string;
}

const documentSections: DocumentSection[] = [
    {
        id: 'id_proof',
        title: 'ID Proof',
        description: 'Aadhaar Card, Passport, or Driver\'s License',
        icon: 'badge',
        iconColor: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
        required: true,
        accept: 'image/*,.pdf',
    },
    {
        id: 'income_proof',
        title: 'Income Proof',
        description: 'Salary slips, ITR, or Bank statements',
        icon: 'payments',
        iconColor: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600',
        required: true,
        accept: 'image/*,.pdf',
    },
    {
        id: 'ngo_certificates',
        title: 'NGO Certificates',
        description: 'Registration certificates (for NGO partners only)',
        icon: 'workspace_premium',
        iconColor: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600',
        required: false,
        accept: 'image/*,.pdf',
    },
];

export function UserDocumentUpload() {
    const { user, userProfile, isAuthenticated } = useAuth();
    const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFile | null>>({
        id_proof: null,
        income_proof: null,
        ngo_certificates: null,
    });
    const [dragOver, setDragOver] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent, sectionId: string) => {
        e.preventDefault();
        setDragOver(sectionId);
    }, []);

    const handleDragLeave = useCallback(() => {
        setDragOver(null);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent, sectionId: string) => {
        e.preventDefault();
        setDragOver(null);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            processFile(files[0], sectionId);
        }
    }, []);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>, sectionId: string) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            processFile(files[0], sectionId);
        }
    }, []);

    const processFile = (file: File, sectionId: string) => {
        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        // Simulate upload
        setUploadedFiles(prev => ({
            ...prev,
            [sectionId]: {
                name: file.name,
                size: file.size,
                type: file.type,
                status: 'uploading',
                progress: 0,
            },
        }));

        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += 20;
            if (progress >= 100) {
                clearInterval(interval);
                setUploadedFiles(prev => ({
                    ...prev,
                    [sectionId]: prev[sectionId] ? {
                        ...prev[sectionId]!,
                        status: 'uploaded',
                        progress: 100,
                    } : null,
                }));
            } else {
                setUploadedFiles(prev => ({
                    ...prev,
                    [sectionId]: prev[sectionId] ? {
                        ...prev[sectionId]!,
                        progress,
                    } : null,
                }));
            }
        }, 200);
    };

    const removeFile = (sectionId: string) => {
        setUploadedFiles(prev => ({
            ...prev,
            [sectionId]: null,
        }));
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const canSubmit = uploadedFiles.id_proof?.status === 'uploaded' &&
        uploadedFiles.income_proof?.status === 'uploaded';

    const handleSubmit = async () => {
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        alert('Documents uploaded successfully! Your documents are now under review.');
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-4">
                <Card padding="lg" className="max-w-md w-full text-center">
                    <div className="h-16 w-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
                        <Icon name="lock" className="text-amber-600" size="lg" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Private Access Only
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Please sign in to upload verification documents.
                    </p>
                    <Link href="/login">
                        <Button icon="login" className="w-full">
                            Sign In to Continue
                        </Button>
                    </Link>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark py-8 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                            Document Upload
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Upload your verification documents securely
                        </p>
                    </div>
                    <Badge variant="warning" className="flex items-center gap-1.5">
                        <Icon name="lock" size="sm" />
                        Private
                    </Badge>
                </div>

                {/* Security Banner */}
                <Card padding="md" className="mb-6 border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-900/20">
                    <div className="flex gap-4">
                        <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-800/50 flex items-center justify-center shrink-0">
                            <Icon name="security" className="text-amber-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">Secure Document Upload</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Your documents are encrypted and accessible only to authorized personnel. This is a private section requiring authentication.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Upload Sections */}
                <div className="space-y-4">
                    {documentSections.map((section) => (
                        <Card key={section.id} padding="lg">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center', section.iconColor)}>
                                    <Icon name={section.icon} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">{section.title}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{section.description}</p>
                                </div>
                                <Badge variant={section.required ? 'error' : 'default'}>
                                    {section.required ? 'Required' : 'Optional'}
                                </Badge>
                            </div>

                            {uploadedFiles[section.id] ? (
                                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <Icon
                                            name={uploadedFiles[section.id]!.status === 'uploaded' ? 'check_circle' : 'sync'}
                                            className={cn(
                                                uploadedFiles[section.id]!.status === 'uploaded' ? 'text-emerald-600' : 'text-primary animate-spin'
                                            )}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 dark:text-white truncate">
                                                {uploadedFiles[section.id]!.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {formatFileSize(uploadedFiles[section.id]!.size)}
                                            </p>
                                        </div>
                                        {uploadedFiles[section.id]!.status === 'uploading' && (
                                            <span className="text-sm text-primary font-medium">
                                                {uploadedFiles[section.id]!.progress}%
                                            </span>
                                        )}
                                        <button
                                            onClick={() => removeFile(section.id)}
                                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-red-500"
                                        >
                                            <Icon name="close" size="sm" />
                                        </button>
                                    </div>
                                    {uploadedFiles[section.id]!.status === 'uploading' && (
                                        <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                            <div
                                                className="bg-primary h-1.5 rounded-full transition-all"
                                                style={{ width: `${uploadedFiles[section.id]!.progress}%` }}
                                            />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div
                                    className={cn(
                                        'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all',
                                        dragOver === section.id
                                            ? 'border-primary bg-primary/5'
                                            : 'border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-primary/5'
                                    )}
                                    onDragOver={(e) => handleDragOver(e, section.id)}
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e) => handleDrop(e, section.id)}
                                >
                                    <input
                                        type="file"
                                        id={`upload-${section.id}`}
                                        className="hidden"
                                        accept={section.accept}
                                        onChange={(e) => handleFileSelect(e, section.id)}
                                    />
                                    <label htmlFor={`upload-${section.id}`} className="cursor-pointer">
                                        <Icon name="cloud_upload" size="xl" className="text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                            Drag & drop your file here or{' '}
                                            <span className="text-primary font-medium">browse</span>
                                        </p>
                                        <p className="text-xs text-gray-400">Supports: JPG, PNG, PDF (Max 5MB)</p>
                                    </label>
                                </div>
                            )}
                        </Card>
                    ))}
                </div>

                {/* Submit Button */}
                <div className="mt-6">
                    <Button
                        className="w-full"
                        size="lg"
                        icon={isSubmitting ? 'sync' : 'cloud_done'}
                        disabled={!canSubmit || isSubmitting}
                        onClick={handleSubmit}
                    >
                        {isSubmitting ? 'Uploading...' : 'Upload All Documents'}
                    </Button>
                    <p className="text-center text-xs text-gray-400 mt-3">
                        Upload at least ID Proof and Income Proof to continue
                    </p>
                </div>

                {/* Security Info */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { icon: 'encrypted', text: '256-bit encryption', color: 'text-emerald-600' },
                        { icon: 'verified_user', text: 'Verified access only', color: 'text-primary' },
                        { icon: 'delete_forever', text: 'Auto-deleted after 90 days', color: 'text-amber-600' },
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                            <Icon name={item.icon} className={item.color} />
                            <span className="text-xs text-gray-600 dark:text-gray-400">{item.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default UserDocumentUpload;
