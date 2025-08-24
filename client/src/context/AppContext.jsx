import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Create the context
const AppContext = createContext();

// Custom hook to use the AppContext
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};

// Export the context for direct use if needed
export { AppContext };

const AppContextProvider = ({ children }) => {
  const [credit, setCredit] = useState(0);
  const [image, setImage] = useState(false);
  const [resultImage, setResultImage] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  // Check if user is authenticated on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      loadUserProfile();
    }
  }, []);

  // Load user profile from token
  const loadUserProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { token }
      });

      if (response.data.success) {
        setUserData(response.data.user);
        setCredit(response.data.user.creditBalance);
        setIsAuthenticated(true);
      } else {
        // Token might be invalid, clear it
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUserData(null);
        setCredit(0);
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
      // Token might be invalid, clear it
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUserData(null);
      setCredit(0);
    } finally {
      setLoading(false);
    }
  };

  // Sign up function
  const signUp = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.post(`${backendUrl}/api/user/signup`, userData);
      
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setUserData(user);
        setCredit(user.creditBalance);
        setIsAuthenticated(true);
        toast.success("Account created successfully!");
        navigate('/');
        return { success: true };
      } else {
        toast.error(response.data.message || "Failed to create account");
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error("Sign up error:", error);
      const message = error.response?.data?.message || "Failed to create account";
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Sign in function
  const signIn = async (credentials) => {
    try {
      setLoading(true);
      const response = await axios.post(`${backendUrl}/api/user/signin`, credentials);
      
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setUserData(user);
        setCredit(user.creditBalance);
        setIsAuthenticated(true);
        toast.success("Signed in successfully!");
        navigate('/');
        return { success: true };
      } else {
        toast.error(response.data.message || "Failed to sign in");
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error("Sign in error:", error);
      const message = error.response?.data?.message || "Failed to sign in";
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Google sign in function
  const googleSignIn = async (idToken) => {
    try {
      setLoading(true);
      const response = await axios.post(`${backendUrl}/api/user/google-signin`, { idToken });
      
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setUserData(user);
        setCredit(user.creditBalance);
        setIsAuthenticated(true);
        toast.success("Google sign in successful!");
        navigate('/');
        return { success: true };
      } else {
        toast.error(response.data.message || "Failed to sign in with Google");
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error("Google sign in error:", error);
      const message = error.response?.data?.message || "Failed to sign in with Google";
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = () => {
    localStorage.removeItem('token');
    setUserData(null);
    setCredit(0);
    setIsAuthenticated(false);
    navigate('/');
    toast.success("Signed out successfully!");
  };

  // Load credit data
  const loadCreditData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`${backendUrl}/api/user/credits`, {
        headers: { token }
      });
      
      if (response.data.success) {
        setCredit(response.data.credits);
        console.log("Credits loaded:", response.data.credits);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Remove background function
  const removeBg = async (image) => {
    try {
      if (!isAuthenticated) {
        navigate('/signin');
        return;
      }

      setImage(image);
      setResultImage(false);
      navigate('/result');

      const token = localStorage.getItem('token');
      const formData = new FormData();
      image && formData.append("image", image);
      
      const response = await axios.post(`${backendUrl}/api/image/remove-bg`, formData, {
        headers: { token }
      });

      if (response.data.success) {
        setResultImage(response.data.resultImage);
        response.data.creditBalance && setCredit(response.data.creditBalance);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
        response.data.creditBalance && setCredit(response.data.creditBalance);
        if (response.data.creditBalance === 0) {
          navigate('/buy');
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const value = {
    credit,
    setCredit,
    loadCreditData,
    loadUserProfile,
    userData,
    loading,
    backendUrl,
    image,
    setImage,
    removeBg,
    resultImage,
    setResultImage,
    isAuthenticated,
    signUp,
    signIn,
    googleSignIn,
    signOut
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
