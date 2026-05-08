export class UploadFileResponseDto {
  id: string;
  originalName: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  blobUrl: string;
  containerName: string;
  uploadedAt: Date;
}
