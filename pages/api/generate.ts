import { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const { ingredients, cookTime } = req.body as {
    ingredients: string[];
    cookTime: number;
  };

  const openai = new OpenAI({
    apiKey: 'sk-proj-ccXvkOnyvRlEpMDqVUfBT3BlbkFJ1lYiKaPt3aLBWkM3nQKm', 
  });

  const response = await openai.completions.create({
    model: "gpt-3.5-turbo-instruct",
    prompt: `I have these ingredients: ${ingredients.join(
      ", "
    )}. Suggest 3 different recipes I can cook in under ${cookTime} minutes. The response should be 3 paragraphs. Include ingredient lists and recipe to make it in the response, and no decorative text like "Here's a recipe for you" or "Another recipe you'd enjoy...".`,
    temperature: 1,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  const recipesText = response.choices[0]?.text; // Using optional chaining to handle potential null or undefined
  if (!recipesText) {
    // Handle the case where there are no recipes
    res.status(404).json({ error: "No recipes found." });
    return;
  }

  const recipes = recipesText
    .split("\n")
    .filter((line: string) => line.trim().length > 0) // Ensure proper type and filter out empty lines
    .map((line: string) => line.trim());

  if (recipes.length === 0) {
    // Handle the case where there are no valid recipes
    res.status(404).json({ error: "No valid recipes found." });
    return;
  }

  const slicedRecipes = recipes.slice(0, 3); // Slice the recipes array

  res.status(200).json({
    recipes: slicedRecipes,
  });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {  
  switch (req.method) {
    case "POST":
      await post(req, res);
      break;
    default:
      res.status(405).end();
      break;
  }
};

export default handler;
