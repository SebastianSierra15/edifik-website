"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from "react";
import type { ImageType, Media, ProjectFormData } from "@/src/interfaces";
import { useImagesProjectValidation } from "../validations";
import { getYouTubeEmbedUrl } from "@/utils";

interface UseImagesProjectFormOptions {
  formData: ProjectFormData;
  imagesTypes: ImageType[];
  onChange: (updatedData: Partial<ProjectFormData>) => void;
  onSubmit: (media: Media[], validateFields: () => boolean) => void;
  onNext: () => void;
  showModalAlert: (payload: { title: string; message: string }) => void;
  isProperty: boolean;
}

export function useImagesProjectForm({
  formData,
  imagesTypes,
  onChange,
  onSubmit,
  onNext,
  showModalAlert,
  isProperty,
}: UseImagesProjectFormOptions) {
  const [initialized, setInitialized] = useState(false);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  const { errors, validateFields, validateField, validateVideoUrl } =
    useImagesProjectValidation(formData, imagesTypes, isProperty);

  const imagesByCategory = useMemo(() => {
    const grouped: Record<string, Media[]> = {};
    (formData.media || []).forEach((media) => {
      const key = media.type ?? "general";
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(media);
    });

    return grouped;
  }, [formData.media]);

  useEffect(() => {
    if (!formData.projectMedia || initialized) return;

    const transformedMedia: Media[] = formData.projectMedia.map((media) => ({
      id: media.id?.toString() || "",
      tag: media.tag || "",
      file: media.url.startsWith("http") ? media.url : new File([], media.url),
      description: media.description || "",
      idType: media.imageType || media.commonArea || 0,
      type: media.type || "",
      category: media.imageType ? "imageType" : "commonArea",
    }));

    onChange({ media: transformedMedia });
    setInitialized(true);
  }, [formData.projectMedia, initialized, onChange]);

  useEffect(() => {
    setExpandedSections(
      imagesTypes.reduce((acc, item) => ({ ...acc, [item.name]: false }), {})
    );
  }, [imagesTypes]);

  useEffect(() => {
    if (!formData.media || formData.media.length === 0) return;
    setTimeout(() => {
      validateFields();
    }, 100);
  }, [formData.media, validateFields]);

  const toggleSection = useCallback((category: string) => {
    setExpandedSections((prev) => ({ ...prev, [category]: !prev[category] }));
  }, []);

  const handleImageChange = useCallback(
    (
      category: string,
      categoryId: number,
      isImageType: boolean,
      event: ChangeEvent<HTMLInputElement>
    ) => {
      if (!event.target.files || event.target.files.length === 0) return;

      const selectedFiles = Array.from(event.target.files);

      const newMedia: Media[] = selectedFiles.map((file) => ({
        file,
        tag: "",
        description: "",
        idType: categoryId,
        type: category,
        category: isImageType ? "imageType" : "commonArea",
      }));

      const updatedMedia = [...(formData.media || []), ...newMedia];

      onChange({ media: updatedMedia });
    },
    [formData.media, onChange]
  );

  const handleRemoveImage = useCallback(
    (category: string, index: number) => {
      const imageToRemove = imagesByCategory[category]?.[index];
      if (!imageToRemove) {
        console.error(`No se encontro la imagen en la categoria ${category}`);
        return;
      }

      const updatedMedia = (formData.media || []).filter(
        (media) => media.file !== imageToRemove.file
      );

      onChange({ media: updatedMedia });
    },
    [formData.media, imagesByCategory, onChange]
  );

  const handleDescriptionChange = useCallback(
    (category: string, index: number, description: string) => {
      if (!formData.media) return;

      const imageToUpdate = imagesByCategory[category]?.[index];
      if (!imageToUpdate) {
        console.error(
          `No se encontro la imagen en ${category} con indice ${index}`
        );
        return;
      }

      const updatedMedia = formData.media.map((mediaItem) =>
        mediaItem.file === imageToUpdate.file
          ? { ...mediaItem, description }
          : mediaItem
      );

      onChange({ media: updatedMedia });

      setTimeout(() => {
        validateField(`${category}-description-${index}`, description);
      }, 100);
    },
    [formData.media, imagesByCategory, onChange, validateField]
  );

  const handleVideoUrlChange = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      const nextValue = trimmed ? value : undefined;
      onChange({ videoUrl: nextValue });
      validateVideoUrl(nextValue);
    },
    [onChange, validateVideoUrl]
  );

  const videoEmbedUrl = useMemo(
    () => getYouTubeEmbedUrl(formData.videoUrl),
    [formData.videoUrl]
  );

  const handleSubmit = useCallback(() => {
    if (!validateFields()) {
      showModalAlert({
        title: "Advertencia",
        message:
          "Revisa las imagenes requeridas y la URL del video antes de continuar.",
      });
      return;
    }

    const baseName = formData.name?.trim() || "Proyecto";
    const mediaData: Media[] =
      formData.media?.map((mediaItem, index) => ({
        tag: `${baseName}-${index + 1}`,
        file: mediaItem.file,
        description: mediaItem.description || "",
        idType: mediaItem.idType || 0,
        type: mediaItem.type,
        category: mediaItem.category,
      })) || [];

    onSubmit(mediaData, validateFields);
    onNext();
  }, [
    formData.media,
    formData.name,
    onNext,
    onSubmit,
    showModalAlert,
    validateFields,
  ]);

  return {
    errors,
    imagesByCategory,
    expandedSections,
    toggleSection,
    handleImageChange,
    handleRemoveImage,
    handleDescriptionChange,
    handleVideoUrlChange,
    videoEmbedUrl,
    handleSubmit,
  };
}
