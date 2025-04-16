import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmail } from "@/lib/email/sendEmail";
import { generateEmailTemplate } from "@/utils/emailTemplates";

function generateTempCode(length = 6): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json(
      { error: "El correo electrónico es obligatorio" },
      { status: 400 }
    );
  }

  const tempPassword = generateTempCode();

  try {
    await db.query("CALL set_temporary_password(?, ?)", [email, tempPassword]);

    const html = generateEmailTemplate({
      title: "Código de recuperación de contraseña",
      greeting: "Hola,",
      intro: "Hemos recibido una solicitud para restablecer tu contraseña.",
      items: [{ label: "Código temporal", value: tempPassword }],
      body: "Usa este código como contraseña temporal para iniciar sesión. Una vez dentro, podrás cambiar tu contraseña desde tu perfil.",
      buttonText: "Ir a iniciar sesión",
      buttonUrl: "https://edifik.co/login",
    });

    await sendEmail(email, "Recuperación de contraseña - EdifiK", html);

    return NextResponse.json({
      message: "Código enviado al correo electrónico",
    });
  } catch (error: any) {
    console.error("Error al enviar código de recuperación:", error);

    if (error.code === "ER_SIGNAL_EXCEPTION") {
      return NextResponse.json(
        { error: error.sqlMessage || "Error al generar el código" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const id = session.user?.id;

  const { currentPassword, newPassword } = await req.json();

  if (!id || !currentPassword || !newPassword) {
    return NextResponse.json(
      { error: "Todos los campos son obligatorios" },
      { status: 400 }
    );
  }

  try {
    await db.query("CALL changed_password(?, ?, ?)", [
      id,
      currentPassword,
      newPassword,
    ]);

    return NextResponse.json({
      message: "Contraseña actualizada correctamente",
    });
  } catch (error: any) {
    console.error("Error al cambiar la contraseña:", error);

    if (error.code === "ER_SIGNAL_EXCEPTION") {
      const message = error.sqlMessage || "Error al cambiar la contraseña";

      if (message.includes("La contraseña actual no es correcta")) {
        return NextResponse.json({ error: message }, { status: 403 });
      }

      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
