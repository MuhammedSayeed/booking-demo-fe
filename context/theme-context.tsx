'use client';
import { createContext, useContext, ReactNode } from 'react';
import { ThemeResponse } from '@/lib/theme';

const ThemeContext = createContext<ThemeResponse | null>(null);

export function WebsiteThemeProvider({ children, data }: { children: ReactNode; data: ThemeResponse }) {
    return (
        <ThemeContext.Provider value={data}>
            {children}
        </ThemeContext.Provider>
    )
}


export function useThemeData() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeData must be used within a ThemeProvider');
    }
    return context;
}