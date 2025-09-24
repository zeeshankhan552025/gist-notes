import React from 'react';
import { Button, Card, Typography, Space } from 'antd';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;

const AuthDebugPanel: React.FC = () => {
  const { isAuthenticated, userInfo, login, logout, githubToken } = useAuth();

  const handleTestLogin = async () => {
    try {
      console.log('Testing login...');
      await login();
      console.log('Login completed');
    } catch (error) {
      console.error('Login test failed:', error);
    }
  };

  const checkFirebaseConfig = () => {
    const config = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    };
    
    console.log('Firebase Config:', config);
    console.log('Missing configs:', Object.entries(config).filter(([_, value]) => !value));
  };

  const checkLocalStorage = () => {
    const token = localStorage.getItem('github_token');
    const userInfo = localStorage.getItem('user_info');
    
    console.log('Stored token:', token ? 'Present' : 'Not found');
    console.log('Stored user info:', userInfo ? JSON.parse(userInfo) : 'Not found');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <Card title="Firebase Auth Debug Panel">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Title level={4}>Authentication Status</Title>
            <Text>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</Text><br />
            <Text>User: {userInfo?.displayName || 'Not logged in'}</Text><br />
            <Text>Token: {githubToken ? 'Present' : 'Not found'}</Text><br />
            <Text>Email: {userInfo?.email || 'N/A'}</Text>
          </div>

          <div>
            <Title level={4}>Actions</Title>
            <Space>
              {!isAuthenticated ? (
                <Button type="primary" onClick={handleTestLogin}>
                  Test GitHub Login
                </Button>
              ) : (
                <Button onClick={logout}>
                  Logout
                </Button>
              )}
              <Button onClick={checkFirebaseConfig}>
                Check Firebase Config
              </Button>
              <Button onClick={checkLocalStorage}>
                Check Local Storage
              </Button>
            </Space>
          </div>

          <div>
            <Title level={4}>Environment Check</Title>
            <Text>
              Firebase API Key: {import.meta.env.VITE_FIREBASE_API_KEY ? 'Set' : 'Missing'}
            </Text><br />
            <Text>
              Firebase Auth Domain: {import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? 'Set' : 'Missing'}
            </Text><br />
            <Text>
              Firebase Project ID: {import.meta.env.VITE_FIREBASE_PROJECT_ID ? 'Set' : 'Missing'}
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default AuthDebugPanel;