import { z } from "zod";
import type { ImageType, Media, SimpleCatalog } from "@/src/interfaces";
import { isValidYouTubeUrl } from "@/utils";

interface ImagesProjectSchemaOptions {
  imagesTypes: ImageType[];
}

export const getImagesProjectSchema = ({
  imagesTypes,
}: ImagesProjectSchemaOptions) =>
  z
    .object({
      media: z.array(z.any()).optional(),
      commonAreas: z.array(z.any()).optional(),
      videoUrl: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      const media = (data.media ?? []) as Media[];
      const commonAreas = (data.commonAreas ?? []) as SimpleCatalog[];
      const videoUrl =
        typeof data.videoUrl === "string" ? data.videoUrl.trim() : "";
      const imagesByCategory: Record<string, Media[]> = {};
      const imageDescriptionsByCategory: Record<string, string[]> = {};

      media.forEach((item) => {
        if (!item.type) return;

        if (!imagesByCategory[item.type]) {
          imagesByCategory[item.type] = [];
          imageDescriptionsByCategory[item.type] = [];
        }

        imagesByCategory[item.type].push(item);
        imageDescriptionsByCategory[item.type].push(item.description || "");
      });

      imagesTypes.forEach((type) => {
        if (
          type.isRequired &&
          (!imagesByCategory[type.name] ||
            imagesByCategory[type.name].length === 0)
        ) {
          ctx.addIssue({
            code: "custom",
            path: [type.name],
            message: `Debe subir al menos una imagen para ${type.name}.`,
          });
        }
      });

      commonAreas.forEach((area) => {
        if (
          !imagesByCategory[area.name] ||
          imagesByCategory[area.name].length === 0
        ) {
          ctx.addIssue({
            code: "custom",
            path: [area.name],
            message: `Debe subir al menos una imagen para ${area.name}.`,
          });
        }
      });

      Object.entries(imagesByCategory).forEach(([category, files]) => {
        files.forEach((_, index) => {
          if (
            imagesTypes.find((type) => type.name === category)?.id === 1005 &&
            !imageDescriptionsByCategory[category]?.[index]
          ) {
            ctx.addIssue({
              code: "custom",
              path: [`${category}-description-${index}`],
              message: "La descripción es obligatoria.",
            });
          }
        });
      });

      if (videoUrl && !isValidYouTubeUrl(videoUrl)) {
        ctx.addIssue({
          code: "custom",
          path: ["videoUrl"],
          message: "Ingrese una URL valida de YouTube.",
        });
      }
    });
