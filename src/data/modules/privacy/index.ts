import { ModuleConfig } from '../../../types/form';
import { identifiabilitySubmodule } from './identifiability';
import { securitySubmodule } from './security';

export const privacyModule: ModuleConfig = {
  id: 'privacy',
  name: 'Privacy & Security',
  description: 'Define data privacy and security measures',
  submodules: {
    identifiability: {
      id: 'identifiability',
      title: 'Data Identifiability',
      required: true,
      dependencies: [],
      sentence: identifiabilitySubmodule
    },
    security: {
      id: 'security',
      title: 'Security & Storage',
      required: true,
      dependencies: ['identifiability'],
      sentence: securitySubmodule
    }
  },
  submoduleOrder: ['identifiability', 'security']
}; 