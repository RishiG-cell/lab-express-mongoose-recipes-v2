const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const Recipe = require("./models/Recipe.model");

const app = express();
const MONGODB_URI = "mongodb://127.0.0.1:27017/express-mongoose-recipes-dev";

// MIDDLEWARE
app.use(logger("dev"));
app.use(express.static("public"));
app.use(express.json());

// Iteration 1 - Connect to MongoDB
// DATABASE CONNECTION
mongoose
  .connect(MONGODB_URI)
  .then((response) =>
    console.log(`connected with"${response.connections[0].name}"`)
  )
  .catch((err) => console.error("error connecting to mongo", err));

// ROUTES
//  GET  / route - This is just an example route
app.get("/", (req, res) => {
  res.send("<h1>LAB | Express Mongoose Recipes</h1>");
});

//  Iteration 3 - Create a Recipe route
//  POST  /recipes route
app.post("/recipes", (req, res) => {
  Recipe.create(req.body)
    .then((createdRecipe) => {
      console.log("here", createdRecipe);
      res.status(201).json(createdRecipe);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "error while creating new recipe" });
    });
});

//  Iteration 4 - Get All Recipes
//  GET  /recipes route
app.get("/recipes", (req, res) => {
  Recipe.find()
    .then((allRecipes) => {
      res.status(200).json(allRecipes);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
});

//  Iteration 5 - Get a Single Recipe
//  GET  /recipes/:id route
app.get("/recipes/:recipeId"),
  async (req, res) => {
    try {
      const oneRecipeFromDb = await Recipe.findById(req.params.recipeId);
      res.status(200).json(oneRecipeFromDb);
      if (!oneRecipeFromDb) {
        res.status(400).json({ errorMessage: "recipe not found" });
      } else {
        res.status(200).json(oneRecipeFromDb);
      }
    } catch (error) {
      console.log(error);
    }
  };

//  Iteration 6 - Update a Single Recipe
//  PUT  /recipes/:id route
app.put("/recipes/:recipeId", async (req, res) => {
  try {
    const update = await Recipe.findByIdAndUpdate(
      req.params.recipeId,
      req.body,
      { new: true }
    );
    res.status(200).json(update);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//  Iteration 7 - Delete a Single Recipe
//  DELETE  /recipes/:id route
app.delete("/recipes/:recipeId", async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.recipeId);
    const allRecipes = await Recipe.find();
    res.status(200).json(allRecipes);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// Start the server
app.listen(3000, () => console.log("My first app listening on port 3000!"));

//❗️DO NOT REMOVE THE BELOW CODE
module.exports = app;
