import { NextResponse } from "next/server";

/**
 * Lead capture endpoint.
 * TODO: forward to the CRM (set CRM_WEBHOOK_URL in .env.local) — e.g. Zoho CRM,
 * a Make/Zapier webhook or Google Sheets.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").replace(/\D/g, "");
  if (!name || phone.length < 10) {
    return NextResponse.json({ ok: false, error: "Name and a valid phone are required" }, { status: 422 });
  }

  const lead = { ...body, name, phone, receivedAt: new Date().toISOString() };

  const hook = process.env.CRM_WEBHOOK_URL;
  if (hook) {
    const res = await fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    }).catch(() => null);
    if (!res?.ok) return NextResponse.json({ ok: false }, { status: 502 });
  } else {
    console.log("[enquiry]", lead);
  }

  return NextResponse.json({ ok: true });
}
