import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, FileText, Loader2, CheckCircle } from 'lucide-react';
import { applicationsApi, resumeApi } from '../lib/api';

const ApplyJobModal = ({ job, onClose }) => {
    const [step, setStep] = useState('select-resume');
    const [resumes, setResumes] = useState([]);
    const [selectedResumeId, setSelectedResumeId] = useState(null);
    const [file, setFile] = useState(null);
    const [coverLetter, setCoverLetter] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            console.log('Fetching resumes...');
            const response = await resumeApi.getMyResumes();
            console.log('Resumes fetched:', response.data);

            const resumesList = response.data || [];
            setResumes(resumesList);

            if (resumesList.length > 0) {
                setSelectedResumeId(resumesList[0]._id);
            }
        } catch (err) {
            console.error('Error fetching resumes:', err.response?.data || err.message);
            setResumes([]);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        const validTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        if (selectedFile && validTypes.includes(selectedFile.type)) {
            // Check file size (5MB)
            if (selectedFile.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB');
                return;
            }
            setFile(selectedFile);
            setError('');
        } else {
            setError('Please upload a PDF or Word document');
        }
    };

    const uploadResume = async () => {
        if (!file) {
            setError('Please select a file');
            return;
        }

        setUploading(true);
        setError('');

        try {
            console.log('Uploading file:', file.name, 'Type:', file.type);

            const response = await resumeApi.upload(file);
            console.log('Upload response:', response.data);

            const newResume = response.data.resume;

            if (!newResume || !newResume._id) {
                throw new Error('Invalid response from server');
            }

            // Add to list and select it
            setResumes(prev => [newResume, ...prev]);
            setSelectedResumeId(newResume._id);
            setStep('cover-letter');

        } catch (err) {
            console.error('Upload error:', err);

            let errorMessage = 'Failed to upload resume';
            if (err.response) {
                errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
            } else if (err.request) {
                errorMessage = 'No response from server. Check your connection.';
            } else {
                errorMessage = err.message;
            }

            setError(errorMessage);
        } finally {
            setUploading(false);
        }
    };

    const submitApplication = async () => {
        if (!selectedResumeId) {
            setError('Please select or upload a resume');
            return;
        }

        setLoading(true);
        setError('');

        try {
            console.log('Submitting application:', {
                jobId: job._id,
                resumeId: selectedResumeId
            });

            await applicationsApi.apply({
                jobId: job._id,
                resumeId: selectedResumeId,
                coverLetter
            });

            setStep('success');
        } catch (err) {
            console.error('Application error:', err);
            setError(err.response?.data?.message || 'Failed to submit application');
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => {
        switch (step) {
            case 'select-resume':
                return (
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Select Resume</h4>

                        {resumes.length > 0 ? (
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {resumes.map((resume) => (
                                    <label
                                        key={resume._id}
                                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${selectedResumeId === resume._id
                                                ? 'border-primary-500 bg-primary-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="resume"
                                            value={resume._id}
                                            checked={selectedResumeId === resume._id}
                                            onChange={(e) => setSelectedResumeId(e.target.value)}
                                            className="mr-3 text-primary-600"
                                        />
                                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">
                                                {resume.fileName || 'Resume'}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(resume.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">
                                No resumes found. Upload a new one.
                            </p>
                        )}

                        <div className="flex space-x-3 pt-4 border-t">
                            <button
                                onClick={() => setStep('upload-new')}
                                className="flex-1 py-2.5 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Upload New
                            </button>
                            <button
                                onClick={() => setStep('cover-letter')}
                                disabled={!selectedResumeId}
                                className="flex-1 py-2.5 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                );

            case 'upload-new':
                return (
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Upload New Resume</h4>

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                                className="hidden"
                                id="resume-upload"
                            />
                            <label htmlFor="resume-upload" className="cursor-pointer block">
                                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                {file ? (
                                    <p className="text-sm text-primary-600 font-medium">{file.name}</p>
                                ) : (
                                    <>
                                        <p className="text-sm text-gray-600">Click to upload PDF or Word</p>
                                        <p className="text-xs text-gray-400 mt-1">Max 5MB</p>
                                    </>
                                )}
                            </label>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => setStep('select-resume')}
                                className="flex-1 py-2.5 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={uploadResume}
                                disabled={!file || uploading}
                                className="flex-1 py-2.5 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                            >
                                {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
                                <span>Upload & Continue</span>
                            </button>
                        </div>
                    </div>
                );

            case 'cover-letter':
                return (
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Cover Letter (Optional)</h4>

                        <textarea
                            rows="6"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                            placeholder="Tell the employer why you're a great fit for this role..."
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                        />

                        <div className="flex space-x-3">
                            <button
                                onClick={() => resumes.length > 0 ? setStep('select-resume') : setStep('upload-new')}
                                className="flex-1 py-2.5 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={submitApplication}
                                disabled={loading}
                                className="flex-1 py-2.5 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                            >
                                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                <span>Submit Application</span>
                            </button>
                        </div>
                    </div>
                );

            case 'success':
                return (
                    <div className="text-center py-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
                        <p className="text-gray-600 mb-6">
                            Your application for <span className="font-semibold">{job.title}</span> has been sent to {job.employerId?.companyName}.
                        </p>
                        <button onClick={onClose} className="w-full py-2.5 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                            Close
                        </button>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl max-w-lg w-full shadow-2xl"
            >
                <div className="p-6 border-b flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Apply for {job.title}</h3>
                        <p className="text-sm text-gray-500">{job.employerId?.companyName}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                            {error}
                        </div>
                    )}
                    {renderContent()}
                </div>
            </motion.div>
        </div>
    );
};

export default ApplyJobModal;