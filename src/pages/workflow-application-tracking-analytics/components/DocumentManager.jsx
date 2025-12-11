import React, { useState, useEffect, useMemo } from 'react';
import { FileText, Upload, Download, Edit, Copy, Trash2, Clock, CheckCircle, Star } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { resumeService } from '../../../services/resumeService';
import { useAuthContext } from '../../../contexts/AuthContext';
import { applicationService } from '../../../services/applicationService';

const DocumentManager = () => {
  const { user } = useAuthContext();
  const [resumes, setResumes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDocuments();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const [resumesData, appsData] = await Promise.all([
        resumeService.getAll().catch(() => []),
        applicationService.getAll().catch(() => [])
      ]);
      setResumes(resumesData);
      setApplications(appsData);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  // Transform resumes to document format
  const documents = useMemo(() => {
    return resumes.map((resume, index) => {
      const resumeApplications = applications.filter(app => 
        app.resume_id === resume.id
      ).length;

      return {
        id: resume.id,
        name: resume.title || `Resume ${index + 1}`,
        type: 'Resume',
        version: '1.0', // Would need version tracking
        lastModified: resume.updated_at ? format(parseISO(resume.updated_at), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        size: '245 KB', // Would need actual file size
        applications: resumeApplications,
        isDefault: resume.is_default || false,
        tags: ['Resume'], // Could extract from content
        resumeId: resume.id
      };
    });
  }, [resumes, applications]);

  const getTypeIcon = (type) => {
    return <FileText className="w-5 h-5" />;
  };

  const getTypeColor = (type) => {
    const colors = {
      Resume: 'bg-blue-100 text-blue-700',
      'Cover Letter': 'bg-green-100 text-green-700',
      Portfolio: 'bg-purple-100 text-purple-700',
      References: 'bg-yellow-100 text-yellow-700'
    };
    return colors?.[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Document Management</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Organize resumes, cover letters, and supporting materials with version control
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#0046FF] text-white rounded-lg font-medium hover:bg-blue-700">
          <Upload className="w-4 h-4" />
          Upload Document
        </button>
      </div>
      {/* Document Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#13182E] border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{documents.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Documents</div>
        </div>
        <div className="bg-white dark:bg-[#13182E] border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {documents.filter(d => d.type === 'Resume').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Resume Versions</div>
        </div>
        <div className="bg-white dark:bg-[#13182E] border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {documents.reduce((sum, d) => sum + d.applications, 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Applications Sent</div>
        </div>
        <div className="bg-white dark:bg-[#13182E] border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {documents.filter(d => d.isDefault).length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Default Documents</div>
        </div>
      </div>
      {/* Documents List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0046FF] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading documents...</p>
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No documents yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Create your first resume to get started</p>
          <a
            href="/resume-builder-ai-enhancement"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0046FF] text-white rounded-lg font-medium hover:bg-blue-700"
          >
            <Upload className="w-5 h-5" />
            Create Resume
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {documents?.map((doc) => (
          <div
            key={doc?.id}
            className="bg-white dark:bg-[#13182E] border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start gap-4">
              {/* Document Icon */}
              <div className={`p-3 rounded-lg ${getTypeColor(doc?.type)}`}>
                {getTypeIcon(doc?.type)}
              </div>

              {/* Document Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 dark:text-white">{doc?.name}</h3>
                      {doc?.isDefault && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs font-medium rounded-full">
                          <Star className="w-3 h-3" />
                          Default
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <span className={`px-2 py-1 rounded ${getTypeColor(doc?.type)} text-xs font-medium`}>
                        {doc?.type}
                      </span>
                      <span>Version {doc?.version}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {doc?.lastModified}
                      </span>
                      <span>{doc?.size}</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {doc?.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Usage Stats */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-[#0046FF]" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">Used in:</span>
                    <span className="text-gray-900 dark:text-white">{doc?.applications} applications</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#0046FF] text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#13182E] text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#13182E] text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <Copy className="w-4 h-4" />
                    Duplicate
                  </button>
                  {!doc?.isDefault && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#13182E] text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <Star className="w-4 h-4" />
                      Set as Default
                    </button>
                  )}
                  <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#13182E] text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800 rounded-lg font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}
      {/* Upload Guidelines */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="font-bold text-gray-900 dark:text-white mb-3">Document Guidelines</h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• Keep multiple versions of your resume tailored for different roles and industries</li>
          <li>• Customize cover letters for each application to improve success rates</li>
          <li>• Update your default documents regularly to reflect your latest experience</li>
          <li>• Use version control to track changes and revert if needed</li>
          <li>• Supported formats: PDF, DOCX (recommended: PDF for consistency)</li>
        </ul>
      </div>
    </div>
  );
};

export default DocumentManager;