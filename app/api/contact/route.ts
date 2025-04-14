import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/sendEmail";
import { generateEmailTemplate } from "@/utils/emailTemplates";

export async function POST(req: Request) {
  try {
    const { name, phone, email, message } = await req.json();

    const html = generateEmailTemplate({
      title: "Nuevo mensaje de contacto",
      intro:
        "Has recibido un nuevo mensaje a través del formulario de contacto.",
      items: [
        { label: "Nombre", value: name },
        { label: "Teléfono", value: phone },
        { label: "Correo", value: email },
        { label: "Mensaje", value: message },
      ],
    });

    await sendEmail("sebasirra13@gmail.com", "Nuevo mensaje de contacto", html);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("❌ Error en el envío:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
