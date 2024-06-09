// components/MetaMaskConnection.js
import React, { useEffect, useState } from 'react';
import { Button, notification } from 'antd';

const MetaMaskConnection = ({ children }) => {
  const [account, setAccount] = useState('');

  useEffect(() => {
    const checkMetaMaskConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          } else {
            connectWallet();
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        alert('Please install MetaMask!');
      }
    };

    checkMetaMaskConnection();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        notification.success({ message: 'Wallet connected!', description: `Connected account: ${accounts[0]}` });
      } catch (error) {
        console.error(error);
        notification.error({ message: 'Connection failed', description: error.message });
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  if (!account) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <h1>Please Connect Your MetaMask Wallet</h1>
        <Button type="primary" onClick={connectWallet}>Connect Wallet</Button>
      </div>
    );
  }

  return <>{children}</>;
};

export default MetaMaskConnection;
