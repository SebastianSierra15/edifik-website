import { Project } from "@/lib/definitios";

export async function getProjectById(
  id: number,
  isProject: boolean = false,
  isAdmin: boolean = false
): Promise<Project | null> {
  try {
    const query = `?isProject=${isProject ? 1 : 0}&isAdmin=${isAdmin ? 1 : 0}`;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${id}${query}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.error("Error en la respuesta del servidor");
      return null;
    }

    const data = await res.json();
    return data.project as Project;
  } catch (error) {
    console.error("Error al obtener proyecto:", error);
    return null;
  }
}
