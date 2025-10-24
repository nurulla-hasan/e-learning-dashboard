export interface ITest {
  testId: string;
}

export interface ILesson {
  id: string;
  title: string;
  order: number;
  description: string;
  tempKey?: string;
}

export interface ISection {
  id: string;
  title: string;
  order: number;
  lessons: ILesson[];
  tests: ITest[];
}

export interface ICurriculumFormProps {
  sections: ISection[];
  onSectionsChange: (sections: ISection[]) => void;
  onLessonFileChange: (lessonId: string, file: File) => void;
  onDeleteLesson: (lessonId: string) => void;
  onAddTest: (sectionId: string, testId: string) => void;
  onRemoveTest: (sectionId: string, testId: string) => void;
  lessonFiles: { [tempKey: string]: File };
  testsData: { id: string; title: string }[];
}
