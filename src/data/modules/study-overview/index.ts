import { ModuleConfig } from '../../../types/form';
import { objectiveSubmodule } from './objective';
import { outcomesSubmodule } from './outcomes';
import { studyOverviewPage } from './study_overview';

// Define submodule flow and their sentence structures
export const submodules = {
  overview: {
    id: 'overview',
    title: 'Overview & Type',
    required: true,
    dependencies: [],
    sentence: studyOverviewPage
  },
  objective: {
    id: 'objective',
    title: 'Study Objective',
    required: true,
    dependencies: ['overview'],
    sentence: objectiveSubmodule
  },
  outcomes: {
    id: 'outcomes',
    title: 'Expected Outcomes',
    required: true,
    dependencies: ['objective'],
    sentence: outcomesSubmodule
  }
};

// Define the order of submodules
export const submoduleOrder = ['overview', 'objective', 'outcomes'];

export const studyOverviewModule: ModuleConfig = {
  id: 'study_overview',
  name: 'Study Overview',
  submodules,
  submoduleOrder
}; 