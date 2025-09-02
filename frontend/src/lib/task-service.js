import { supabase, TABLES, TASK_TYPES } from './database';
import { ExperienceService } from './auth';

export class TaskService {
  // Get daily tasks for a user
  static async getDailyTasks(userId) {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get all daily tasks
      const { data: dailyTasks, error: tasksError } = await supabase
        .from(TABLES.TASKS)
        .select('*')
        .eq('task_type', TASK_TYPES.DAILY)
        .eq('is_active', true);

      if (tasksError) throw tasksError;

      // Get user's completed tasks for today
      const { data: completedTasks, error: completedError } = await supabase
        .from(TABLES.USER_TASKS)
        .select('task_id')
        .eq('user_id', userId)
        .gte('completed_at', today + 'T00:00:00Z')
        .lt('completed_at', today + 'T23:59:59Z');

      if (completedError) throw completedError;

      const completedTaskIds = completedTasks.map(ct => ct.task_id);

      // Mark tasks as completed or incomplete
      const tasksWithStatus = dailyTasks.map(task => ({
        ...task,
        isCompleted: completedTaskIds.includes(task.id),
        canClaim: completedTaskIds.includes(task.id)
      }));

      return { success: true, data: tasksWithStatus };
    } catch (error) {
      console.error('Get daily tasks error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get one-time tasks for a user
  static async getOneTimeTasks(userId) {
    try {
      // Get all one-time tasks
      const { data: oneTimeTasks, error: tasksError } = await supabase
        .from(TABLES.TASKS)
        .select('*')
        .eq('task_type', TASK_TYPES.ONE_TIME)
        .eq('is_active', true);

      if (tasksError) throw tasksError;

      // Get user's completed one-time tasks
      const { data: completedTasks, error: completedError } = await supabase
        .from(TABLES.USER_TASKS)
        .select('task_id')
        .eq('user_id', userId);

      if (completedError) throw completedError;

      const completedTaskIds = completedTasks.map(ct => ct.task_id);

      // Mark tasks as completed or incomplete
      const tasksWithStatus = oneTimeTasks.map(task => ({
        ...task,
        isCompleted: completedTaskIds.includes(task.id),
        canClaim: completedTaskIds.includes(task.id)
      }));

      return { success: true, data: tasksWithStatus };
    } catch (error) {
      console.error('Get one-time tasks error:', error);
      return { success: false, error: error.message };
    }
  }

  // Complete a task
  static async completeTask(userId, taskId) {
    try {
      // Check if task exists and is active
      const { data: task, error: taskError } = await supabase
        .from(TABLES.TASKS)
        .select('*')
        .eq('id', taskId)
        .eq('is_active', true)
        .single();

      if (taskError || !task) {
        return { success: false, error: 'Task not found or inactive' };
      }

      // Check if already completed today (for daily tasks)
      if (task.task_type === TASK_TYPES.DAILY) {
        const today = new Date().toISOString().split('T')[0];
        const { data: existing, error: checkError } = await supabase
          .from(TABLES.USER_TASKS)
          .select('*')
          .eq('user_id', userId)
          .eq('task_id', taskId)
          .gte('completed_at', today + 'T00:00:00Z')
          .lt('completed_at', today + 'T23:59:59Z')
          .single();

        if (checkError && checkError.code !== 'PGRST116') throw checkError;

        if (existing) {
          return { success: false, error: 'Task already completed today' };
        }
      } else {
        // Check if one-time task already completed
        const { data: existing, error: checkError } = await supabase
          .from(TABLES.USER_TASKS)
          .select('*')
          .eq('user_id', userId)
          .eq('task_id', taskId)
          .single();

        if (checkError && checkError.code !== 'PGRST116') throw checkError;

        if (existing) {
          return { success: false, error: 'Task already completed' };
        }
      }

      // Mark task as completed
      const { data: completedTask, error: completeError } = await supabase
        .from(TABLES.USER_TASKS)
        .insert({
          user_id: userId,
          task_id: taskId,
          exp_earned: task.exp_reward
        })
        .select()
        .single();

      if (completeError) throw completeError;

      // Add experience reward
      const expResult = await ExperienceService.addExperience(
        userId, 
        task.exp_reward, 
        `task_completion: ${task.title}`
      );

      if (!expResult.success) {
        console.error('Failed to add experience:', expResult.error);
      }

      return { 
        success: true, 
        data: completedTask, 
        expEarned: task.exp_reward,
        leveledUp: expResult.leveledUp || false
      };
    } catch (error) {
      console.error('Complete task error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get task progress for a user
  static async getUserTaskProgress(userId) {
    try {
      // Get total tasks completed
      const { count: totalCompleted, error: completedError } = await supabase
        .from(TABLES.USER_TASKS)
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (completedError) throw completedError;

      // Get daily tasks completed today
      const today = new Date().toISOString().split('T')[0];
      const { count: dailyCompletedToday, error: dailyError } = await supabase
        .from(TABLES.USER_TASKS)
        .select(`
          *,
          tasks!inner(task_type)
        `, { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('completed_at', today + 'T00:00:00Z')
        .lt('completed_at', today + 'T23:59:59Z')
        .eq('tasks.task_type', TASK_TYPES.DAILY);

      if (dailyError) throw dailyError;

      // Get total daily tasks available
      const { count: totalDailyTasks, error: totalDailyError } = await supabase
        .from(TABLES.TASKS)
        .select('*', { count: 'exact', head: true })
        .eq('task_type', TASK_TYPES.DAILY)
        .eq('is_active', true);

      if (totalDailyError) throw totalDailyError;

      // Get total one-time tasks available
      const { count: totalOneTimeTasks, error: totalOneTimeError } = await supabase
        .from(TABLES.TASKS)
        .select('*', { count: 'exact', head: true })
        .eq('task_type', TASK_TYPES.ONE_TIME)
        .eq('is_active', true);

      if (totalOneTimeError) throw totalOneTimeError;

      // Get one-time tasks completed
      const { count: oneTimeCompleted, error: oneTimeError } = await supabase
        .from(TABLES.USER_TASKS)
        .select(`
          *,
          tasks!inner(task_type)
        `, { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('tasks.task_type', TASK_TYPES.ONE_TIME);

      if (oneTimeError) throw oneTimeError;

      return {
        success: true,
        data: {
          totalCompleted: totalCompleted || 0,
          dailyCompletedToday: dailyCompletedToday || 0,
          totalDailyTasks: totalDailyTasks || 0,
          oneTimeCompleted: oneTimeCompleted || 0,
          totalOneTimeTasks: totalOneTimeTasks || 0,
          dailyProgress: totalDailyTasks > 0 ? Math.round((dailyCompletedToday / totalDailyTasks) * 100) : 0,
          oneTimeProgress: totalOneTimeTasks > 0 ? Math.round((oneTimeCompleted / totalOneTimeTasks) * 100) : 0
        }
      };
    } catch (error) {
      console.error('Get user task progress error:', error);
      return { success: false, error: error.message };
    }
  }

  // Reset daily tasks (called at midnight)
  static async resetDailyTasks() {
    try {
      // This would typically be called by a cron job or scheduled function
      // For now, we'll just return success
      return { success: true, message: 'Daily tasks reset successfully' };
    } catch (error) {
      console.error('Reset daily tasks error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get task completion streak
  static async getUserTaskStreak(userId) {
    try {
      const { data: recentCompletions, error } = await supabase
        .from(TABLES.USER_TASKS)
        .select('completed_at')
        .eq('user_id', userId)
        .gte('completed_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('completed_at', { ascending: false });

      if (error) throw error;

      // Calculate streak
      let streak = 0;
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      for (let i = 0; i < 30; i++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const hasCompletion = recentCompletions.some(comp => 
          comp.completed_at.startsWith(dateStr)
        );

        if (hasCompletion) {
          streak++;
        } else {
          break;
        }

        currentDate.setDate(currentDate.getDate() - 1);
      }

      return { success: true, data: { streak } };
    } catch (error) {
      console.error('Get user task streak error:', error);
      return { success: false, error: error.message };
    }
  }
}
