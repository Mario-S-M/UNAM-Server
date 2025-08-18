import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { existsSync, mkdirSync } from 'fs';

// Configuración de multer para almacenar archivos
const storage = diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = './uploads/images';
    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = uuidv4();
    const ext = extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

// Filtro para validar tipos de archivo
const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|avif|svg\+xml)$/)) {
    cb(null, true);
  } else {
    cb(new BadRequestException('Solo se permiten archivos de imagen'), false);
  }
};

@Controller('uploads')
export class UploadsController {
  @UseGuards(JwtAuthGuard)
  @Post('image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage,
      fileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB máximo
      },
    }),
  )
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser, ValidRoles.docente])
    user: User,
  ) {
    if (!file) {
      throw new BadRequestException('No se ha subido ningún archivo');
    }

    // Construir la URL completa del archivo
    const imageUrl = `http://localhost:3002/uploads/images/${file.filename}`;

    return {
      message: 'Imagen subida exitosamente',
      url: imageUrl,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
    };
  }

  // Endpoint público para subir imágenes (sin autenticación)
  @Post('image/public')
  @UseInterceptors(
    FileInterceptor('image', {
      storage,
      fileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB máximo
      },
    }),
  )
  uploadImagePublic(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se ha subido ningún archivo');
    }

    // Construir la URL completa del archivo
    const imageUrl = `http://localhost:3002/uploads/images/${file.filename}`;

    return {
      message: 'Imagen subida exitosamente',
      url: imageUrl,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
    };
  }
}