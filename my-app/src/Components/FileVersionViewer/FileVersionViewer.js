import React, { useState, useEffect, useCallback } from 'react';
import s3 from '../../awsConfig'; // Adjust path if awsConfig.js is elsewhere
import { Table, DatePicker, Space } from 'antd';
import moment from 'moment';
import './FileVersionViewer.css';

const { RangePicker } = DatePicker;

const FileVersionViewer = ({ onSelectVersion, setError }) => {
  const [versions, setVersions] = useState([]);
  const [filteredVersions, setFilteredVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);

  const BUCKET_NAME = 'boris-public-bucket';
  const FILE_KEY = 'document.json';

  const fetchDocumentContent = useCallback(
    async (version) => {
      const params = {
        Bucket: BUCKET_NAME,
        Key: FILE_KEY,
        VersionId: version.versionId,
      };
      try {
        const data = await s3.getObject(params).promise();
        const documentBody = data.Body.toString('utf-8');
        const parsedContent = JSON.parse(documentBody);
        onSelectVersion(parsedContent);
      } catch (err) {
        console.error('Error fetching document content:', err);
        setError('Failed to load document content.');
      }
    },
    [BUCKET_NAME, FILE_KEY, onSelectVersion, setError]
  );

  const fetchDocumentVersions = useCallback(async () => {
    const params = { Bucket: BUCKET_NAME, Prefix: FILE_KEY };
    try {
      const data = await s3.listObjectVersions(params).promise();
      const versionsList = data.Versions.map((version) => ({
        versionId: version.VersionId,
        lastModified: new Date(version.LastModified).getTime(),
        readableDate: moment(version.LastModified).format('YYYY-MM-DD HH:mm:ss'),
        size: (version.Size / 1024).toFixed(2) + ' KB',
      }));
      versionsList.sort((a, b) => b.lastModified - a.lastModified);
      setVersions(versionsList);
      setFilteredVersions(versionsList);
    } catch (err) {
      console.error('Error fetching document versions:', err);
      setError('Failed to load document versions.');
    }
  }, [BUCKET_NAME, FILE_KEY, setError]);

  useEffect(() => {
    fetchDocumentVersions();
  }, [fetchDocumentVersions]);

  const filterVersionsByDate = (range) => {
    if (range && range.length === 2) {
      const [startDate, endDate] = range.map((date) => date.valueOf());
      const filtered = versions.filter((version) => {
        const versionDate = version.lastModified;
        return versionDate >= startDate && versionDate <= endDate;
      });
      setFilteredVersions(filtered);
    } else {
      setFilteredVersions(versions);
    }
  };

  const handleDateRangeChange = (dates) => {
    filterVersionsByDate(dates);
  };

  const handleVersionChange = (record) => {
    setSelectedVersion(record);
    fetchDocumentContent(record);
  };

  const columns = [
    {
      title: 'Last Modified',
      dataIndex: 'readableDate',
      render: (text, record) => (
        <span>
          {text} {record.versionId === selectedVersion?.versionId && '(Selected)'}
        </span>
      ),
    },
    { title: 'Size', dataIndex: 'size' },
  ];

  return (
    <div className="file-version-viewer">
      <Space direction="vertical" size={12}>
        <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" onChange={handleDateRangeChange} />
      </Space>
      <Table
        columns={columns}
        dataSource={filteredVersions}
        rowKey={(record) => record.versionId}
        onRow={(record) => ({
          onClick: () => handleVersionChange(record),
        })}
        rowClassName={(record) =>
          record.versionId === selectedVersion?.versionId ? 'ant-table-row-selected' : ''
        }
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default FileVersionViewer;

