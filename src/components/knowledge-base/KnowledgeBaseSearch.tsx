/**
 * Knowledge Base Search Component
 * 
 * Main search interface with filters, AI insights, and document grid.
 */

'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Icon, Card, Badge, Button, Input } from '@/components/ui';
import { DocumentCard, Document } from './DocumentCard';
import { AIInsightCard } from './AIInsightCard';

// Document categories/filters
const categories = [
  { id: 'all', label: 'All', count: 156 },
  { id: 'adoption', label: 'Adoption', count: 45 },
  { id: 'legal', label: 'Legal', count: 32 },
  { id: 'grants', label: 'Grants', count: 28 },
  { id: 'healthcare', label: 'Healthcare', count: 24 },
  { id: 'fundraising', label: 'Fundraising', count: 18 },
  { id: 'policy', label: 'Policy', count: 9 },
];

// Mock documents
const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'International Adoption Framework v2.4',
    description: 'Complete documentation regarding the standardized procedures for international adoption cases involving partner organizations in Southeast Asia.',
    type: 'Policy',
    category: 'adoption',
    fileType: 'pdf',
    fileSize: '2.4 MB',
    uploadDate: new Date('2023-10-12'),
    views: 1200,
    status: 'approved',
  },
  {
    id: '2',
    title: 'NGO Grant Application Template',
    description: 'A standardized template for federal grant submissions, including budget breakdown sheets and impact assessment forms required for 2024 cycle.',
    type: 'Grant',
    category: 'grants',
    fileType: 'docx',
    fileSize: '850 KB',
    uploadDate: new Date('2023-09-05'),
    views: 856,
    status: 'approved',
  },
  {
    id: '3',
    title: 'Child Welfare Rights Handbook',
    description: 'Comprehensive guide on legal rights for minors in care facilities, updated with the latest state regulations and compliance checklists.',
    type: 'Legal',
    category: 'legal',
    fileType: 'pdf',
    fileSize: '5.1 MB',
    uploadDate: new Date('2023-08-14'),
    views: 2100,
    status: 'approved',
  },
  {
    id: '4',
    title: 'Volunteer Training Manual 2024',
    description: 'Updated training materials for volunteers including safeguarding protocols, communication guidelines, and ethical considerations.',
    type: 'Policy',
    category: 'policy',
    fileType: 'pdf',
    fileSize: '3.2 MB',
    uploadDate: new Date('2023-11-20'),
    views: 543,
    status: 'approved',
  },
  {
    id: '5',
    title: 'Healthcare Access Guidelines',
    description: 'Protocols for ensuring healthcare access for beneficiaries, including insurance navigation and emergency care procedures.',
    type: 'Healthcare',
    category: 'healthcare',
    fileType: 'pdf',
    fileSize: '1.8 MB',
    uploadDate: new Date('2023-07-30'),
    views: 678,
    status: 'approved',
  },
  {
    id: '6',
    title: 'Annual Fundraising Playbook',
    description: 'Strategies and templates for annual fundraising campaigns, donor engagement, and event planning.',
    type: 'Fundraising',
    category: 'fundraising',
    fileType: 'pdf',
    fileSize: '4.5 MB',
    uploadDate: new Date('2023-06-15'),
    views: 432,
    status: 'approved',
  },
];

export function KnowledgeBaseSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'views'>('date');

  // Filter documents
  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || doc.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort documents
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    if (sortBy === 'date') return b.uploadDate.getTime() - a.uploadDate.getTime();
    if (sortBy === 'name') return a.title.localeCompare(b.title);
    if (sortBy === 'views') return b.views - a.views;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon name="library_books" className="text-primary" size="lg" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              Knowledge Base
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Search and explore verified documents
            </p>
          </div>
        </div>
      </div>

      {/* Search and filters */}
      <div className="mb-6 space-y-4">
        {/* Search bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Icon name="search" size="lg" className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents, policies, guidelines..."
            className="w-full pl-12 pr-12 py-4 text-base bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <Icon name="mic" size="lg" />
            </button>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
          <button className="flex shrink-0 items-center justify-center h-10 w-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
            <Icon name="tune" size="md" />
          </button>
          
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                'flex shrink-0 items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                activeCategory === cat.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              )}
            >
              {cat.label}
              <span className={cn(
                'px-1.5 py-0.5 rounded text-xs',
                activeCategory === cat.id
                  ? 'bg-white/20'
                  : 'bg-gray-100 dark:bg-gray-700'
              )}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* AI Insight Card */}
      {searchQuery && (
        <AIInsightCard query={searchQuery} className="mb-8" />
      )}

      {/* Results header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {sortedDocuments.length} Results
          </h2>
          {activeCategory !== 'all' && (
            <Badge variant="primary" icon="filter_alt" removable onRemove={() => setActiveCategory('all')}>
              {categories.find(c => c.id === activeCategory)?.label}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Sort dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'views')}
            className="text-sm bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="date">Most Recent</option>
            <option value="name">Alphabetical</option>
            <option value="views">Most Viewed</option>
          </select>

          {/* View mode toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 rounded-md transition-colors',
                viewMode === 'grid' ? 'bg-white dark:bg-surface-dark shadow-sm' : 'text-gray-500'
              )}
            >
              <Icon name="grid_view" size="md" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded-md transition-colors',
                viewMode === 'list' ? 'bg-white dark:bg-surface-dark shadow-sm' : 'text-gray-500'
              )}
            >
              <Icon name="view_list" size="md" />
            </button>
          </div>
        </div>
      </div>

      {/* Documents grid/list */}
      <div className={cn(
        viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'flex flex-col gap-4'
      )}>
        {sortedDocuments.map((doc) => (
          <DocumentCard
            key={doc.id}
            document={doc}
            viewMode={viewMode}
          />
        ))}
      </div>

      {/* Empty state */}
      {sortedDocuments.length === 0 && (
        <div className="text-center py-16">
          <Icon name="search_off" size="2xl" className="text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No documents found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Try adjusting your search or filter criteria
          </p>
          <Button onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}>
            Clear Filters
          </Button>
        </div>
      )}

      {/* Pagination */}
      {sortedDocuments.length > 0 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 disabled:opacity-50" disabled>
            <Icon name="chevron_left" size="lg" />
          </button>
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              className={cn(
                'h-10 w-10 rounded-lg font-medium transition-colors',
                page === 1
                  ? 'bg-primary text-white'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'
              )}
            >
              {page}
            </button>
          ))}
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
            <Icon name="chevron_right" size="lg" />
          </button>
        </div>
      )}
    </div>
  );
}

export default KnowledgeBaseSearch;
