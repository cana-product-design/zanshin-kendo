
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, TrainingPlan, TrainingEnvironment } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-2.5-flash";

export const generateTrainingPlans = async (profile: UserProfile): Promise<TrainingPlan[]> => {
  const prompt = `
    Act as a world-class Strength & Conditioning Coach specializing in Kendo athletes.
    
    Design 3 distinct 4-week training programs (Weekly Splits) for this athlete:
    Profile: ${profile.age}yo, ${profile.height}cm, ${profile.weight}kg, Level: ${profile.level}.
    Goals: ${profile.goals}.
    Injuries: ${profile.injuries || "None"}.

    **Mandatory Session Structure (Must include all phases):**
    1. **Warm-up/Mobility (WARMUP)**: Dynamic stretching (e.g., shoulder circumduction, hip openers) to prevent injury.
    2. **Footwork/Agility (SKILL)**: Specific "Feet" drills (e.g., Suri-ashi ladder drills, Fumikomi lunges).
    3. **Main Lift (STRENGTH)**: Compound movements for power.
    4. **Conditioning (HIIT/CARDIO)**: High-intensity intervals to mimic 3-4 minute Kendo matches or steady state cardio for base stamina.
    5. **Cool-down (COOLDOWN)**: Static stretching (Calves, Achilles, Forearms).

    **Methodology (Bodybuilding x Kendo):**
    - Use "Progressive Overload" principles.
    - Structure: 3 to 6 workouts per week.
    - Focus: Hypertrophy for armor-wearing endurance, explosive power for Fumikomi, and core strength for posture.
    
    **Environments:**
    1. **GYM**: Full commercial gym. Use splits (e.g., Push/Pull/Legs or Upper/Lower). Heavy compounds + HIIT on treadmill/rower.
    2. **HOME**: Minimal equipment (Calisthenics/Bands). High volume, time-under-tension. Burpees/Jump rope for HIIT.
    3. **DOJO**: Space & Shinai only. Plyometrics, HIIT sprints, Suburi drills, Footwork agility.

    **Output:**
    Return an array of 3 TrainingPlans. Each plan contains a 'sessions' array representing ONE WEEK of the routine (to be repeated for 4 weeks).
    Label sessions as "Day 1", "Day 2", etc.
  `;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            environment: { type: Type.STRING, enum: ["GYM", "HOME", "DOJO"] },
            programTitle: { type: Type.STRING },
            description: { type: Type.STRING },
            durationWeeks: { type: Type.NUMBER },
            frequencyPerWeek: { type: Type.NUMBER },
            sessions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  dayLabel: { type: Type.STRING },
                  title: { type: Type.STRING },
                  environment: { type: Type.STRING, enum: ["GYM", "HOME", "DOJO"] },
                  durationMinutes: { type: Type.NUMBER },
                  focus: { type: Type.STRING },
                  exercises: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        reps: { type: Type.STRING },
                        sets: { type: Type.NUMBER },
                        description: { type: Type.STRING },
                        muscleFocus: { type: Type.STRING },
                        category: { 
                          type: Type.STRING, 
                          enum: ['WARMUP', 'STRENGTH', 'CARDIO', 'HIIT', 'SKILL', 'COOLDOWN'] 
                        }
                      },
                      required: ["name", "reps", "sets", "description", "muscleFocus", "category"]
                    }
                  }
                },
                required: ["id", "dayLabel", "title", "environment", "durationMinutes", "focus", "exercises"]
              }
            }
          },
          required: ["environment", "programTitle", "description", "durationWeeks", "frequencyPerWeek", "sessions"]
        }
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No data returned from Gemini");
  
  return JSON.parse(text) as TrainingPlan[];
};

export const generateSamuraiQuote = async (): Promise<string> => {
  const prompt = "Give me a short, powerful motivational quote from a famous Samurai (e.g., Musashi, Tsunetomo) or a Kendo philosophy concept related to discipline, hard work, or 'Mushin'. Keep it under 20 words.";
  
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "text/plain",
      maxOutputTokens: 50,
    }
  });

  return response.text || "Train hard, fight easy.";
};
