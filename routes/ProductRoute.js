import express from "express";
import {
    deleteFile,
    downloadProduct,
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
// router.delete('/products/:filename/',authenticateJWT, deleteFile);

export default router;