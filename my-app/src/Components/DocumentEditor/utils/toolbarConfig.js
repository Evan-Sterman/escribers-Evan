// src/Components/DocumentEditor/utils/toolbarConfig.js
import { selectFile, readFileAsText, openDocument, saveDocument, saveAsDocument } from './utils';

export const getToolbarItems = (ref, setIsModalVisible, uploadDocument) => {
  return [
    'New',
    {
      prefixIcon: 'e-icons e-folder-open',
      tooltipText: 'Open',
      text: 'Open',
      id: 'openFile',
      align: 'Left',
      click: async () => {
        try {
          const file = await selectFile();
          const fileContent = await readFileAsText(file);
          openDocument(ref, fileContent);
        } catch (error) {
          console.error('Failed to open file:', error);
          alert('Failed to open file. Please try again.');
        }
      },
    },
    'Undo', 'Redo', 'Image', 'Table', 'Hyperlink', 'Bookmark',
    'TableOfContents', 'Header', 'Footer', 'PageSetup', 'PageNumber', 'Break',
    'Find', 'LocalClipboard', 'RestrictEditing', 'FormFields',
    {
      prefixIcon: 'e-icons e-save',
      tooltipText: 'Save',
      text: 'Save',
      id: 'save',
      align: 'Left',
      click: () => saveDocument(ref, 'Document'),
    },
    {
      prefixIcon: 'e-icons e-save',
      tooltipText: 'Save As',
      text: 'Save As',
      id: 'saveAs',
      align: 'Left',
      click: () => {
        console.log('Save As clicked, calling saveAsDocument with ref:', ref);
        saveAsDocument(ref);
      },
    },
    {
      prefixIcon: 'e-icons e-upload-1',
      tooltipText: 'Upload',
      text: 'Upload',
      id: 'uploadS3',
      align: 'Left',
      click: () => uploadDocument(ref),
    },
    {
      prefixIcon: 'e-icons e-folder-open',
      tooltipText: 'Previous Versions',
      text: 'Previous Versions',
      id: 'viewVersions',
      align: 'Left',
      click: () => setIsModalVisible(true),
    },
  ];
};