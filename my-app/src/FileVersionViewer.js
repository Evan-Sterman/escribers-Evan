import React, { useState, useEffect, useCallback } from 'react';
import s3 from './awsConfig'; // Import the AWS S3 configuration
import { Table, DatePicker, Space } from 'antd'; // Import UI components from Ant Design
import moment from 'moment'; // Library for date and time manipulation

const { RangePicker } = DatePicker; // Destructure RangePicker from DatePicker

/**
 * FileVersionViewer Component
 * This component fetches and displays different versions of a document stored in an S3 bucket.
 * It allows the user to filter versions by date and load a selected version.
 * 
 * Props:
 * - onSelectVersion: Callback to handle the selected version's content.
 * - setError: Callback to handle and display errors.
 */
const FileVersionViewer = ({ onSelectVersion, setError }) => {
    const [versions, setVersions] = useState([]); // State to hold all fetched versions
    const [filteredVersions, setFilteredVersions] = useState([]); // State to hold filtered versions
    const [selectedVersion, setSelectedVersion] = useState(null); // State for the currently selected version

    // Bucket name and file key to identify the document in S3
    const BUCKET_NAME = 'boris-public-bucket';
    const FILE_KEY = 'document.json';

    /**
     * Fetches the content of a selected document version from S3 and updates the editor.
     * @param {Object} version - The version object containing versionId.
     */
    const fetchDocumentContent = useCallback(
        async (version) => {
            const params = {
                Bucket: BUCKET_NAME, // S3 bucket name
                Key: FILE_KEY, // File key (document identifier)
                VersionId: version.versionId, // Specific version ID
            };

            try {
                const data = await s3.getObject(params).promise(); // Fetch the object from S3
                const documentBody = data.Body.toString('utf-8'); // Convert the response to a string
                const parsedContent = JSON.parse(documentBody); // Parse the document content to JSON
                onSelectVersion(parsedContent); // Pass the content to the parent component
            } catch (err) {
                console.error('Error fetching document content:', err);
                setError('Failed to load document content.'); // Display error if fetch fails
            }
        },
        [BUCKET_NAME, FILE_KEY, onSelectVersion, setError] // Dependencies
    );

    /**
     * Fetches all versions of the document from S3 and updates the state.
     */
    const fetchDocumentVersions = useCallback(async () => {
        const params = { Bucket: BUCKET_NAME, Prefix: FILE_KEY }; // Parameters for S3 API

        try {
            const data = await s3.listObjectVersions(params).promise(); // List all versions

            // Map and transform the version data for display
            const versionsList = data.Versions.map((version) => ({
                versionId: version.VersionId, // Unique version ID
                lastModified: new Date(version.LastModified).getTime(), // Timestamp of last modification
                readableDate: moment(version.LastModified).format('YYYY-MM-DD HH:mm:ss'), // Readable date format
                size: (version.Size / 1024).toFixed(2) + ' KB', // Size in KB
            }));

            // Sort versions by most recent
            versionsList.sort((a, b) => b.lastModified - a.lastModified);
            setVersions(versionsList); // Update the state with all versions
            setFilteredVersions(versionsList); // Set the filtered list initially to all versions
        } catch (err) {
            console.error('Error fetching document versions:', err);
            setError('Failed to load document versions.'); // Handle errors
        }
    }, [BUCKET_NAME, FILE_KEY, setError]); // Dependencies

    // Fetch document versions when the component mounts
    useEffect(() => {
        fetchDocumentVersions();
    }, [fetchDocumentVersions]);

    /**
     * Filters document versions by a date range.
     * @param {Array} range - Array containing start and end dates.
     */
    const filterVersionsByDate = (range) => {
        if (range && range.length === 2) {
            const [startDate, endDate] = range.map((date) => date.valueOf());
            const filtered = versions.filter((version) => {
                const versionDate = version.lastModified;
                return versionDate >= startDate && versionDate <= endDate;
            });
            setFilteredVersions(filtered); // Update the filtered list
        } else {
            setFilteredVersions(versions); // Reset to all versions if no range is selected
        }
    };

    /**
     * Handles the change in date range picker.
     * @param {Array} dates - Array containing start and end dates.
     */
    const handleDateRangeChange = (dates) => {
        filterVersionsByDate(dates);
    };

    /**
     * Handles the selection of a document version.
     * @param {Object} record - Selected version record.
     */
    const handleVersionChange = (record) => {
        setSelectedVersion(record); // Set the selected version
        fetchDocumentContent(record); // Fetch the content of the selected version
    };

    // Table columns configuration
    const columns = [
        {
            title: 'Last Modified',
            dataIndex: 'readableDate', // Column for readable date
            render: (text, record) => (
                <span>
                    {text} {record.versionId === selectedVersion?.versionId && '(Selected)'}
                </span>
            ),
        },
        { title: 'Size', dataIndex: 'size' }, // Column for size
    ];

    return (
        <div>
            {/* Date range picker for filtering versions */}
            <Space direction="vertical" size={12} style={{ marginBottom: '16px' }}>
                <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" onChange={handleDateRangeChange} />
            </Space>

            {/* Table to display document versions */}
            <Table
                columns={columns}
                dataSource={filteredVersions} // Data source for the table
                rowKey={(record) => record.versionId} // Unique key for each row
                onRow={(record) => ({
                    onClick: () => handleVersionChange(record), // Handle row click to select version
                    style: { cursor: 'pointer', backgroundColor: record.versionId === selectedVersion?.versionId ? '#e6f7ff' : 'inherit' },
                })}
                pagination={{ pageSize: 5 }} // Pagination settings
            />
        </div>
    );
};

export default FileVersionViewer;





