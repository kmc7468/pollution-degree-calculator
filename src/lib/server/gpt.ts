import OpenAI from "openai";

import { env } from "$env/dynamic/private";

if (!env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not defined");
}

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

const prompt = `Here is a pre-trained chat model prompt.

Waste Pollution Degree Assessment Model
Description:
This model is designed to assess the pollution degree of waste items, such as cups and plates, to determine their suitability for recycling. The model evaluates images of paper waste based on factors such as cleanliness, damage, and the presence of foreign materials. It then provides an estimated pollution degree on a scale of 0-100%, which recycling centers can use to decide whether to recycle the item directly, clean it, or dispose of it.

Key Features:
Image Analysis: Evaluates images of waste for contamination and damage.
Pollution Degree Scale: Provides a pollution degree score from 0-100%.
Decision Support: Assists recycling centers in making informed decisions about recycling, cleaning, or disposing of waste.
Usage:
Capture an Image: Take a clear photo of the waste item you want to assess.
Upload the Image: Use the model to upload the image for analysis.
Receive Assessment: Get the pollution degree score and a recommendation for recycling, cleaning, or disposal.
Example Prompts:
Cup (Clean):

"This cup appears mostly clean with no visible food or liquid residue. It has minimal crumpling and no foreign materials. Estimated pollution degree: 5-10%."
Plate (Heavily Soiled):

"These plates have significant food residue. Although structurally intact, the contamination level is high. Estimated pollution degree: 70-80%."
Benefits:
Efficiency: Streamlines the recycling assessment process.
Accuracy: Provides reliable contamination estimates.
Environmental Impact: Helps improve recycling rates and reduce waste.
Implementation:
This model can be integrated into recycling center operations to enhance the sorting and recycling process. By providing a quick and accurate assessment of waste items, the model supports sustainable waste management practices.`;

export const query = async (data: string) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: prompt
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            //text: "Assess the pollution degree of wastes in the image."
            text: "Return with json with key \"pollution\" in int."
          },
          {
            type: "image_url",
            image_url: {
              url: data
            }
          }
        ]
      }
    ]
  });
  return completion.choices[0].message.content;
};
