import { NextResponse } from "next/server";
import { HistoryModel } from "../../../models/History";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const filterType = searchParams.get("type");

    let history = await HistoryModel.getRecent(limit);

    if (filterType && filterType !== "all") {
      history = history.filter((item) => item.type === filterType);
    }

    return NextResponse.json({ success: true, history });
  } catch (error) {
    console.error("GET /api/history error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { type, query, result, score, reason } = body;

    if (!type || !result) {
      return NextResponse.json(
        { success: false, error: "Type and result are required" },
        { status: 400 }
      );
    }

    const record = await HistoryModel.add({ type, query, result, score, reason });
    return NextResponse.json({ success: true, record });
  } catch (error) {
    console.error("POST /api/history error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save history" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await HistoryModel.clear();
    return NextResponse.json({ success: true, message: "History cleared successfully." });
  } catch (error) {
    console.error("DELETE /api/history error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to clear history" },
      { status: 500 }
    );
  }
}
