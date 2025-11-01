
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'bn';

type Translations = {
    [key in Language]: {
        dashboard: string;
        salesForecasting: string;
        inventory: string;
        cashFlow: string;
        customers: string;
        reports: string;
        aiAgent: string;
        settings: string;
        loginTitle: string;
        loginDescription: string;
        emailLabel: string;
        passwordLabel: string;
        forgotPasswordLink: string;
        loginButton: string;
        loginWithGoogleButton: string;
        signupPrompt: string;
        signupLink: string;
    };
};

export const strings: Translations = {
    en: {
        dashboard: 'Dashboard',
        salesForecasting: 'Sales Forecasting',
        inventory: 'Inventory',
        cashFlow: 'Cash Flow',
        customers: 'Customers',
        reports: 'Reports',
        aiAgent: 'AI Agent',
        settings: 'Settings',
        loginTitle: 'Login',
        loginDescription: 'Enter your email below to login to your account',
        emailLabel: 'Email',
        passwordLabel: 'Password',
        forgotPasswordLink: 'Forgot your password?',
        loginButton: 'Login',
        loginWithGoogleButton: 'Login with Google',
        signupPrompt: "Don't have an account?",
        signupLink: 'Sign up',
    },
    bn: {
        dashboard: 'ড্যাশবোর্ড',
        salesForecasting: 'বিক্রয় পূর্বাভাস',
        inventory: 'ইনভেন্টরি',
        cashFlow: 'নগদ প্রবাহ',
        customers: 'গ্রাহক',
        reports: 'রিপোর্ট',
        aiAgent: 'এআই এজেন্ট',
        settings: 'সেটিংস',
        loginTitle: 'লগইন',
        loginDescription: 'আপনার অ্যাকাউন্টে লগইন করতে আপনার ইমেল লিখুন',
        emailLabel: 'ইমেল',
        passwordLabel: 'পাসওয়ার্ড',
        forgotPasswordLink: 'পাসওয়ার্ড ভুলে গেছেন?',
        loginButton: 'লগইন',
        loginWithGoogleButton: 'Google দিয়ে লগইন করুন',
        signupPrompt: 'অ্যাকাউন্ট নেই?',
        signupLink: 'সাইন আপ করুন',
    },
};

interface LanguageContextProps {
    language: Language;
    setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<Language>('en');

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
