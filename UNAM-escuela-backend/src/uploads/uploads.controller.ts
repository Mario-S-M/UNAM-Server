import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UseGuards,
  Body,
  Delete,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { existsSync, mkdirSync, unlinkSync, rmdir, readdir } from 'fs';
import { promisify } from 'util';
import { dirname } from 'path';

const rmdirAsync = promisify(rmdir);
const readdirAsync = promisify(readdir);

// Función helper para eliminar carpetas vacías recursivamente
const removeEmptyDirectories = async (dirPath: string): Promise<void> => {
  try {
    if (!existsSync(dirPath)) return;
    
    const files = await readdirAsync(dirPath);
    
    // Si la carpeta está vacía, eliminarla
    if (files.length === 0) {
      await rmdirAsync(dirPath);
      
      // Intentar eliminar la carpeta padre si también está vacía
      const parentDir = dirname(dirPath);
      if (parentDir !== dirPath && parentDir !== './Imagenes') {
        await removeEmptyDirectories(parentDir);
      }
    }
  } catch (error) {
    // Ignorar errores al eliminar carpetas (pueden no estar vacías)
    console.log('No se pudo eliminar la carpeta:', dirPath);
  }
};

// Función helper para crear la estructura de carpetas
const createUploadPath = (type: string, entityData: any): string => {
  const baseImagePath = './Imagenes';
  let uploadPath = baseImagePath;

  switch (type) {
    case 'language':
      uploadPath = `${baseImagePath}/languages/${entityData.languageName || entityData.languageId || 'temp'}`;
      break;
    case 'level':
      uploadPath = `${baseImagePath}/languages/${entityData.languageName || entityData.languageId || 'temp'}/levels/${entityData.levelName || entityData.levelId || 'temp'}`;
      break;
    case 'skill':
      uploadPath = `${baseImagePath}/languages/${entityData.languageName || entityData.languageId || 'temp'}/levels/${entityData.levelName || entityData.levelId || 'temp'}/skills/${entityData.skillName || entityData.skillId || 'temp'}`;
      break;
    case 'content':
      uploadPath = `${baseImagePath}/languages/${entityData.languageName || entityData.languageId || 'temp'}/levels/${entityData.levelName || entityData.levelId || 'temp'}/skills/${entityData.skillName || entityData.skillId || 'temp'}/contents/${entityData.contentName || entityData.contentId || 'temp'}`;
      break;
    case 'activity':
      uploadPath = `${baseImagePath}/languages/${entityData.languageName || entityData.languageId || 'temp'}/levels/${entityData.levelName || entityData.levelId || 'temp'}/skills/${entityData.skillName || entityData.skillId || 'temp'}/contents/${entityData.contentName || entityData.contentId || 'temp'}/activities/${entityData.activityName || entityData.activityId || 'temp'}`;
      break;
    default:
      uploadPath = './uploads/images';
  }

  if (!existsSync(uploadPath)) {
    mkdirSync(uploadPath, { recursive: true });
  }

  return uploadPath;
};

// Configuración de multer para languages
const languageStorage = diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = createUploadPath('language', req.body);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = uuidv4();
    const ext = extname(file.originalname);
    cb(null, `language-${uniqueSuffix}${ext}`);
  },
});

// Configuración de multer para levels
const levelStorage = diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = createUploadPath('level', req.body);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = uuidv4();
    const ext = extname(file.originalname);
    cb(null, `level-${uniqueSuffix}${ext}`);
  },
});

// Configuración de multer para skills
const skillStorage = diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = createUploadPath('skill', req.body);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = uuidv4();
    const ext = extname(file.originalname);
    cb(null, `skill-${uniqueSuffix}${ext}`);
  },
});

// Configuración de multer para contents
const contentStorage = diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = createUploadPath('content', req.body);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = uuidv4();
    const ext = extname(file.originalname);
    cb(null, `content-${uniqueSuffix}${ext}`);
  },
});

// Configuración de multer para activities
const activityStorage = diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = createUploadPath('activity', req.body);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = uuidv4();
    const ext = extname(file.originalname);
    cb(null, `activity-${uniqueSuffix}${ext}`);
  },
});

// Configuración de multer general (mantener compatibilidad)
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
    const imageUrl = `http://localhost:3000/uploads/images/${file.filename}`;

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

  // Endpoint específico para subir imágenes de languages
  @UseGuards(JwtAuthGuard)
  @Post('language-image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: languageStorage,
      fileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB máximo
      },
    }),
  )
  uploadLanguageImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('languageId') languageId: string,
    @Body('languageName') languageName: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser, ValidRoles.docente])
    user: User,
  ) {
    if (!file) {
      throw new BadRequestException('No se ha subido ningún archivo');
    }

    if (!languageId && !languageName) {
      throw new BadRequestException('El ID o nombre del idioma es requerido');
    }

    const folderName = languageName || languageId;
    const relativePath = `languages/${folderName}/${file.filename}`;
    const imageUrl = `http://localhost:3000/images/${relativePath}`;

    return {
      message: 'Imagen de idioma subida exitosamente',
      url: imageUrl,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      relativePath,
      languageId,
      languageName,
    };
  }

  // Endpoint específico para subir imágenes de levels
  @UseGuards(JwtAuthGuard)
  @Post('level-image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: levelStorage,
      fileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB máximo
      },
    }),
  )
  uploadLevelImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('languageId') languageId: string,
    @Body('languageName') languageName: string,
    @Body('levelId') levelId: string,
    @Body('levelName') levelName: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser, ValidRoles.docente])
    user: User,
  ) {
    if (!file) {
      throw new BadRequestException('No se ha subido ningún archivo');
    }

    if (!levelId && !levelName) {
      throw new BadRequestException('El ID o nombre del nivel es requerido');
    }

    if (!languageId && !languageName) {
      throw new BadRequestException('El ID o nombre del idioma es requerido');
    }

    const langFolder = languageName || languageId;
    const levelFolder = levelName || levelId;
    const relativePath = `languages/${langFolder}/levels/${levelFolder}/${file.filename}`;
    const imageUrl = `http://localhost:3000/images/${relativePath}`;

    return {
      message: 'Imagen de nivel subida exitosamente',
      url: imageUrl,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      relativePath,
      languageId,
      languageName,
      levelId,
      levelName,
    };
  }

  // Endpoint específico para subir imágenes de skills
  @UseGuards(JwtAuthGuard)
  @Post('skill-image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: skillStorage,
      fileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB máximo
      },
    }),
  )
  uploadSkillImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('languageId') languageId: string,
    @Body('languageName') languageName: string,
    @Body('levelId') levelId: string,
    @Body('levelName') levelName: string,
    @Body('skillId') skillId: string,
    @Body('skillName') skillName: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser, ValidRoles.docente])
    user: User,
  ) {
    if (!file) {
      throw new BadRequestException('No se ha subido ningún archivo');
    }

    if (!skillId && !skillName) {
      throw new BadRequestException('El ID o nombre de la skill es requerido');
    }

    const langFolder = languageName || languageId;
    const levelFolder = levelName || levelId;
    const skillFolder = skillName || skillId;
    const relativePath = `languages/${langFolder}/levels/${levelFolder}/skills/${skillFolder}/${file.filename}`;
    const imageUrl = `http://localhost:3000/images/${relativePath}`;

    return {
      message: 'Imagen de skill subida exitosamente',
      url: imageUrl,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      relativePath,
      languageId,
      languageName,
      levelId,
      levelName,
      skillId,
      skillName,
    };
  }

  // Endpoint específico para subir imágenes de contents
  @UseGuards(JwtAuthGuard)
  @Post('content-image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: contentStorage,
      fileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB máximo
      },
    }),
  )
  uploadContentImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('languageId') languageId: string,
    @Body('languageName') languageName: string,
    @Body('levelId') levelId: string,
    @Body('levelName') levelName: string,
    @Body('skillId') skillId: string,
    @Body('skillName') skillName: string,
    @Body('contentId') contentId: string,
    @Body('contentName') contentName: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser, ValidRoles.docente])
    user: User,
  ) {
    if (!file) {
      throw new BadRequestException('No se ha subido ningún archivo');
    }

    if (!contentId && !contentName) {
      throw new BadRequestException('El ID o nombre del contenido es requerido');
    }

    const langFolder = languageName || languageId;
    const levelFolder = levelName || levelId;
    const skillFolder = skillName || skillId;
    const contentFolder = contentName || contentId;
    const relativePath = `languages/${langFolder}/levels/${levelFolder}/skills/${skillFolder}/contents/${contentFolder}/${file.filename}`;
    const imageUrl = `http://localhost:3000/images/${relativePath}`;

    return {
      message: 'Imagen de contenido subida exitosamente',
      url: imageUrl,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      relativePath,
      languageId,
      languageName,
      levelId,
      levelName,
      skillId,
      skillName,
      contentId,
      contentName,
    };
  }

  // Endpoint específico para subir imágenes de activities
  @UseGuards(JwtAuthGuard)
  @Post('activity-image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: activityStorage,
      fileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB máximo
      },
    }),
  )
  uploadActivityImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('languageId') languageId: string,
    @Body('languageName') languageName: string,
    @Body('levelId') levelId: string,
    @Body('levelName') levelName: string,
    @Body('skillId') skillId: string,
    @Body('skillName') skillName: string,
    @Body('contentId') contentId: string,
    @Body('contentName') contentName: string,
    @Body('activityId') activityId: string,
    @Body('activityName') activityName: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser, ValidRoles.docente])
    user: User,
  ) {
    if (!file) {
      throw new BadRequestException('No se ha subido ningún archivo');
    }

    if (!activityId && !activityName) {
      throw new BadRequestException('El ID o nombre de la actividad es requerido');
    }

    const langFolder = languageName || languageId;
    const levelFolder = levelName || levelId;
    const skillFolder = skillName || skillId;
    const contentFolder = contentName || contentId;
    const activityFolder = activityName || activityId;
    const relativePath = `languages/${langFolder}/levels/${levelFolder}/skills/${skillFolder}/contents/${contentFolder}/activities/${activityFolder}/${file.filename}`;
    const imageUrl = `http://localhost:3000/images/${relativePath}`;

    return {
      message: 'Imagen de actividad subida exitosamente',
      url: imageUrl,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      relativePath,
      languageId,
      languageName,
      levelId,
      levelName,
      skillId,
      skillName,
      contentId,
      contentName,
      activityId,
      activityName,
    };
  }

  // Endpoint para eliminar imágenes de languages
  @UseGuards(JwtAuthGuard)
  @Delete('language-image/:languageName/:filename')
  async deleteLanguageImage(
    @Param('languageName') languageName: string,
    @Param('filename') filename: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser, ValidRoles.docente])
    user: User,
  ) {
    try {
      const filePath = `./Imagenes/languages/${languageName}/${filename}`;
      
      if (!existsSync(filePath)) {
        throw new BadRequestException('El archivo no existe');
      }

      unlinkSync(filePath);
      
      // Intentar eliminar carpetas vacías
      const dirPath = `./Imagenes/languages/${languageName}`;
      await removeEmptyDirectories(dirPath);

      return {
        message: 'Imagen de idioma eliminada exitosamente',
        filename,
        languageName,
      };
    } catch (error) {
      throw new BadRequestException('Error al eliminar la imagen');
    }
  }

  // Endpoint para eliminar imágenes de levels
  @UseGuards(JwtAuthGuard)
  @Delete('level-image/:languageName/:levelName/:filename')
  async deleteLevelImage(
    @Param('languageName') languageName: string,
    @Param('levelName') levelName: string,
    @Param('filename') filename: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser, ValidRoles.docente])
    user: User,
  ) {
    try {
      const filePath = `./Imagenes/languages/${languageName}/levels/${levelName}/${filename}`;
      
      if (!existsSync(filePath)) {
        throw new BadRequestException('El archivo no existe');
      }

      unlinkSync(filePath);
      
      // Intentar eliminar carpetas vacías
      const dirPath = `./Imagenes/languages/${languageName}/levels/${levelName}`;
      await removeEmptyDirectories(dirPath);

      return {
        message: 'Imagen de nivel eliminada exitosamente',
        filename,
        languageName,
        levelName,
      };
    } catch (error) {
      throw new BadRequestException('Error al eliminar la imagen');
    }
  }

  // Endpoint para eliminar imágenes de skills
  @UseGuards(JwtAuthGuard)
  @Delete('skill-image/:languageName/:levelName/:skillName/:filename')
  async deleteSkillImage(
    @Param('languageName') languageName: string,
    @Param('levelName') levelName: string,
    @Param('skillName') skillName: string,
    @Param('filename') filename: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser, ValidRoles.docente])
    user: User,
  ) {
    try {
      const filePath = `./Imagenes/languages/${languageName}/levels/${levelName}/skills/${skillName}/${filename}`;
      
      if (!existsSync(filePath)) {
        throw new BadRequestException('El archivo no existe');
      }

      unlinkSync(filePath);
      
      // Intentar eliminar carpetas vacías
      const dirPath = `./Imagenes/languages/${languageName}/levels/${levelName}/skills/${skillName}`;
      await removeEmptyDirectories(dirPath);

      return {
        message: 'Imagen de skill eliminada exitosamente',
        filename,
        languageName,
        levelName,
        skillName,
      };
    } catch (error) {
      throw new BadRequestException('Error al eliminar la imagen');
    }
  }

  // Endpoint para eliminar imágenes de contents
  @UseGuards(JwtAuthGuard)
  @Delete('content-image/:languageName/:levelName/:skillName/:contentName/:filename')
  async deleteContentImage(
    @Param('languageName') languageName: string,
    @Param('levelName') levelName: string,
    @Param('skillName') skillName: string,
    @Param('contentName') contentName: string,
    @Param('filename') filename: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser, ValidRoles.docente])
    user: User,
  ) {
    try {
      const filePath = `./Imagenes/languages/${languageName}/levels/${levelName}/skills/${skillName}/contents/${contentName}/${filename}`;
      
      if (!existsSync(filePath)) {
        throw new BadRequestException('El archivo no existe');
      }

      unlinkSync(filePath);
      
      // Intentar eliminar carpetas vacías
      const dirPath = `./Imagenes/languages/${languageName}/levels/${levelName}/skills/${skillName}/contents/${contentName}`;
      await removeEmptyDirectories(dirPath);

      return {
        message: 'Imagen de contenido eliminada exitosamente',
        filename,
        languageName,
        levelName,
        skillName,
        contentName,
      };
    } catch (error) {
      throw new BadRequestException('Error al eliminar la imagen');
    }
  }

  // Endpoint para eliminar imágenes de activities
  @UseGuards(JwtAuthGuard)
  @Delete('activity-image/:languageName/:levelName/:skillName/:contentName/:activityName/:filename')
  async deleteActivityImage(
    @Param('languageName') languageName: string,
    @Param('levelName') levelName: string,
    @Param('skillName') skillName: string,
    @Param('contentName') contentName: string,
    @Param('activityName') activityName: string,
    @Param('filename') filename: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser, ValidRoles.docente])
    user: User,
  ) {
    try {
      const filePath = `./Imagenes/languages/${languageName}/levels/${levelName}/skills/${skillName}/contents/${contentName}/activities/${activityName}/${filename}`;
      
      if (!existsSync(filePath)) {
        throw new BadRequestException('El archivo no existe');
      }

      unlinkSync(filePath);
      
      // Intentar eliminar carpetas vacías
      const dirPath = `./Imagenes/languages/${languageName}/levels/${levelName}/skills/${skillName}/contents/${contentName}/activities/${activityName}`;
      await removeEmptyDirectories(dirPath);

      return {
        message: 'Imagen de actividad eliminada exitosamente',
        filename,
        languageName,
        levelName,
        skillName,
        contentName,
        activityName,
      };
    } catch (error) {
      throw new BadRequestException('Error al eliminar la imagen');
    }
  }
}