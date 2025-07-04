import { Router } from 'express';
import { updateProduct,deleteProduct,getAllProducts,getProductById,createProduct } from '../controllers/product.controller.js';
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from '../middlewares/auth.middleware.js';
import requireRole from "../middlewares/requireRole.middleware.js";
const router  = Router();


router.route("/updatestock").put(verifyJWT,requireRole("admin"),updateProduct);
router.route("/delete/:productId").delete(verifyJWT,requireRole("admin"),deleteProduct);
router.route("/").get(getAllProducts).post(verifyJWT,requireRole("admin"),
    upload.fields([{
        name:'image',
        maxCount: 1
    }]),
    createProduct
);
router.route("/:productId").get(getProductById);
router.route("/:productId").put(verifyJWT,requireRole("admin"),
    upload.fields([{
        name:'image',
        maxCount: 1
    }]),
    updateProduct
);
 


router.route()

export default router;