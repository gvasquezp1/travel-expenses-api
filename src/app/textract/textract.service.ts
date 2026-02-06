import { Injectable } from '@nestjs/common';
import {
  TextractClient,
  AnalyzeDocumentCommand,
  StartDocumentAnalysisCommand,
  GetDocumentAnalysisCommand
} from '@aws-sdk/client-textract';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { parseTextractKeyValues } from './textract.parser';

@Injectable()
export class TextractService {
  private textract = new TextractClient({ region: process.env.AWS_REGION });
  private s3 = new S3Client({ region: process.env.AWS_REGION });

  async analyzeInvoice(file: Express.Multer.File) {
    if (file.mimetype === 'application/pdf') {
      return this.processPdf(file);
    }

    return this.processImage(file);
  }

  // ---------- IMAGE (JPG / PNG) ----------
  private async processImage(file: Express.Multer.File) {
    const command = new AnalyzeDocumentCommand({
      Document: { Bytes: file.buffer },
      FeatureTypes: ['FORMS', 'TABLES'],
    });

    const response = await this.textract.send(command);
    const raw = this.extractKeyValues(response);

    return parseTextractKeyValues(raw);
  }

  // ---------- PDF (S3 + ASYNC) ----------
  private async processPdf(file: Express.Multer.File) {
    const key = `ocr/${Date.now()}-${file.originalname}`;

    await this.uploadToS3(file, key);

    const jobId = await this.startPdfAnalysis(key);
    const response = await this.pollPdf(jobId);

    await this.deleteFromS3(key);

    const raw = this.extractKeyValues(response);
    return parseTextractKeyValues(raw);
  }

 private async uploadToS3(file: Express.Multer.File, key: string) {
  console.log('Uploading to S3:', {
    bucket: process.env.AWS_S3_BUCKET,
    key,
    size: file.buffer.length,
    mimetype: file.mimetype,
  });

  await this.s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
      Body: file.buffer,
      ContentType: 'application/pdf', // FORZADO
    })
  );

  console.log('Upload to S3 completed');
}

  private async deleteFromS3(key: string) {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: key,
      })
    );
  }

  private async startPdfAnalysis(key: string): Promise<string> {
    const start = await this.textract.send(
      new StartDocumentAnalysisCommand({
        DocumentLocation: {
          S3Object: {
            Bucket: process.env.AWS_S3_BUCKET!,
            Name: key,
          },
        },
        FeatureTypes: ['FORMS', 'TABLES'],
      })
    );

    return start.JobId!;
  }

  private async pollPdf(jobId: string) {
    while (true) {
      const result = await this.textract.send(
        new GetDocumentAnalysisCommand({ JobId: jobId })
      );

      if (result.JobStatus === 'SUCCEEDED') return result;
      if (result.JobStatus === 'FAILED') throw new Error('Textract PDF failed');

      await new Promise(r => setTimeout(r, 1500));
    }
  }

  // ---------- KEY-VALUE EXTRACTION ----------
  private extractKeyValues(response: any): Record<string, string> {
    const blocks = response.Blocks || [];
    const blockMap: any = {};
    const keyMap: any = {};
    const valueMap: any = {};

    blocks.forEach(b => {
      blockMap[b.Id] = b;
      if (b.BlockType === 'KEY_VALUE_SET') {
        if (b.EntityTypes?.includes('KEY')) keyMap[b.Id] = b;
        else valueMap[b.Id] = b;
      }
    });

    const result: Record<string, string> = {};

    for (const keyId in keyMap) {
      const keyBlock = keyMap[keyId];
      const valueBlock = this.findValueBlock(keyBlock, valueMap);
      const key = this.getText(keyBlock, blockMap);
      const value = this.getText(valueBlock, blockMap);
      if (key) result[key] = value;
    }

    return result;
  }

  private findValueBlock(keyBlock: any, valueMap: any) {
    const rel = keyBlock.Relationships?.find(r => r.Type === 'VALUE');
    return rel ? valueMap[rel.Ids[0]] : null;
  }

  private getText(block: any, blockMap: any): string {
    if (!block?.Relationships) return '';
    return block.Relationships
      .filter(r => r.Type === 'CHILD')
      .flatMap(r => r.Ids)
      .map(id => blockMap[id])
      .filter(b => b.BlockType === 'WORD')
      .map(b => b.Text)
      .join(' ');
  }
}