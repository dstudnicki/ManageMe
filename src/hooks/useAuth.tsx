import { useState, useEffect } from "react";
import { api } from "../services/api";

export const useAuth = () => {
    const [user, setUser] = useState<{ _id: string; email: string } | null>(null);
    // Login function
    const login = async (email: string, password: string) => {
        try {
            const { data } = await api.post("/auth/login", { email, password });
            const token = data.token;
            const expirationTime = Date.now() + 3600 * 1000;
            localStorage.setItem("token", token);
            localStorage.setItem("tokenExpiration", expirationTime.toString());
            setTokenExpiry();
            const user = await fetchMyProfile();
            if (user) {
                return { success: true, user };
            }
            return { error: "Failed to fetch user" };
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    // Register function
    const register = async (email: string, password: string) => {
        try {
            await api.post("/auth/register", { email, password });
        } catch (error) {
            console.error("Registration failed:", error);
        }
    };

    // Fetch your profile from the token
    const fetchMyProfile = async () => {
        try {
            const { data } = await api.get("/user/profile/me", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass token in the header
                },
            });
            setUser(data.user);
            return data.user;
        } catch (error) {
            console.error("Failed to fetch your profile:", error);
            return null;
        }
    };

    // Fetch another user's profile by username
    const fetchUserByUsername = async (username: string) => {
        try {
            const { data } = await api.get(`/profile/${username}`);
            return data; // Return fetched user profile
        } catch (error) {
            console.error("Failed to fetch user by username:", error);
            throw error;
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem("token"); // Remove token
        setUser(null);
    };

    const setTokenExpiry = () => {
        const expirationTime = parseInt(localStorage.getItem("tokenExpiration") || "0", 10);
        if (expirationTime) {
            const remainingTime = expirationTime - Date.now();
            if (remainingTime > 0) {
                setTimeout(() => {
                    logout(); // Automatically log out the user
                    console.log("Token expired. User logged out.");
                }, remainingTime);
            } else {
                logout(); // Token already expired
            }
        }
    };

    // Initialize token expiration on app load
    useEffect(() => {
        setTokenExpiry();
    }, []);

    return { user, login, register, logout, fetchMyProfile, fetchUserByUsername };
};
