//backend/src/utils/moderation.js
import axios from "axios";

const MODEL = process.env.HUGGINGFACE_MODEL;

const API_URL = `https://router.huggingface.co/hf-inference/models/${MODEL}`;

export const checkModeration = async (text) => {
  try {
    const response = await axios.post(
      API_URL,
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.error) {
      throw new Error(response.data.error);
    }

    const predictions = response.data[0];

    const maxScore = Math.max(...predictions.map((p) => p.score));

    return {
      flagged: maxScore > 0.8,
      scores: predictions,
      model: MODEL,
    };
  } catch (error) {
    console.error("HuggingFace Error:");
    console.error(error.response?.data || error.message);

    throw new Error(
      error.response?.data?.error || "Moderation service unavailable"
    );
  }
};