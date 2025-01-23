import LoginRoute from "./MainRoute"; 
import AdminRoute from "./AdminRoute";
import UsersRoute from "./UsersRoute";
import { Router } from 'express';

const router = Router();

router.use("/",LoginRoute);
router.use("/admin",AdminRoute);
router.use("/users",UsersRoute);

export default router;