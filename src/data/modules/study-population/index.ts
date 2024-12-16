import { ModuleConfig } from '../../../types/form';
import { populationTypeSubmodule } from './population-type';
import { criteriaSubmodule } from './criteria';
import { sampleSizeSubmodule } from './sample-size';

// Define submodule flow and their sentence structures
export const submodules = {
  population_type: {
    id: 'population_type',
    title: 'Population Type',
    required: true,
    dependencies: [],
    sentence: populationTypeSubmodule
  },
  criteria: {
    id: 'criteria',
    title: 'Inclusion/Exclusion Criteria',
    required: true,
    dependencies: ['population_type'],
    sentence: criteriaSubmodule
  },
  sample_size: {
    id: 'sample_size',
    title: 'Sample Size',
    required: true,
    dependencies: ['criteria'],
    sentence: sampleSizeSubmodule
  }
};

// Define the order of submodules
export const submoduleOrder = ['population_type', 'criteria', 'sample_size'];

export const studyPopulationModule: ModuleConfig = {
  id: 'study_population',
  name: 'Study Population & Scope',
  submodules,
  submoduleOrder
}; 