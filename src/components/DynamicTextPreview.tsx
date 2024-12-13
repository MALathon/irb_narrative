import React from 'react';
import { Box, Typography, Menu, MenuItem, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button, Paper } from '@mui/material';
import { NarrativeSection, Field } from '../types/narrative';
import { Edit as EditIcon } from '@mui/icons-material';
import { NarrativePreviewModal } from './NarrativePreviewModal';

interface DynamicTextPreviewProps {
  section: NarrativeSection;
  values: { [key: string]: any };
  onUpdate: (fieldId: string, value: any) => void;
  isDocumentPreview?: boolean;
}

export const DynamicTextPreview: React.FC<DynamicTextPreviewProps> = ({
  section,
  values,
  onUpdate,
  isDocumentPreview = false,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedField, setSelectedField] = React.useState<Field | null>(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [otherValue, setOtherValue] = React.useState('');
  const [isModulePreviewOpen, setIsModulePreviewOpen] = React.useState(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>, field: Field) => {
    if (!isDocumentPreview) {
      setSelectedField(field);
      const currentValue = values[field.id];
      setOtherValue(currentValue?.toString() || '');
      
      if (field.type === 'select' || field.type === 'multiSelect') {
        setAnchorEl(event.currentTarget);
      } else {
        setOpenDialog(true);
      }
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedField(null);
    setOpenDialog(false);
  };

  const handleOptionSelect = (value: any) => {
    if (selectedField) {
      if (value === 'other') {
        setOpenDialog(true);
      } else {
        onUpdate(selectedField.id, value);
      }
      setAnchorEl(null);
    }
  };

  const handleOtherSubmit = () => {
    if (selectedField) {
      onUpdate(selectedField.id, otherValue);
      setOtherValue('');
      setOpenDialog(false);
    }
  };

  const renderValue = (field: Field, value: any) => {
    const displayValue = (() => {
      if (field.type === 'select' || field.type === 'radio') {
        const option = field.options?.find(opt => opt.value === value);
        return option?.label || value;
      }

      if (field.type === 'multiSelect') {
        const selectedOptions = field.options?.filter(opt => 
          Array.isArray(value) && value.includes(opt.value)
        );
        return selectedOptions?.map(opt => opt.label).join(', ') || value;
      }

      return value;
    })();

    if (isDocumentPreview) {
      return <span>{displayValue}</span>;
    }

    return (
      <Box
        component="span"
        onClick={(e) => handleClick(e, field)}
        sx={{
          cursor: 'pointer',
          display: 'inline',
          borderBottom: '2px dashed',
          borderColor: 'primary.main',
          color: 'text.primary',
          position: 'relative',
          paddingRight: '4px',
          paddingBottom: '1px',
          marginX: '2px',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(33, 150, 243, 0.08)',
            borderColor: 'primary.dark',
          },
          '& .edit-icon': {
            opacity: 0,
            transition: 'opacity 0.2s ease',
            marginLeft: '4px',
            fontSize: '12px',
            verticalAlign: 'super',
            color: 'primary.main'
          },
          '&:hover .edit-icon': {
            opacity: 1
          }
        }}
      >
        {displayValue}
        <EditIcon className="edit-icon" />
      </Box>
    );
  };

  const renderPlaceholder = (field: Field) => {
    const placeholderText = field.placeholder || field.label;
    
    if (isDocumentPreview) {
      return <span className="placeholder">[{placeholderText}]</span>;
    }

    return (
      <Box
        component="span"
        onClick={(e) => handleClick(e, field)}
        sx={{
          cursor: 'pointer',
          display: 'inline',
          color: 'text.secondary',
          borderBottom: '2px dashed',
          borderColor: 'action.disabled',
          paddingBottom: '1px',
          marginX: '2px',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
            borderColor: 'primary.light',
            color: 'primary.main'
          }
        }}
      >
        {placeholderText}
      </Box>
    );
  };

  const renderTemplate = (template: string) => {
    const cleanTemplate = template
      .replace(/;position:absolute.*?}}/g, '')
      .replace(/;.*?}}/g, '')
      .replace(/;[^}]*$/, '')
      .replace(/\s+/g, ' ');

    const parts = cleanTemplate.split(/(\{[^}]+\})/g);
    
    return parts.map((part, index) => {
      const match = part.match(/^\{([^}]+)\}$/);
      if (match) {
        const fieldId = match[1].split(',')[0].trim();
        const field = section.fields.find(f => f.id === fieldId);
        if (!field) return null;

        const value = values[fieldId];
        if (!value) {
          return (
            <Box component="span" key={index} sx={{ display: 'inline', verticalAlign: 'middle' }}>
              {renderPlaceholder(field)}
            </Box>
          );
        }

        return (
          <Box 
            component="span" 
            key={index}
            sx={{ 
              display: 'inline',
              verticalAlign: 'middle'
            }}
          >
            {renderValue(field, value)}
          </Box>
        );
      }
      return <span key={index}>{part}</span>;
    }).filter(Boolean);
  };

  return (
    <Box sx={{ mb: 4, position: 'relative' }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          borderLeft: '4px solid',
          borderLeftColor: 'primary.main',
          position: 'relative',
          '& .MuiTypography-root': {
            lineHeight: 2,
            letterSpacing: '0.01em'
          }
        }}
      >
        <Typography variant="body1">
          {renderTemplate(section.template)}
        </Typography>
      </Paper>

      {selectedField && (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          {selectedField.options?.map((option) => (
            <MenuItem 
              key={option.value} 
              onClick={() => handleOptionSelect(option.value)}
              sx={{
                minWidth: 300,
                py: 1.5,
                px: 2,
                whiteSpace: 'normal',
                '& .MuiBox-root': {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5,
                },
                '& .label': {
                  fontWeight: 500,
                },
                '& .description': {
                  fontSize: '0.75rem',
                  color: 'text.secondary',
                  lineHeight: 1.4,
                },
                '&:hover': {
                  backgroundColor: 'action.hover',
                }
              }}
            >
              <Box>
                <span className="label">{option.label}</span>
                {option.description && (
                  <span className="description">{option.description}</span>
                )}
              </Box>
            </MenuItem>
          ))}
          {selectedField.allowOther && (
            <MenuItem onClick={() => handleOptionSelect('other')}>
              Other...
            </MenuItem>
          )}
        </Menu>
      )}

      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedField?.label}
          {selectedField?.helpText && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {selectedField.helpText}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          {selectedField?.type === 'textArea' ? (
            <TextField
              autoFocus
              margin="dense"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={otherValue}
              onChange={(e) => setOtherValue(e.target.value)}
              placeholder={selectedField.placeholder}
              helperText={selectedField.description}
            />
          ) : selectedField?.type === 'number' ? (
            <TextField
              autoFocus
              margin="dense"
              fullWidth
              type="number"
              variant="outlined"
              value={otherValue}
              onChange={(e) => setOtherValue(e.target.value)}
              placeholder={selectedField.placeholder}
              helperText={selectedField.description}
              inputProps={{
                min: selectedField.validation?.find(v => v.type === 'min')?.value,
                max: selectedField.validation?.find(v => v.type === 'max')?.value,
              }}
            />
          ) : selectedField?.type === 'date' ? (
            <TextField
              autoFocus
              margin="dense"
              fullWidth
              type="date"
              variant="outlined"
              value={otherValue}
              onChange={(e) => setOtherValue(e.target.value)}
              helperText={selectedField.description}
              InputLabelProps={{
                shrink: true,
              }}
            />
          ) : (
            <TextField
              autoFocus
              margin="dense"
              fullWidth
              variant="outlined"
              value={otherValue}
              onChange={(e) => setOtherValue(e.target.value)}
              placeholder={selectedField?.placeholder}
              helperText={selectedField?.description}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button 
            onClick={handleOtherSubmit} 
            variant="contained" 
            color="primary"
            disabled={!otherValue.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      
      <NarrativePreviewModal
        isOpen={isModulePreviewOpen}
        onClose={() => setIsModulePreviewOpen(false)}
        currentModule={{
          id: section.moduleId,
          name: section.moduleName,
          sections: [section]
        }}
        values={values}
        onUpdate={onUpdate}
      />
    </Box>
  );
}; 