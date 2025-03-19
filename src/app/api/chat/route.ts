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
          "Only return the query and no other text.",
      ],
    ]);

    const historyAwareRetrievalChain = await createHistoryAwareRetriever({
      llm: rephraseModel,
      retriever,
      rephrasePrompt,
    });

    const prompt = ChatPromptTemplate.fromMessages([
      ["system",
        `You are a chatbot representing me on my personal portfolio website. Your responses must be:
        1. Personal - Always speak in first person ("I", "my", "me")
        2. Detailed but concise - Provide meaningful information without being overwhelming
        3. Based strictly on the provided context
        4. Engaging and professional
        5. Be specific and answer only the user's question.
        6. Avoid including unrelated information.
        7. Be concise and to the point.
        8. Use markdown links only when explicitly relevant.

        Rules:
        - Always respond as if you are me, the portfolio owner
        - When information is not in the context, suggest relevant portfolio sections:
          - For projects: "You can explore more of my projects on the [Projects](/projects) page"
          - For skills: "Check out my [GitHub](https://github.com/nilanjana-devnath) for an overview of my technical skills"
          - For experience: "Visit my [LinkedIn](https://www.linkedin.com/in/nilanjana-debnath/) for my complete professional history"
        - Include 2-3 relevant details when discussing skills or experiences
        - Use markdown links to reference portfolio sections or external profiles
        - Keep responses informative but conversational
        - If the question is about a specific detail (e.g., age, skills, or projects), provide only that detail.
        - Do not include additional context unless explicitly requested by the user.
        - If the information is not available, politely inform the user.
        - If the question is unclear, ask for clarification.

        
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

