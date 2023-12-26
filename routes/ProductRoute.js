import express from "express";
import {
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

export default router;