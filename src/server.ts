
import express, {Request, Response, NextFunction} from 'express';
import {PORT} from "./config/libConfig.ts";
import {libRouter} from "./routes/libRouter.ts";
import {errorHandler} from "./errorHandler/errorHandler.ts";

export const launchServer = () => {
    const app = express();
    app.listen(PORT, () => console.log(`Server runs at http://localhost:${PORT}`));

//==================Middleware================
    app.use(express.json());
    app.use((req: Request, res:Response, next:NextFunction) => next())
//==================Router====================
    app.use('/api', libRouter);
    app.use((req, res) => {
        res.status(404).send("Page not found")
    })

//================ErrorHandler================
app.use(errorHandler)
}