"use client";

import { useCallback, useState } from "react";
import type { Media, ProjectFormData, ProjectMedia } from "@/src/interfaces";
import { useProjectApi } from "../useProjectApi";
import { useDeleteProject } from "../useDeleteProject";
import { useProjectMediaApi } from "../media";
import { useS3Images } from "@/src/hooks/s3";
import { UploadImagesError } from "@/src/services/s3";

interface UseProjectSubmissionOptions {
  isEdit: boolean;
  isProperty: boolean;
  projectData: ProjectFormData;
}

interface ProjectSubmissionResult {
  redirectPath: string;
  success: boolean;
}

type SubmissionPhase = "idle" | "saving-project" | "saving-images";

const getRedirectPath = (isProperty: boolean) =>
  isProperty ? "/admin/propiedades" : "/admin/proyectos";

const getUploadedUrlsFromError = (error: unknown): string[] => {
  if (error instanceof UploadImagesError) {
    return error.uploadedUrls;
  }

  if (error && typeof error === "object" && "uploadedUrls" in error) {
    const maybeUrls = (error as { uploadedUrls?: unknown }).uploadedUrls;
    if (Array.isArray(maybeUrls)) {
      return maybeUrls.filter((item): item is string => typeof item === "string");
    }
  }

  return [];
};

export function useProjectSubmission({
  isEdit,
  isProperty,
  projectData,
}: UseProjectSubmissionOptions) {
  const { submitProject } = useProjectApi();
  const { deleteProject } = useDeleteProject();
  const { uploadImages, deleteImages } = useS3Images();
  const { insertProjectMedia, updateProjectMedia, deleteProjectMedia } =
    useProjectMediaApi();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionPhase, setSubmissionPhase] =
    useState<SubmissionPhase>("idle");

  const createOrUpdateProject = useCallback(
    async (data: ProjectFormData) => {
      const result = await submitProject(data, isEdit ? "edit" : "create");

      if (isEdit) {
        if (!result) {
          console.error("Error al editar el proyecto.");
          sessionStorage.setItem(
            "projectMessage",
            JSON.stringify({
              type: "error",
              message: "Error al editar el proyecto.",
            })
          );
          return null;
        }
        return data.id ?? null;
      }

      if (typeof result === "number") {
        return result;
      }

      console.error("Error al crear el proyecto.");
      sessionStorage.setItem(
        "projectMessage",
        JSON.stringify({
          type: "error",
          message: "Error al crear el proyecto.",
        })
      );
      return null;
    },
    [isEdit, submitProject]
  );

  const deleteUnusedImages = useCallback(
    async (
      previousUrls: string[],
      currentUrls: string[],
      existingMedia: ProjectMedia[] | undefined
    ) => {
      const imagesToDelete = previousUrls.filter(
        (url) => !currentUrls.includes(url)
      );

      if (imagesToDelete.length === 0) {
        return;
      }

      await deleteImages(imagesToDelete);

      const mediaIdsToDelete =
        existingMedia
          ?.filter((media) => imagesToDelete.includes(media.url))
          .map((media) => media.id)
          .filter((id): id is number => id !== undefined) || [];

      if (mediaIdsToDelete.length > 0) {
        await deleteProjectMedia(mediaIdsToDelete);
      }
    },
    [deleteImages, deleteProjectMedia]
  );

  const uploadAndInsertMedia = useCallback(
    async (projectId: number, media: Media[], propertyTypeName: string) => {
      let uploadResult: ProjectMedia[] = [];

      try {
        uploadResult = await uploadImages(projectId, media, propertyTypeName);
      } catch (error) {
        const uploadedUrls = getUploadedUrlsFromError(error);
        if (uploadedUrls.length > 0) {
          await deleteImages(uploadedUrls);
        }

        if (!isEdit) {
          await deleteProject(projectId);
        }

        throw error;
      }

      if (!uploadResult || uploadResult.length === 0) {
        console.error(
          "No se pudieron subir imagenes. Eliminando el proyecto..."
        );
        if (!isEdit) {
          await deleteProject(projectId);
        }
        throw new Error("Error al subir las imagenes. Proyecto eliminado.");
      }

      try {
        await insertProjectMedia(uploadResult);
      } catch (error) {
        console.error(
          "Error al insertar imagenes en la base de datos. Eliminando el proyecto..."
        );
        await deleteImages(uploadResult.map((item) => item.url));
        if (!isEdit) {
          await deleteProject(projectId);
        }
        throw new Error(
          "Error al insertar imagenes en la BD. Proyecto eliminado."
        );
      }
    },
    [deleteImages, deleteProject, insertProjectMedia, isEdit, uploadImages]
  );

  const updateExistingMedia = useCallback(
    async (media: Media[], existingMedia: ProjectMedia[] | undefined) => {
      const mediaToUpdate =
        existingMedia
          ?.map((original) => {
            const updated = media.find(
              (item) =>
                typeof item.file === "string" && item.file === original.url
            );

            if (
              updated &&
              (updated.tag.trim() !== original.tag.trim() ||
                (updated.description?.trim() || "") !==
                  (original.description?.trim() || ""))
            ) {
              return {
                id: original.id!,
                tag: updated.tag,
                description: updated.description ?? "",
              };
            }
            return null;
          })
          .filter(
            (item): item is { id: number; tag: string; description: string } =>
              item !== null
          ) || [];

      if (mediaToUpdate.length > 0) {
        await updateProjectMedia(mediaToUpdate);
      }
    },
    [updateProjectMedia]
  );

  const handleEditMedia = useCallback(
    async (
      projectId: number,
      media: Media[],
      existingMedia: ProjectMedia[] | undefined,
      propertyTypeName: string
    ) => {
      const existingUploads = media.filter(
        (item) => typeof item.file === "string"
      );
      const newUploads = media.filter((item) => item.file instanceof File);

      const mediaUrls = existingUploads.map((item) => item.file as string);
      const previousMediaUrls = existingMedia?.map((item) => item.url) || [];

      await deleteUnusedImages(previousMediaUrls, mediaUrls, existingMedia);

      if (newUploads.length > 0) {
        await uploadAndInsertMedia(projectId, newUploads, propertyTypeName);
      }

      await updateExistingMedia(media, existingMedia);
    },
    [deleteUnusedImages, updateExistingMedia, uploadAndInsertMedia]
  );

  const handleNewMedia = useCallback(
    async (projectId: number, media: Media[], propertyTypeName: string) => {
      await uploadAndInsertMedia(projectId, media, propertyTypeName);
    },
    [uploadAndInsertMedia]
  );

  const submitProjectForm = useCallback(
    async (media: Media[]): Promise<ProjectSubmissionResult> => {
      const redirectPath = getRedirectPath(isProperty);
      setIsSubmitting(true);
      setSubmissionPhase("saving-project");

      try {
        const finalProjectData = { ...projectData, media };
        const projectId = await createOrUpdateProject(finalProjectData);

        if (!projectId) {
          console.error("No se pudo obtener un ID de proyecto valido.");
          return { success: false, redirectPath };
        }

        const propertyTypeName =
          finalProjectData.propertyType?.name ?? "default";
        const existingMedia = projectData.projectMedia;

        if (isEdit) {
          if (media.some((item) => item.file instanceof File)) {
            setSubmissionPhase("saving-images");
          }
          await handleEditMedia(
            projectId,
            media,
            existingMedia,
            propertyTypeName
          );
        } else {
          if (media.length > 0) {
            setSubmissionPhase("saving-images");
          }
          await handleNewMedia(projectId, media, propertyTypeName);
        }

        sessionStorage.setItem(
          "projectMessage",
          JSON.stringify({
            type: "success",
            message: isEdit
              ? isProperty
                ? "Propiedad editada exitosamente."
                : "Proyecto editado exitosamente."
              : isProperty
                ? "Propiedad creada exitosamente."
                : "Proyecto creado exitosamente.",
          })
        );

        return { success: true, redirectPath };
      } catch (error) {
        console.error("Error durante el proceso:", error);
        sessionStorage.setItem(
          "projectMessage",
          JSON.stringify({
            type: "error",
            message: "Hubo un problema al procesar el proyecto.",
          })
        );
        return { success: false, redirectPath };
      } finally {
        setIsSubmitting(false);
        setSubmissionPhase("idle");
      }
    },
    [
      createOrUpdateProject,
      handleEditMedia,
      handleNewMedia,
      isEdit,
      isProperty,
      projectData,
    ]
  );

  return { submitProjectForm, isSubmitting, submissionPhase };
}
