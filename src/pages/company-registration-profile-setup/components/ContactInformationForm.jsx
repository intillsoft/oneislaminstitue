import React from 'react';
import Icon from 'components/AppIcon';

const ContactInformationForm = ({ formData, handleChange, errors }) => {
  const positions = [
    'CEO/Founder',
    'HR Manager',
    'Recruiter',
    'Hiring Manager',
    'Department Head',
    'Office Manager',
    'Executive Assistant',
    'Other'
  ];
  
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-xl font-black text-text-primary uppercase tracking-tight mb-2">Contact Information</h2>
        <p className="text-xs font-medium text-text-muted leading-relaxed">
          Provide contact details for your company. This information will be used for account verification and communication.
        </p>
      </div>
      <div className="space-y-6">
        {/* Contact Name */}
        <div>
          <label htmlFor="contactName" className="block text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 mb-2">
            Contact Name <span className="text-error">*</span>
          </label>
          <input
            type="text"
            id="contactName"
            name="contactName"
            value={formData?.contactName}
            onChange={handleChange}
            className={`input-field ${errors?.contactName ? 'border-error focus:ring-error' : ''}`}
            placeholder="Full name of primary contact"
          />
          {errors?.contactName && (
            <p className="mt-1 text-sm text-error flex items-center">
              <Icon name="AlertCircle" size={14} className="mr-1" />
              {errors?.contactName}
            </p>
          )}
        </div>
        
        {/* Contact Email & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Email */}
          <div>
            <label htmlFor="contactEmail" className="block text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 mb-2">
              Contact Email <span className="text-error">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="Mail" size={16} className="text-workflow-primary/50" />
              </div>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={formData?.contactEmail}
                onChange={handleChange}
                className={`input-field pl-10 ${errors?.contactEmail ? 'border-error focus:ring-error' : ''}`}
                placeholder="email@company.com"
              />
            </div>
            {errors?.contactEmail && (
              <p className="mt-1 text-sm text-error flex items-center">
                <Icon name="AlertCircle" size={14} className="mr-1" />
                {errors?.contactEmail}
              </p>
            )}
            <p className="mt-1 text-xs text-text-secondary">
              We'll send a verification email to this address
            </p>
          </div>
          
          {/* Contact Phone */}
          <div>
            <label htmlFor="contactPhone" className="block text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 mb-2">
              Contact Phone
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="Phone" size={16} className="text-workflow-primary/50" />
              </div>
              <input
                type="tel"
                id="contactPhone"
                name="contactPhone"
                value={formData?.contactPhone}
                onChange={handleChange}
                className={`input-field pl-10 ${errors?.contactPhone ? 'border-error focus:ring-error' : ''}`}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            {errors?.contactPhone && (
              <p className="mt-1 text-sm text-error flex items-center">
                <Icon name="AlertCircle" size={14} className="mr-1" />
                {errors?.contactPhone}
              </p>
            )}
          </div>
        </div>
        
        {/* Position */}
        <div>
          <label htmlFor="contactPosition" className="block text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 mb-2">
            Position at Company
          </label>
          <select
            id="contactPosition"
            name="contactPosition"
            value={formData?.contactPosition}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Select position</option>
            {positions?.map((position, index) => (
              <option key={index} value={position}>
                {position}
              </option>
            ))}
          </select>
        </div>
        
        {/* Verification Notice */}
        <div className="bg-surface/50 p-8 rounded-[2.5rem] border border-border shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <Icon name="Shield" size={80} />
          </div>
          <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-4 flex items-center">
            <Icon name="Shield" size={14} className="mr-2 text-workflow-primary" />
            Verification Process
          </h3>
          <p className="text-sm text-text-secondary">
            To ensure the authenticity of employer accounts, we'll send a verification email to the address provided. 
            For premium features, additional verification may be required.
          </p>
          
          <div className="mt-4 flex items-start">
            <div className="flex items-center h-5">
              <input
                id="verification-consent"
                name="verification-consent"
                type="checkbox"
                className="h-4 w-4 text-primary border-secondary-300 rounded focus:ring-primary"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="verification-consent" className="text-text-secondary">
                I understand that my company information will be verified before full access is granted
              </label>
            </div>
          </div>
        </div>
        
        {/* Optional Document Upload */}
        <div>
          <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 mb-4">
            Business Verification (Optional)
          </label>
          <div className="mt-1 flex justify-center px-6 pt-12 pb-12 border-2 border-dashed border-border hover:border-workflow-primary/30 transition-all rounded-[2.5rem] bg-surface/50 shadow-inner group">
            <div className="space-y-4 text-center">
              <Icon name="FileText" size={32} className="mx-auto text-workflow-primary/20 group-hover:text-workflow-primary/40 transition-colors" />
              <div className="flex text-sm text-text-secondary">
                <label
                  htmlFor="business-document"
                  className="relative cursor-pointer bg-background rounded-md font-medium text-primary hover:text-primary-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                >
                  <span>Upload a document</span>
                  <input id="business-document" name="business-document" type="file" className="sr-only" />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-text-secondary">
                Business license, registration, or other official document (PDF, JPG, PNG)
              </p>
            </div>
          </div>
          <p className="mt-2 text-xs text-text-secondary">
            Uploading verification documents can expedite the approval process and unlock premium features.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactInformationForm;