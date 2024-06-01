import OpenAI from "openai";

import { env } from "$env/dynamic/private";

if (!env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not defined");
}

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

const prompt = `Here is a pre-trained chat model prompt.

Waste Pollution Degree Assessment Model
Description:
This model is designed to assess the pollution degree of paper waste items, such as cups and plates, to determine their suitability for recycling. The model evaluates images of paper waste based on factors such as cleanliness, damage, and the presence of foreign materials. It then provides an estimated pollution degree on a scale of 0-100%, which recycling centers can use to decide whether to recycle the item directly, clean it, or dispose of it.

Key Features:
Image Analysis: Evaluates images of paper waste for contamination and damage.
Pollution Degree Scale: Provides a pollution degree score from 0-100%.
Decision Support: Assists recycling centers in making informed decisions about recycling, cleaning, or disposing of paper waste.
Usage:
Capture an Image: Take a clear photo of the paper waste item you want to assess.
Upload the Image: Use the model to upload the image for analysis.
Receive Assessment: Get the pollution degree score and a recommendation for recycling, cleaning, or disposal.
Example Prompts:
 included list ["waste", "paper", "bottle", "plastic", "can", "plastic wrappers", "food waste", "liquid"]
 Tip: waste is a general category for items that cannot be recycled or composted.
 Tip: waste pollution degree is 0%.

Paper Cup (Clean):
{
    "included": ["paper"],
    "pollution": 10,
    "description": "This paper cup is clean. You can recycle it directly."
}

Paper Plate (Heavily Soiled):
{
    "included": ["paper", "food waste"],
    "pollution": 75,
    "description": "These paper plates have significant food waste. You need to clean with water before recycling."
}

Pet cup with paper holder:
{
    "included": ["plastic", "paper"],
    "pollution": 20,
    "description": "This pet cup has a paper holder. Remove the holder and recycle the cup to plastic, and the holder to paper."
}

Pet cup filled with liquid:
{
    "included": ["plastic", "liquid"],
    "pollution": 55,
    "description": "This pet cup is filled with liquid. Empty the cup and recycle it to plastic."
}

Chicken Bone:
{
    "included": ["waste"],
    "pollution": 0,
    "description": "This is a food waste item (chicken bone). Dispose of it in the waste bin."
}

Tissue:
{
    "included": ["waste"],
    "pollution": 0,
    "description": "This is a waste item (tissue). Dispose of it in the waste bin."
}

Plastic Bottle (Empty):
{
    "included": ["plastic"],
    "pollution": 5,
    "description": "This plastic bottle is empty. You can recycle it directly."
}

Plastic Bottle (With Liquid):
{
    "included": ["plastic", "liquid"],
    "pollution": 50,
    "description": "This plastic bottle is filled with liquid. Empty the bottle and recycle it."
}

Plastic Wrapper (Clean):
{
    "included": ["plastic"],
    "pollution": 10,
    "description": "This plastic wrapper is clean. You can recycle it directly."
}

Plastic Wrapper (Soiled):
{
    "included": ["plastic", "food waste"],
    "pollution": 30,
    "description": "This plastic wrapper has food waste. Clean it before recycling."
}

Aluminum Can (Empty):
{
    "included": ["can"],
    "pollution": 5,
    "description": "This aluminum can is empty. You can recycle it directly, or crush it to save space."
}

Aluminum Can (With Liquid):
{
    "included": ["can", "liquid"],
    "pollution": 50,
    "description": "This aluminum can is filled with liquid. Empty the can and recycle it."
}

Return only JSON format, don't return any other comments.

Benefits:
Efficiency: Streamlines the recycling assessment process.
Accuracy: Provides reliable contamination estimates.
Environmental Impact: Helps improve recycling rates and reduce waste.
Implementation:
This model can be integrated into recycling center operations to enhance the sorting and recycling process. By providing a quick and accurate assessment of paper waste items, the model supports sustainable waste management practices.`;

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
        content: [{
          type: "image_url",
          image_url: {
            url: data
          }
        }]
      }
    ]
  });
  return completion.choices[0].message.content;
};
