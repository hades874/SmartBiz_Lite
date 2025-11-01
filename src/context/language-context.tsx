
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
        totalRevenue: string;
        totalRevenueDescription: string;
        activeCustomers: string;
        activeCustomersDescription: string;
        stockValue: string;
        stockValueDescription: string;
        pendingPayments: string;
        pendingPaymentsDescription: string;
        salesOverview: string;
        salesOverviewDescription: string;
        recentSales: string;
        recentSalesDescription: (count: number) => string;
        inventoryAlerts: string;
        inventoryAlertsDescription: string;
        inventoryAlertsEmpty: string;
        lowStock: string;
        overstock: string;
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
        totalRevenue: 'Total Revenue',
        totalRevenueDescription: '+20.1% from last month',
        activeCustomers: 'Active Customers',
        activeCustomersDescription: '+180.1% from last month',
        stockValue: 'Stock Value',
        stockValueDescription: 'Total value of current inventory',
        pendingPayments: 'Pending Payments',
        pendingPaymentsDescription: 'From 12 invoices',
        salesOverview: 'Sales Overview',
        salesOverviewDescription: 'An overview of your sales for the last year.',
        recentSales: 'Recent Sales',
        recentSalesDescription: (count) => `You made ${count} sales this month.`,
        inventoryAlerts: 'Inventory Alerts',
        inventoryAlertsDescription: 'Items that need your attention.',
        inventoryAlertsEmpty: 'All inventory levels are looking good!',
        lowStock: 'Low Stock',
        overstock: 'Overstock',
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
        totalRevenue: 'মোট রাজস্ব',
        totalRevenueDescription: 'গত মাস থেকে +২০.১%',
        activeCustomers: 'সক্রিয় গ্রাহক',
        activeCustomersDescription: 'গত মাস থেকে +১৮০.১%',
        stockValue: 'স্টকের মূল্য',
        stockValueDescription: 'বর্তমান ইনভেন্টরির মোট মূল্য',
        pendingPayments: 'মুলতবি পেমেন্ট',
        pendingPaymentsDescription: '১২টি চালান থেকে',
        salesOverview: 'বিক্রয় ওভারভিউ',
        salesOverviewDescription: 'গত বছরের আপনার বিক্রয়ের একটি ওভারভিউ।',
        recentSales: 'সাম্প্রতিক বিক্রয়',
        recentSalesDescription: (count) => `আপনি এই মাসে ${count}টি বিক্রয় করেছেন।`,
        inventoryAlerts: 'ইনভেন্টরি সতর্কতা',
        inventoryAlertsDescription: 'যে আইটেমগুলিতে আপনার মনোযোগ প্রয়োজন।',
        inventoryAlertsEmpty: 'সমস্ত ইনভেন্টরি লেভেল ভাল দেখাচ্ছে!',
        lowStock: 'কম স্টক',
        overstock: 'অতিরিক্ত স্টক',
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
