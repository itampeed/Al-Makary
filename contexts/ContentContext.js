import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchCatalogFromSupabase } from '../services/supabaseContent';

const ContentContext = createContext();

export const useContent = () => {
    return useContext(ContentContext);
};

export const ContentProvider = ({ children }) => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const refreshContent = async () => {
        try {
            setLoading(true);
            const data = await fetchCatalogFromSupabase();
            setBooks(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching content:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshContent();
    }, []);

    const value = {
        books,
        loading,
        error,
        refreshContent
    };

    return (
        <ContentContext.Provider value={value}>
            {children}
        </ContentContext.Provider>
    );
};
