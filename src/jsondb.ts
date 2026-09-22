import { InternalServerErrorException } from '@nestjs/common';
import { readFile, writeFile } from 'node:fs/promises';

export class JsonDb {
  private readonly filePath = 'src/database.json';
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  // Makes sure that the table exists
  private async getFullDatabase(): Promise<Record<string, any>> {
    try {
      const fileData = await readFile(this.filePath, 'utf-8');
      const parsedData = JSON.parse(fileData);

      // Incase the file exists but this specific key is missing
      if (!(this.key in parsedData)) {
        parsedData[this.key] = [];
        await writeFile(
          this.filePath,
          JSON.stringify(parsedData, null, 2),
          'utf-8',
        );
      }
      return parsedData;
    } catch (error: any) {
      // in case the file doesn't exist
      if (error.code === 'ENOENT') {
        const table = { [this.key]: [] };
        await writeFile(
          this.filePath,
          JSON.stringify({ [this.key]: [] }, null, 2),
          'utf-8',
        );
        return table;
      }
      throw error;
    }
  }

  async writeData(data: any): Promise<void> {
    try {
      const db = await this.getFullDatabase();
      db[this.key] = data;
      await writeFile(this.filePath, JSON.stringify(db, null, 2), 'utf-8');
    } catch (error) {
      throw new InternalServerErrorException('Could not save data file');
    }
  }

  async readData(): Promise<any> {
    try {
      const db = await this.getFullDatabase();
      return db[this.key];
    } catch (error) {
      throw new InternalServerErrorException('Could not read data file');
    }
  }
}
