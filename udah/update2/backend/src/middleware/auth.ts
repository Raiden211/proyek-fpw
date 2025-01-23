import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_KEY = "TOKOSERBAADA";

export interface JwtPayload {
    username: string;
    role: number;
}


export const extractjwt = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ message: "Authorization missing" });
            return;
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_KEY) as JwtPayload;
        (req as Request & { user: JwtPayload }).user = decoded;
        next();
    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            res.status(401).json({ message: "JWT expired" });
            return;
        }
        res.status(401).json({ message: "Invalid token" });
    }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as Request & { user: JwtPayload }).user;
    if (!user || user.role !== 1) {
        res.status(403).json({ message: "Kau bukan admin" });
        return;
    }
    next();
};

export const requireUser = (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as Request & { user: JwtPayload }).user;
    if (!user || user.role !== 2) {
        res.status(403).json({ message: "Kau bukan users" });
        return;
    }
    next();
};