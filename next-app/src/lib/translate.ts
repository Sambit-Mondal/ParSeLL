import { TranslateTextCommand } from "@aws-sdk/client-translate";
import translateClient from "./aws-config";

const translateText = async (
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> => {
  try {
    const command = new TranslateTextCommand({
      Text: text,
      SourceLanguageCode: sourceLang,
      TargetLanguageCode: targetLang,
    });
    const response = await translateClient.send(command);
    return response.TranslatedText!;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
};

export default translateText;
