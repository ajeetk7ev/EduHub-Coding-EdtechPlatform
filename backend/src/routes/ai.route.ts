import { Router, Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();

// Load API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Generate description, tags, and what-you-will-learn
router.post("/generate-course-content", async (req: Request, res: Response) => {
  try {
    const { courseTitle } = req.body;
    console.log("COURSE TITLE IS ", courseTitle);

    if (!courseTitle) {
      return res.status(400).json({success:false, message: "Course title is required" });
    }

    // Select model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prompt
    const prompt = `
      You are an expert course creator. Based only on the course title: "${courseTitle}",
      generate the following in JSON format only (without extra text, markdown, or explanation):
      {
        "description": "Engaging and detailed description of the course (100-150 words)",
        "tags": ["tag1", "tag2", "tag3", "tag4"],
        "whatYouWillLearn": [
          "Learning outcome 1",
          "Learning outcome 2",
          "Learning outcome 3",
          "Learning outcome 4"
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // ✅ Clean response (remove markdown fences if present)
    const cleaned = text.replace(/```json|```/g, "").trim();

    let data;
    try {
      data = JSON.parse(cleaned);
    } catch (err) {
      return res.status(500).json({
        error: "Failed to parse AI response",
        raw: text,
        cleaned,
      });
    }

    return res.json(data);
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    res.status(500).json({
      error: "Something went wrong",
      details: error.message,
    });
  }
});

export default router;
