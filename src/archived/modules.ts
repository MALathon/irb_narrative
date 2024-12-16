import { NarrativeModule } from './narrative';
import { 
  studyOverviewModule, 
  dataAccessModule,
  studyPopulationModule,
  privacyModule,
  algorithmicFairnessModule
} from './irbNarrativeSchema';

export const modules: NarrativeModule[] = [
  studyOverviewModule,
  dataAccessModule,
  studyPopulationModule,
  privacyModule,
  algorithmicFairnessModule
];

export { 
  studyOverviewModule, 
  dataAccessModule,
  studyPopulationModule,
  privacyModule,
  algorithmicFairnessModule
}; 