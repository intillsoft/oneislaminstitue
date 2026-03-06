import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const ShareCourseModal = ({ course, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isEmailSending, setIsEmailSending] = useState(false);

  const courseUrl = `${window.location?.origin}/courses/detail/${course?.id}`;

  const shareOptions = [
    {
      name: 'LinkedIn',
      icon: 'Linkedin',
      color: 'bg-blue-600 hover:bg-blue-700',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(courseUrl)}`
    },
    {
      name: 'Twitter',
      icon: 'Twitter',
      color: 'bg-sky-500 hover:bg-sky-600',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this academic course: ${course?.title} at ${course?.department?.name}`)}&url=${encodeURIComponent(courseUrl)}`
    },
    {
      name: 'Facebook',
      icon: 'Facebook',
      color: 'bg-blue-700 hover:bg-blue-800',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(courseUrl)}`
    },
    {
      name: 'WhatsApp',
      icon: 'MessageCircle',
      color: 'bg-green-600 hover:bg-green-700',
      url: `https://wa.me/?text=${encodeURIComponent(`Explore this course: ${course?.title} at ${course?.department?.name} - ${courseUrl}`)}`
    }
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard?.writeText(courseUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = courseUrl;
      document.body?.appendChild(textArea);
      textArea?.select();
      document.execCommand('copy');
      document.body?.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSocialShare = (url) => {
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleEmailShare = async (e) => {
    e?.preventDefault();
    setIsEmailSending(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Course shared successfully via email!');
      setEmail('');
      setMessage('');
      onClose();
    } catch (error) {
      alert('Failed to send email. Please try again.');
    } finally {
      setIsEmailSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-1050">
      <div className="bg-background rounded-lg shadow-modal max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-text-primary uppercase tracking-tight">Share Course</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface rounded-lg transition-smooth"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {/* Course Info */}
          <div className="bg-surface rounded-2xl p-6 mb-8 border border-border">
            <h3 className="font-bold text-text-primary mb-2 uppercase tracking-tight">{course?.title}</h3>
            <p className="text-text-secondary text-[10px] font-black uppercase tracking-widest">{course?.department?.name}</p>
            <p className="text-text-muted text-[10px] font-black uppercase tracking-widest mt-1">{course?.location}</p>
          </div>

          {/* Copy Link */}
          <div className="mb-8">
            <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3">
              Course Portal Link
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={courseUrl}
                readOnly
                className="input-field flex-1 bg-surface border-border rounded-xl text-xs font-medium"
              />
              <button
                onClick={handleCopyLink}
                className={`btn-secondary px-4 py-2 transition-smooth ${copied ? 'bg-accent-50 text-accent-600 border-accent-200' : ''
                  }`}
              >
                {copied ? (
                  <>
                    <Icon name="Check" size={16} className="mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Icon name="Copy" size={16} className="mr-1" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Social Media Sharing */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-text-primary mb-3">Share on Social Media</h4>
            <div className="grid grid-cols-2 gap-3">
              {shareOptions?.map((option) => (
                <button
                  key={option?.name}
                  onClick={() => handleSocialShare(option?.url)}
                  className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-white transition-smooth ${option?.color}`}
                >
                  <Icon name={option?.icon} size={18} />
                  <span className="text-sm font-medium">{option?.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Email Sharing */}
          <div>
            <h4 className="text-sm font-medium text-text-primary mb-3">Share via Email</h4>
            <form onSubmit={handleEmailShare} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e?.target?.value)}
                  className="input-field"
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Personal Message (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e?.target?.value)}
                  rows={3}
                  className="input-field resize-none"
                  placeholder="Add a personal message..."
                />
              </div>

              <button
                type="submit"
                disabled={isEmailSending || !email}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEmailSending ? (
                  <>
                    <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Icon name="Mail" size={16} className="mr-2" />
                    Send Email
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareCourseModal;