export type WorkoutProgress = {
  workoutId: string;
  workoutCompleted: boolean;
  progressData: number[];
};

export type CourseProgress = {
  courseId: string;
  courseCompleted: boolean;
  workoutsProgress: WorkoutProgress[];
};

export type UserWithProgress = {
  _id: string;
  email: string;
  selectedCourses: string[];
  progress?: CourseProgress[];
};
