import { Router } from 'express';
import { createOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder, } from '../controllers/order.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import requireRole from "../middlewares/requireRole.middleware.js";
const router  = Router();

router.route("/createOrder").post(verifyJWT,requireRole("user"),createOrder);
router.route("/").get(verifyJWT,requireRole("admin"),getAllOrders);
router.route("/myorders").get(verifyJWT,requireRole("user"),getMyOrders);
router.route("/:orderId").get(verifyJWT,requireRole("user","admin"),getOrderById);
router.route("/:orderId/status").put(verifyJWT,requireRole("admin"),updateOrderStatus);
router.route("/:orderId").delete(verifyJWT,requireRole("user","admin"),deleteOrder);



export default router;