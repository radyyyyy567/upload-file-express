import express from "express";
import {
    deleteFile,
    downloadProduct,
    downloadRealFile,
    getProduct,
    saveDataPDF,
    saveProduct,
    
} from "../controllers/ProductController.js";
import { authenticateJWT } from '../middleware/auth.js'
import dotenv from 'dotenv';
const router = express.Router();
dotenv.config();
const url = process.env.URL;
router.post(`${url}/products`,authenticateJWT,  saveProduct); 
router.post(`${url}/products/pdf`,authenticateJWT,  saveDataPDF);
router.get(`${url}/products/:filename`, getProduct);
router.get(`${url}/products/download/:filename/:title`, downloadProduct);
router.get(`${url}/products/download/real/:filename/:title`, downloadRealFile);
router.delete(`${url}/products/:filename/`,authenticateJWT, deleteFile);

export default router;