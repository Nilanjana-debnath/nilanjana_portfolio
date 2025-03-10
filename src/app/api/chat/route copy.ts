// import { getVectorStore } from "@/lib/vectordb";
// import { UpstashRedisCache } from "@langchain/community/caches/upstash_redis";
// import { AIMessage, HumanMessage } from "@langchain/core/messages";
// import {
//   ChatPromptTemplate,
//   MessagesPlaceholder,
//   PromptTemplate,
// } from "@langchain/core/prompts";
// import { ChatGroq } from "@langchain/groq"; // Changed import
// import { Redis } from "@upstash/redis";
// import { Message } from "ai";
// import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
// import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
// import { createRetrievalChain } from "langchain/chains/retrieval";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const messages = body.messages;
//     const latestMessage = messages[messages.length - 1].content;

//     const cache = new UpstashRedisCache({
//       client: Redis.fromEnv(),
//     });

//     // Replace with ChatGroq
//     const chatModel = new ChatGroq({
//       model: "mixtral-8x7b-32768", // Groq model name
//       verbose: true,
//       cache,
//       temperature: 0,
//       apiKey: process.env.GROQ_API_KEY, // New environment variable
//     });

//     const rephraseModel = new ChatGroq({
//       model: "mixtral-8x7b-32768", // Groq model name
//       verbose: true,
//       cache,
//       apiKey: process.env.GROQ_API_KEY,
//     });

//     const retriever = (await getVectorStore()).asRetriever();

//     const chatHistory = messages
//       .slice(0, -1)
//       .map((msg: Message) =>
//         msg.role === "user"
//           ? new HumanMessage(msg.content)
//           : new AIMessage(msg.content),
//       );

//     const rephrasePrompt = ChatPromptTemplate.fromMessages([
//       new MessagesPlaceholder("chat_history"),
//       ["user", "{input}"],
//       [
//         "user",
//         "Given the above conversation history, generate a search query to look up information relevant to the current question. " +
//           "Do not leave out any relevant keywords. " +
//           "Only return the query and no other text.",
//       ],
//     ]);

//     const historyAwareRetrievalChain = await createHistoryAwareRetriever({
//       llm: rephraseModel,
//       retriever,
//       rephrasePrompt,
//     });

//     const prompt = ChatPromptTemplate.fromMessages([
//       [
//         "system",
//         "You are Ted Support, a friendly chatbot for Ted's personal developer portfolio website. " +
//           "You are trying to convince potential employers to hire Ted as a software developer. " +
//           "Be concise and only answer the user's questions based on the provided context below. " +
//           "Provide links to pages that contains relevant information about the topic from the given context. " +
//           "Format your messages in markdown.\n\n" +
//           "Context:\n{context}",
//       ],
//       new MessagesPlaceholder("chat_history"),
//       ["user", "{input}"],
//     ]);

//     const combineDocsChain = await createStuffDocumentsChain({
//       llm: chatModel,
//       prompt,
//       documentPrompt: PromptTemplate.fromTemplate(
//         "Page content:\n{page_content}",
//       ),
//       documentSeparator: "\n------\n",
//     });

//     const retrievalChain = await createRetrievalChain({
//       combineDocsChain,
//       retriever: historyAwareRetrievalChain,
//     });

//     const result = await retrievalChain.invoke({
//       input: latestMessage,
//       chat_history: chatHistory,
//     });

//     return Response.json({ message: result.answer });
//   } catch (error) {
//     console.error(error);
//     return Response.json({ error: "Internal server error" }, { status: 500 });
//   }
// }



// import { getVectorStore } from "@/lib/vectordb";
// import { UpstashRedisCache } from "@langchain/community/caches/upstash_redis";
// import { AIMessage, HumanMessage } from "@langchain/core/messages";
// import {
//   ChatPromptTemplate,
//   MessagesPlaceholder,
//   PromptTemplate,
// } from "@langchain/core/prompts";
// import { ChatGroq } from "@langchain/groq"; // Changed from ChatOpenAI
// import { Redis } from "@upstash/redis";
// import { Message } from "ai";
// import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
// import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
// import { createRetrievalChain } from "langchain/chains/retrieval";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const messages = body.messages;
//     const latestMessage = messages[messages.length - 1].content;

//     const cache = new UpstashRedisCache({
//       client: Redis.fromEnv(),
//     });

//     // Initialize Groq Chat model
//     const chatModel = new ChatGroq({
//       model: "mixtral-8x7b-32768",
//       cache,
//       temperature: 0,
//       apiKey: process.env.GROQ_API_KEY, // New environment variable
//     });

//     const rephraseModel = new ChatGroq({
//       model: "mixtral-8x7b-32768",
//       cache,
//       apiKey: process.env.GROQ_API_KEY,
//     });

//     const retriever = (await getVectorStore()).asRetriever();

//     const chatHistory = messages
//       .slice(0, -1)
//       .map((msg: Message) =>
//         msg.role === "user"
//           ? new HumanMessage(msg.content)
//           : new AIMessage(msg.content),
//       );

//     const rephrasePrompt = ChatPromptTemplate.fromMessages([
//       new MessagesPlaceholder("chat_history"),
//       ["user", "{input}"],
//       [
//         "user",
//         "Given the conversation history, generate a search query for relevant information. Return only the query.",
//       ],
//     ]);

//     const historyAwareRetrievalChain = await createHistoryAwareRetriever({
//       llm: rephraseModel,
//       retriever,
//       rephrasePrompt,
//     });

//     const prompt = ChatPromptTemplate.fromMessages([
//       [
//         "system",
//         `As Ted Support, help potential employers understand Ted's skills. 
//         Use context below and answer in markdown with relevant links.
//         Context:\n{context}`,
//       ],
//       new MessagesPlaceholder("chat_history"),
//       ["user", "{input}"],
//     ]);

//     const combineDocsChain = await createStuffDocumentsChain({
//       llm: chatModel,
//       prompt,
//       documentPrompt: PromptTemplate.fromTemplate("Page content:\n{page_content}"),
//       documentSeparator: "\n------\n",
//     });

//     const retrievalChain = await createRetrievalChain({
//       combineDocsChain,
//       retriever: historyAwareRetrievalChain,
//     });

//     const result = await retrievalChain.invoke({
//       input: latestMessage,
//       chat_history: chatHistory,
//     });

//     return Response.json({ message: result.answer });
//   } catch (error) {
//     console.error(error);
//     return Response.json({ error: "Internal server error" }, { status: 500 });
//   }
// }

import Groq from "groq-sdk";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const messages = body.messages;

        const groq = new Groq();

        const systemMessage = {
            role: "system",
            content: "You are a sarcasm bot. You answer all user questions in a sarcastic way."
        };

        const res = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile", // Replace with the appropriate Groq model
            stream: true,
            messages: [
                systemMessage,
                ...messages
            ]
        });

        // Handle the streaming response
        const stream = new ReadableStream({
            async start(controller) {
                for await (const chunk of res) {
                    const content = chunk.choices[0]?.delta?.content || "";
                    controller.enqueue(new TextEncoder().encode(content));
                }
                controller.close();
            }
        });

        return new Response(stream, {
            headers: { "Content-Type": "text/plain" }
        });

    } catch (error) {
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}


// import { getVectorStore } from "@/lib/vectordb";
// import { UpstashRedisCache } from "@langchain/community/caches/upstash_redis";
// import { AIMessage, HumanMessage } from "@langchain/core/messages";
// import {
//   ChatPromptTemplate,
//   MessagesPlaceholder,
//   PromptTemplate,
// } from "@langchain/core/prompts";
// import { ChatOpenAI } from "@langchain/openai";
// import { Redis } from "@upstash/redis";
// import { LangChainStream, Message, StreamingTextResponse } from "ai";
// import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
// import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
// import { createRetrievalChain } from "langchain/chains/retrieval";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const messages = body.messages;

//     const latestMessage = messages[messages.length - 1].content;

//     const { stream, handlers } = LangChainStream();

//     // store the same user questions
//     const cache = new UpstashRedisCache({
//       client: Redis.fromEnv(),
//     });

//     const chatModel = new ChatOpenAI({
//       model: "gpt-3.5-turbo-0125",
//       streaming: true,
//       callbacks: [handlers],
//       verbose: true, // logs to console
//       cache,
//       temperature: 0,
//     });

//     const rephraseModel = new ChatOpenAI({
//       model: "gpt-3.5-turbo-0125",
//       verbose: true,
//       cache,
//     });

//     const retriever = (await getVectorStore()).asRetriever();

//     // get a customised prompt based on chat history
//     const chatHistory = messages
//       .slice(0, -1) // ignore latest message
//       .map((msg: Message) =>
//         msg.role === "user"
//           ? new HumanMessage(msg.content)
//           : new AIMessage(msg.content),
//       );

//     const rephrasePrompt = ChatPromptTemplate.fromMessages([
//       new MessagesPlaceholder("chat_history"),
//       ["user", "{input}"],
//       [
//         "user",
//         "Given the above conversation history, generate a search query to look up information relevant to the current question. " +
//           "Do not leave out any relevant keywords. " +
//           "Only return the query and no other text. ",
//       ],
//     ]);

//     const historyAwareRetrievalChain = await createHistoryAwareRetriever({
//       llm: rephraseModel,
//       retriever,
//       rephrasePrompt,
//     });

//     // final prompt
//     const prompt = ChatPromptTemplate.fromMessages([
//       [
//         "system",
//         "You are Ted Support, a friendly chatbot for Ted's personal developer portfolio website. " +
//           "You are trying to convince potential employers to hire Ted as a software developer. " +
//           "Be concise and only answer the user's questions based on the provided context below. " +
//           "Provide links to pages that contains relevant information about the topic from the given context. " +
//           "Format your messages in markdown.\n\n" +
//           "Context:\n{context}",
//       ],
//       new MessagesPlaceholder("chat_history"),
//       ["user", "{input}"],
//     ]);

//     const combineDocsChain = await createStuffDocumentsChain({
//       llm: chatModel,
//       prompt,
//       documentPrompt: PromptTemplate.fromTemplate(
//         "Page content:\n{page_content}",
//       ),
//       documentSeparator: "\n------\n",
//     });

//     // 1. retrievalChain converts the {input} into a vector
//     // 2. do a similarity search in the vector store and finds relevant documents
//     // 3. pairs the documents to createStuffDocumentsChain and put into {context}
//     // 4. send the updated prompt to chatgpt for a customised response

//     const retrievalChain = await createRetrievalChain({
//       combineDocsChain,
//       retriever: historyAwareRetrievalChain, // get the relevant documents based on chat history
//     });

//     retrievalChain.invoke({
//       input: latestMessage,
//       chat_history: chatHistory,
//     });

//     return new StreamingTextResponse(stream);
//   } catch (error) {
//     console.error(error);
//     return Response.json({ error: "Internal server error" }, { status: 500 });
//   }
// }