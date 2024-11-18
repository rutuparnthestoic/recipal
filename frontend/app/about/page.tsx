import { GraduationCap, Users, Rocket, Code, Database, Brain, Volume2 } from 'lucide-react'
import Link from 'next/link'

export default function AboutUs() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">About Us</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <Users className="mr-2" />
          Who We Are
        </h2>
        <p className="mb-4">
          We are a group of dedicated final-year B.Tech students from Vishwakarma Institute of Technology (VIT), Pune. Our team has poured our skills, creativity, and hard work into developing Recipal as our final year project.
        </p>
        <p>
          This journey has been fueled by our passion for technology, innovation, and creating a tool that can bring practical value to users. The project represents not only the culmination of our academic journey but also a collaborative effort marked by countless hours of planning, coding, and refining.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <Rocket className="mr-2" />
          Our Mission
        </h2>
        <p>
          Each team member has contributed uniquely to shaping Recipal into what it is today. Together, we have worked diligently to bring Recipal to life, and we are excited to share our work with you!
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <GraduationCap className="mr-2" />
          Meet Our Team
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <TeamMember
            name="Rutuparn Kakade"
            role="Team Leader"
            link="https://www.linkedin.com/in/rutuparn-kakade-7b9a26231/"
            responsibilities={[
              { icon: <Code className="w-4 h-4" />, text: "Developing Front-end with Next JS" },
              { icon: <Database className="w-4 h-4" />, text: "Developing Back-end Flask API" },
              { icon: <Brain className="w-4 h-4" />, text: "Contributed in fine tuning the prediction model" }
            ]}
          />
          <TeamMember
            name="Saamya Gupta"
            role="Team Member"
            link="https://www.linkedin.com/in/saamya-gupta-2bb11b241/"
            responsibilities={[
              { icon: <Brain className="w-4 h-4" />, text: "Fine tuning YOLOV9 image to ingredients model" },
              { icon: <Database className="w-4 h-4" />, text: "Dataset preparation" },
              { icon: <Database className="w-4 h-4" />, text: "Dataset cleaning" }
            ]}
          />
          <TeamMember
            name="Sahil Akalwadi"
            role="Team Member"
            link="https://www.linkedin.com/in/sahil-akalwadi/"
            responsibilities={[
              { icon: <Brain className="w-4 h-4" />, text: "Fine tuning prediction model" },
              { icon: <Database className="w-4 h-4" />, text: "Dataset Cleaning" },
              { icon: <Brain className="w-4 h-4" />, text: "Integrated Stable Diffusion" }
            ]}
          />
          <TeamMember
            name="Soham Pawar"
            role="Team Member"
            link="https://www.linkedin.com/in/pawar-soham-497807231/"
            responsibilities={[
              { icon: <Code className="w-4 h-4" />, text: "Integrating front-end and back-end" },
              { icon: <Volume2 className="w-4 h-4" />, text: "Integrating text-to-speech API" },
              { icon: <Brain className="w-4 h-4" />, text: "Contributing in fine tuning YOLOV9 image to ingredients model" }
            ]}
          />
        </div>
      </section>
    </div>
  )
}

function TeamMember({ name, role, responsibilities, link }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <Link href={link} className="text-xl font-semibold text-blue-600 hover:underline">
        {name}
      </Link>
      {role && <p className="text-gray-600 mb-2">{role}</p>}
      <ul className="space-y-2">
        {responsibilities.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.icon}
            <span className="ml-2">{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
