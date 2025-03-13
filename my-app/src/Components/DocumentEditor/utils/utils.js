// src/Components/DocumentEditor/utils/utils.js
// Reads the content of a file as text
export const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
    });
};

// Saves the document to the client's machine
export const saveDocumentToClient = (fileName, blob, extension) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `${fileName}.${extension}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
};

// Opens a file selection dialog
export const selectFile = () => {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.sfdt,.json';
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

// Opens a document in the editor
export const openDocument = (editorRef, content) => {
    try {
        const parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
        editorRef.current.documentEditor.open(parsedContent);
        alert('File opened successfully!');
    } catch (error) {
        console.error('Invalid file format:', error);
        throw new Error('Invalid file format. Ensure the file contains valid SFDT content.');
    }
};

// Saves the document in SFDT format
export const saveDocument = (editorRef, fileName = 'Document') => {
    if (editorRef?.current) {
        const sfdtContent = editorRef.current.documentEditor.serialize();
        const blob = new Blob([sfdtContent], { type: 'application/vnd.syncfusion.sfdt' });
        saveDocumentToClient(fileName, blob, 'sfdt');
    }
};

// Saves the document with user-defined format
export const saveAsDocument = async (editorRef) => {
    if (editorRef?.current) {
        const fileName = prompt('Enter file name', 'Document');
        if (fileName) {
            const format = prompt('Enter file format (sfdt/json)', 'sfdt');
            const sfdtContent = editorRef.current.documentEditor.serialize();
            const blob = new Blob([sfdtContent], { type: format === 'json' ? 'application/json' : 'application/vnd.syncfusion.sfdt' });
            saveDocumentToClient(fileName, blob, format);
        }
    }
};