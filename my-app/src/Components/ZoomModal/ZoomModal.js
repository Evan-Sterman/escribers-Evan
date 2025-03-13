import React from 'react';
import { Modal } from 'antd';

const ZoomModal = ({ visible, onCancel, zoomImage }) => (
  <Modal
    open={visible}
    onCancel={onCancel}
    footer={null}
    width={1000}
  >
    {zoomImage && (
      <img src={zoomImage} alt="Zoom Preview" style={{ width: '100%', height: 'auto' }} />
    )}
  </Modal>
);

export default ZoomModal;