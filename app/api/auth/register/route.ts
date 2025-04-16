import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { hash } from "bcrypt";
import { sendEmail } from "@/lib/email/sendEmail";
import { generateEmailTemplate } from "@/utils/emailTemplates";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { names, lastnames, birthdate, email, phoneNumber, password } = body;

  if (
    !names ||
    !lastnames ||
    !birthdate ||
    !email ||
    !phoneNumber ||
    !password
  ) {
    return NextResponse.json(
      { error: "Todos los campos son obligatorios" },
      { status: 400 }
    );
  }

  const hashedPassword = await hash(password, 10);

  try {
    await db.query("CALL register_user(?, ?, ?, ?, ?, ?)", [
      names,
      lastnames,
      birthdate,
      email,
      phoneNumber,
      hashedPassword,
    ]);

    const html = generateEmailTemplate({
      title: "¡Tu cuenta ha sido creada exitosamente!",
      greeting: `Hola ${names},`,
      intro:
        "Gracias por registrarte en EdifiK. Tu cuenta ha sido creada con éxito.",
      items: [
        { label: "Correo electrónico", value: email },
        { label: "Teléfono", value: phoneNumber },
      ],
      body: "Ahora puedes acceder a tu cuenta y empezar a explorar nuestras funcionalidades.",
      buttonText: "Iniciar sesión",
      buttonUrl: "https://edifik.co/login",
    });

    await sendEmail(email, "Bienvenido a EdifiK", html);

    return NextResponse.json({ message: "Usuario registrado exitosamente" });
  } catch (error: any) {
    console.error("Error al registrar el usuario:", error);

    if (error.code === "ER_SIGNAL_EXCEPTION") {
      return NextResponse.json(
        { error: error.sqlMessage || "Error al registrar el usuario" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
