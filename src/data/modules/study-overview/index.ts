import { ModuleConfig } from '../../../types/form';
import { objectiveSubmodule } from './objective';
import { overviewSubmodule } from './overview';
import { outcomesSubmodule } from './outcomes';

export const studyOverviewModule: ModuleConfig = {
  id: 'study_overview',
  name: 'Study Overview',
  description: 'Define the core aspects of the study',
  submodules: {
    objective: {
      id: 'objective',
      title: 'Study Objective',
      required: true,
      dependencies: [],
      sentence: objectiveSubmodule
    },
    overview: {
    id: 'overview',
    title: "Study Overview",
    required: true,
    dependencies: ['objective'],
    sentence: overviewSubmodule
    },
    outcomes: {
      id: 'outcomes',
      title: 'Study Outcomes',
      required: true,
      dependencies: ['objective'],
      sentence: outcomesSubmodule
    }
  },
  submoduleOrder: ['objective', 'overview', 'outcomes']
}; 