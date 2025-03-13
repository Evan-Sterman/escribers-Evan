// src/Components/DocumentEditor/DocumentEditor.js
import React, { useEffect, forwardRef, useState, useRef } from 'react';
import { DocumentEditorContainerComponent, Toolbar } from '@syncfusion/ej2-react-documenteditor';
import { registerLicense } from '@syncfusion/ej2-base';
import { getToolbarItems } from './utils/toolbarConfig';
import { handleZoomClick } from './utils/zoomUtils';
import VersionModal from '../VersionModal/VersionModal';
import ZoomModal from '../ZoomModal/ZoomModal';
import './DocumentEditor.css';
import { openDocument, saveDocument, saveAsDocument } from './utils/utils'; // Import all needed utils
import { uploadDocument, uploadToS3 } from './utils/s3Utils';

registerLicense('Ngo9BigBOggjHTQxAR8/V1NMaF1cXGJCekx3RHxbf1x1ZFRGal5XTndcUj0eQnxTdEBjWn5dcHRVRmVdWU1wXQ==');
DocumentEditorContainerComponent.Inject(Toolbar);

const DocumentEditor = forwardRef(({ documentContent }, ref) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isZoomModalVisible, setIsZoomModalVisible] = useState(false);
  const [previewContent, setPreviewContent] = useState(null);
  const [zoomImage, setZoomImage] = useState(null);
  const previewRef = useRef(null);

  useEffect(() => {
    if (ref?.current && documentContent) {
      openDocument(ref, documentContent);
    }
  }, [documentContent, ref]);

  return (
    <div className="container-grid" style={{ height: '100vh' }}>
      <DocumentEditorContainerComponent
        id="documentEditor"
        enableToolbar={true}
        toolbarItems={getToolbarItems(ref, setIsModalVisible, uploadDocument)}
        serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/documenteditor/"
        ref={ref}
        style={{ height: '100%', width: '100%' }}
      />
      <VersionModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        previewContent={previewContent}
        setPreviewContent={setPreviewContent}
        previewRef={previewRef}
        handleZoomClick={() => handleZoomClick(previewRef, setZoomImage, setIsZoomModalVisible)}
      />
      <ZoomModal
        visible={isZoomModalVisible}
        onCancel={() => setIsZoomModalVisible(false)}
        zoomImage={zoomImage}
      />
    </div>
  );
});

export default DocumentEditor;