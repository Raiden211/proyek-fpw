import { useEffect, useState } from 'react';
import DataHandler from './DataHandler'; // Import from dataHandler

const useUserData = () => {
    const [user, setUser] = useState({ username: null, role: null });

    useEffect(() => {
        const userData = DataHandler.getUsername();
        setUser(userData);
    }, []);

    return user;
};

export default useUserData;