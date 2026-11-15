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

  // Bot checks. A bot gets the same "ok" a person gets, so it learns nothing, but its lead
  // is not forwarded to the CRM.
  //  1. Honeypot: the hidden "website" field is empty for every person.
  //  2. Timing: our forms send how long the form was open; a person, even with browser autofill, needs more than 1.2 s to fill in a
  //     name and a mobile number. A post without it did not come from our forms.
  //  3. Links in the name field are spam.
  const honeypot = String(body.website ?? "").trim();
  const formMs = Number(body.form_ms);
  const bot = honeypot ? "honeypot" : !Number.isFinite(formMs) || formMs < 1200 ? "too fast" : /https?:|www\.|<|>/i.test(String(body.name ?? "")) ? "link in name" : "";
  if (bot) {
    console.warn("[enquiry] dropped as bot:", bot);
    return NextResponse.json({ ok: true });
  }

  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").replace(/\D/g, "");
  if (!name || phone.length < 10) {
    return NextResponse.json({ ok: false, error: "Name and a valid phone are required" }, { status: 422 });
  }

  const { website: _hp, ...fields } = body;
  const lead = { ...fields, name, phone, receivedAt: new Date().toISOString() };

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
