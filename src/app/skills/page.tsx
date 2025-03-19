import Skills from "@/components/Skills";

export default async function SkillsPage() {
  return (
    <article className="mt-8 flex flex-col gap-8 pb-16">
      <h1 className="title">My Skills -</h1>

      <Skills />
    </article>
  );
}
