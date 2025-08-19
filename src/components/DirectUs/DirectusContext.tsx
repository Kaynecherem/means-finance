import { authentication, AuthenticationData, createDirectus, rest, staticToken } from '@directus/sdk';
import React, { createContext, ReactNode, useContext, useMemo } from 'react';
import { DirectusContextClient } from '../../utils/types/directus';
import { Schema } from '../../utils/types/schema';

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
    const providerValue = useMemo(() => ({
        directusClient: createDirectus<Schema>(process.env.REACT_APP_DIRECTUS_URL!)
            .with(staticToken(process.env.REACT_APP_DIRECTUS_STATIC_TOKEN!))
            .with(
                authentication(
                    'json',
                    {
                        autoRefresh: true,
                        storage: {
                            get: () => {
                                const data = localStorage.getItem('authenticationData');
                                if (data) {
                                    return JSON.parse(data);
                                }
                                return null;
                            },
                            set: (value: AuthenticationData | null) =>
                                localStorage.setItem('authenticationData', JSON.stringify(value))
                        }
                    }
                )
            )
            .with(rest())
    }), []);
    return (
        <DirectusContext.Provider value={providerValue}>
            {children}
        </DirectusContext.Provider>
    );
};
