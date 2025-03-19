import Experience from "@/components/Experience";
import LinkWithIcon from "@/components/LinkWithIcon";
import Projects from "@/components/Projects";
import Socials from "@/components/Socials";
import { Button } from "@/components/ui/Button";
import { ArrowDownRight, ArrowRightIcon, FileDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import path from "path";
import Skills from "@/components/Skills"; // Import the Skills component
import TechStack from "@/components/TechStack";
import AdditionalInfo from "@/components/additionalInfo";
// Constants
const BLOG_DIRECTORY = path.join(process.cwd(), "content"); // Path to blog content
const BIRTH_YEAR = 1998; // Birth year for age calculation
const LIMIT = 2; // Max number of posts/projects to display

export default async function Home() {
  // Fetch latest posts
  // const posts = await getPosts(BLOG_DIRECTORY, LIMIT);

  return (
    
    <article className="mt-8 flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="flex flex-col items-center gap-8 md:flex-row-reverse md:items-center md:justify-between">
          {/* Profile Image */}
          <Image
            className="rounded-full mx-auto" // Make the image circular and center it
            src="/nilanjana.jpg" // Update with your image path
            alt="Photo of Nilanjana Debnath"
            width={200}
            height={200}
            priority
          />

          {/* Introduction Text */}
          <div className="flex flex-col text-center md:text-left">
            <h1 className="title text-5xl">Hi, I'm Nilanjana 👋</h1>
            <p className="mt-4 font-light">
              A researcher and developer specializing in <strong>Machine Learning</strong>,{" "}
              <strong>Graph Neural Networks</strong>, and{" "}
              <strong>Natural Language Processing</strong>.
            </p>
            <p className="mt-2 font-light">
              Currently pursuing my <strong>M.S. (Research)</strong> at{" "}
              <strong>IIT Palakkad</strong>, I’m passionate about solving complex
              problems using cutting-edge technologies.
            </p>

            {/* Chatbot Prompt */}
            <div className="mt-4 flex items-center justify-center md:justify-start gap-1">
              <p className="font-semibold">Ask the chatbot anything about me</p>
              <ArrowDownRight className="size-5 animate-bounce" />
            </div>

            {/* Call-to-Action Buttons */}
            <section className="mt-8 flex flex-col items-center gap-4 md:flex-row md:items-center md:gap-8">
              <Link href="/Nilanjana_Debnath_Resume.pdf" target="_blank">
                <Button variant="outline">
                  <span className="font-semibold">Resume</span>
                  <FileDown className="ml-2 size-5" />
                </Button>
              </Link>
              <Socials />
            </section>
          </div>
        </section>
      {/* Experience Section */}
      <Experience />
      {/* <TechStack/> */}
      {/* Skills Section */}
       {/* <Skills />  */}
      {/* Add the Skills component here  */}

      {/* Featured Skills Section */}
      <section className="flex flex-col gap-8">
        <div className="flex justify-between">
          <h2 className="title text-2xl sm:text-3xl">Skills</h2>
          <LinkWithIcon
            href="/Skills"
            position="right"
            icon={<ArrowRightIcon className="size-5" />}
            text="View All"
          />
        </div>
        <Skills />
      </section>


      {/* Featured Projects Section */}
      <section className="flex flex-col gap-8">
        <div className="flex justify-between">
          <h2 className="title text-2xl sm:text-3xl">Featured Projects</h2>
          <LinkWithIcon
            href="/projects"
            position="right"
            icon={<ArrowRightIcon className="size-5" />}
            text="View All"
          />
        </div>
        <Projects limit={LIMIT} />
      </section>

      {/* Recent Posts Section 
      <section className="flex flex-col gap-8">
        <div className="flex justify-between">
          <h2 className="title text-3xl">Recent Posts</h2>
          <LinkWithIcon
            href="/blog"
            position="right"
            icon={<ArrowRightIcon className="size-5" />}
            text="View More"
          />
        </div>
        <Posts posts={posts} />
      </section>*/}
      <div className="hidden">
      <AdditionalInfo />
      </div>
      </article>
  );
}