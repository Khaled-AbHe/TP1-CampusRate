import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { readFile, writeFile } from 'node:fs/promises';

@Injectable()
export class StorageService {
  private readonly filePath = 'src/data/database.json';

  async writeData(data: any): Promise<void> {
    try {
      const stringifiedData = JSON.stringify(data, null, 2);
      await writeFile(this.filePath, stringifiedData, 'utf-8');
    } catch (error) {
      throw new InternalServerErrorException('Could not save data file');
    }
  }

  async readData(): Promise<any> {
    try {
      const fileData = await readFile(this.filePath, 'utf-8');
      return JSON.parse(fileData);
    } catch (error) {
      throw new InternalServerErrorException('Could not read data file');
    }
  }
}
