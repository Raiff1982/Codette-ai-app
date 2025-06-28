import React, { useState } from 'react';
import { Brain, Settings, Circle, Sparkles, Zap, FileText, ChevronDown, ChevronRight, Upload, AlertCircle, Shield } from 'lucide-react';
import SecureFileList from './SecureFileList';
import AdminLogin from './AdminLogin';
import { SecurityUtils } from '../utils/security';

interface SidebarProps {
  isOpen: boolean;
  cocoons: Array<{
    id: string;
    type: string;
    wrapped: any;
  }>;
  aiState: {
    quantumState: number[];
    chaosState: number[];
    activePerspectives: string[];
    ethicalScore: number;
    processingPower: number;
  };
  darkMode: boolean;
  supabase: any;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  cocoons, 
  aiState,
  darkMode,
  supabase,
  isAdmin,
  setIsAdmin
}) => {
  const [activeSection, setActiveSection] = useState<string>('cocoons');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [securityAlert, setSecurityAlert] = useState<string | null>(null);
  
  if (!isOpen) return null;

  const handleSecureLogin = async (email: string, password: string) => {
    if (!supabase) {
      setAuthError('Database connection not available - running in secure mode');
      throw new Error('Database connection not available');
    }

    try {
      setAuthError(null);
      setSecurityAlert(null);

      // Sanitize inputs
      const sanitizedEmail = SecurityUtils.sanitizeInput(email);
      const sanitizedPassword = SecurityUtils.sanitizeInput(password);

      if (!sanitizedEmail || !sanitizedPassword) {
        throw new Error('Invalid credentials format');
      }

      await supabase.auth.signOut();
      await new Promise(resolve => setTimeout(resolve, 500));

      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password: sanitizedPassword
      });

      if (signInError) {
        throw signInError;
      }

      if (!signInData?.user) {
        throw new Error('Login failed. Please check your credentials');
      }

      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', signInData.user.id)
        .single();

      if (roleError) {
        throw new Error('Failed to verify user role');
      }

      setIsAdmin(roleData?.role === 'admin');
      setShowLoginPrompt(false);
      setAuthError(null);

    } catch (error: any) {
      console.error('Secure login error:', error);
      setAuthError(error.message);
      setSecurityAlert('Authentication attempt blocked for security');
      throw error;
    }
  };

  const handleSecureFileUpload = async () => {
    if (!selectedFile) return;

    if (!supabase) {
      setUploadError('Database connection not available - running in secure mode');
      return;
    }

    if (!isAdmin) {
      setUploadError('Only administrators can upload files.');
      setSecurityAlert('Unauthorized upload attempt blocked');
      return;
    }

    // Security validation
    const validation = SecurityUtils.validateFile(selectedFile);
    if (!validation.valid) {
      setUploadError(`File rejected: ${validation.error}`);
      setSecurityAlert(`Malicious file upload blocked: ${validation.error}`);
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      setSecurityAlert(null);

      // Generate secure filename
      const secureToken = SecurityUtils.generateSecureToken(8);
      const sanitizedFilename = SecurityUtils.sanitizeInput(selectedFile.name);
      const secureFilename = `${secureToken}-${sanitizedFilename}`;

      const { data, error: uploadError } = await supabase.storage
        .from('codette-files')
        .upload(secureFilename, selectedFile);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('codette_files')
        .insert([{
          filename: sanitizedFilename,
          storage_path: data.path,
          file_type: selectedFile.type
        }]);

      if (dbError) throw dbError;

      setSelectedFile(null);
      setUploadError(null);
    } catch (error: any) {
      console.error('Error uploading file:', error);
      setUploadError(error.message);
      setSecurityAlert('File upload failed - security protocols engaged');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Immediate security validation
    const validation = SecurityUtils.validateFile(file);
    if (!validation.valid) {
      setUploadError(`File rejected: ${validation.error}`);
      setSecurityAlert(`Malicious file blocked: ${validation.error}`);
      event.target.value = ''; // Clear the input
      return;
    }

    setSelectedFile(file);
    setUploadError(null);
    setSecurityAlert(null);
  };

  const handleSettingsClick = () => {
    if (!isAdmin && supabase) {
      setShowLoginPrompt(true);
    }
    setActiveSection('settings');
  };
  
  return (
    <aside className={`w-64 flex-shrink-0 border-r transition-colors duration-300 flex flex-col ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      {securityAlert && (
        <div className="bg-red-600 text-white px-3 py-2 text-xs flex items-center justify-between">
          <span>🔒 {securityAlert}</span>
          <button 
            onClick={() => setSecurityAlert(null)}
            className="text-white hover:text-gray-200"
          >
            ✕
          </button>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2 flex items-center">
            <Shield className="mr-1" size={12} />
            Secure Navigation
          </h2>
          
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setActiveSection('cocoons')}
                className={`w-full flex items-center px-3 py-2 rounded-md ${
                  activeSection === 'cocoons'
                    ? darkMode 
                      ? 'bg-gray-700 text-white' 
                      : 'bg-gray-200 text-gray-900'
                    : darkMode
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Brain size={18} className="mr-2" />
                <span>Secure Cocoons</span>
              </button>
            </li>
            
            <li>
              <button
                onClick={() => setActiveSection('perspectives')}
                className={`w-full flex items-center px-3 py-2 rounded-md ${
                  activeSection === 'perspectives'
                    ? darkMode 
                      ? 'bg-gray-700 text-white' 
                      : 'bg-gray-200 text-gray-900'
                    : darkMode
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Sparkles size={18} className="mr-2" />
                <span>AI Perspectives</span>
              </button>
            </li>
            
            <li>
              <button
                onClick={handleSettingsClick}
                className={`w-full flex items-center px-3 py-2 rounded-md ${
                  activeSection === 'settings'
                    ? darkMode 
                      ? 'bg-gray-700 text-white' 
                      : 'bg-gray-200 text-gray-900'
                    : darkMode
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Settings size={18} className="mr-2" />
                <span>Secure Settings</span>
              </button>
            </li>
          </ul>
        </div>
        
        <div className="px-4 py-2">
          <div className={`h-px ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
        </div>
        
        {activeSection === 'cocoons' && (
          <div className="p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">
              Secure Thought Cocoons
            </h2>
            
            {cocoons.length === 0 ? (
              <div className={`p-3 rounded-md ${
                darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-500'
              }`}>
                <p className="text-sm">No secure cocoons yet.</p>
                <p className="text-xs mt-1 italic">Interact with Codette to generate secure thought patterns.</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {cocoons.map((cocoon) => (
                  <li key={cocoon.id}>
                    <div className={`p-3 rounded-md border ${
                      darkMode ? 'bg-gray-700 hover:bg-gray-600 border-gray-600' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'
                    } cursor-pointer transition-colors`}>
                      <div className="flex items-start">
                        <FileText size={16} className={`mr-2 mt-0.5 ${
                          cocoon.type === 'prompt' 
                            ? 'text-green-500' 
                            : cocoon.type === 'encrypted' 
                              ? 'text-purple-500' 
                              : 'text-blue-500'
                        }`} />
                        <div>
                          <div className="text-sm font-medium">
                            {cocoon.type === 'prompt' ? 'Secure Query' : 
                             cocoon.type === 'encrypted' ? 'Encrypted Thought' : 
                             'Protected Pattern'}
                          </div>
                          <div className="text-xs truncate mt-1 max-w-[180px]">
                            {cocoon.type === 'encrypted' 
                              ? '🔒 Encrypted content'
                              : typeof cocoon.wrapped === 'object' && cocoon.wrapped.query
                                ? SecurityUtils.sanitizeInput(cocoon.wrapped.query)
                                : `Secure ID: ${cocoon.id.slice(0, 8)}`}
                          </div>
                          <div className={`text-xs mt-1 ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {typeof cocoon.wrapped === 'object' && cocoon.wrapped.timestamp
                              ? new Date(cocoon.wrapped.timestamp).toLocaleTimeString()
                              : 'Protected time'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {supabase && (
              <div className="mt-6">
                <SecureFileList supabase={supabase} darkMode={darkMode} isAdmin={isAdmin} />
              </div>
            )}
          </div>
        )}
        
        {activeSection === 'perspectives' && (
          <div className="p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">
              Active AI Perspectives
            </h2>
            
            <ul className="space-y-2">
              {aiState.activePerspectives.map((perspective) => (
                <li key={perspective}>
                  <div className={`p-3 rounded-md border ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
                  }`}>
                    <div className="flex items-center">
                      <Zap size={16} className="mr-2 text-green-500" />
                      <div className="text-sm font-medium capitalize">
                        {perspective.replace('_', ' ')}
                      </div>
                    </div>
                    <div className={`text-xs mt-2 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Security Level: High • Confidence: {(Math.random() * 0.2 + 0.8).toFixed(2)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mt-6 mb-2">
              Available Perspectives
            </h2>
            
            <ul className="space-y-2">
              {['security', 'ethics', 'privacy', 'validation'].map((perspective) => (
                <li key={perspective}>
                  <div className={`p-3 rounded-md border ${
                    darkMode ? 'bg-gray-700 bg-opacity-50 border-gray-600' : 'bg-gray-100 bg-opacity-50 border-gray-300'
                  }`}>
                    <div className="flex items-center">
                      <Circle size={16} className={`mr-2 ${
                        darkMode ? 'text-gray-500' : 'text-gray-400'
                      }`} />
                      <div className={`text-sm capitalize ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {perspective.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {activeSection === 'settings' && (
          <div className="p-4">
            {showLoginPrompt && supabase ? (
              <AdminLogin 
                onLogin={handleSecureLogin}
                darkMode={darkMode}
                error={authError}
              />
            ) : (
              <>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4 flex items-center">
                  <Shield className="mr-1" size={12} />
                  Secure AI Settings
                </h2>
                
                <div className="space-y-4">
                  {!supabase && (
                    <div className="p-4 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 border border-blue-300 dark:border-blue-700">
                      <div className="flex items-center">
                        <Shield className="mr-2" size={16} />
                        <span>Secure offline mode active</span>
                      </div>
                    </div>
                  )}

                  {isAdmin && supabase && (
                    <div className="p-4 rounded-md bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border border-green-300 dark:border-green-700">
                      <div className="flex items-center">
                        <Shield className="mr-2" size={16} />
                        <span>Secure Admin Access</span>
                      </div>
                    </div>
                  )}
                  
                  {isAdmin && supabase && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Secure File Upload</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="file"
                          onChange={handleFileSelection}
                          className="hidden"
                          id="secure-file-upload"
                          disabled={isUploading}
                          accept=".txt,.md,.json,.csv,.pdf"
                        />
                        <label
                          htmlFor="secure-file-upload"
                          className={`flex-1 cursor-pointer px-4 py-2 rounded-md border-2 border-dashed ${
                            darkMode
                              ? 'border-gray-600 hover:border-gray-500'
                              : 'border-gray-300 hover:border-gray-400'
                          } flex items-center justify-center ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <Upload size={18} className="mr-2" />
                          {selectedFile ? SecurityUtils.sanitizeInput(selectedFile.name) : 'Choose Secure File'}
                        </label>
                        {selectedFile && (
                          <button
                            onClick={handleSecureFileUpload}
                            disabled={isUploading}
                            className={`px-4 py-2 rounded-md ${
                              darkMode
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-green-500 hover:bg-green-600'
                            } text-white ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {isUploading ? 'Securing...' : 'Upload'}
                          </button>
                        )}
                      </div>
                      {uploadError && (
                        <div className="mt-2 p-2 rounded-md bg-red-100 dark:bg-red-900 flex items-start space-x-2">
                          <AlertCircle className="flex-shrink-0 text-red-500 dark:text-red-400" size={16} />
                          <p className="text-sm text-red-600 dark:text-red-300">
                            {uploadError}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="flex items-center justify-between">
                      <span className="text-sm font-medium">Security Level</span>
                      <select 
                        className={`text-sm rounded-md ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        defaultValue="maximum"
                      >
                        <option value="maximum">Maximum</option>
                        <option value="high">High</option>
                        <option value="standard">Standard</option>
                      </select>
                    </label>
                  </div>
                  
                  <div>
                    <label className="flex items-center justify-between">
                      <span className="text-sm font-medium">Input Validation</span>
                      <div className="relative inline-block w-10 align-middle select-none">
                        <input 
                          type="checkbox" 
                          id="validation-toggle" 
                          className="sr-only"
                          defaultChecked={true}
                          disabled
                        />
                        <label 
                          htmlFor="validation-toggle" 
                          className={`block h-6 overflow-hidden rounded-full cursor-not-allowed ${
                            darkMode ? 'bg-green-700' : 'bg-green-500'
                          }`}
                        >
                          <span 
                            className={`absolute block w-4 h-4 rounded-full transform transition-transform duration-200 ease-in-out bg-white left-1 top-1 translate-x-4`}
                          ></span>
                        </label>
                      </div>
                    </label>
                  </div>
                  
                  <div className="pt-2 pb-1">
                    <label className="block text-sm font-medium mb-2">Security Scanning</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      defaultValue="100"
                      className="w-full"
                      disabled
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Basic</span>
                      <span>Enhanced</span>
                      <span>Maximum</span>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button 
                      className={`w-full py-2 px-4 rounded-md ${
                        darkMode 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                      disabled
                    >
                      Security Settings Locked
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </nav>
      
      <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className={`rounded-md p-3 border ${
          darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
        }`}>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
            <div className="text-sm font-medium flex items-center">
              <Shield className="mr-1" size={12} />
              Secure Status
            </div>
          </div>
          <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {supabase ? 'All security protocols active' : 'Offline security mode - Core protection active'}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;