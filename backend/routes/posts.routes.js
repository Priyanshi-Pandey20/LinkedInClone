import {Router} from "express";
import { activeCheck, createPost, delete_comment_of_user, deletePost, get_comments_by_post, getAllPosts, increment_likes} from "../controllers/posts.controller.js";
import multer from "multer";
import { commentPost } from "../controllers/user.controller.js";


const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
})

const upload = multer({storage: storage})
router.get("/",activeCheck);

router.post("/post", upload.single('media'), createPost)
router.get("/posts", getAllPosts);
router.route("/delete_post").delete(deletePost).post(deletePost); // support both DELETE and POST methods
router.post("/comment", commentPost);
router.get("/get_comments",get_comments_by_post);
router.delete("/delete_comment", delete_comment_of_user);
router.post("/increment_post_like", increment_likes);

export default router;