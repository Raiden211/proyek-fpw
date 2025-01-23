import func from "../function/AdminFunction";
import { Router } from "express";
import { extractjwt, requireAdmin } from "../middleware/auth";
import upload from "../middleware/upload";

const router = Router();

router.post(
  "/barang",
  extractjwt,
  requireAdmin,
  upload.single("image"),
  func.addBarang
);
router.put(
  "/barang/:id",
  extractjwt,
  requireAdmin,
  upload.single("newImagePath"),
  func.editBarang
);
router.delete("/barang/:id", extractjwt, requireAdmin, func.deleteBarang);
router.post("/kupon", extractjwt, requireAdmin, func.createKupon);
router.post("/jenis", extractjwt, requireAdmin, func.createJenis);
router.post("/register", extractjwt, requireAdmin, func.addAnotherAdmin);
router.get("/report", extractjwt, requireAdmin, func.showReport);

export default router;
