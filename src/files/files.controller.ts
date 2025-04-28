import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { NotFoundException } from '@nestjs/common';
import * as fs from 'fs';

@Controller('files')
export class FilesController {
  @Get('/:directory/:id')
  getFile(
    @Param('directory') directory: string,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    // Only allow 'assets' or 'docs' directories
    if (!['assets', 'docs'].includes(directory)) {
      throw new NotFoundException('Invalid directory');
    }

    const allowedPath = join(process.cwd(), 'src', 'public', directory);
    const path = join(allowedPath, id);

    // Ensure the path is within the allowed directory and does not contain '..'
    if (!path.startsWith(allowedPath) || id.includes('..')) {
      throw new NotFoundException('Invalid file path');
    }

    if (!fs.existsSync(path)) {
      throw new NotFoundException('File not found');
    }

    const file = createReadStream(path);
    file.pipe(res);
  }
}
