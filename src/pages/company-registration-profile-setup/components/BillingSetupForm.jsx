import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const BillingSetupForm = ({ formData, handleChange, errors }) => {
  const [showCardForm, setShowCardForm] = useState(false);
  
  const billingPlans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 'Free',
      description: 'Get started with basic job posting capabilities',
      features: [
        '1 active job posting',
        'Standard listing visibility',
        'Basic company profile',
        'Email support'
      ]
    },
    {
      id: 'standard',
      name: 'Standard',
      price: '$99',
      period: 'per month',
      description: 'Most popular plan for growing companies',
      features: [
        '5 active job postings',
        'Featured listings',
        'Enhanced company profile',
        'Applicant tracking',
        'Priority email support'
      ],
      recommended: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$299',
      period: 'per month',
      description: 'Advanced features for high-volume recruiting',
      features: [
        'Unlimited job postings',
        'Premium placement in search results',
        'Advanced analytics dashboard',
        'Candidate matching',
        'API access',
        'Dedicated account manager'
      ]
    }
  ];
  
  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'JP', name: 'Japan' },
    { code: 'SG', name: 'Singapore' },
    { code: 'IN', name: 'India' }
  ];
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-text-primary mb-2">Billing Setup</h2>
        <p className="text-text-muted font-medium">
          Choose a plan that fits your hiring needs. You can upgrade or downgrade at any time.
        </p>
      </div>
      <div className="space-y-8">
        {/* Billing Plans */}
        <div>
          <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 mb-4">
            Select a Plan <span className="text-error">*</span>
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {billingPlans?.map((plan) => (
              <div 
                key={plan?.id}
                className={`relative rounded-[2rem] border transition-all duration-300 p-6 cursor-pointer shadow-xl ${
                  formData?.billingPlan === plan?.id 
                    ? 'border-workflow-primary bg-bg-elevated' :'border-border dark:border-white/5 bg-bg hover:border-workflow-primary/30'
                }`}
                onClick={() => handleChange({ target: { name: 'billingPlan', value: plan?.id } })}
              >
                {plan?.recommended && (
                  <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary text-white">
                      Recommended
                    </span>
                  </div>
                )}
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="radio"
                      name="billingPlan"
                      id={`plan-${plan?.id}`}
                      value={plan?.id}
                      checked={formData?.billingPlan === plan?.id}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary border-secondary-300 focus:ring-primary"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor={`plan-${plan?.id}`} className="font-medium text-text-primary">
                      {plan?.name}
                    </label>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-baseline">
                    <span className="text-2xl font-black text-text-primary tracking-tight">{plan?.price}</span>
                    {plan?.period && (
                      <span className="ml-1 text-sm text-text-secondary">{plan?.period}</span>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-text-muted font-medium leading-relaxed">{plan?.description}</p>
                </div>
                
                <ul className="mt-4 space-y-2">
                  {plan?.features?.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Icon name="Check" size={16} className="mt-0.5 mr-2 text-accent" />
                      <span className="text-xs text-text-muted font-black uppercase tracking-widest">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          {errors?.billingPlan && (
            <p className="mt-2 text-sm text-error flex items-center">
              <Icon name="AlertCircle" size={14} className="mr-1" />
              {errors?.billingPlan}
            </p>
          )}
        </div>
        
        {/* Payment Method */}
        {formData?.billingPlan !== 'basic' && (
          <div>
            <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 mb-4">
              Payment Method
            </label>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCardForm(true)}
                  className={`flex items-center justify-center px-6 py-4 border rounded-2xl transition-all duration-300 font-black uppercase tracking-widest text-[10px] ${
                    showCardForm ? 'border-workflow-primary bg-bg-elevated text-workflow-primary' : 'border-border dark:border-white/10 bg-bg text-text-muted hover:text-text-primary'
                  }`}
                >
                  <Icon name="CreditCard" size={16} className="mr-3" />
                  <span>Credit Card</span>
                </button>
                
                <button
                  type="button"
                  className="flex items-center justify-center px-6 py-4 border border-border dark:border-white/10 rounded-2xl bg-bg text-text-muted hover:text-text-primary transition-all font-black uppercase tracking-widest text-[10px]"
                >
                  <Icon name="Shield" size={16} className="mr-3" />
                  <span>PayPal</span>
                </button>
              </div>
              
              {showCardForm && (
                <div className="mt-8 p-8 border border-border dark:border-white/5 rounded-[2.5rem] bg-bg shadow-2xl">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="card-number" className="block text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        id="card-number"
                        placeholder="1234 5678 9012 3456"
                        className="input-field"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expiration" className="block text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 mb-2">
                          Expiration Date
                        </label>
                        <input
                          type="text"
                          id="expiration"
                          placeholder="MM / YY"
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label htmlFor="cvc" className="block text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 mb-2">
                          CVC
                        </label>
                        <input
                          type="text"
                          id="cvc"
                          placeholder="123"
                          className="input-field"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="card-name" className="block text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 mb-2">
                        Name on Card
                      </label>
                      <input
                        type="text"
                        id="card-name"
                        placeholder="John Smith"
                        className="input-field"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center">
                    <Icon name="Lock" size={16} className="text-workflow-primary/50 mr-2" />
                    <span className="text-xs text-text-secondary">
                      Your payment information is secured with 256-bit encryption
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Billing Address */}
        {formData?.billingPlan !== 'basic' && (
          <div>
            <h3 className="text-xs font-black text-text-muted uppercase tracking-[0.2em] mb-4">Billing Address</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="billingAddress" className="block text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  id="billingAddress"
                  name="billingAddress"
                  value={formData?.billingAddress}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="123 Main St"
                />
              </div>
              
              <div>
                <label htmlFor="billingCity" className="block text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 mb-2">
                  City
                </label>
                <input
                  type="text"
                  id="billingCity"
                  name="billingCity"
                  value={formData?.billingCity}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="San Francisco"
                />
              </div>
              
              <div>
                <label htmlFor="billingState" className="block text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 mb-2">
                  State / Province
                </label>
                <input
                  type="text"
                  id="billingState"
                  name="billingState"
                  value={formData?.billingState}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="CA"
                />
              </div>
              
              <div>
                <label htmlFor="billingZip" className="block text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 mb-2">
                  ZIP / Postal Code
                </label>
                <input
                  type="text"
                  id="billingZip"
                  name="billingZip"
                  value={formData?.billingZip}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="94103"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="billingCountry" className="block text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 mb-2">
                  Country
                </label>
                <select
                  id="billingCountry"
                  name="billingCountry"
                  value={formData?.billingCountry}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Select country</option>
                  {countries?.map(country => (
                    <option key={country?.code} value={country?.code}>
                      {country?.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        
        {/* Coupon Code */}
        {formData?.billingPlan !== 'basic' && (
          <div>
            <label htmlFor="couponCode" className="block text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 mb-2">
              Coupon Code (Optional)
            </label>
            <div className="flex">
              <input
                type="text"
                id="couponCode"
                className="input-field rounded-r-none"
                placeholder="Enter coupon code"
              />
              <button
                type="button"
                className="px-4 py-2 bg-surface-elevated text-text-primary border border-border border-l-0 rounded-r-md hover:bg-workflow-primary hover:text-white transition-all duration-300 font-black uppercase tracking-widest text-[10px]"
              >
                Apply
              </button>
            </div>
          </div>
        )}
        
        {/* Billing Terms */}
        <div className="bg-surface/50 rounded-3xl p-6 border border-border">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-primary border-secondary-300 rounded focus:ring-primary"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="text-text-secondary">
                I agree to the <a href="#" className="text-primary hover:text-primary-700">Terms of Service</a> and <a href="#" className="text-primary hover:text-primary-700">Privacy Policy</a>
              </label>
            </div>
          </div>
          
          <p className="mt-3 text-xs text-text-secondary">
            {formData?.billingPlan === 'basic' ?'The Basic plan is free to use. You can upgrade to a paid plan at any time to access additional features.' :'Your subscription will begin immediately. You can cancel or change your plan at any time from your account settings.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BillingSetupForm;