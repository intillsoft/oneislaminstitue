import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { resumeService } from '../../services/resumeService';
import ResumePreview from './components/ResumePreview';
import { FileText, Ghost } from 'lucide-react';
import Button from '../../components/ui/Button';

const PublicResumeView = () => {
    const { id } = useParams();
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadResume();
    }, [id]);

    const loadResume = async () => {
        try {
            setLoading(true);
            const data = await resumeService.getPublicById(id);
            setResume(data);
        } catch (err) {
            setError('This resume is private or does not exist.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <Ghost className="w-8 h-8 text-gray-500" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 mb-2">Resume Not Found</h1>
                <p className="text-gray-500 mb-6">{error}</p>
                <Button onClick={() => window.location.href = '/'}>Go to Home</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            {/* Floating Banner */}
            <div className="fixed top-0 left-0 right-0 bg-white shadow-sm py-3 px-6 z-50 flex justify-between items-center">
                <div className="flex items-center gap-2 font-bold text-gray-900">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <span>Workflow Resume</span>
                </div>
                <Button size="sm" onClick={() => window.location.href = '/register'}>
                    Create Your Own
                </Button>
            </div>

            <div className="max-w-[210mm] mx-auto mt-12 bg-white shadow-2xl overflow-hidden rounded-sm">
                <ResumePreview
                    data={resume.content_json}
                    template={resume.template_id}
                />
            </div>

            <div className="max-w-[210mm] mx-auto mt-8 text-center text-gray-500 text-sm pb-8">
                Built with Workflow - The AI Career Platform
            </div>
        </div>
    );
};

export default PublicResumeView;
