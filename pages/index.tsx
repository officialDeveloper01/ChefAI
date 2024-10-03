import Head from "next/head";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [cookTime, setCookTime] = useState<number | null>(null);
  const [recipes, setRecipes] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({
        ingredients: ingredients,
        cookTime: cookTime as number,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      setLoading(false);
      return;
    }

    const data = await res.json();
    setRecipes([...recipes, ...data.recipes]); // Appending new recipes to the existing list
    setLoading(false);
  };

  return (
    <>
      <Head>
  <title>Chef AI</title>
  <meta name="description" content="Create recipes with AI" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="icon" href="/favicon.svg" />
</Head>
<main className="min-h-screen p-10 bg-gray-400 text-gray-900">
  {/* Hero Section */}
  <div className="text-center mb-10">
    <div className="text-7xl">👨‍🍳</div>
    <h1 className="text-5xl p-2 font-extrabold text-green-800">ChefAI</h1>
    <h2 className="text-xl p-2 font-bold text-gray-900">
      Generate recipes with AI based on ingredients and cook time
    </h2>
  </div>

  {/* Form Section */}
  <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
    {ingredients.map((ingredient, index) => (
      <div key={index} className="flex items-center mb-4">
        <input
          type="text"
          value={ingredient}
          onChange={(e) => {
            const newIngredients = [...ingredients];
            newIngredients[index] = e.target.value;
            setIngredients(newIngredients);
          }}
          className="flex-1 p-3 border-2 bo rder-gray-300 rounded-lg focus:border-green-600 text-lg font-medium transition-all"
        />
        <button
          type="button"
          onClick={() => {
            const newIngredients = [...ingredients];
            newIngredients.splice(index, 1);
            setIngredients(newIngredients);
          }}
          className="ml-4 p-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all"
        >
          Remove
        </button>
      </div>
    ))}
    <div className="mb-6">
      <button
        type="button"
        onClick={() => setIngredients([...ingredients, ""])}
        className="p-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-all"
      >
        Add Ingredient
      </button>
    </div>

    {/* Cook Time Section */}
    <div className="flex items-center mb-6">
      <label htmlFor="cookTime" className="text-lg font-bold text-gray-800">
        Cook time
      </label>
      <input
        type="number"
        value={cookTime || ""}
        placeholder="20"
        onChange={(e) => setCookTime(Number(e.target.value))}
        className="ml-4 p-3 border-2 border-gray-300 rounded-lg focus:border-green-600 w-24 text-lg"
      />
      <span className="ml-2 text-lg font-bold text-gray-700">minutes</span>
    </div>

    {/* Generate Button */}
    <div className="text-center">
      <button
        type="submit"
        className={`p-3 text-lg font-bold rounded-lg bg-green-700 text-white transition-all hover:bg-green-800 ${
          ingredients.length === 0 && cookTime === null
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
        disabled={(ingredients.length === 0 && cookTime === null) || loading}
      >
        {loading ? "Generating..." : "Generate Recipe"}
      </button>
    </div>
  </form>

  {/* Recipe Section */}
  <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {recipes.length > 0 &&
      recipes.map((recipe, index) => (
        <div
          key={index}
          className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          <h3 className="text-2xl font-bold text-green-800 mb-2">
            Recipe {index + 1}
          </h3>
          <p className="text-gray-700 text-base">{recipe}</p>
        </div>
      ))}
  </div>
</main>
    </>
  );
}
