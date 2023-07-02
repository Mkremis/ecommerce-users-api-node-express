import { allowedOrigins } from "./allowedOrigins";

export const corsOptions = {
    credentials: true,
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            console.log("origin", origin)
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}

