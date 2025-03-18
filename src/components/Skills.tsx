"use client"; // Required for using React hooks (useState)

import { useState } from "react";
import skillsData from "@/data/skills.json";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface Props {
  limit?: number;
}

export default function Skills({ limit }: Props) {
  // Extract skills categories
  const categories = Object.entries(skillsData.skills_and_technologies);

  // State to manage the number of categories displayed
  const [displayLimit, setDisplayLimit] = useState(limit || categories.length);

  // Function to handle "Load More" button click
  const handleLoadMore = () => {
    setDisplayLimit((prevLimit) => prevLimit + 2); // Increase by 2 categories
  };

  return (
    <section>
      {/* Grid layout for skills categories */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {categories.slice(0, displayLimit).map(([category, skills], idx) => (
          <Card key={idx} className="p-4 shadow-lg rounded-xl">
            <h3 className="text-lg font-semibold mb-3">{category} </h3>
            <ul className="space-y-2">
              {Object.entries(skills).map(([subcategory, skillList]) => (
                <li key={subcategory}>
                  <h4 className="font-medium text-gray-700">{subcategory}</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {(skillList as any[]).map((skill, id) => (
                      <span
                        key={id}
                        className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg text-sm"
                      >
                        <img
                          src={`/icons/${skill.name.toLowerCase()}.png`}
                          alt={skill.name}
                          className="w-4 h-4"
                        /> {skill.name}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      {/* "Load More" button (only if there are more categories to display) */}
      {displayLimit < categories.length && (
        <div className="mt-6 flex justify-center">
          <Button onClick={handleLoadMore}>Load More</Button>
        </div>
      )}
    </section>
  );
}
