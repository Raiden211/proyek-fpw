import func from "../function/MainFunction";
import { Router } from 'express';

const router = Router();

router.post('/register', func.doRegister);
router.post('/login',func.doLogin);
router.get("/user",func.getUsername);
router.get("/users",func.showAllUsers);
router.get('/barang/:id', func.showABarang);
router.get('/barang',func.showAllBarang);
router.get("/jenis",func.showAllJenis);
router.get('/kupon',func.showKupon);
router.get('/transaction',func.showTransaction);
router.get('/kupon/active', func.showActiveKupon);

export default router;