import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { 
    getAdminJobs, 
    getAllJobs, 
    getJobById, 
    getJobFilters,
    postJob, 
    searchExternalJobs, 
    matchExternalJobs 
} from "../controllers/job.controller.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, postJob);
router.route("/get").get(getAllJobs);
router.route("/get/filters").get(getJobFilters);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/get/:id").get(getJobById);

// External Job Search (Tavily)
router.route("/external/search").post(isAuthenticated, searchExternalJobs);
router.route("/external/match").post(isAuthenticated, matchExternalJobs);

export default router;
