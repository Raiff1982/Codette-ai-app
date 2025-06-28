import React, { useState, useEffect } from 'react';
import { FileText, Download, Trash2, AlertCircle, Shield } from 'lucide-react';
import { SecurityUtils } from '../utils/security';

interface SecureFileListProps {
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

const SecureFileList: React.FC<SecureFileListProps> = ({ supabase, darkMode, isAdmin }) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [securityWarning, setSecurityWarning] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      setError('Database connection not available - running in secure offline mode');
      return;
    }

    fetchSecureFiles();
  }, [supabase]);

  const fetchSecureFiles = async () => {
    if (!supabase) return;

    try {
      setLoading(true);
      setError(null);
      setSecurityWarning(null);

      const { data, error: fetchError } = await supabase
        .from('codette_files')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      // Security validation of file data
      const validatedFiles = (data || []).filter((file: any) => {
        if (!file.filename || !file.storage_path) {
          console.warn('Invalid file data detected:', file);
          return false;
        }
        
        // Check for suspicious file names
        const validation = SecurityUtils.validateFile(new File([], file.filename, { type: file.file_type || 'text/plain' }));
        if (!validation.valid) {
          console.warn('Suspicious file detected:', file.filename, validation.error);
          setSecurityWarning(`Suspicious file detected: ${file.filename}`);
          return false;
        }
        
        return true;
      });

      setFiles(validatedFiles);
    } catch (err: any) {
      console.error('Error fetching files:', err);
      setError(err.message || 'Failed to fetch files securely');
    } finally {
      setLoading(false);
    }
  };

  const handleSecureDownload = async (file: FileItem) => {
    if (!supabase) return;

    try {
      // Additional security check before download
      const validation = SecurityUtils.validateFile(new File([], file.filename, { type: file.file_type || 'text/plain' }));
      if (!validation.valid) {
        setSecurityWarning(`Download blocked: ${validation.error}`);
        return;
      }

      const { data, error } = await supabase.storage
        .from('codette-files')
        .download(file.storage_path);

      if (error) throw error;

      // Create secure download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = SecurityUtils.sanitizeInput(file.filename);
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Error downloading file:', err);
      setError(err.message || 'Failed to download file securely');
    }
  };

  const handleSecureDelete = async (file: FileItem) => {
    if (!supabase || !isAdmin) return;

    const sanitizedFilename = SecurityUtils.sanitizeInput(file.filename);
    if (!confirm(`Are you sure you want to securely delete ${sanitizedFilename}?`)) {
      return;
    }

    try {
      // Delete from storage first
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
      await fetchSecureFiles();
      setSecurityWarning(null);
    } catch (err: any) {
      console.error('Error deleting file:', err);
      setError(err.message || 'Failed to delete file securely');
    }
  };

  if (!supabase) {
    return (
      <div className={`p-3 rounded-md border ${
        darkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-500 border-gray-300'
      }`}>
        <div className="flex items-center">
          <Shield className="mr-2" size={16} />
          <p className="text-sm">Secure offline mode - File management unavailable</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`p-3 rounded-md ${
        darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-500'
      }`}>
        <div className="flex items-center">
          <Shield className="mr-2 animate-pulse" size={16} />
          <p className="text-sm">Securely loading files...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2 flex items-center">
        <Shield className="mr-1" size={14} />
        Secure Files
      </h3>
      
      {securityWarning && (
        <div className="mb-3 p-2 rounded-md bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
          <div className="flex items-start space-x-2">
            <AlertCircle className="flex-shrink-0 text-yellow-500" size={16} />
            <p className="text-sm">{securityWarning}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-3 p-2 rounded-md bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
          <div className="flex items-start space-x-2">
            <AlertCircle className="flex-shrink-0 text-red-500" size={16} />
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}
      
      {files.length === 0 ? (
        <div className={`p-3 rounded-md ${
          darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-500'
        }`}>
          <p className="text-sm">No secure files available.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {files.map((file) => (
            <li key={file.id}>
              <div className={`p-3 rounded-md border ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600 border-gray-600' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'
              } transition-colors`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start flex-1">
                    <FileText size={16} className="mr-2 mt-0.5 text-green-500" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {SecurityUtils.sanitizeInput(file.filename)}
                      </div>
                      <div className={`text-xs mt-1 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {new Date(file.uploaded_at).toLocaleDateString()} • Verified
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 ml-2">
                    <button
                      onClick={() => handleSecureDownload(file)}
                      className={`p-1 rounded hover:bg-opacity-20 ${
                        darkMode ? 'hover:bg-white' : 'hover:bg-black'
                      }`}
                      title="Secure Download"
                    >
                      <Download size={14} />
                    </button>
                    
                    {isAdmin && (
                      <button
                        onClick={() => handleSecureDelete(file)}
                        className="p-1 rounded hover:bg-red-500 hover:bg-opacity-20 text-red-500"
                        title="Secure Delete"
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

export default SecureFileList;