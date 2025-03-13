import React from 'react';
import { Modal, Button } from 'antd';
import FileVersionViewer from '../FileVersionViewer/FileVersionViewer';
import { DocumentEditorContainerComponent } from '@syncfusion/ej2-react-documenteditor';

const VersionModal = ({
  visible,
  onCancel,
  onConfirm,
  previewContent,
  setPreviewContent,
  previewRef,
  handleZoomClick,
}) => (
  <Modal
    title="View Versions"
    open={visible}
    onCancel={onCancel}
    footer={[
      <Button key="cancel" onClick={onCancel}>Cancel</Button>,
      <Button key="confirm" type="primary" onClick={onConfirm} disabled={!previewContent}>
        Confirm
      </Button>,
    ]}
    width={1000}
  >
    <div style={{ display: 'flex', flexDirection: 'row', height: '500px', gap: '20px' }}>
      <div style={{ flex: 1, overflowY: 'auto', borderRight: '1px solid #ccc', padding: '10px' }}>
        <h3>Versions List</h3>
        <FileVersionViewer
          onSelectVersion={setPreviewContent}
          setError={(error) => console.error("Error in FileVersionViewer:", error)}
        />
      </div>
      {previewContent && (
        <div style={{ flex: 2, padding: '10px', overflowY: 'hidden' }}>
          <h3>Document Preview</h3>
          <DocumentEditorContainerComponent
            id="documentPreview"
            enableToolbar={false}
            showPropertiesPane={false}
            serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/documenteditor/"
            style={{ flex: 1, height: '100%', width: '100%' }}
            onClick={handleZoomClick}
            ref={previewRef}
          />
        </div>
      )}
    </div>
  </Modal>
);

export default VersionModal;