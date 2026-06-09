import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const aiSearch = async (req, res) => {
  const { query, files } = req.body;
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `You are a file search assistant. Given a list of files and a user query, return only the filenames that match the query.
User query: "${query}"
Files: ${JSON.stringify(files.map(f => ({ name: f.name, type: f.type, status: f.status, expiresAt: f.expiresAt })))}
Respond ONLY with a JSON array of matching filenames. Example: ["file1.pdf", "file2.jpg"]
If no files match, return [].`
        }
      ],
    });
    const text = completion.choices[0]?.message?.content?.trim();
    const clean = text.replace(/```json|```/g, "").trim();
    const matchedNames = JSON.parse(clean);
    const matchedFiles = files.filter(f => matchedNames.includes(f.name));
    return res.status(200).json({ files: matchedFiles });
  } catch (error) {
    console.error("AI search error:", error);
    return res.status(500).json({ error: "AI search failed" });
  }
};

export const aiSummarize = async (req, res) => {
  const { file } = req.body;
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `You are a file assistant. Given this file info, write a short 2-3 sentence summary about what this file likely contains and any important details.
File name: ${file.name}
File type: ${file.type}
File size: ${file.size} bytes
Upload date: ${file.createdAt}
Expiry: ${file.expiresAt}
Status: ${file.status}`
        }
      ],
    });
    const summary = completion.choices[0]?.message?.content?.trim();
    return res.status(200).json({ summary });
  } catch (error) {
    console.error("AI summarize error:", error);
    return res.status(500).json({ error: "AI summarize failed" });
  }
};
