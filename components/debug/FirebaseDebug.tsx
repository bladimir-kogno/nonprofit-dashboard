'use client';

import { useState } from 'react';
import { EmailRecipientService } from '@/lib/client-database';

export default function FirebaseDebug() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const testFirebaseConnection = async () => {
    setLogs([]);
    addLog('Starting Firebase connection test...');

    try {
      // Test environment variables
      addLog('Checking environment variables...');
      const envVars = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✓ Set' : '✗ Missing',
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✓ Set' : '✗ Missing',
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✓ Set' : '✗ Missing',
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✓ Set' : '✗ Missing',
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✓ Set' : '✗ Missing',
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✓ Set' : '✗ Missing',
      };
      
      Object.entries(envVars).forEach(([key, status]) => {
        addLog(`${key}: ${status}`);
      });

      // Test database connection
      addLog('Testing database connection...');
      const recipients = await EmailRecipientService.getAll();
      addLog(`✓ Successfully connected! Found ${recipients.length} recipients`);

      // Test creating a test record
      addLog('Testing create operation...');
      const testRecipient = await EmailRecipientService.create({
        name: 'Test Contact',
        email: 'test@example.com',
        type: 'subscriber',
        status: 'active',
        metadata: { source: 'debug-test' }
      });
      addLog(`✓ Successfully created test contact with ID: ${testRecipient.id}`);

      // Clean up test record
      addLog('Cleaning up test record...');
      await EmailRecipientService.delete(testRecipient.id);
      addLog('✓ Test record deleted successfully');

      addLog('🎉 All tests passed! Firebase is working correctly.');

    } catch (error) {
      addLog(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Firebase test error:', error);
    }
  };

  const testCreate = async () => {
    try {
      addLog('Creating test contact...');
      const result = await EmailRecipientService.create({
        name: 'Debug Test',
        email: `debug-${Date.now()}@test.com`,
        type: 'subscriber',
        status: 'active',
        metadata: { 
          source: 'debug-manual-test',
          timestamp: new Date().toISOString()
        }
      });
      addLog(`✓ Created contact: ${result.name} (${result.id})`);
    } catch (error) {
      addLog(`❌ Create failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700 z-50"
      >
        🔧 Debug Firebase
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Firebase Debug Console</h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex gap-2 mb-4">
            <button
              onClick={testFirebaseConnection}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Run Full Test
            </button>
            <button
              onClick={testCreate}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Test Create
            </button>
            <button
              onClick={() => setLogs([])}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Clear Logs
            </button>
          </div>

          <div className="bg-gray-900 text-green-400 p-4 rounded max-h-96 overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? (
              <div className="text-gray-500">Click "Run Full Test" to check Firebase connectivity...</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}