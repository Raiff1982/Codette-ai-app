import React, { useState } from 'react';
import { QrCode, Copy, ExternalLink, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface QRCodeDisplayProps {
  darkMode: boolean;
  url?: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ 
  darkMode, 
  url = "https://codette-ai-demo.netlify.app" 
}) => {
  const [copied, setCopied] = useState(false);

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}&bgcolor=${darkMode ? '1f2937' : 'ffffff'}&color=${darkMode ? 'ffffff' : '000000'}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const openInNewTab = () => {
    window.open(url, '_blank');
  };

  return (
    <div className={`p-6 rounded-lg border text-center ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-center mb-4">
        <QrCode className="mr-2 text-purple-600" size={24} />
        <h3 className="text-lg font-semibold">Instant Demo Access</h3>
      </div>
      
      <div className="mb-4">
        <img 
          src={qrCodeUrl} 
          alt="QR Code for Codette AI Demo"
          className="mx-auto rounded-lg shadow-md"
          width={200}
          height={200}
        />
      </div>
      
      <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Scan with your phone to access the live demo instantly
      </p>
      
      <div className="space-y-2">
        <div className={`text-xs font-mono p-2 rounded ${
          darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
        }`}>
          {url}
        </div>
        
        <div className="flex space-x-2">
          <motion.button
            onClick={copyToClipboard}
            className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm transition-colors ${
              copied
                ? 'bg-green-600 text-white'
                : darkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            {copied ? (
              <>
                <CheckCircle size={16} className="mr-1" />
                Copied!
              </>
            ) : (
              <>
                <Copy size={16} className="mr-1" />
                Copy URL
              </>
            )}
          </motion.button>
          
          <motion.button
            onClick={openInNewTab}
            className="flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm bg-purple-600 hover:bg-purple-700 text-white transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            <ExternalLink size={16} className="mr-1" />
            Open Demo
          </motion.button>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
        <p className="text-xs text-gray-500">
          📱 Works on mobile • 💻 Desktop optimized • 🔒 Secure HTTPS
        </p>
      </div>
    </div>
  );
};

export default QRCodeDisplay;