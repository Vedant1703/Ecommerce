// middlewares/requireRole.js

import {ApiError} from "../utils/apiError.js";

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized: No user in request");
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, "Forbidden: You don't have access to this resource");
    }

    next();
  };
};

export default requireRole;
