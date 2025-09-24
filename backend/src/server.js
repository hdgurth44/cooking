import express from "express";
import { ENV } from "./config/env.js";
import { db } from "./config/db.js";
import { favoritesTable } from "./db/schema.js";
import { and, eq } from "drizzle-orm";

const app = express();
const PORT = ENV.PORT;

// Add middleware to parse JSON bodies. Else everything would be undefined.
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true });
});

// Create a new favorite. We use `async` here so that we can later use `await` in the body of the function.
app.post("/api/favorites", async (req, res) => {
  try {
    const { userId, recipeId, title, image, cookTime, servings } = req.body;
    if (!userId || !recipeId || !title) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const newFavorite = await db
      .insert(favoritesTable)
      .values({
        userId,
        recipeId,
        title,
        image,
        cookTime,
        servings,
      })
      .returning();
    res.status(201).json(newFavorite[0]);
  } catch (error) {
    console.error("Error creating favorite:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a favorite

app.delete("/api/favorites/:userId/:recipeId", async (req, res) => {
    try {
        const { userId, recipeId } = req.params
        await db.delete(favoritesTable).where(
            and(eq(favoritesTable.userId, userId), eq(favoritesTable.recipeId, recipeId))
        )
        res.status(200).json({ message: "Favorite removed successfully" });
    } catch (error) {
        console.error("Error removing favorite:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

// Get all favorites for a user

app.get("/api/favorites/:userId", async (req, res) => {
    try {
        const { userId } = req.params // get the userId from the request params
        const favorites = await db.select().from(favoritesTable).where(eq(favoritesTable.userId, userId)) // assign the results of the query to the favorites variable
        res.status(200).json(favorites) // send the favorites as a response
    } catch (error) {
        console.error("Error getting favorites:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

app.listen(PORT, () => {
  console.log("Server is running on port: ", PORT);
});
