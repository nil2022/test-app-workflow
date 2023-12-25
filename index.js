import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_TIMEOUT * 60 * 1000 || 15 * 60 * 1000, // take rate limit timeout from environment variables, default to 15 minutes
  max: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: async (req, res) => {
    // console.log(res.getHeaders('x-powered-by'));
    let retryAfter = 0;
      for (const key in res.getHeaders()) {
        if (key.startsWith("retry-after")) {
          retryAfter = res.getHeaders()[key];
          if (retryAfter > 60) {
            console.log(`IP->[${req.protocol}://${req.host}:${req.socket.localPort}${req.url}] [${req.method}] is rate-limited!, Waiting ${Math.ceil(retryAfter/60)} minutes. `);
            return  `You can only make 5 requests every ${process.env.RATE_LIMIT_TIMEOUT} minutes. Retry after ${Math.ceil(retryAfter/60)} minutes.`;
          }
        }
      }
      console.log(`IP->[${req.protocol}://${req.host}:${req.socket.localPort}${req.url}] [${req.method}] is rate-limited!, Waiting ${retryAfter} seconds. `);
      return `You can only make 5 requests every minute. Retry after ${retryAfter} seconds.`;
    
  },
});

// Initialize express app
const app = express();
app.use(limiter);
const port = process.env.PORT || 3000;

app.use(cors()); // Enable CORS for all routes
app.use(morgan("combined")); // Enable HTTP request logging

// Serve homepage
app.get("/", (req, res) => {
  res.send("Welcome to the Home Page 🏠");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
