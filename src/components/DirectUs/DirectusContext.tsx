import React, { createContext, ReactNode, useContext, useMemo, useEffect } from 'react';
import { DirectusContextClient } from '../../utils/types/directus';
import { directusClient, restoreSession } from '../../lib/directus';

interface DirectusContextProps {
    directusClient: DirectusContextClient
}


const DirectusContext = createContext<DirectusContextProps | undefined>(undefined);

interface DirectusProviderProps {
    children: ReactNode;
}

export const useDirectUs = () => {
    const context = useContext(DirectusContext);
    if (!context) {
        throw new Error('useDirectus must be used within a DirectusProvider');
    }
    return context;
};

export const DirectusProvider: React.FC<DirectusProviderProps> = ({ children }) => {
    useEffect(() => {
        restoreSession();
    }, []);

    const providerValue = useMemo(() => ({
        directusClient
    }), []);

    return (
        <DirectusContext.Provider value={providerValue}>
            {children}
        </DirectusContext.Provider>
    );
};
