import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { DocumentInterface } from "@langchain/core/documents";
import { Redis } from "@upstash/redis";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { getEmbeddingsCollection, getVectorStore } from "../src/lib/vectordb";
import fs from "fs"; // Import the file system module

async function generateEmbeddings() {
  const vectorStore = await getVectorStore();

  // Clear existing data
  (await getEmbeddingsCollection()).deleteMany({});
  (await Redis.fromEnv()).flushdb();

  const routeLoader = new DirectoryLoader(
    "src/app",
    {
      ".tsx": (path) => new TextLoader(path),
    },
    true,
  );

  // Load additional information from a JSON file
  const additionalInfoPath = "src/data/additionalInfo.json"; // Path to your JSON file
  let additionalInfo = "";
  if (fs.existsSync(additionalInfoPath)) {
    const rawData = fs.readFileSync(additionalInfoPath, "utf-8");
    additionalInfo = JSON.parse(rawData).info || ""; // Assuming the JSON has an "info" field
  }

  // Routes
  const routes = (await routeLoader.load())
    .filter((route) => route.metadata.source.endsWith("page.tsx"))
    .map((route): DocumentInterface => {
      const url =
        route.metadata.source
          .replace(/\\/g, "/") // Replace "\\" with "/"
          .split("/src/app")[1]
          .split("/page.tsx")[0] || "/";

      const pageContentTrimmed = route.pageContent
        .replace(/^import.*$/gm, "") // Remove all import statements
        .replace(/ className=(["']).*?\1| className={.*?}/g, "") // Remove all className props
        .replace(/^\s*[\r]/gm, "") // Remove empty lines
        .trim();

      // Append additional information to the page content
      const finalPageContent = `${pageContentTrimmed}\n\n${additionalInfo}`;

      return { pageContent: finalPageContent, metadata: { url } };
    });

  const routesSplitter = RecursiveCharacterTextSplitter.fromLanguage("html");
  const splitRoutes = await routesSplitter.splitDocuments(routes);

  // Resume data
  const dataLoader = new DirectoryLoader("src/data", {
    ".json": (path) => new TextLoader(path),
  });

  const data = await dataLoader.load();

  const dataSplitter = RecursiveCharacterTextSplitter.fromLanguage("js");
  const splitData = await dataSplitter.splitDocuments(data);

  // Blog posts
  const postLoader = new DirectoryLoader(
    "content",
    {
      ".mdx": (path) => new TextLoader(path),
    },
    true,
  );

  const posts = (await postLoader.load())
    .filter((post) => post.metadata.source.endsWith(".mdx"))
    .map((post): DocumentInterface => {
      const pageContentTrimmed = post.pageContent.split("---")[1]; // Only want the frontmatter

      return { pageContent: pageContentTrimmed, metadata: post.metadata };
    });

  const postSplitter = RecursiveCharacterTextSplitter.fromLanguage("markdown");
  const splitPosts = await postSplitter.splitDocuments(posts);

  await vectorStore.addDocuments(splitRoutes);
  await vectorStore.addDocuments(splitData);
  await vectorStore.addDocuments(splitPosts);
}

generateEmbeddings();