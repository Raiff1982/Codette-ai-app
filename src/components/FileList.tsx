import React, { useState, useEffect } from 'react';
import { FileText, Download, Trash2, AlertCircle } from 'lucide-react';

interface FileListProps {
  supabase: any;
  darkMode: boolean;
  isAdmin: boolean;
}

interface FileItem {
  id: string;
  filename: string;
  storage_path: string;
  file_type: string;
  uploaded_at: string;
}

const FileList: React.FC<FileListProps> = ({ supabase, darkMode, isAdmin }) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      setError('Database connection not available');
      return;
    }

    fetchFiles();
  }, [supabase]);

  const fetchFiles = async () => {
    if (!supabase) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('codette_files')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setFiles(data || []);
    } catch (err: any) {
      console.error('Error fetching files:', err);
      setError(err.message || 'Failed to fetch files');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (file: FileItem) => {
    if (!supabase) return;

    try {
      const { data, error } = await supabase.storage
        .from('codette-files')
        .download(file.storage_path);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Error downloading file:', err);
      setError(err.message || 'Failed to download file');
    }
  };

  const handleDelete = async (file: FileItem) => {
    if (!supabase || !isAdmin) return;

    if (!confirm(`Are you sure you want to delete ${file.filename}?`)) {
      return;
    }

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('codette-files')
        .remove([file.storage_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('codette_files')
        .delete()
        .eq('id', file.id);

      if (dbError) throw dbError;

      // Refresh file list
      await fetchFiles();
    } catch (err: any) {
      console.error('Error deleting file:', err);
      setError(err.message || 'Failed to delete file');
    }
  };

  if (!supabase) {
    return (
      <div className={`p-3 rounded-md ${
        darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-500'
      }`}>
        <p className="text-sm">File management unavailable in offline mode</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`p-3 rounded-md ${
        darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-500'
      }`}>
        <p className="text-sm">Loading files...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 rounded-md bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
        <div className="flex items-start space-x-2">
          <AlertCircle className="flex-shrink-0 text-red-500 dark:text-red-400" size={16} />
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">
        Uploaded Files
      </h3>
      
      {files.length === 0 ? (
        <div className={`p-3 rounded-md ${
          darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-500'
        }`}>
          <p className="text-sm">No files uploaded yet.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {files.map((file) => (
            <li key={file.id}>
              <div className={`p-3 rounded-md ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              } transition-colors`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start flex-1">
                    <FileText size={16} className="mr-2 mt-0.5 text-blue-500" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {file.filename}
                      </div>
                      <div className={`text-xs mt-1 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {new Date(file.uploaded_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 ml-2">
                    <button
                      onClick={() => handleDownload(file)}
                      className={`p-1 rounded hover:bg-opacity-20 ${
                        darkMode ? 'hover:bg-white' : 'hover:bg-black'
                      }`}
                      title="Download"
                    >
                      <Download size={14} />
                    </button>
                    
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(file)}
                        className="p-1 rounded hover:bg-red-500 hover:bg-opacity-20 text-red-500"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileList;