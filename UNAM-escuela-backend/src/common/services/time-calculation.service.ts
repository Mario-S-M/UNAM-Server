import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from '../../activities/entities/activity.entity';
import { Content } from '../../contents/entities/content.entity';
import { Skill } from '../../skills/entities/skill.entity';
import { Level } from '../../levels/entities/level.entity';
import { Lenguage } from '../../lenguages/entities/lenguage.entity';

@Injectable()
export class TimeCalculationService {
  private readonly logger = new Logger(TimeCalculationService.name);

  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
    @InjectRepository(Content)
    private contentRepository: Repository<Content>,
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
    @InjectRepository(Level)
    private levelRepository: Repository<Level>,
    @InjectRepository(Lenguage)
    private lenguageRepository: Repository<Lenguage>,
  ) {}

  /**
   * Calcula el tiempo total de un contenido basado en sus actividades
   */
  async calculateContentTotalTime(contentId: string): Promise<number> {
    try {
      const activities = await this.activityRepository.find({
        where: { contentId },
        select: ['estimatedTime'],
      });

      const totalTime = activities.reduce((sum, activity) => {
        return sum + (activity.estimatedTime || 0);
      }, 0);

      this.logger.log(`Calculated total time for content ${contentId}: ${totalTime} minutes`);
      return totalTime;
    } catch (error) {
      this.logger.error(`Error calculating content total time: ${error.message}`, error.stack);
      return 0;
    }
  }

  /**
   * Calcula el tiempo total de una habilidad basado en sus contenidos
   */
  async calculateSkillTotalTime(skillId: string): Promise<number> {
    try {
      const contents = await this.contentRepository.find({
        where: { skillId },
        select: ['id'],
      });

      let totalTime = 0;
      for (const content of contents) {
        const contentTime = await this.calculateContentTotalTime(content.id);
        totalTime += contentTime;
      }

      this.logger.log(`Calculated total time for skill ${skillId}: ${totalTime} minutes`);
      return totalTime;
    } catch (error) {
      this.logger.error(`Error calculating skill total time: ${error.message}`, error.stack);
      return 0;
    }
  }

  /**
   * Calcula el tiempo total de un nivel basado en sus habilidades
   */
  async calculateLevelTotalTime(levelId: string): Promise<number> {
    try {
      const skills = await this.skillRepository.find({
        where: { levelId },
        select: ['id'],
      });

      let totalTime = 0;
      for (const skill of skills) {
        const skillTime = await this.calculateSkillTotalTime(skill.id);
        totalTime += skillTime;
      }

      this.logger.log(`Calculated total time for level ${levelId}: ${totalTime} minutes`);
      return totalTime;
    } catch (error) {
      this.logger.error(`Error calculating level total time: ${error.message}`, error.stack);
      return 0;
    }
  }

  /**
   * Calcula el tiempo total de un idioma basado en sus niveles
   */
  async calculateLanguageTotalTime(lenguageId: string): Promise<number> {
    try {
      const levels = await this.levelRepository.find({
        where: { lenguageId },
        select: ['id'],
      });

      let totalTime = 0;
      for (const level of levels) {
        const levelTime = await this.calculateLevelTotalTime(level.id);
        totalTime += levelTime;
      }

      this.logger.log(`Calculated total time for language ${lenguageId}: ${totalTime} minutes`);
      return totalTime;
    } catch (error) {
      this.logger.error(`Error calculating language total time: ${error.message}`, error.stack);
      return 0;
    }
  }

  /**
   * Actualiza el tiempo calculado de un contenido
   */
  async updateContentCalculatedTime(contentId: string): Promise<void> {
    try {
      const calculatedTime = await this.calculateContentTotalTime(contentId);
      await this.contentRepository.update(contentId, {
        calculatedTotalTime: calculatedTime,
      });
      this.logger.log(`Updated calculated time for content ${contentId}: ${calculatedTime} minutes`);
    } catch (error) {
      this.logger.error(`Error updating content calculated time: ${error.message}`, error.stack);
    }
  }

  /**
   * Actualiza el tiempo calculado de una habilidad
   */
  async updateSkillCalculatedTime(skillId: string): Promise<void> {
    try {
      const calculatedTime = await this.calculateSkillTotalTime(skillId);
      await this.skillRepository.update(skillId, {
        calculatedTotalTime: calculatedTime,
      });
      this.logger.log(`Updated calculated time for skill ${skillId}: ${calculatedTime} minutes`);
    } catch (error) {
      this.logger.error(`Error updating skill calculated time: ${error.message}`, error.stack);
    }
  }

  /**
   * Actualiza el tiempo calculado de un nivel
   */
  async updateLevelCalculatedTime(levelId: string): Promise<void> {
    try {
      const calculatedTime = await this.calculateLevelTotalTime(levelId);
      await this.levelRepository.update(levelId, {
        calculatedTotalTime: calculatedTime,
      });
      this.logger.log(`Updated calculated time for level ${levelId}: ${calculatedTime} minutes`);
    } catch (error) {
      this.logger.error(`Error updating level calculated time: ${error.message}`, error.stack);
    }
  }

  /**
   * Actualiza el tiempo calculado de un idioma
   */
  async updateLanguageCalculatedTime(lenguageId: string): Promise<void> {
    try {
      const calculatedTime = await this.calculateLanguageTotalTime(lenguageId);
      await this.lenguageRepository.update(lenguageId, {
        calculatedTotalTime: calculatedTime,
      });
      this.logger.log(`Updated calculated time for language ${lenguageId}: ${calculatedTime} minutes`);
    } catch (error) {
      this.logger.error(`Error updating language calculated time: ${error.message}`, error.stack);
    }
  }

  /**
   * Recalcula todos los tiempos en cascada cuando se actualiza una actividad
   */
  async recalculateTimesForActivity(activityId: string): Promise<void> {
    try {
      const activity = await this.activityRepository.findOne({
        where: { id: activityId },
        select: ['contentId'],
      });

      if (!activity) {
        this.logger.warn(`Activity ${activityId} not found for recalculation`);
        return;
      }

      // Actualizar contenido
      await this.updateContentCalculatedTime(activity.contentId);

      // Obtener skill del contenido
      const content = await this.contentRepository.findOne({
        where: { id: activity.contentId },
        select: ['skillId'],
      });

      if (content?.skillId) {
        // Actualizar skill
        await this.updateSkillCalculatedTime(content.skillId);

        // Obtener level del skill
        const skill = await this.skillRepository.findOne({
          where: { id: content.skillId },
          select: ['levelId'],
        });

        if (skill?.levelId) {
          // Actualizar level
          await this.updateLevelCalculatedTime(skill.levelId);

          // Obtener language del level
          const level = await this.levelRepository.findOne({
            where: { id: skill.levelId },
            select: ['lenguageId'],
          });

          if (level?.lenguageId) {
            // Actualizar language
            await this.updateLanguageCalculatedTime(level.lenguageId);
          }
        }
      }

      this.logger.log(`Completed time recalculation cascade for activity ${activityId}`);
    } catch (error) {
      this.logger.error(`Error in time recalculation cascade: ${error.message}`, error.stack);
    }
  }

  /**
   * Recalcula todos los tiempos del sistema (útil para migraciones o mantenimiento)
   */
  async recalculateAllTimes(): Promise<void> {
    try {
      this.logger.log('Starting full system time recalculation...');

      // Recalcular todos los contenidos
      const contents = await this.contentRepository.find({ select: ['id'] });
      for (const content of contents) {
        await this.updateContentCalculatedTime(content.id);
      }

      // Recalcular todas las habilidades
      const skills = await this.skillRepository.find({ select: ['id'] });
      for (const skill of skills) {
        await this.updateSkillCalculatedTime(skill.id);
      }

      // Recalcular todos los niveles
      const levels = await this.levelRepository.find({ select: ['id'] });
      for (const level of levels) {
        await this.updateLevelCalculatedTime(level.id);
      }

      // Recalcular todos los idiomas
      const languages = await this.lenguageRepository.find({ select: ['id'] });
      for (const language of languages) {
        await this.updateLanguageCalculatedTime(language.id);
      }

      this.logger.log('Completed full system time recalculation');
    } catch (error) {
      this.logger.error(`Error in full system time recalculation: ${error.message}`, error.stack);
    }
  }
}