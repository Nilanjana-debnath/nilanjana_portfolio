import { getVectorStore } from "@/lib/vectordb";
import { UpstashRedisCache } from "@langchain/community/caches/upstash_redis";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
  PromptTemplate,
} from "@langchain/core/prompts";
import { ChatGroq } from "@langchain/groq"; // Changed import
import { Redis } from "@upstash/redis";
import { Message } from "ai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { LangChainStream, StreamingTextResponse } from "ai";
import fetch from "node-fetch"; // Use fetch to validate links


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages;
    const latestMessage = messages[messages.length - 1].content;

    const cache = new UpstashRedisCache({
      client: Redis.fromEnv(),
    });
    const { stream, handlers } = LangChainStream();

    // Replace with ChatGroq
    const chatModel = new ChatGroq({
      model: "mixtral-8x7b-32768", // Groq model name
      verbose: true,
      callbacks: [handlers],
      cache,
      temperature: 0,
      apiKey: process.env.GROQ_API_KEY, // New environment variable
      streaming: true,

    });

    const rephraseModel = new ChatGroq({
      model: "mixtral-8x7b-32768", // Groq model name
      verbose: true,
      cache,
      apiKey: process.env.GROQ_API_KEY,
      // streaming: false,
    });

    const retriever = (await getVectorStore()).asRetriever();

    const chatHistory = messages
      .slice(0, -1)
      .map((msg: Message) =>
        msg.role === "user"
          ? new HumanMessage(msg.content)
          : new AIMessage(msg.content),
      );

    const rephrasePrompt = ChatPromptTemplate.fromMessages([
      new MessagesPlaceholder("chat_history"),
      ["user", "{input}"],
      [
        "user",
        "Given the above conversation history, generate a search query to look up information relevant to the current question. " +
          "Do not leave out any relevant keywords. " +
          "Only return the query and no other text." + 
          " Based on the above conversation history, generate a precise query to retrieve only the information relevant to the user's question. Do not include unrelated keywords or context. Only return the query",
      ],
    ]);

    const historyAwareRetrievalChain = await createHistoryAwareRetriever({
      llm: rephraseModel,
      retriever,
      rephrasePrompt,
    });

    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
    `You are Nilanjana Support, a friendly chatbot for Nilanjana's personal developer portfolio website. 
    You are trying to convince potential employers to hire Nilanjana as a Machine learning enginner or data scientist role. 
    Be concise and only answer the user's questions based on the provided context below.
    Provide links to pages that contains relevant information about the topic from the given context.
    Format your messages in markdown.
    Your responses must:
    1. Be specific and answer only the user's question. Be professional while responsing.
    2. Avoid including unrelated information.
    3. Short crisp and consise responses is expected.
    4. Use markdown links only when explicitly relevant.

    Rules:
    - Always respond as if you are Nilanjana. when asked about tell me aout yourself give a professional response without giving extra information. Give a professional answer. 
    - When asked about contact information give it mail id, contact number etc and social links. like github, linkedin etc. never give wrong contact information. crosscheck it with contact page.
    - If the question is about a specific detail (e.g., age, skills, or projects), provide only that detail.
    - Currently I stay atmy hometown Santipur. In West Bengal.  I am from Santipur, West Bengal. But I am open to relocate anywhere in India for job requirement.
    - Do not include additional context unless explicitly requested by the user.
    - If the information is not available, politely inform the user.
    - Only include links that are explicitly provided in the context. Do not generate links that are not present in the context.
    - Give links only when it is absolutely necessary , otherwise avoid. When you are giving any reference to links like skills projects etc, the only valid links are skills page, projects page, home page and contact page. do not generate links on your own. thats a very bad practice as clicking to those links will go to wrong place or nowhere. make sure to not include links which are incorrect.
    Context:
    {context}`,
      ],
      new MessagesPlaceholder("chat_history"),
      ["user", "{input}"],
    ]);

    const combineDocsChain = await createStuffDocumentsChain({
      llm: chatModel,
      prompt,
      documentPrompt: PromptTemplate.fromTemplate(
        "Page content:\n{page_content}",
      ),
      documentSeparator: "\n------\n",
    });

    const retrievalChain = await createRetrievalChain({
      combineDocsChain,
      retriever: historyAwareRetrievalChain,
    });

    const resultPromise = retrievalChain.invoke({
      input: latestMessage,
      chat_history: chatHistory,
    });

    sanitizeResponse((await resultPromise).answer);
    const response = new StreamingTextResponse(stream);

    resultPromise.then((result) => {
      if (!result.answer) {
        handlers.handleLLMError(new Error("No response generated"), "no_response");
        return;
      }
    // // Sanitize the response to validate links
    // const sanitizedResponse = sanitizeResponse(result.answer);
    // handlers.handleLLMResponse(sanitizedResponse);

    }).catch((error) => {
      handlers.handleLLMError(error, "chain_error");
    });

    return response;
  } catch (error: any) {
    console.error("Chat API error:", error);
    
    const errorMessage = error?.message || "Unknown error occurred";
    return Response.json(
      { 
        error: "Chat processing failed", 
        details: errorMessage,
        code: error?.code || "UNKNOWN_ERROR"
      }, 
      { status: 500 }
    );
  }
}

async function validateLink(link: string): Promise<boolean> {
  try {
    const response = await fetch(link, { method: "HEAD" });
    return response.ok; // Returns true if the link is valid
  } catch (error) {
    console.error(`Invalid link: ${link}`, error);
    return false;
  }
}

async function sanitizeResponse(response: string): Promise<string> {
  if (!response) return "";

  // Extract all links from the response
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  const matches = [...response.matchAll(linkRegex)];

  // Validate each link
  for (const match of matches) {
    const [fullMatch, text, link] = match;
    const isValid = await validateLink(link);
    if (!isValid) {
      // Remove invalid links from the response
      response = response.replace(fullMatch, text); // Keep the text but remove the link
    }
  }

  return response.trim();
}
// function sanitizeResponse(response: string): string {
//   if (!response) return "";
  
//   return response
//     .replace(/<\/?[^>]+(>|$)/g, "")
//     .trim();
// }
    // const result = await retrievalChain.invoke({
    //   input: latestMessage,
    //   chat_history: chatHistory,
    // });

    // return new StreamingTextResponse(stream);

    // console.log('%cRESULT:', 'color: red; font-weight: bold;', result.answer);
    // return Response.json({ message: result.answer });
    // return result.answer;
//   } catch (error) {
//     console.error(error);
//     return Response.json({ error: "Internal server error" }, { status: 500 });
//   }
// }

