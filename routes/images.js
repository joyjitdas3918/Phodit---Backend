const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Images");
const router = express.Router();
const multer= require("multer");

const app = express()


const { body, validationResult } = require("express-validator");
const Images = require("../models/Images");

//ROUTE-1
//Image Link
router.post("/posts/:id", async (req, res) => {
  try {
    const images = await Images.findById(req.params.id);
    res.json(images);
    
  } catch (error) {
    //console.error(error.message);
    res.status(500).send(error.message);
  }
});



//ROUTE 0
//get all images of all users using get "/api/notes/fetchallimagesallusers". login required
router.post("/fetchallimagesallusers/:page/:limit", async (req, res) => {
  try {
    const page=parseInt(req.params.page);
    const limit=parseInt(req.params.limit);
    const skip=(page-1)*limit;

    const images = await Images.find().skip(skip).limit(limit).sort({date:-1});
    res.json(images);
  } catch (error) {
    //console.error(error.message);
    res.status(500).send(error.message);
  }
});


//ROUTE 1
//get all images using get "/api/notes/fetchallimages". login required
router.post("/fetchallimages/:page/:limit", fetchuser, async (req, res) => {
  try {
    const page=parseInt(req.params.page);
    const limit=parseInt(req.params.limit);
    const skip=(page-1)*limit;

    const images = await Images.find({ user: req.user.id }).skip(skip).limit(limit).sort({date:-1});
    res.json(images);
  } catch (error) {
    //console.error(error.message);
    res.status(500).send(error.message);
  }
});



//ROUTE 2
//add images using post "/api/notes/addimages". login required
router.post(
  "/addimages",
  fetchuser,
  [
    body("title", "Enter a longer title").isLength({ min: 3 }),
    body("description", "Enter a longer description").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, imagedata, username,parent} = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send({ errors: result.array() });
      }
      const image = new Images({
        title,
        description,
        imagedata,
        user: req.user.id,
        username,
        parent,
      });
      const savedImage = await image.save();

      //res.json(savedImage);
      if(parent!==""){
      let findimage = await Images.findById(parent);
      if (!findimage) return res.status(404).send("not found");
      findimage = await Images.findByIdAndUpdate(
        parent,
        {
          children:findimage.children.concat(savedImage._id)
        },
        { new: true }
      );
      res.json(findimage);
    }
    else res.json(savedImage);
    } catch (error) {
      //console.error(error.message);
      res.status(500).send("internal server error");
    }
    
     
  }
);

//ROUTE 3
//updating images using put "/api/notes/updateimages". login required
router.put(
  "/updateimages/:id",
  fetchuser,
  /*[
    body("title", "Enter a longer title").isLength({ min: 3 }),
    body("description", "Enter a longer description").isLength({ min: 5 }),
  ],*/
  async (req, res) => {
    try {
      const { title, description} = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send({ errors: result.array() });
      }
      /*const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      if(title) note.title=title;
      if(description) note.description=description;
      if(tag) note.tag=tag;*/

      //find node to be updated and update it
      let findimage = await Images.findById(req.params.id);
      if (!findimage) return res.status(404).send("not found");
      if (findimage.user.toString() != req.user.id)
        return res.status(401).send("not allowed");
      findimage = await Images.findByIdAndUpdate(
        req.params.id,
        {
          title,
          description,
        },
        { new: true }
      );
      res.json(findimage);
    } catch (error) {
      //console.error(error.message);
      res.status(500).send("internal server error");
    }
  }
);

//ROUTE 4
//deleting images using delete "/api/notes/deleteimages". login required
router.delete(
  "/deleteimages/:id",
  fetchuser,
  /*[
    body("title", "Enter a longer title").isLength({ min: 3 }),
    body("description", "Enter a longer description").isLength({ min: 5 }),
  ],*/
  async (req, res) => {
    try {
      const { title, description } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send({ errors: result.array() });
      }
      /*const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      if(title) note.title=title;
      if(description) note.description=description;
      if(tag) note.tag=tag;*/

      //find node to be deleted and delete it
      let findimage = await Images.findById(req.params.id);
      if (!findimage) return res.status(404).send("not found");
      if (findimage.user.toString() != req.user.id)
        return res.status(401).send("not allowed");
      findimage = await Images.findByIdAndDelete(
        req.params.id,
        {
          title,
          description,
        },
        { new: true }
      );
      res.json({ success: "note deleted", note: findnote });
    } catch (error) {
      //console.error(error.message);
      res.status(500).send("internal server error");
    }
  }
);

module.exports = router;