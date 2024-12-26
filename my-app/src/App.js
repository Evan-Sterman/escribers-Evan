import React, { useState, useRef, useEffect } from 'react';
import DocumentEditor from './DocumentEditor'; // Importing the DocumentEditor component
import './App.css'; // Importing CSS for styling

/**
 * App Component
 * This is the main application component that renders the DocumentEditor component.
 * It manages the state and passes props to control the behavior of the editor.
 */
const App = () => {
    // State for document content, initially null
    const [documentContent] = useState(null); 
    
    // State to control the read-only mode of the editor, set to true initially
    const [isReadOnly] = useState(true);

    // Reference to access methods and properties of the DocumentEditor component
    const documentEditorRef = useRef(null);

    /**
     * Effect Hook
     * This hook is triggered whenever `documentContent` changes.
     * It opens the document in the editor if `documentContent` and the editor reference are available.
     */
    useEffect(() => {
        if (documentEditorRef.current && documentContent) {
            // Opens the document content in the editor by parsing it to a string
            documentEditorRef.current.documentEditor.open(JSON.stringify(documentContent));
        }
    }, [documentContent]); // Dependency array ensures the effect runs only when `documentContent` changes

    return (
        <div className="container-grid"> {/* Main container for the app layout */}
            <main>
                {/* Render the DocumentEditor component */}
                <DocumentEditor
                    documentContent={documentContent} // Pass the document content as a prop
                    isReadOnly={isReadOnly} // Pass the read-only state as a prop
                    ref={documentEditorRef} // Attach the ref to access editor's methods and properties
                />
            </main>
        </div>
    );
};

export default App; // Exporting the App component as the default export


