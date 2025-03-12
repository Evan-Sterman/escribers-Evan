// Import necessary modules and components
import React, { useEffect, forwardRef, useState, useMemo, useRef } from 'react';
import { DocumentEditorContainerComponent, Toolbar } from '@syncfusion/ej2-react-documenteditor';
import { registerLicense } from '@syncfusion/ej2-base';
import axios from 'axios';
import '@syncfusion/ej2-react-documenteditor/styles/material.css';
import { Modal } from 'antd';
import FileVersionViewer from '../FileVersionViewer/FileVersionViewer';
import './App.css';

// Register Syncfusion license (required for use of their components)
registerLicense('Ngo9BigBOggjHTQxAR8/V1NMaF5cXmBCf0x3RHxbf1x1ZFZMYVxbQHNPIiBoS35RckRhWHdfdnBVRWNcVkF/');

// Inject the Toolbar module into DocumentEditorContainerComponent
DocumentEditorContainerComponent.Inject(Toolbar);

const DocumentEditor = forwardRef(({ documentContent }, ref) => {
    // State variables
    const [isModalVisible, setIsModalVisible] = useState(false); // Controls modal visibility
    const [error, setError] = useState(null); // Error state for error handling
    const [previewContent, setPreviewContent] = useState(null); // Holds content for document preview
    const [zoomImage, setZoomImage] = useState(null); // For storing the generated image
    const [isZoomModalVisible, setIsZoomModalVisible] = useState(false); // State for zoom modal
    const [isEditorInitialized, setIsEditorInitialized] = useState(false); // Editor initialization status
    const previewRef = useRef(null); // Ref for the preview DocumentEditor

    // Utility Functions
    // Reads the content of a file as text
    const readFileAsText = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result); // Resolve with file content
            reader.onerror = () => reject(reader.error); // Reject on error
            reader.readAsText(file); // Read file as text
        });
    };

    // Save the current document to the client in .sfdt format
    const saveDocument = (fileName = 'Document') => {
        if (ref?.current) {
            const sfdtContent = ref.current.documentEditor.serialize(); // Serialize document content to SFDT format
            const blob = new Blob([sfdtContent], { type: 'application/vnd.syncfusion.sfdt' });
            saveDocumentToClient(fileName, blob, 'sfdt'); // Save the serialized content as a file
        }
    };

    // Save the current document with the ability to choose name and format
    const saveAsDocument = async () => {
        if (ref?.current) {
            const fileName = prompt('Enter file name (without extension)', 'Document');
            if (fileName) {
                const format = prompt('Enter file format (sfdt/json)', 'sfdt');
                const sfdtContent = ref.current.documentEditor.serialize();

                if (format === 'json') {
                    const jsonBlob = new Blob([sfdtContent], { type: 'application/json' });
                    saveDocumentToClient(fileName, jsonBlob, 'json');
                } else {
                    const sfdtBlob = new Blob([sfdtContent], { type: 'application/vnd.syncfusion.sfdt' });
                    saveDocumentToClient(fileName, sfdtBlob, 'sfdt');
                }
            }
        }
    };

    // Helper function to save a file to the client
    const saveDocumentToClient = (fileName, blob, extension) => {
        const url = window.URL.createObjectURL(blob); // Create a downloadable URL for the file
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${fileName}.${extension}`; // Set the file name and extension
        document.body.appendChild(a);
        a.click(); // Trigger download
        window.URL.revokeObjectURL(url); // Revoke the URL after download
        document.body.removeChild(a);
    };

    // Upload the current document to an S3 bucket using a presigned URL
    const uploadToS3 = async (fileName, fileContent, fileType) => {
        try {
            const contentType = fileType === 'sfdt' ? 'application/vnd.syncfusion.sfdt' : 'application/json';

            // Get a presigned URL for uploading the file
            const response = await axios.get('http://localhost:3002/generate-presigned-url', {
                params: { fileName, fileType }
            });

            const url = response.data.url; // Extract the presigned URL

            // Upload the file to the S3 bucket
            await axios.put(url, fileContent, {
                headers: { 'Content-Type': contentType }
            });

            alert(`File uploaded successfully as ${fileName}.${fileType}!`);
        } catch (error) {
            console.error('Error uploading file:', error);
            setError('File upload failed.');
        }
    };

    // Upload document content to S3 after user input
    const uploadDocument = async () => {
        if (ref?.current) {
            const fileName = prompt('Enter file name (without extension)', 'Document');
            if (fileName) {
                const format = prompt('Enter file format (sfdt/json)', 'sfdt');
                const sfdtContent = ref.current.documentEditor.serialize();
                const sfdtBlob = new Blob([sfdtContent], {
                    type: format === 'sfdt' ? 'application/vnd.syncfusion.sfdt' : 'application/json'
                });

                uploadToS3(fileName, sfdtBlob, format); // Upload the document content to S3
            }
        }
    };

    // Opens a file selector dialog to let the user choose a file
    const selectFile = () => {
        return new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.sfdt,.json'; // Allow only SFDT and JSON files
            input.onchange = (event) => {
                const file = event.target.files[0];
                if (file) {
                    resolve(file);
                } else {
                    reject(new Error('No file selected'));
                }
            };
            input.click();
        });
    };

    // Handles opening a file in the Document Editor
    const handleOpenFile = (fileContent) => {
        try {
            const parsedContent = typeof fileContent === 'string' ? JSON.parse(fileContent) : fileContent;
            ref.current.documentEditor.open(parsedContent); // Open the document in the editor
            alert('File opened successfully!');
        } catch (error) {
            setError('Invalid file format. Ensure the file contains valid SFDT content.');
            console.error(error);
        }
    };

    // Modal-related Functions
    // Confirms the selected version in the modal and loads it into the main editor
    const confirmVersion = () => {
        if (previewContent && ref?.current) {
            try {
                const container = ref.current;
                container.documentEditor.open(previewContent); // Open the confirmed version
                container.restrictEditing = true; // Set the editor to read-only
                setIsModalVisible(false); // Close the modal
                console.log("Version confirmed and loaded into the editor.");
            } catch (error) {
                console.error("Failed to confirm and load version:", error);
            }
        }
    };

    // Sets the preview Document Editor to read-only mode
    const setPreviewReadOnly = (content) => {
        if (previewRef.current?.documentEditor) {
            const previewEditor = previewRef.current.documentEditor;
            previewEditor.open(content); // Open the content in the preview editor
            previewEditor.isReadOnly = true; // Set the editor to read-only
        } else {
            console.warn("DocumentEditor not initialized yet. Delaying content load.");
        }
    };

    // Update the preview content when it changes
    useEffect(() => {
        if (previewContent && previewRef.current?.documentEditor) {
            setPreviewReadOnly(previewContent);
        }
    }, [previewContent]);

    // Zoom-related Functions
    const handleZoomClick = async () => {
        if (!isEditorInitialized) {
            console.warn("DocumentEditor is not initialized.");
            return;
        }

        if (previewRef.current?.documentEditor) {
            let canvas = document.createElement('canvas');
            let context = canvas.getContext('2d');
            let totalHeight = 0;

            const pageCount = previewRef.current.documentEditor.pageCount;
            previewRef.current.documentEditor.documentEditorSettings.printDevicePixelRatio = 2;

            for (let i = 1; i <= pageCount; i++) {
                try {
                    const dataUrl = await exportPageAsImage(previewRef.current, i);
                    const image = await loadImage(dataUrl);

                    const imageHeight = image.height;

                    if (i === 1) {
                        canvas.width = image.width;
                    }

                    canvas.height += imageHeight;
                    totalHeight += imageHeight;

                    context.drawImage(image, 0, totalHeight - imageHeight);
                } catch (error) {
                    console.error(`Failed to export or load image for page ${i}:`, error);
                }
            }

            const finalDataUrl = canvas.toDataURL('image/png');
            setZoomImage(finalDataUrl);
            setIsZoomModalVisible(true);
        } else {
            console.warn("DocumentEditor is not initialized.");
        }
    };

    const exportPageAsImage = (previewContainer, pageIndex) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const image = previewContainer.documentEditor.exportAsImage(pageIndex, 'image/png');
                    resolve(image.src);
                } catch (error) {
                    reject(error);
                }
            }, 500 * pageIndex);
        });
    };

    const loadImage = (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    };

    // Ensure editor is initialized
    const onEditorInitialized = () => {
        setIsEditorInitialized(true);
        console.log("DocumentEditor is initialized.");
    };

    // Define toolbar items with custom actions
    const toolbarItems = useMemo(() => [
        'New',
        {
            prefixIcon: 'e-icons e-folder-open', // Updated icon for open
            tooltipText: 'Open',
            text: 'Open',
            id: 'openFile',
            align: 'Left',
            click: async () => {
                try {
                    const file = await selectFile(); // File selection
                    const fileContent = await readFileAsText(file); // File reading
                    handleOpenFile(fileContent); // Open the file in the editor
                } catch (error) {
                    setError('Failed to open file. Please try again.');
                    console.error(error);
                }
            }
        },
        'Undo', 'Redo', 'Image', 'Table', 'Hyperlink', 'Bookmark',
        'TableOfContents', 'Header', 'Footer', 'PageSetup', 'PageNumber', 'Break',
        'Find', 'LocalClipboard', 'RestrictEditing', 'FormFields',
        {
            prefixIcon: 'e-icons e-save', // Icon for save
            tooltipText: 'Save',
            text: 'Save',
            id: 'save',
            align: 'Left',
            click: () => saveDocument('Document') // Default save functionality
        },
        {
            prefixIcon: 'e-icons e-save', // Icon for save as
            tooltipText: 'Save As',
            text: 'Save As',
            id: 'saveAs',
            align: 'Left',
            click: saveAsDocument // Save As functionality
        },
        {
            prefixIcon: 'e-icons e-upload-1', // Updated icon for upload
            tooltipText: 'Upload',
            text: 'Upload',
            id: 'uploadS3',
            align: 'Left',
            click: uploadDocument // Upload to S3 functionality
        },
        {
            prefixIcon: 'e-icons e-folder-open', // Updated icon for previous versions
            tooltipText: 'Previous Versions',
            text: 'Previous Versions',
            id: 'viewVersions',
            align: 'Left',
            click: () => {
                setIsModalVisible(true); // Open the versions modal
            }
        }
    ], []);

    // Load the initial document content into the editor
    useEffect(() => {
        if (ref?.current && documentContent) {
            ref.current.documentEditor.open(typeof documentContent === 'string' ? JSON.parse(documentContent) : documentContent);
        }
    }, [documentContent, ref]);

    return (
        <div className="container-grid" style={{ height: '100vh' }}>
            <main style={{ height: '100%' }}>
                {/* Main Document Editor */}
                <DocumentEditorContainerComponent
                    id="documentEditor"
                    enableToolbar={true}
                    toolbarItems={toolbarItems}
                    serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/documenteditor/"
                    style={{ height: '100%', width: '100%' }}
                    ref={ref}
                    created={onEditorInitialized} // Set editor initialization status
                />
            </main>

            {/* Modal for View Versions */}
            <Modal
                title="View Versions"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={1000}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        height: '500px',
                        gap: '20px',
                    }}
                >
                    {/* Left Panel: File Version Viewer */}
                    <div style={{ flex: 1, overflowY: 'auto', borderRight: '1px solid #ccc', padding: '10px' }}>
                        <h3>Versions List</h3>
                        <FileVersionViewer
                            onSelectVersion={(content) => {
                                setPreviewContent(content);
                                setPreviewReadOnly(content);
                            }}
                            setError={(error) => console.error("Error in FileVersionViewer:", error)}
                        />
                    </div>

                    {/* Right Panel: Document Preview */}
                    {previewContent && (
                        <div style={{ flex: 2, flexDirection: 'column', padding: '10px', overflowY: 'hidden' }}>
                            <h3>Document Preview</h3>
                            <DocumentEditorContainerComponent
                                id="documentPreview"
                                enableToolbar={false}
                                showPropertiesPane={false}
                                serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/documenteditor/"
                                style={{ flex: 1, height: '100%', width: '100%' }}
                                onClick={handleZoomClick} // Trigger zoom on click
                                created={onEditorInitialized} // Set editor initialization status
                                ref={previewRef}
                            />
                            {/* Confirm Button */}
                            <button
                                style={{
                                    marginTop: '10px',
                                    padding: '10px 20px',
                                    backgroundColor: '#007bff',
                                    color: '#fff',
                                    border: 'none',
                                    cursor: 'pointer',
                                }}
                                onClick={confirmVersion}
                                disabled={!previewContent}
                            >
                                Confirm Selection
                            </button>
                        </div>
                    )}
                </div>
            </Modal>

            {/* Zoom Modal */}
            <Modal
                open={isZoomModalVisible}
                onCancel={() => setIsZoomModalVisible(false)} // Close the modal
                footer={null} // No footer for simplicity
                width={1000}
            >
                {zoomImage && (
                    <img
                        src={zoomImage} // Use the generated image data URL
                        alt="Zoom Preview"
                        style={{ width: '100%', height: 'auto' }} // Scale image to fit modal width
                    />
                )}
            </Modal>
        </div>
    );
});

export default DocumentEditor;

