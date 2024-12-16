import { ModuleConfig } from '../../../types/form';
import { identifiabilitySubmodule } from './identifiability';
import { securitySubmodule } from './security';

// Define submodule flow and their sentence structures
export const submodules = {
  identifiability: {
    id: 'identifiability',
    title: 'Data Identifiability',
    required: true,
    dependencies: [],
    sentence: identifiabilitySubmodule
  },
  security: {
    id: 'security',
    title: 'Security Measures',
    required: true,
    dependencies: ['identifiability'],
    sentence: securitySubmodule
  }
};

// Define the order of submodules
export const submoduleOrder = ['identifiability', 'security'];

export const privacyModule: ModuleConfig = {
  id: 'privacy',
  name: 'Privacy & Security',
  submodules,
  submoduleOrder
}; 