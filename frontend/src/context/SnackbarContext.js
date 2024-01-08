import React, { createContext, useContext, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const SnackbarContext = createContext();

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error('useSnackbar must be used within a SnackbarProvider');
    }
    return context;
};

export const SnackbarProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [type, setType] = useState(null);
    const [message, setMessage] = useState(null);

    const openSnackbar = (type, message) => {
        setType(type);
        setMessage(message);
        setIsOpen(true);
    };

    const closeSnackbar = () => {
        setIsOpen(false);
        setMessage(null);
        setType(null);
    };

    return (
        <SnackbarContext.Provider value={{ isOpen, type, message, closeSnackbar, openSnackbar  }}>
            {children}
            {isOpen && type && message && (
                <div className="snackbar-overlay">
                    <Snackbar
                      open={isOpen}
                      autoHideDuration={6000}
                      onClose={closeSnackbar}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                      sx={{ zIndex: 9999 }}
                    >
                        {type === 'success' ? 
                            <Alert onClose={closeSnackbar} severity="success" sx={{ width: '100%' }}>
                                {message}
                            </Alert> 
                        : type === 'error' ?
                            <Alert onClose={closeSnackbar} severity="error" sx={{ width: '100%' }}>
                                {message}
                            </Alert> 
                        : 
                            <Alert onClose={closeSnackbar} severity="info" sx={{ width: '100%' }}>
                                {message}
                            </Alert> 
                        }
                    </Snackbar>
                </div>
            )}
        </SnackbarContext.Provider>
    );
};
