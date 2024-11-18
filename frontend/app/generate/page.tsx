'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Upload, ChefHat, Loader } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function GeneratePage() {
  const router = useRouter();
  const [image, setImage] = useState<File | null>(null)
  const [ingredients, setIngredients] = useState('')
  const [protein, setProtein] = useState('')
  const [carbs, setCarbs] = useState('')
  const [fat, setFat] = useState('')
  const [cholesterol, setCholesterol] = useState('')
  const [calories, setCalories] = useState('')
  const [taste, setTaste] = useState('')
  const [texture, setTexture] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!ingredients || !protein || !carbs || !fat || !cholesterol || !calories || !taste || !texture) {
      alert("Please fill in all fields")
      return
    }

    setIsLoading(true)

    try {
      const formData = {
        ingredients: ingredients,
        protein,
        carbs,
        fat,
        cholesterol,
        calories,
        taste,
        texture
      }

      const response = await axios.post('http://localhost:5000/api/generate', formData)
      router.push(`/recipe/${response.data.id}`)
    } catch (err) {
      console.error("Error generating recipe: ", err)
      alert("An error occurred while generating the recipe. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const levels = ["Low", "Medium", "High"]
  const tastes = ["Spicy", "Salty", "Sweet", "Savory", "Tangy"]
  const textures = ["Soft", "Chewy", "Crunchy", "Creamy", "Saucy", "Smooth", "Crispy"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-red-700 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-white bg-opacity-70"></div>
        <div className="absolute inset-0 bg-repeat opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 to-red-200 opacity-60"></div>
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">Let&apos;s Cook Up Some Delicious Meal!</h1>
        <p className="text-center text-gray-700 mb-8">Tell us what you have got and your preferences, and we will whip up an amazing recipe for you.</p>
        
        <Card className="bg-white bg-opacity-90 shadow-xl rounded-lg overflow-hidden backdrop-blur-sm">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit}>
              <Tabs defaultValue="text" className="w-full mb-6">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="image">Upload an Image</TabsTrigger>
                  <TabsTrigger value="text">Enter Ingredients Manually</TabsTrigger>
                </TabsList>
                <TabsContent value="image">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-white bg-opacity-50">
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer inline-flex flex-col items-center justify-center w-full"
                    >
                      <Upload className="h-12 w-12 text-gray-400 mb-3" />
                      <span className="text-lg font-medium text-gray-600 mb-2">
                        Snap a pic of your ingredients
                      </span>
                      <span className="text-sm text-gray-500">
                        (Make sure it is clear and well-lit!)
                      </span>
                    </label>
                    {image && (
                      <p className="mt-4 text-sm text-green-600">
                        Great! We have got your image: {image.name}
                      </p>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="text">
                  <div>
                    <label htmlFor="ingredients-input" className="block text-lg font-medium text-gray-700 mb-2">
                      What is in your kitchen?
                    </label>
                    <Input
                      id="ingredients-input"
                      placeholder="e.g., chicken, spinach, tomatoes, olive oil..."
                      value={ingredients}
                      onChange={(e) => setIngredients(e.target.value)}
                      className="w-full text-lg p-4 bg-white bg-opacity-50"
                      required
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Tip: The more ingredients you list, the more creative we can get!
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="protein" className="block text-sm font-medium text-gray-700 mb-1">
                    Protein Level
                  </label>
                  <Select onValueChange={setProtein} required>
                    <SelectTrigger id="protein">
                      <SelectValue placeholder="Select protein level" />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map((level) => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="carbs" className="block text-sm font-medium text-gray-700 mb-1">
                    Carbohydrate Level
                  </label>
                  <Select onValueChange={setCarbs} required>
                    <SelectTrigger id="carbs">
                      <SelectValue placeholder="Select carb level" />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map((level) => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="fat" className="block text-sm font-medium text-gray-700 mb-1">
                    Fat Level
                  </label>
                  <Select onValueChange={setFat} required>
                    <SelectTrigger id="fat">
                      <SelectValue placeholder="Select fat level" />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map((level) => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="cholesterol" className="block text-sm font-medium text-gray-700 mb-1">
                    Cholesterol Level
                  </label>
                  <Select onValueChange={setCholesterol} required>
                    <SelectTrigger id="cholesterol">
                      <SelectValue placeholder="Select cholesterol level" />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map((level) => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="calories" className="block text-sm font-medium text-gray-700 mb-1">
                    Calories
                  </label>
                  <Select onValueChange={setCalories} required>
                    <SelectTrigger id="calories">
                      <SelectValue placeholder="Select calorie level" />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map((level) => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="taste" className="block text-sm font-medium text-gray-700 mb-1">
                    Taste
                  </label>
                  <Select onValueChange={setTaste} required>
                    <SelectTrigger id="taste">
                      <SelectValue placeholder="Select taste" />
                    </SelectTrigger>
                    <SelectContent>
                      {tastes.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="texture" className="block text-sm font-medium text-gray-700 mb-1">
                    Texture
                  </label>
                  <Select onValueChange={setTexture} required>
                    <SelectTrigger id="texture">
                      <SelectValue placeholder="Select texture" />
                    </SelectTrigger>
                    <SelectContent>
                      {textures.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator className="my-6" />

              <Button
                type="submit"
                className={`w-full text-lg py-6 ${isLoading ? 'bg-green-500' : 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500'} text-white`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader className="mr-2 h-6 w-6 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <ChefHat className="mr-2 h-6 w-6" />
                    Create My Recipe!
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center font-semibold text-gray-700 mt-6">
          Note: Recipal takes time to generate your masterpiece, so please be patient. It will take a minute or two on average for recipal to generate your recipe.
        </p>
        <p className="text-center font-semibold text-gray-700 mt-6">
          Tip: Good things take time (and a little magic)!
        </p>
      </div>
    </div>
  )
}
