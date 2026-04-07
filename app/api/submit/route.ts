import { NextResponse } from "next/server";

const APPS_SCRIPT_WEB_APP_URL = process.env.APPS_SCRIPT_WEB_APP_URL;

export async function POST(request: Request) {
  try {
    if (!APPS_SCRIPT_WEB_APP_URL) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Missing APPS_SCRIPT_WEB_APP_URL. Add your deployed Google Apps Script web app URL to the environment.",
        },
        { status: 500 },
      );
    }

    const payload = await request.json();

    const response = await fetch(APPS_SCRIPT_WEB_APP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const text = await response.text();

    try {
      const data = JSON.parse(text) as { success?: boolean; message?: string };
      return NextResponse.json(
        {
          success: Boolean(data.success),
          message: data.message ?? "Submission processed.",
        },
        { status: data.success ? 200 : 502 },
      );
    } catch {
      return NextResponse.json(
        {
          success: response.ok,
          message: response.ok
            ? "Submission sent, but the Apps Script response was not JSON."
            : "Apps Script returned an invalid response.",
        },
        { status: response.ok ? 200 : 502 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Unexpected submission error.",
      },
      { status: 500 },
    );
  }
}
