import mongoose from "mongoose";
import Course from "./src/models/Course.js";
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
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    await Course.deleteMany({});
    await Course.insertMany(courses);
    console.log("База наполнена тестовыми курсами!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Ошибка при сидировании:", error);
  }
};

seedDB();
