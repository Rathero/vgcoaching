import { NextRequest } from "next/server";
import { getBookedSlotsRange } from "@/lib/firestore";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const coachId = searchParams.get("coachId");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  if (!coachId || !startDate || !endDate) {
    return Response.json({ error: "Missing params" }, { status: 400 });
  }

  const bookedSlots = await getBookedSlotsRange(coachId, startDate, endDate);
  return Response.json({ bookedSlots });
}
