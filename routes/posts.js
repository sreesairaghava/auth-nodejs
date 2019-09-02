const router = require("express").Router();
//import auth-token verifier
const verify = require("./verifyToken");
router.get("/", verify, (req, res) => {
  res.json({
    posts: {
      title: "My first post",
      description: "random data you shouldn't access"
    }
  });
});

module.exports = router;
