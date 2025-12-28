/**
 * Admin Dashboard Overview Component
 * 
 * Main dashboard with analytics, pending approvals, and quick actions.
 */

'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Icon, Card, Button, Badge, Avatar } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { DocumentUploadModal } from './DocumentUploadModal';

// Analytics data (mock)
const analyticsData = {
  queryVolume: { value: 1240, change: 12, trend: 'up' as const },
  activeUsers: { value: 328, change: 8, trend: 'up' as const },
  documentsIndexed: { value: 156, change: 3, trend: 'up' as const },
  avgResponseTime: { value: '1.2s', change: -5, trend: 'down' as const },
};

const topTopics = ['Adoption', 'Grants', 'Ethics', 'Healthcare', 'Legal'];

// Pending documents (mock)
const pendingDocuments = [
  {
    id: '1',
    name: 'Annual_Report_2023.pdf',
    type: 'pdf',
    status: 'vectorized',
    uploadedBy: 'Admin User',
    uploadedAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: '2',
    name: 'Volunteer_Guide_v2.docx',
    type: 'docx',
    status: 'processing',
    uploadedBy: 'Staff Member',
    uploadedAt: new Date(Date.now() - 1000 * 60 * 45),
  },
  {
    id: '3',
    name: 'Global_Grant_Policy.pdf',
    type: 'pdf',
    status: 'vectorized',
    uploadedBy: 'Admin User',
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60),
  },
];

// Recent activity (mock)
const recentActivity = [
  { icon: 'upload', text: 'New document uploaded: Policy_2024.pdf', time: '5 min ago', color: 'text-blue-500' },
  { icon: 'check_circle', text: 'Document approved: Grant_Template.docx', time: '15 min ago', color: 'text-green-500' },
  { icon: 'person_add', text: 'New user registered: john@ngo.org', time: '1 hour ago', color: 'text-purple-500' },
  { icon: 'warning', text: 'Sensitive query flagged for review', time: '2 hours ago', color: 'text-orange-500' },
];

export function DashboardOverview() {
  const { user, userProfile } = useAuth();
  const [showUploadModal, setShowUploadModal] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            {getGreeting()}, {user?.displayName?.split(' ')[0] || 'Admin'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Here's what's happening in your knowledge base today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Icon name="notifications" size="lg" className="text-gray-600 dark:text-gray-300" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
          </button>
          <Avatar
            src={user?.photoURL}
            name={user?.displayName || undefined}
            size="lg"
          />
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        {[
          { 
            label: 'Query Volume', 
            value: analyticsData.queryVolume.value.toLocaleString(), 
            change: analyticsData.queryVolume.change,
            icon: 'bar_chart',
            color: 'bg-blue-50 dark:bg-blue-900/20 text-primary'
          },
          { 
            label: 'Active Users', 
            value: analyticsData.activeUsers.value.toLocaleString(), 
            change: analyticsData.activeUsers.change,
            icon: 'group',
            color: 'bg-green-50 dark:bg-green-900/20 text-green-600'
          },
          { 
            label: 'Documents', 
            value: analyticsData.documentsIndexed.value.toLocaleString(), 
            change: analyticsData.documentsIndexed.change,
            icon: 'folder_open',
            color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600'
          },
          { 
            label: 'Avg Response', 
            value: analyticsData.avgResponseTime.value, 
            change: analyticsData.avgResponseTime.change,
            icon: 'speed',
            color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600'
          },
        ].map((stat) => (
          <Card key={stat.label} padding="lg" className="relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-gradient-to-br from-primary/5 to-primary/10 rounded-full blur-xl group-hover:scale-150 transition-transform" />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {stat.label}
                </p>
                <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center', stat.color)}>
                  <Icon name={stat.icon} size="md" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                {stat.value}
              </p>
              <div className={cn(
                'text-xs font-bold flex items-center gap-1 mt-2',
                stat.change >= 0 ? 'text-green-600' : 'text-red-600'
              )}>
                <Icon name={stat.change >= 0 ? 'trending_up' : 'trending_down'} size="sm" />
                {Math.abs(stat.change)}% vs last week
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Main content - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Card */}
          <Card padding="lg" className="border-dashed border-2 border-gray-200 dark:border-gray-700 hover:border-primary/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon name="cloud_upload" className="text-primary" size="lg" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    Add Knowledge
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Upload PDF/DOCX for AI vectorization
                  </p>
                </div>
              </div>
              <Button onClick={() => setShowUploadModal(true)} icon="add">
                Upload Documents
              </Button>
            </div>
          </Card>

          {/* Pending Approval */}
          <Card padding="lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Pending Approval
              </h3>
              <Button variant="ghost" size="sm">View All</Button>
            </div>

            <div className="space-y-4">
              {pendingDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className={cn(
                    'flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 transition-colors',
                    doc.status === 'processing' && 'opacity-70'
                  )}
                >
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-white dark:bg-gray-700 shrink-0">
                    <Icon 
                      name={doc.type === 'pdf' ? 'picture_as_pdf' : 'description'} 
                      className={doc.type === 'pdf' ? 'text-red-500' : 'text-blue-500'} 
                      size="lg" 
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">
                      {doc.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {doc.status === 'vectorized' ? (
                        <>
                          <span className="h-2 w-2 rounded-full bg-green-500" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">Vectorized</span>
                        </>
                      ) : (
                        <>
                          <Icon name="progress_activity" size="sm" className="animate-spin text-orange-500" />
                          <span className="text-xs text-orange-600">Chunking...</span>
                        </>
                      )}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant={doc.status === 'vectorized' ? 'primary' : 'secondary'}
                    disabled={doc.status === 'processing'}
                  >
                    {doc.status === 'vectorized' ? 'Approve' : 'Wait'}
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Bias Audit Section */}
          <Card 
            padding="lg" 
            className="border-l-4 border-green-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                  <Icon name="health_and_safety" className="text-green-600" size="lg" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    Bias Audit Logs
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    System Health: Nominal • Last check 2h ago
                  </p>
                </div>
              </div>
              <Icon name="chevron_right" className="text-gray-400" size="lg" />
            </div>
          </Card>
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Top Topics */}
          <Card padding="lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white">Top Topics</h3>
              <Icon name="topic" className="text-primary" />
            </div>
            <div className="flex flex-wrap gap-2">
              {topTopics.map((topic) => (
                <Badge key={topic} variant="default">
                  #{topic}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card padding="lg">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className={cn('mt-0.5', activity.color)}>
                    <Icon name={activity.icon} size="md" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                      {activity.text}
                    </p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Stats */}
          <Card padding="lg" className="bg-gradient-to-br from-primary to-blue-600 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="insights" size="lg" />
              <h3 className="font-bold">Weekly Summary</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-blue-100">Queries answered</span>
                <span className="font-bold">8,429</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-100">Human escalations</span>
                <span className="font-bold">23</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-100">Satisfaction rate</span>
                <span className="font-bold">94%</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <DocumentUploadModal onClose={() => setShowUploadModal(false)} />
      )}
    </div>
  );
}

export default DashboardOverview;
