import React, { useState } from 'react';
import { Container, Grid, Box, Tabs, Tab } from '@mui/material';
import { ModuleConfig } from '../types/form';
import { ModuleView } from '../components/form/ModuleView';
import { FormNavigator } from '../components/form/Navigator';
import { FormPreview } from '../components/form/Preview';
import { moduleRegistry, moduleFlow } from '../data/modules';

const DRAWER_WIDTH = 400;

export const FormPage: React.FC = () => {
  const [values, setValues] = useState<Record<string, any>>({});
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);

  const currentModule: ModuleConfig = moduleRegistry[moduleFlow[currentModuleIndex].id];

  const handleModuleChange = (_: React.SyntheticEvent, newIndex: number) => {
    setCurrentModuleIndex(newIndex);
  };

  const handleValuesChange = (newValues: Record<string, any>) => {
    setValues(prev => ({
      ...prev,
      ...newValues
    }));
  };

  return (
    <Container maxWidth={false} disableGutters>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={currentModuleIndex} 
          onChange={handleModuleChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {moduleFlow.map((module) => (
            <Tab 
              key={module.id} 
              label={module.title}
              disabled={module.dependencies.some(dep => !values[dep])}
            />
          ))}
        </Tabs>
      </Box>

      <Grid container spacing={3} sx={{ p: 3 }}>
        <Grid item sx={{ width: DRAWER_WIDTH }}>
          <FormNavigator
            module={currentModule}
            values={values}
            onPreviewClick={() => setIsPreviewOpen(true)}
            DRAWER_WIDTH={DRAWER_WIDTH}
          />
        </Grid>

        <Grid item xs>
          <ModuleView
            module={currentModule}
            initialValues={values}
            onValuesChange={handleValuesChange}
          />
        </Grid>
      </Grid>

      <FormPreview
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        module={currentModule}
        values={values}
      />
    </Container>
  );
}; 