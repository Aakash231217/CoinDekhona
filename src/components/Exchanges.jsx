// components/Swap.js
import React, { useState } from 'react';
import Web3 from 'web3';
import { Token, Fetcher, Route, Trade, TokenAmount, TradeType } from '@uniswap/sdk';
import { Button, Input, Card, Typography, notification, Row, Col, Form } from 'antd';

const { Title, Text } = Typography;

const Swap = () => {
  const [account, setAccount] = useState('');
  const [amountIn, setAmountIn] = useState('');
  const [amountOut, setAmountOut] = useState('');
  const [tokenInAddress, setTokenInAddress] = useState('');
  const [tokenOutAddress, setTokenOutAddress] = useState('');

  const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');

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

  const getSwapPrice = async () => {
    try {
      const tokenIn = new Token(1, tokenInAddress, 18);
      const tokenOut = new Token(1, tokenOutAddress, 18);

      const pair = await Fetcher.fetchPairData(tokenIn, tokenOut);
      const route = new Route([pair], tokenIn);
      const trade = new Trade(route, new TokenAmount(tokenIn, web3.utils.toWei(amountIn, 'ether')), TradeType.EXACT_INPUT);

      setAmountOut(trade.executionPrice.toSignificant(6));
      notification.success({ message: 'Price fetched!', description: `Estimated Amount Out: ${trade.executionPrice.toSignificant(6)}` });
    } catch (error) {
      console.error(error);
      notification.error({ message: 'Error fetching price', description: error.message });
    }
  };

  const swapTokens = async () => {
    // Implement the swap logic here
    notification.info({ message: 'Swap initiated', description: 'Swapping tokens...' });
  };

  return (
    <Row justify="center" style={{ marginTop: 50 }}>
      <Col xs={24} sm={18} md={12} lg={10}>
        <Card style={{ padding: 20 }}>
          <Title level={2} style={{ textAlign: 'center' }}>Swap Exchange</Title>
          <Button type="primary" block onClick={connectWallet} style={{ marginBottom: 20 }}>Connect Wallet</Button>
          {account && <Text type="secondary">Connected account: {account}</Text>}
          <Form layout="vertical">
            <Form.Item label="Token In Address">
              <Input
                placeholder="Token In Address"
                value={tokenInAddress}
                onChange={(e) => setTokenInAddress(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Token Out Address">
              <Input
                placeholder="Token Out Address"
                value={tokenOutAddress}
                onChange={(e) => setTokenOutAddress(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Amount to swap">
              <Input
                placeholder="Amount to swap"
                value={amountIn}
                onChange={(e) => setAmountIn(e.target.value)}
              />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Button type="primary" block onClick={getSwapPrice}>Get Swap Price</Button>
              </Col>
              <Col span={12}>
                <Button type="primary" block onClick={swapTokens}>Swap</Button>
              </Col>
            </Row>
          </Form>
          {amountOut && (
            <Text style={{ marginTop: 20, display: 'block', textAlign: 'center' }}>
              Estimated Amount Out: {amountOut}
            </Text>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default Swap;
