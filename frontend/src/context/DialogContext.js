import React, { createContext, useContext, useState } from 'react';

const DialogContext = createContext();

export const useDialog = () => {
    const context = useContext(DialogContext);
    if (!context) {
        throw new Error('useDialog must be used within a DialogProvider');
    }
    return context;
};

export const DialogProvider = ({ children }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogComponent, setDialogComponent] = useState(null);

    const openDialog = (component, props={}) => {
        setDialogComponent(component);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setDialogComponent(null);
    };

    return (
        <DialogContext.Provider value={{ dialogComponent, isDialogOpen, openDialog, closeDialog }}>
            {children}
            {isDialogOpen && dialogComponent && (
                <div className="dialog-overlay" sx={{ overflowY: 'scroll' }}>
                    {dialogComponent}
                </div>
            )}
        </DialogContext.Provider>
    );
};
