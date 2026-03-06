import React, { createContext, useContext, useState } from 'react';
import { donationService } from '../services/donationService';
import { useToast } from '../components/ui/Toast';

const DonationContext = createContext();

export const useDonation = () => {
    return useContext(DonationContext);
};

export const DonationProvider = ({ children }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [lastDonation, setLastDonation] = useState(null);
    const [error, setError] = useState(null);
    const { success, error: toastError } = useToast();

    /**
     * Handle the entire donation flow
     * @param {number} amount 
     * @param {string} type 'monthly' | 'one-time'
     * @param {string} method 'card' | 'paypal'
     */
    const donate = async (amount, type = 'one-time', method = 'card') => {
        setIsProcessing(true);
        setError(null);

        try {
            // 1. Prepare Data
            const donationData = {
                amount,
                type,
                currency: 'USD',
                method,
                timestamp: new Date().toISOString()
            };

            // 2. Call Service
            const result = await donationService.processDonation(donationData);

            // 3. Handle Success
            setLastDonation({ ...donationData, ...result });
            success(`JazakAllah Khair! Your $${amount} donation was successful.`);
            return { success: true, result };

        } catch (err) {
            // 4. Handle Error
            console.error(err);
            setError(err.message);
            toastError(err.message || "Donation failed. Please try again.");
            return { success: false, error: err.message };
        } finally {
            setIsProcessing(false);
        }
    };

    const clearLastDonation = () => setLastDonation(null);

    const value = {
        isProcessing,
        lastDonation,
        error,
        donate,
        clearLastDonation
    };

    return (
        <DonationContext.Provider value={value}>
            {children}
        </DonationContext.Provider>
    );
};
