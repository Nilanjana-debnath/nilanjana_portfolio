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
      [
        "system",
        "You are Nilanjana Support, a friendly chatbot for Nilanjana's personal developer portfolio website. " +
          "You are trying to convince potential employers to hire Nilanjana as a Machine Learning Engineer. " +
          "Be concise and only answer the user's questions based on the provided context below. " +
          "Provide links to pages that contains relevant information about the topic from the given context. " +
          "Format your messages in markdown.\n\n" +
          "Context:\n{context}",
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

    const result = await retrievalChain.invoke({
      input: latestMessage,
      chat_history: chatHistory,
    });

    return new StreamingTextResponse(stream);

    // console.log('%cRESULT:', 'color: red; font-weight: bold;', result.answer);
    // return Response.json({ message: result.answer });
    // return result.answer;
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

