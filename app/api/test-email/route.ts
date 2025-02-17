import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/sendEmail";
import { generateEmailTemplate } from "@/utils/emailTemplates";

export async function GET() {
  try {
    const emailContent = generateEmailTemplate("Prueba de Propiedad", "123");
    await sendEmail(
      "sebasirra13@gmail.com",
      "Prueba de Correo en EdifiK",
      emailContent
    );

    return NextResponse.json(
      { message: "Correo enviado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error al enviar el correo:", error);
    return NextResponse.json(
      { error: "Error al enviar el correo" },
      { status: 500 }
    );
  }
}
