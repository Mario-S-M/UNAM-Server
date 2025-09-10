import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProgress } from './entities/user-progress.entity';
import { UserActivityHistory } from './entities/user-activity-history.entity';
import { User } from '../users/entities/user.entity';
import { Content } from '../contents/entities/content.entity';
import { Activity } from '../activities/entities/activity.entity';
import { FormResponse } from '../forms/entities/form-response.entity';

@Injectable()
export class UserProgressService {
  private readonly logger = new Logger(UserProgressService.name);

  constructor(
    @InjectRepository(UserProgress)
    private userProgressRepository: Repository<UserProgress>,
    @InjectRepository(UserActivityHistory)
    private userActivityHistoryRepository: Repository<UserActivityHistory>,
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
    @InjectRepository(Content)
    private contentRepository: Repository<Content>,
  ) {}

  async updateUserProgress(
    userId: string,
    contentId: string,
    activityId: string,
    formResponseId?: string,
    score?: number,
    maxScore?: number,
    timeSpent?: number,
  ): Promise<UserProgress> {
    try {
      // Buscar o crear el progreso del usuario
      let userProgress = await this.userProgressRepository.findOne({
        where: { userId, contentId },
      });

      if (!userProgress) {
        // Obtener el total de actividades del contenido
        const totalActivities = await this.activityRepository.count({
          where: { contentId },
        });

        userProgress = this.userProgressRepository.create({
          userId,
          contentId,
          totalActivities,
          completedActivityIds: [],
          formResponseIds: [],
        });
      }

      // Inicializar arrays si son undefined
      if (!userProgress.completedActivityIds) {
        userProgress.completedActivityIds = [];
      }
      if (!userProgress.formResponseIds) {
        userProgress.formResponseIds = [];
      }

      // Actualizar actividades completadas
      if (!userProgress.completedActivityIds.includes(activityId)) {
        userProgress.completedActivityIds.push(activityId);
        userProgress.completedActivities = userProgress.completedActivityIds.length;
      }

      // Actualizar respuestas de formularios
      if (formResponseId && !userProgress.formResponseIds.includes(formResponseId)) {
        userProgress.formResponseIds.push(formResponseId);
      }

      // Calcular porcentaje de progreso
      userProgress.progressPercentage = userProgress.totalActivities > 0 
        ? (userProgress.completedActivities / userProgress.totalActivities) * 100
        : 0;

      // Verificar si está completado
      userProgress.isCompleted = userProgress.progressPercentage >= 100;
      if (userProgress.isCompleted && !userProgress.completedAt) {
        userProgress.completedAt = new Date();
      }

      userProgress.lastActivityAt = new Date();

      // Guardar progreso
      const savedProgress = await this.userProgressRepository.save(userProgress);

      // Crear entrada en el historial
      await this.createActivityHistory(
        userId,
        contentId,
        activityId,
        formResponseId,
        score,
        maxScore,
        timeSpent,
      );

      this.logger.log(`Progress updated for user ${userId} in content ${contentId}`);
      return savedProgress;
    } catch (error) {
      this.logger.error(`Error updating user progress: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async createActivityHistory(
    userId: string,
    contentId: string,
    activityId: string,
    formResponseId?: string,
    score?: number,
    maxScore?: number,
    timeSpent?: number,
  ): Promise<UserActivityHistory> {
    try {
      // Verificar si ya existe una entrada para este intento
      const existingHistory = await this.userActivityHistoryRepository.findOne({
        where: {
          userId,
          contentId,
          activityId,
          formResponseId,
        },
      });

      if (existingHistory) {
        // Actualizar entrada existente
        existingHistory.status = 'completed';
        existingHistory.score = score;
        existingHistory.maxScore = maxScore;
        existingHistory.timeSpent = timeSpent;
        existingHistory.completedAt = new Date();
        return await this.userActivityHistoryRepository.save(existingHistory);
      }

      // Contar intentos previos para esta actividad
      const attemptCount = await this.userActivityHistoryRepository.count({
        where: { userId, activityId },
      });

      const historyEntry = this.userActivityHistoryRepository.create({
        userId,
        contentId,
        activityId,
        formResponseId,
        status: 'completed',
        score,
        maxScore,
        timeSpent,
        attemptNumber: attemptCount + 1,
        startedAt: new Date(),
        completedAt: new Date(),
      });

      return await this.userActivityHistoryRepository.save(historyEntry);
    } catch (error) {
      this.logger.error(`Error creating activity history: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getUserProgress(userId: string, contentId?: string): Promise<UserProgress[]> {
    const where: any = { userId };
    if (contentId) {
      where.contentId = contentId;
    }

    return await this.userProgressRepository.find({
      where,
      relations: ['content', 'user'],
      order: { updatedAt: 'DESC' },
    });
  }

  async getUserActivityHistory(
    userId: string,
    contentId?: string,
    activityId?: string,
  ): Promise<UserActivityHistory[]> {
    const where: any = { userId };
    if (contentId) where.contentId = contentId;
    if (activityId) where.activityId = activityId;

    return await this.userActivityHistoryRepository.find({
      where,
      relations: ['content', 'activity', 'formResponse'],
      order: { createdAt: 'DESC' },
    });
  }

  async getOverallProgress(userId: string): Promise<{
    totalContents: number;
    completedContents: number;
    overallPercentage: number;
    totalActivities: number;
    completedActivities: number;
  }> {
    const userProgress = await this.getUserProgress(userId);
    
    const totalContents = userProgress.length;
    const completedContents = userProgress.filter(p => p.isCompleted).length;
    const overallPercentage = totalContents > 0 ? (completedContents / totalContents) * 100 : 0;
    
    const totalActivities = userProgress.reduce((sum, p) => sum + p.totalActivities, 0);
    const completedActivities = userProgress.reduce((sum, p) => sum + p.completedActivities, 0);

    return {
      totalContents,
      completedContents,
      overallPercentage,
      totalActivities,
      completedActivities,
    };
  }

  async shouldAutoSave(userRole: string): Promise<boolean> {
    return userRole === 'mortal' || userRole === 'alumno';
  }
}