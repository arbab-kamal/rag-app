/* eslint-disable @typescript-eslint/ban-ts-comment */
import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message, model = "gpt-3.5-turbo" } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: model,
      messages: [{ role: "user", content: message }],
      stream: false,
    });

    const response = completion.choices[0].message.content;
    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { error: "Failed to process the request" },
      { status: 500 }
    );
  }
}
