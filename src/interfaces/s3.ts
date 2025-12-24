export interface S3UploadResult {
  url: string;
}

export interface UploadProjectImagesParams {
  projectId: number;
  propertyTypeName: string;
  media: Media[];
}

export interface Media {
  id?: string;
  file: File | string;
  tag: string;
  description?: string;
  type?: string;
  category: "commonArea" | "imageType";
  idType?: number;
}
