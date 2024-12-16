import { ModuleConfig } from '../../types/form';
import { studyOverviewModule } from './study-overview';
import { studyPopulationModule } from './study-population';
import { dataAccessModule } from './data-access';
import { privacyModule } from './privacy';
import { algorithmicFairnessModule } from './algorithmic-fairness';

export interface ModuleRegistry {
  [key: string]: ModuleConfig;
}

// Registry of all available modules
export const moduleRegistry: ModuleRegistry = {
  study_overview: studyOverviewModule,
  study_population: studyPopulationModule,
  data_access: dataAccessModule,
  privacy: privacyModule,
  algorithmic_fairness: algorithmicFairnessModule
};

// Define module flow and order
export const moduleOrder = [
  'study_overview',
  'study_population',
  'data_access',
  'privacy',
  'algorithmic_fairness'
];

// Define module metadata
export const moduleFlow = moduleOrder.map(id => {
  const module = moduleRegistry[id];
  return {
    id,
    title: module.name,
    required: true,
    dependencies: getDependencies(id)
  };
});

// Helper function to get dependencies for each module
function getDependencies(moduleId: string): string[] {
  switch (moduleId) {
    case 'study_overview':
      return [];
    case 'study_population':
      return ['study_overview'];
    case 'data_access':
      return ['study_overview', 'study_population'];
    case 'privacy':
      return ['data_access'];
    case 'algorithmic_fairness':
      return ['study_overview', 'study_population', 'data_access'];
    default:
      return [];
  }
} 