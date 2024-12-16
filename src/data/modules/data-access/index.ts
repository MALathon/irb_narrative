import { ModuleConfig } from '../../../types/form';
import { dataSourcesSubmodule } from './data-sources';
import { timelineSubmodule } from './data-timeline';

// Define submodule flow and their sentence structures
export const submodules = {
  sources: {
    id: 'data_sources',
    title: 'Data Sources',
    required: true,
    dependencies: [],
    sentence: dataSourcesSubmodule
  },
  timeline: {
    id: 'timeline',
    title: 'Timeline & Access',
    required: true,
    dependencies: ['data_sources'],
    sentence: timelineSubmodule
  }
};

// Define the order of submodules
export const submoduleOrder = ['sources', 'timeline'];

export const dataAccessModule: ModuleConfig = {
  id: 'data_access',
  name: 'Data Access & Timeline',
  submodules,
  submoduleOrder
}; 