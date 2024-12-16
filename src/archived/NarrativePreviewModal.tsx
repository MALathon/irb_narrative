import React from 'react';
import {
  Modal,
  Fade,
  Box,
  Typography,
  IconButton,
  Paper,
  Button,
  Divider,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { NarrativeModule, NarrativeSection } from './narrative';
import { DynamicTextPreview } from './DynamicTextPreview';

interface NarrativePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentModule?: NarrativeModule;
  modules?: NarrativeModule[];
  values: { [key: string]: any };
  handleStepClick?: (index: number) => void;
  onUpdate: (fieldId: string, value: any) => void;
}

export const NarrativePreviewModal: React.FC<NarrativePreviewModalProps> = ({
  isOpen,
  onClose,
  currentModule,
  modules,
  values,
  handleStepClick,
  onUpdate,
}) => {
  const isFullPreview = !!modules;

  const getSectionIndex = (section: NarrativeSection): number => {
    if (!modules) return 0;
    let index = 0;
    for (const module of modules) {
      const sectionIndex = module.sections.findIndex(s => s.id === section.id);
      if (sectionIndex !== -1) {
        return index + sectionIndex;
      }
      index += module.sections.length;
    }
    return 0;
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      closeAfterTransition
      disablePortal
      keepMounted={false}
      disableEnforceFocus
      disableAutoFocus
      aria-labelledby={isFullPreview ? "document-preview-title" : "module-preview-title"}
    >
      <Fade in={isOpen}>
        <Box
          role="dialog"
          aria-modal="true"
          aria-labelledby={isFullPreview ? "document-preview-title" : "module-preview-title"}
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80vw',
            maxWidth: isFullPreview ? 1200 : 1000,
            maxHeight: '90vh',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              p: 2,
              borderBottom: 1,
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography 
              id={isFullPreview ? "document-preview-title" : "module-preview-title"} 
              variant="h6"
            >
              {isFullPreview ? "Document Preview" : currentModule?.name}
            </Typography>
            <IconButton 
              onClick={onClose}
              size="small"
              aria-label="Close preview"
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              p: 4,
              backgroundColor: '#f8f9fa',
            }}
          >
            <Paper
              sx={{
                maxWidth: isFullPreview ? 900 : 800,
                mx: 'auto',
                p: isFullPreview ? { xs: 4, md: 8 } : 6,
                minHeight: '100%',
                boxShadow: theme => theme.shadows[4],
                position: 'relative',
              }}
            >
              {isFullPreview ? (
                // Full document preview
                <Box sx={{ 
                  '& > :not(:last-child)': { 
                    mb: 8 
                  }
                }}>
                  {modules?.map((module) => (
                    <Box key={module.id}>
                      <Typography 
                        variant="h4" 
                        gutterBottom 
                        sx={{ 
                          color: 'primary.main',
                          fontWeight: 500,
                          mb: 3
                        }}
                      >
                        {module.name}
                      </Typography>
                      <Divider sx={{ mb: 4 }} />
                      {module.sections.map((section) => (
                        <Box
                          key={section.id}
                          sx={{
                            mb: 6,
                            position: 'relative',
                            '&:hover': {
                              '& .section-link': {
                                opacity: 1,
                              },
                            },
                          }}
                        >
                          {handleStepClick && (
                            <Button
                              className="section-link"
                              variant="text"
                              size="small"
                              onClick={() => {
                                handleStepClick(getSectionIndex(section));
                                onClose();
                              }}
                              sx={{
                                position: 'absolute',
                                left: -6,
                                opacity: 0,
                                transition: 'opacity 0.2s',
                                transform: 'translateX(-100%)',
                                textTransform: 'none',
                                color: 'primary.main',
                              }}
                            >
                              Edit Section
                            </Button>
                          )}
                          <Typography 
                            variant="h5" 
                            gutterBottom
                            sx={{ 
                              mb: 3,
                              fontWeight: 500 
                            }}
                          >
                            {section.title}
                          </Typography>
                          <DynamicTextPreview
                            section={section}
                            values={values}
                            onUpdate={onUpdate}
                            isDocumentPreview={isFullPreview}
                          />
                          {module.sections.indexOf(section) < module.sections.length - 1 && (
                            <Divider sx={{ my: 4 }} />
                          )}
                        </Box>
                      ))}
                    </Box>
                  ))}
                </Box>
              ) : (
                // Single module preview
                <Box sx={{ 
                  '& > :not(:last-child)': { 
                    mb: 6 
                  }
                }}>
                  <Typography 
                    variant="h4" 
                    gutterBottom 
                    sx={{ 
                      color: 'primary.main',
                      fontWeight: 500,
                      mb: 3
                    }}
                  >
                    {currentModule?.name}
                  </Typography>
                  <Divider sx={{ mb: 4 }} />
                  {currentModule?.sections.map((section, index) => (
                    <Box 
                      key={section.id} 
                      sx={{ 
                        position: 'relative',
                        '&:hover': {
                          '& .section-link': {
                            opacity: 1,
                          },
                        },
                      }}
                    >
                      <Typography 
                        variant="h5" 
                        gutterBottom
                        sx={{ 
                          mb: 3,
                          fontWeight: 500 
                        }}
                      >
                        {section.title}
                      </Typography>
                      <DynamicTextPreview
                        section={section}
                        values={values}
                        onUpdate={onUpdate}
                        isDocumentPreview={true}
                      />
                      {index < currentModule.sections.length - 1 && (
                        <Divider sx={{ my: 4 }} />
                      )}
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}; 