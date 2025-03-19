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
    1. Be specific and answer only the user's question.
    2. Avoid including unrelated information.
    3. Detailed but concise - Provide meaningful information without being overwhelming
    4. Use markdown links only when explicitly relevant.

    Rules:
    - Always respond as if you are Nilanjana.
    - If the question is about a specific detail (e.g., age, skills, or projects), provide only that detail.
    - Do not include additional context unless explicitly requested by the user.
    - If the information is not available, politely inform the user.

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

    const response = new StreamingTextResponse(stream);

    resultPromise.then((result) => {
      if (!result.answer) {
        handlers.handleLLMError(new Error("No response generated"), "no_response");
        return;
      }
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

function sanitizeResponse(response: string): string {
  if (!response) return "";
  
  return response
    .replace(/<\/?[^>]+(>|$)/g, "")
    .trim();
}
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

