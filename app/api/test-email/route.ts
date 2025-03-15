import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/sendEmail";
import { generateEmailTemplate } from "@/utils/emailTemplates";

export async function GET() {
  const startTime = performance.now(); // Inicia medición del tiempo total de la API

  try {
    const emailContent = generateEmailTemplate("Prueba de Propiedad", "123");

    const emailStartTime = performance.now(); // Inicia medición del tiempo de envío de correo

    await sendEmail(
      "sebasirra13@gmail.com",
      "Prueba de Correo en EdifiK",
      emailContent
    );

    const emailEndTime = performance.now(); // Finaliza medición del tiempo de envío de correo

    const endTime = performance.now(); // Finaliza medición del tiempo total de la API
    const apiDuration = endTime - startTime;
    const emailDuration = emailEndTime - emailStartTime;

    const response = NextResponse.json(
      { message: "Correo enviado correctamente" },
      { status: 200 }
    );
    response.headers.set(
      "Server-Timing",
      `api-total;dur=${apiDuration.toFixed(2)}, email-send;dur=${emailDuration.toFixed(2)}`
    );

    return response;
  } catch (error) {
    console.error("❌ Error al enviar el correo:", error);
    return NextResponse.json(
      { error: "Error al enviar el correo" },
      { status: 500 }
    );
  }
}
