import { NextResponse } from "next/server";
import { requireUser } from "@/app/lib/hook";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";

const refineResponseSchema = z.object({
  quadrant: z.enum(["Q1", "Q2", "Q3", "Q4", "UNSORTED"]).describe("The optimal Eisenhower Matrix quadrant for this task. Q1=Urgent & Important, Q2=Important & Not Urgent, Q3=Urgent & Not Important, Q4=Not Urgent & Not Important."),
  refinedTitle: z.string().describe("A clean, action-oriented, and concisely phrased version of the user's input task."),
  subtasks: z.array(z.string()).describe("2-3 small, granular action steps that break down this task if it is complex (empty array if the task is already simple/granular)."),
});

export async function POST(req: Request) {
  try {
    await requireUser();
    
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ ok: false, error: "AI configuration missing." }, { status: 500 });
    }

    const { title } = await req.json();
    if (!title || !title.trim()) {
      return NextResponse.json({ ok: false, error: "Task description is required." }, { status: 400 });
    }

    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      apiKey: process.env.GEMINI_API_KEY,
      temperature: 0.1,
    });

    const structuredModel = model.withStructuredOutput(refineResponseSchema);

    const prompt = `
You are Ocean's wise, silent productivity assistant. 
Analyze this user task input: "${title}"

1. Classify it into the best Eisenhower Matrix quadrant:
   - Q1: Do First (Urgent & Important)
   - Q2: Schedule (Important & Not Urgent)
   - Q3: Delegate (Urgent & Not Important)
   - Q4: Eliminate (Not Urgent & Not Important)
   - UNSORTED: If there is not enough context to classify.

2. Refine the title to be action-oriented, starting with an active verb (e.g., "Refactor onboarding controllers" instead of "work on code").

3. If the task is a large project or vague goal, break it down into 2-3 clear, granular micro-tasks. If it is already small and simple, return an empty list of subtasks.
`;

    const refined = await structuredModel.invoke(prompt);
    return NextResponse.json({ ok: true, data: refined });
  } catch (error: any) {
    console.error("AI Planner refinement error:", error);
    return NextResponse.json(
      { ok: false, error: error.message ?? "Refinement failed" },
      { status: 500 }
    );
  }
}
