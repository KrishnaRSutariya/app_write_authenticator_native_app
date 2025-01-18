import React, { createContext, useContext, useState, useCallback, PropsWithChildren } from 'react';
import { Snackbar } from 'react-native-paper';

export type SnackbarContextType = {
    showSnackbar: (message: string) => void;
    hideSnackbar: () => void;
};

const SnackbarContext = createContext<SnackbarContextType>({
    showSnackbar: () => { },
    hideSnackbar: () => { },
});

export const SnackbarProvider = ({ children }: PropsWithChildren) => {
    const [snackBar, setSnackBar] = useState<string | null>(null);

    const showSnackbar = useCallback((message: string) => {
        setSnackBar(message);
    }, []);

    const hideSnackbar = useCallback(() => {
        setSnackBar(null);
    }, []);

    return (
        <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
            {children}
            <Snackbar
                visible={!!snackBar}
                onDismiss={hideSnackbar}
                action={{
                    label: 'Close',
                    onPress: hideSnackbar,
                }}
                duration={30000}
            >
                {snackBar}
            </Snackbar>
        </SnackbarContext.Provider>
    );
};

export const useSnackbar = () => useContext(SnackbarContext);
