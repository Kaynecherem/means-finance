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

                        }
                    )
                )

    return (
        <DirectusContext.Provider value={providerValue}>
            {children}
        </DirectusContext.Provider>
    );
};
