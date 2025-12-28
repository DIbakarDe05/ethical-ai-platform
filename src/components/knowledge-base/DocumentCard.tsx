/**
 * Document Card Component
 * 
 * Card for displaying individual documents in the knowledge base.
 */

import React from 'react';
import { cn, formatDate, formatFileSize } from '@/lib/utils';
import { Icon, Badge, Card } from '@/components/ui';

export interface Document {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  fileType: 'pdf' | 'docx' | 'txt' | 'xlsx';
  fileSize: string;
  uploadDate: Date;
  views: number;
  status: 'pending' | 'approved' | 'rejected';
}

interface DocumentCardProps {
  document: Document;
  viewMode: 'grid' | 'list';
  onClick?: () => void;
}

const typeColors: Record<string, { bg: string; text: string }> = {
  Policy: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300' },
  Grant: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300' },
  Legal: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300' },
  Healthcare: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300' },
  Fundraising: { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-700 dark:text-pink-300' },
};

const fileTypeIcons: Record<string, { icon: string; color: string }> = {
  pdf: { icon: 'picture_as_pdf', color: 'text-red-500' },
  docx: { icon: 'description', color: 'text-blue-500' },
  txt: { icon: 'article', color: 'text-gray-500' },
  xlsx: { icon: 'table_chart', color: 'text-green-500' },
};

export function DocumentCard({ document, viewMode, onClick }: DocumentCardProps) {
  const colors = typeColors[document.type] || { bg: 'bg-gray-100', text: 'text-gray-700' };
  const fileInfo = fileTypeIcons[document.fileType] || { icon: 'description', color: 'text-gray-500' };

  if (viewMode === 'list') {
    return (
      <Card
        hover
        padding="md"
        className="flex items-center gap-4"
        onClick={onClick}
      >
        {/* File icon */}
        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-700 shrink-0">
          <Icon name={fileInfo.icon} className={fileInfo.color} size="lg" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium', colors.bg, colors.text)}>
              {document.type}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {formatDate(document.uploadDate)}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-primary">
            {document.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {document.description}
          </p>
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-6 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <Icon name={fileInfo.icon} size="sm" className={fileInfo.color} />
            <span>{document.fileType.toUpperCase()} • {document.fileSize}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Icon name="visibility" size="sm" />
            <span>{document.views.toLocaleString()}</span>
          </div>
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <Icon name="download" size="md" className="text-gray-500" />
          </button>
        </div>
      </Card>
    );
  }

  // Grid view
  return (
    <Card
      hover
      padding="md"
      className="flex flex-col h-full group"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <span className={cn('inline-flex items-center px-2 py-1 rounded text-xs font-medium', colors.bg, colors.text)}>
          {document.type}
        </span>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {formatDate(document.uploadDate)}
        </span>
      </div>

      {/* Title & description */}
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
        {document.title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4 flex-1">
        {document.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <Icon name={fileInfo.icon} size="sm" className={fileInfo.color} />
          <span>{document.fileType.toUpperCase()} • {document.fileSize}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Icon name="visibility" size="sm" />
          <span>{document.views.toLocaleString()}</span>
        </div>
      </div>
    </Card>
  );
}

export default DocumentCard;
