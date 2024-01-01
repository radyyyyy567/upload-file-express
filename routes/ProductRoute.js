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

const router = express.Router();

router.post('/products',authenticateJWT,  saveProduct); 
router.post('/products/pdf',authenticateJWT,  saveDataPDF);
router.get('/products/:filename', getProduct);
router.get('/products/download/:filename/:title', downloadProduct);
router.get('/products/download/real/:filename/:title', downloadRealFile);
router.delete('/products/:filename/',authenticateJWT, deleteFile);

export default router;