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
  setSections: (
    updater: ISection[] | ((prev: ISection[]) => ISection[])
  ) => void;
  lessonFiles: { [tempKey: string]: File };
  setLessonFiles: (
    updater:
      | ((prev: { [tempKey: string]: File }) => { [tempKey: string]: File })
      | { [tempKey: string]: File }
  ) => void;
  testsData: { id: string; title: string }[];
}
