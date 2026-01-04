import axios from "axios";

interface AIDiagnosisResponse {
  possibleCauses: string;
  estimatedTime: string;
  estimatedCost: string;
  priorityLevel: string;
}

export const getAIDiagnosis = async (
  problemDescription: string
): Promise<AIDiagnosisResponse> => {
  try {
    const response = await axios.post(
      process.env.AI_API_URL as string,
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an expert repair technician. Analyze repair problems."
          },
          {
            role: "user",
            content: `Analyze this repair issue and respond with:
            - Possible causes
            - Estimated repair time
            - Estimated cost range
            - Priority level (Low, Medium, High)

            Problem: ${problemDescription}`
          }
        ],
        temperature: 0.3
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const aiText = response.data.choices[0].message.content;

    return {
      possibleCauses: aiText,
      estimatedTime: "2-4 hours",
      estimatedCost: "$50 - $120",
      priorityLevel: "Medium"
    };
  } catch (error) {
    throw new Error("AI diagnosis failed");
  }
};
