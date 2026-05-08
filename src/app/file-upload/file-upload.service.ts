import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BlobServiceClient,
  BlockBlobClient,
  BlobSASPermissions,
  generateBlobSASQueryParameters,
  StorageSharedKeyCredential,
} from '@azure/storage-blob';
import { FileUpload } from './entities/file-upload.entity';
import { UploadFileResponseDto } from './dto/upload-file-response.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileUploadService {
  private blobServiceClient: BlobServiceClient;
  private containerName: string;

  constructor(
    @InjectRepository(FileUpload)
    private fileUploadRepository: Repository<FileUpload>,
  ) {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    this.containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || '';

    if (!connectionString) {
      throw new Error('Azure Storage Connection String is not configured');
    }

    if (!this.containerName) {
      throw new Error('Azure Storage Container Name is not configured');
    }

    this.blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
  }

  async uploadFile(
    file: any,
    uploadedBy?: string,
  ): Promise<UploadFileResponseDto> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Generate unique filename
    const fileExtension = file.originalname.split('.').pop();
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;

    // Get container client
    const containerClient =
      this.blobServiceClient.getContainerClient(this.containerName);

    // Create container if it doesn't exist (without public access)
    await containerClient.createIfNotExists();

    // Get block blob client
    const blockBlobClient: BlockBlobClient =
      containerClient.getBlockBlobClient(uniqueFileName);

    // Upload file to Azure Blob Storage
    await blockBlobClient.uploadData(file.buffer, {
      blobHTTPHeaders: {
        blobContentType: file.mimetype,
      },
    });

    // Save file metadata to database
    const fileUpload = this.fileUploadRepository.create({
      originalName: file.originalname,
      fileName: uniqueFileName,
      mimeType: file.mimetype,
      fileSize: file.size,
      blobUrl: blockBlobClient.url,
      containerName: this.containerName,
      uploadedBy: uploadedBy,
    });

    const savedFile = await this.fileUploadRepository.save(fileUpload);

    return {
      id: savedFile.id,
      originalName: savedFile.originalName,
      fileName: savedFile.fileName,
      mimeType: savedFile.mimeType,
      fileSize: savedFile.fileSize,
      blobUrl: savedFile.blobUrl,
      containerName: savedFile.containerName,
      uploadedAt: savedFile.uploadedAt,
    };
  }

  async findAll(): Promise<FileUpload[]> {
    return this.fileUploadRepository.find({
      order: {
        uploadedAt: 'DESC',
      },
    });
  }

  async findOne(id: string): Promise<FileUpload> {
    const file = await this.fileUploadRepository.findOne({
      where: { id },
    });

    if (!file) {
      throw new BadRequestException('File not found');
    }

    return file;
  }

  async findByFileName(fileName: string): Promise<FileUpload> {
    const file = await this.fileUploadRepository.findOne({
      where: { fileName },
    });

    if (!file) {
      throw new BadRequestException('File not found');
    }

    return file;
  }

  async getSignedUrl(id: string, expiresInMinutes: number = 60): Promise<string> {
    const file = await this.findOne(id);

    // Parse connection string to get account name and key
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || '';
    const accountNameMatch = connectionString.match(/AccountName=([^;]+)/);
    const accountKeyMatch = connectionString.match(/AccountKey=([^;]+)/);

    if (!accountNameMatch || !accountKeyMatch) {
      throw new Error('Invalid Azure Storage connection string');
    }

    const accountName = accountNameMatch[1];
    const accountKey = accountKeyMatch[1];

    // Create shared key credential
    const sharedKeyCredential = new StorageSharedKeyCredential(
      accountName,
      accountKey,
    );

    // Set expiration time
    const startsOn = new Date();
    const expiresOn = new Date(startsOn);
    expiresOn.setMinutes(startsOn.getMinutes() + expiresInMinutes);

    // Generate SAS token
    const sasToken = generateBlobSASQueryParameters(
      {
        containerName: this.containerName,
        blobName: file.fileName,
        permissions: BlobSASPermissions.parse('r'), // read-only
        startsOn,
        expiresOn,
      },
      sharedKeyCredential,
    ).toString();

    // Return the full URL with SAS token
    return `${file.blobUrl}?${sasToken}`;
  }

  async deleteFile(id: string): Promise<void> {
    const file = await this.findOne(id);

    // Delete from Azure Blob Storage
    const containerClient =
      this.blobServiceClient.getContainerClient(this.containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(file.fileName);
    await blockBlobClient.deleteIfExists();

    // Delete from database
    await this.fileUploadRepository.delete(id);
  }
}
