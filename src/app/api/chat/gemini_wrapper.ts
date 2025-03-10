import { BaseLanguageModel, BaseLanguageModelInput, LanguageModelOutput } from "@langchain/core/language_models/base";
import { CallbackManagerForLLMRun } from "@langchain/core/callbacks/manager";
import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiLangChainWrapper extends BaseLanguageModel {
  private geminiModel: any;

  constructor(apiKey: string, modelName: string = "gemini-pro") {
    super({});
    const genAI = new GoogleGenerativeAI(apiKey);
    this.geminiModel = genAI.getGenerativeModel({ model: modelName });
  }

  async _call(
    input: BaseLanguageModelInput,
    options?: this["ParsedCallOptions"],
    runManager?: CallbackManagerForLLMRun
  ): Promise<LanguageModelOutput> {
    const prompt = input.toString();
    const result = await this.geminiModel.generateContent(prompt);
    return result.response.text();
  }

  _llmType(): string {
    return "gemini";
  }
}