import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    try {
        let token = req.headers.token || req.headers.authorization;
        if (!token) {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }
        
        // Handle optional Bearer prefix
        if (token.startsWith('Bearer ')) {
            token = token.slice(7);
        }
        
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.userId) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }
        
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.log(error.message);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Token expired" });
        }
        return res.status(500).json({ success: false, message: error.message });
    }
};

export default authUser;