import { Router } from "express";
import upload from "../middlewares/upload.middlewares.js";
import authenticate from "../middlewares/auth.middlewares.js";
import {
  deleteFile, downloadInfo, downloadFile, generateQR, generateShareShortenLink,
  getDownloadCount, getFileDetails, getUserFiles, resolveShareLink, searchFiles,
  sendLinkEmail, showUserFiles, updateAllFileExpiry, updateFileExpiry,
  updateFilePassword, updateFileStatus, uploadFiles, verifyFilePassword,
} from "../controllers/file.controller.js";

const router = Router();

router.post("/upload", authenticate, upload.array('files'), uploadFiles);
router.get("/download/:fileId", authenticate, downloadFile);
router.delete("/delete/:fileId", authenticate, deleteFile);
router.put("/update/:fileId", authenticate, updateFileStatus);
router.get("/getFileDetails/:fileId", authenticate, getFileDetails);
router.post("/generateShareShortenLink", authenticate, generateShareShortenLink);
router.post("/sendLinkEmail", authenticate, sendLinkEmail);
router.post("/FileExpiry", authenticate, updateFileExpiry);
router.post("/updateAllFileExpiry", authenticate, updateAllFileExpiry);
router.post("/updateFilePassword", authenticate, updateFilePassword);
router.get("/searchFiles", authenticate, searchFiles);
router.get("/showUserFiles", authenticate, showUserFiles);
router.get("/generateQR/:fileId", authenticate, generateQR);
router.get("/getDownloadCount/:fileId", authenticate, getDownloadCount);
router.get("/f/:shortCode", downloadInfo);
router.get("/resolveShareLink/:code", resolveShareLink);
router.post("/verifyFilePassword", verifyFilePassword);
router.get("/getUserFiles/:userId", authenticate, getUserFiles);

export default router;
