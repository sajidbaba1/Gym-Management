import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

axios.defaults.baseURL = 'http://localhost:8080';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchCurrentUser = async () => {
        try {
            const response = await axios.get('/api/v1/users/me');
            setUser(response.data);
            setIsAuthenticated(true);
            localStorage.setItem('role', response.data.role);
        } catch (error) {
            console.error("Failed to fetch user", error);
            logout(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchCurrentUser();
        } else {
            setLoading(false);
        }

        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    console.warn("Session expired or invalid token.");
                    logout();
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post('/api/v1/auth/authenticate', {
                email,
                password
            });
            const { token } = response.data;
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            await fetchCurrentUser();
            toast.success("Login successful!");
            return true;
        } catch (error) {
            toast.error("Login failed. Check your credentials.");
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const response = await axios.post('/api/v1/auth/register', userData);
            const { token } = response.data;
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            await fetchCurrentUser();
            toast.success("Account created successfully!");
            return true;
        } catch (error) {
            toast.error("Registration failed.");
            throw error;
        }
    };

    const logout = (redirect = true) => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setUser(null);
        setIsAuthenticated(false);
        delete axios.defaults.headers.common['Authorization'];
        if (redirect) {
            toast.success("Logged out");
            navigate('/login');
        }
    };

    const loginWithOtp = async (email, otp) => {
        try {
            const response = await axios.post('/api/v1/auth/verify-otp', { email, otp });
            const { token } = response.data;
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            await fetchCurrentUser();
            toast.success("Login successful!");
            return true;
        } catch (error) {
            toast.error("Invalid OTP.");
            throw error;
        }
    };

    const updateProfile = async (userData) => {
        try {
            const response = await axios.put('/api/v1/users/me', userData);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            }
            setUser(response.data);
            toast.success("Profile updated successfully!");
            return response.data;
        } catch (error) {
            toast.error("Failed to update profile.");
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, loginWithOtp, register, logout, updateProfile, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
