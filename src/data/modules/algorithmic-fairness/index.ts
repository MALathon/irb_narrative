import { ModuleConfig } from '../../../types/form';
import { algorithmTypeSubmodule } from './algorithm-type';
import { fairnessMetricsSubmodule } from './fairness-metrics';

// Define submodule flow and their sentence structures
export const submodules = {
  algorithm_type: {
    id: 'algorithm_type',
    title: 'Algorithm Type',
    required: true,
    dependencies: [],
    sentence: algorithmTypeSubmodule
  },
  fairness_metrics: {
    id: 'fairness_metrics',
    title: 'Fairness Metrics',
    required: true,
    dependencies: ['algorithm_type'],
    sentence: fairnessMetricsSubmodule
  }
};

// Define the order of submodules
export const submoduleOrder = ['algorithm_type', 'fairness_metrics'];

export const algorithmicFairnessModule: ModuleConfig = {
  id: 'algorithmic_fairness',
  name: 'Algorithmic Fairness',
  submodules,
  submoduleOrder
}; 