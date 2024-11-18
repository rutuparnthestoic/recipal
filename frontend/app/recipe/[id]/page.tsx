"use client"

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ChefHat, Utensils, List, BarChart, AlertCircle, Download } from 'lucide-react'
import { usePDF } from 'react-to-pdf'

async function fetchRecipe(id: string | string[]) {
  try {
    const response = await axios.get(`http://localhost:5000/api/recipe/${id}`)
    return response.data
  } catch (error) {
    console.error("Error fetching recipe:", error)
    throw error
  }
}

function formatRecipeInstructions(instructions: string | undefined) {
  const sections = instructions ? instructions.split('\n') : ''
  const formattedData: { [key: string]: string } = {}

  let currentSection = ''
  for (const line of sections) {
    if (line.includes(':')) {
      const [key, value] = line.split(':')
      currentSection = key.trim()
      formattedData[currentSection] = value.trim()
    } else if (currentSection === 'Instructions') {
      formattedData[currentSection] = (formattedData[currentSection] || '') + '\n' + line.trim()
    }
  }

  return formattedData
}

function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

async function generateRecipeImage(recipeName: string | undefined) {
  try {
    const response = await fetch('https://stablediffusionapi.com/api/v3/text2img', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: "R5ukORpWKCjP0p8zAxQEtyBJfjxEeVauAt0RmkN1tBAWbTbyWeFm31PPg2ro",
        prompt: `A delicious ${recipeName} dish`,
        negative_prompt: "((out of frame)), ((extra fingers)), mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), (((tiling))), ((naked)), ((tile)), ((fleshpile)), ((ugly)), (((abstract))), blurry, ((bad anatomy)), ((bad proportions)), ((extra limbs)), cloned face, (((skinny))), glitchy, ((extra breasts)), ((double torso)), ((extra arms)), ((extra hands)), ((mangled fingers)), ((missing breasts)), (missing lips), ((ugly face)), ((fat)), ((extra legs)), anime",
        width: "512",
        height: "512",
        samples: "1",
        num_inference_steps: "20",
        seed: null,
        guidance_scale: 7.5,
        webhook: null,
        track_id: null
      })
    });
    
    const data = await response.json();
    if (data.status === 'success' && data.output && data.output.length > 0) {
      return data.output[0];
    } else {
      console.error("Error generating image:", data.message || "Unknown error");
      return null;
    }
  } catch (error) {
    console.error("Error generating image with Stable Diffusion:", error)
    return null
  }
}

function splitInstructions(instructions: string | undefined): string[] {
  return instructions
    .split(/[\n.]/)
    .map(step => step.trim())
    .filter(step => step.length > 0)
}

export default function RecipePage() {
  const { id } = useParams()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [backgroundImage, setBackgroundImage] = useState(null)
  const [imageError, setImageError] = useState(false)
  const { toPDF, targetRef } = usePDF({filename: 'recipe.pdf'})

  useEffect(() => {
    const getRecipe = async () => {
      try {
        const recipeData = await fetchRecipe(id)
        setRecipe(recipeData)

        const formattedInstructions = formatRecipeInstructions(recipeData.instructions ?? '')
        const recipeName = formattedInstructions['Recipe Name'] || 'Delicious recipe'
        const imageUrl = await generateRecipeImage(recipeName)
        if (imageUrl) {
          setBackgroundImage(imageUrl)
          setImageError(false)
        } else {
          setImageError(true)
        }
      } catch (error) {
        console.error("Error fetching recipe:", error)
        setImageError(true)
      } finally {
        setLoading(false)
      }
    }
    getRecipe()
  }, [id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Skeleton className="h-8 w-3/4 mb-4 mx-auto" />
        <Skeleton className="h-4 w-1/2 mb-2 mx-auto" />
        <Skeleton className="h-4 w-1/3 mx-auto" />
        <p className="mt-4 text-gray-600">Preparing your culinary masterpiece...</p>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-xl text-red-600">Oops! We could not find that recipe. Please try again.</p>
      </div>
    )
  }

  const formattedInstructions = formatRecipeInstructions(recipe.instructions ?? '');
  const recipeName = formattedInstructions['Recipe Name'] || 'Delicious Recipe';
  const ingredients = recipe.ingredients.split(',').map(item => item.trim());
  const instructions = splitInstructions(formattedInstructions['Instructions'] ?? '');

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed relative py-8 px-4" style={{ backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none' }}>
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <Card className="max-w-4xl mx-auto relative z-10 bg-white/95 shadow-xl">
        <div ref={targetRef}>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold mb-2 flex items-center justify-center">
              <ChefHat className="mr-2" />
              {recipeName}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2">
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <List className="mr-2" />
                  Ingredients
                </h2>
                <ul className="list-disc pl-5 space-y-1">
                  {ingredients.map((ingredient, index) => (
                    <li key={index} className="text-gray-700">
                      {capitalizeFirstLetter(ingredient)}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:w-1/2">
                {imageError ? (
                  <div className="rounded-lg overflow-hidden shadow-md bg-gray-200 flex items-center justify-center h-64">
                    <div className="text-center">
                      <AlertCircle className="mx-auto mb-2 text-gray-400" size={48} />
                      <p className="text-gray-600">Image generation failed</p>
                      <p className="text-sm text-gray-500">Please use your imagination!</p>
                    </div>
                  </div>
                ) : backgroundImage ? (
                  <div className="rounded-lg overflow-hidden shadow-md">
                    <img
                      src={backgroundImage}
                      alt={recipeName}
                      width={500}
                      height={300}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                ) : (
                  <Skeleton className="h-64 w-full rounded-lg" />
                )}
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Protein', 'Carbs', 'Fat', 'Cholesterol', 'Calories', 'Texture', 'Taste'].map((item) => (
                <div key={item} className="bg-gray-100 p-3 rounded-lg">
                  <h3 className="text-sm font-semibold mb-1 flex items-center">
                    <BarChart className="w-4 h-4 mr-1" />
                    {item}
                  </h3>
                  <p className="text-gray-700">{recipe[item.toLowerCase()] || formattedInstructions[item] || 'N/A'}</p>
                </div>
              ))}
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-3 flex items-center">
                <Utensils className="mr-2" />
                Instructions
              </h2>
              <ol className="space-y-3">
                {instructions.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex items-center justify-center bg-primary text-primary-foreground rounded-full w-6 h-6 mr-3 mt-1 flex-shrink-0">
                      {index + 1}
                    </span>
                    <p className="text-gray-700">{capitalizeFirstLetter(step)}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-600 italic">
                Enjoy your homemade {recipeName}! Bon appétit!
              </p>
            </div>
          </CardContent>
        </div>
        <div className="flex justify-center mt-6 pb-6">
          <Button onClick={() => toPDF()} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Download className="mr-2 h-4 w-4" /> Download Recipe as PDF
          </Button>
        </div>
      </Card>
    </div>
  )
}
