
import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const ATSScoreCard = ({ score = 0, formattingScore = 0, keywordsScore = 0 }) => {
    const getScoreColor = (s) => {
        if (s >= 85) return '#10B981'; // Green
        if (s >= 70) return '#F59E0B'; // Amber
        return '#EF4444'; // Red
    };

    const getScoreLabel = (s) => {
        if (s >= 85) return 'Excellent';
        if (s >= 70) return 'Good';
        if (s >= 50) return 'Fair';
        return 'Needs Work';
    };

    const circumference = 50 * 2 * Math.PI;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sticky top-6">
            <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-gray-900">ATS Strength</h4>
                <button className="text-gray-400 hover:text-blue-600">
                    <AlertCircle className="w-4 h-4" />
                </button>
            </div>

            {/* Circular score */}
            <div className="relative w-32 h-32 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="64"
                        cy="64"
                        r="50"
                        fill="none"
                        stroke="#E5E7EB"
                        strokeWidth="8"
                    />
                    <circle
                        cx="64"
                        cy="64"
                        r="50"
                        fill="none"
                        stroke={getScoreColor(score)}
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900">{score}</span>
                    <span className="text-xs font-medium text-gray-500">{getScoreLabel(score)}</span>
                </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Keywords</span>
                    <span className="font-bold">{keywordsScore}/50</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: `${(keywordsScore / 50) * 100}%` }}></div>
                </div>

                <div className="flex justify-between items-center text-sm mt-3">
                    <span className="text-gray-600">Formatting</span>
                    <span className="font-bold">{formattingScore}/50</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: `${(formattingScore / 50) * 100}%` }}></div>
                </div>
            </div>

            {score < 70 && (
                <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100 text-xs text-amber-800">
                    <p className="font-bold mb-1">Tip:</p>
                    Use more action verbs and quantify your results to boost your score.
                </div>
            )}
        </div>
    );
};

export default ATSScoreCard;
