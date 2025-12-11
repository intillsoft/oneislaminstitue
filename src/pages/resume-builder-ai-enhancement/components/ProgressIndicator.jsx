import React from 'react';
import Icon from 'components/AppIcon';

const ProgressIndicator = ({ currentStep, steps, progress }) => {
  return (
    <div className="bg-background rounded-lg shadow-sm border border-border p-6">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-primary">Overall Progress</span>
          <span className="text-sm font-semibold text-primary">{progress}%</span>
        </div>
        <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      {/* Steps */}
      <div className="hidden md:flex items-center justify-between">
        {steps?.map((step, index) => (
          <div key={step?.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  currentStep === step?.id
                    ? 'bg-primary text-white ring-4 ring-primary/20'
                    : currentStep > step?.id
                    ? 'bg-success text-white' :'bg-surface text-text-muted border border-border'
                }`}
              >
                {currentStep > step?.id ? (
                  <Icon name="Check" size={18} />
                ) : (
                  <Icon name={step?.icon} size={18} />
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  currentStep === step?.id
                    ? 'text-primary'
                    : currentStep > step?.id
                    ? 'text-success' :'text-text-muted'
                }`}
              >
                {step?.name}
              </span>
            </div>
            {index < steps?.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 bg-surface">
                <div
                  className={`h-full transition-all duration-300 ${
                    currentStep > step?.id ? 'bg-success' : 'bg-transparent'
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Mobile View */}
      <div className="md:hidden">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
            <Icon name={steps?.[currentStep - 1]?.icon} size={18} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-text-primary">
              {steps?.[currentStep - 1]?.name}
            </p>
            <p className="text-xs text-text-secondary">
              {steps?.[currentStep - 1]?.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;