import mongoose from "mongoose";
import Course from "./src/models/Course.js";
import Workout from "./src/models/Workout.js";
import { MONGODB_URI } from "./src/utils/constants.js";

const courses = [
  {
    _id: "yoga_001",
    nameRU: "Йога",
    nameEN: "Yoga",
    description:
      "Древняя практика для гармонии тела и духа. Йога помогает развить гибкость, силу и внутреннее равновесие.",
    directions: [
      "Йога для новичков",
      "Кундалини-йога",
      "Хатха-йога",
      "Классическая йога",
      "Йогатерапия",
      "Аштанга-йога",
    ],
    fitting: [
      "Давно хотели попробовать йогу, но не решались начать",
      "Хотите укрепить позвоночник, избавиться от болей в спине и суставах",
      "Ищете активность, полезную для тела и души",
    ],
    difficulty: "средний",
    durationInDays: 25,
    dailyDurationInMinutes: { from: 20, to: 50 },
    workouts: ["yoga_w1", "yoga_w2"],
  },
  {
    _id: "stretch_002",
    nameRU: "Стретчинг",
    nameEN: "Stretching",
    description:
      "Комплекс упражнений на растяжку всех групп мышц. Улучшает гибкость и подвижность суставов.",
    directions: [
      "Динамический стретчинг",
      "Статический стретчинг",
      "PNF-растяжка",
    ],
    fitting: [
      "Хотите сесть на шпагат",
      "Нужно улучшить осанку и гибкость",
      "Снимаете мышечное напряжение после тренировок",
    ],
    difficulty: "легкий",
    durationInDays: 20,
    dailyDurationInMinutes: { from: 15, to: 30 },
    workouts: ["stretch_w1"],
  },
  {
    _id: "fitness_003",
    nameRU: "Фитнес",
    nameEN: "Fitness",
    description:
      "Интенсивные тренировки для укрепления всех групп мышц и развития выносливости.",
    directions: ["Силовой фитнес", "Кардио", "Функциональный тренинг", "HIIT"],
    fitting: [
      "Хотите похудеть и подтянуть тело",
      "Нужно развить выносливость и силу",
      "Ищете интенсивные тренировки",
    ],
    difficulty: "сложный",
    durationInDays: 30,
    dailyDurationInMinutes: { from: 30, to: 60 },
    workouts: ["fitness_w1"],
  },
  {
    _id: "step_004",
    nameRU: "Степ-аэробика",
    nameEN: "Step Aerobics",
    description:
      "Энергичные тренировки на специальной платформе. Отлично сжигает калории и укрепляет ноги.",
    directions: ["Базовый степ", "Продвинутый степ", "Степ + силовые"],
    fitting: [
      "Любите энергичную музыку и танцы",
      "Хотите укрепить ноги и ягодицы",
      "Ищете кардионагрузку",
    ],
    difficulty: "средний",
    durationInDays: 25,
    dailyDurationInMinutes: { from: 30, to: 45 },
    workouts: [],
  },
  {
    _id: "bodyflex_005",
    nameRU: "Бодифлекс",
    nameEN: "Bodyflex",
    description:
      "Дыхательная гимнастика в сочетании с изометрическими упражнениями. Помогает похудеть и улучшить обмен веществ.",
    directions: [
      "Базовый бодифлекс",
      "Продвинутый уровень",
      "Утренний комплекс",
    ],
    fitting: [
      "Хотите похудеть без изнурительных тренировок",
      "Нужно улучшить обмен веществ",
      "Ищете спокойную практику",
    ],
    difficulty: "легкий",
    durationInDays: 20,
    dailyDurationInMinutes: { from: 15, to: 25 },
    workouts: [],
  },
];

const workouts = [
  {
    _id: "yoga_w1",
    name: "Урок 1. Введение в йогу",
    video: "https://www.youtube.com/embed/gJPs7b8SpVw",
    exercises: [
      {
        _id: "687d11f5faa133228adcafc1",
        name: "Собака мордой вниз",
        quantity: 10,
      },
      { _id: "687d11f5faa133228adcafc2", name: "Поза ребёнка", quantity: 15 },
      {
        _id: "687d11f5faa133228adcafc3",
        name: "Наклон вперёд сидя",
        quantity: 12,
      },
    ],
  },
  {
    _id: "yoga_w2",
    name: "Урок 2. Основные движения",
    video: "https://www.youtube.com/embed/gJPs7b8SpVw",
    exercises: [
      {
        _id: "687d11f5faa133228adcafc4",
        name: "Крендель (15 повторений)",
        quantity: 15,
      },
      { _id: "687d11f5faa133228adcafc5", name: "Скрутка лёжа", quantity: 8 },
    ],
  },

  {
    _id: "stretch_w1",
    name: "Урок 1. Базовая растяжка",
    video: "https://www.youtube.com/embed/gJPs7b8SpVw",
    exercises: [
      { _id: "687d11f5faa133228adcafd1", name: "Наклон к ногам", quantity: 20 },
      { _id: "687d11f5faa133228adcafd2", name: "Растяжка бёдер", quantity: 15 },
      {
        _id: "687d11f5faa133228adcafd3",
        name: "Повороты корпуса",
        quantity: 10,
      },
    ],
  },

  {
    _id: "fitness_w1",
    name: "Урок 1. Кардио-старт",
    video: "https://www.youtube.com/embed/gJPs7b8SpVw",
    exercises: [
      { _id: "687d11f5faa133228adcafe1", name: "Джампинг джек", quantity: 30 },
      { _id: "687d11f5faa133228adcafe2", name: "Берпи", quantity: 10 },
      { _id: "687d11f5faa133228adcafe3", name: "Приседания", quantity: 20 },
      { _id: "687d11f5faa133228adcafe4", name: "Планка", quantity: 30 },
    ],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);

    await Course.deleteMany({});
    await Course.insertMany(courses);

    await Workout.deleteMany({});
    await Workout.insertMany(workouts);

    for (const course of courses) {
      if (course.workouts?.length > 0) {
        await Course.updateOne(
          { _id: course._id },
          { $set: { workouts: course.workouts } },
        );
      }
    }

    mongoose.connection.close();
  } catch (error) {
    mongoose.connection.close();
  }
};

seedDB();
