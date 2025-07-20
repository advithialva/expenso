import ratelimit from "../config/upstash.js";

const ratelimiter = async (req, res, next) => {
    try {
        //I kept it simple here, can customize the key based on user ID or IP address
        const {success} = await ratelimit.limit("my-rate-limit");
        
        if (!success) {
            return res.status(429).json({ message: "Too many requests, please try again later." });
        }
        
        next();
    } catch (error) {
        console.error("Rate limiter error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export default ratelimiter;