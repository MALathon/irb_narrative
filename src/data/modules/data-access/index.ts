import { ModuleConfig } from '../../../types/form';
import { dataSourcesSubmodule } from './data-sources';
import { dataTimelineSubmodule } from './data-timeline';

export const dataAccessModule: ModuleConfig = {
  id: 'data_access',
  name: 'Data Access',
  description: 'Define how study data will be accessed and managed',
  submodules: {
    sources: {
      id: 'sources',
      title: 'Data Sources',
      required: true,
      dependencies: [],
      sentence: dataSourcesSubmodule
    },
    timeline: {
      id: 'timeline',
      title: 'Data Timeline',
      required: true,
      dependencies: ['sources'],
      sentence: dataTimelineSubmodule
    }
  },
  submoduleOrder: ['sources', 'timeline']
}; 