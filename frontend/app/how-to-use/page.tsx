import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import React from 'react'

export default function HowToUse() {
  const steps = [
    {
      title: "Step 1: Choose your preferred method for entering ingredients.",
      images: ["/images/pic_ingredients.png", "/images/manual_ingredients.png"],
      description: "On the input page, you have two options: either upload an image containing the ingredients or enter the ingredients manually. Choose the method that's most convenient for you.",
      hasOr: true
    },
    {
      title: "Step 2: Select macros and submit",
      images: ["/images/macro_and_submit.png"],
      description: "Select all the macro and micro nutrients you want to consider in your recipe. Once you've made your selections, click the submit button to generate your recipe."
    },
    {
      title: "Step 3: View your generated recipe",
      images: ["/images/ready_recipe.png"],
      description: "On the recipe page, you'll see the generated recipe based on your ingredients and nutritional preferences. Review the ingredients, instructions, and nutritional information provided."
    },
    {
      title: "Step 4: Download your recipe as PDF",
      images: ["/images/share.png"],
      description: "If you'd like to save or print your recipe, you can download it as a PDF. Look for the download button on the recipe page and click it to save your recipe."
    },
    {
      title: "Step 5: Learn more about us",
      images: ["/images/about.png"],
      description: "We encourage you to visit our About Us page to learn more about the team behind Recipal. You can also follow our team members on LinkedIn to stay updated on our future projects and developments."
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-4xl font-bold mb-8 text-center">How to Use Recipal</h1>
      
      <div className="space-y-12">
        {steps.map((step, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden mb-12">
            <div className="p-8">
              <h2 className="text-3xl font-semibold mb-6">{step.title}</h2>
              <div className="flex flex-col justify-center items-center gap-8 mb-6">
                {step.images.map((img, imgIndex) => (
                  <React.Fragment key={imgIndex}>
                    <div className="relative w-full aspect-video max-w-3xl">
                      <Image
                        src={img}
                        alt={`Step ${index + 1} illustration ${imgIndex + 1}`}
                        layout="fill"
                        objectFit="contain"
                        className="rounded-lg"
                      />
                    </div>
                    {step.hasOr && imgIndex === 0 && (
                      <div className="text-3xl font-bold text-gray-500 my-4">OR</div>
                    )}
                  </React.Fragment>
                ))}
              </div>
              <p className="text-gray-600 text-lg">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link href="/about" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
          Learn More About Our Team
          <ArrowRight className="ml-2" />
        </Link>
      </div>
    </div>
  )
}