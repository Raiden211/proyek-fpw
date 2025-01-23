import func from "../function/UsersFunction";
import { Router } from "express";
import { extractjwt, requireUser } from "../middleware/auth";
import upload from "../middleware/upload";
import multer from "multer";
const router = Router();
const upload2 = multer();
router.post("/cart", extractjwt, requireUser, func.addToCart);
router.get("/cart", extractjwt, requireUser, func.showCart);
router.put("/cart", extractjwt, requireUser, func.editCart);
router.post("/checkout", extractjwt, requireUser, func.checkoutCart);
router.get("/transaction", extractjwt, requireUser, func.showMyTrans);
router.post("/topup", extractjwt, requireUser, func.topupSaldo);
router.get("/saldo", extractjwt, requireUser, func.getCurrentSaldo);
router.get("/details", extractjwt, requireUser, func.getUserDetails);
router.put(
  "/update-password",
  extractjwt,
  requireUser,
  upload2.none(), // Parse form-data without files
  func.updatePassword
);
router.post("/review/:id", extractjwt, requireUser, func.addReview);
router.delete(
  "/review/:id_barang/:id_review",
  extractjwt,
  requireUser,
  func.deleteReview
);
export default router;
