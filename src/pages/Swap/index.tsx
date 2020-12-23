import React, { useEffect, useState } from 'react';
import { Box } from 'grommet';
import * as styles from '../FAQ/faq-styles.styl';
import { PageContainer } from 'components/PageContainer';
import { BaseContainer } from 'components/BaseContainer';
import { Button, Container, Input, Dropdown, Icon } from 'semantic-ui-react';
import { useStores } from 'stores';
import tokens from './tokens.json';

const flexRowSpace = <span style={{ flex: 1 }}></span>;
const downArrow = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#00ADE8"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <polyline points="19 12 12 19 5 12"></polyline>
  </svg>
);

const tokenShadow = 'rgba(0, 0, 0, 0.075) 0px 6px 10px';

const FromRow = ({ fromToken, setFromToken, fromAmount, setFromAmount }) => {
  const [balance, setBalance] = useState(0);
  const [dropdownBackground, setDropdownBackground] = useState(undefined);

  const font = { fontWeight: 500, fontSize: '14px', color: 'rgb(86, 90, 105)' };

  return (
    <Container
      style={{
        padding: '1rem',
        borderRadius: '20px',
        border: '1px solid rgb(247, 248, 250)',
        backgroundColor: 'white',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <span style={font}>From</span>
        {flexRowSpace}
        <span
          style={Object.assign({ cursor: 'pointer' }, font)}
          onClick={() => {}}
        >
          Balance: {priceNumberFormat.format(balance)}
        </span>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Input
          style={{
            padding: 0,
            width: '200px',
          }}
          transparent
          size="massive"
          placeholder="0.0"
          value={fromAmount}
          onChange={(_, { value }) => {
            if (isNaN(Number(value))) {
              return;
            }
            setFromAmount(Number(value));
          }}
        />
        <Button
          primary
          style={{
            borderRadius: '15px',
            fontSize: '1rem',
            fontWeight: 500,
            height: '30px',
            padding: '0rem 0.3rem',
          }}
        >
          MAX
        </Button>
        <Dropdown
          style={{
            border: 'none',
            borderRadius: '15px',
            background: dropdownBackground,
          }}
          onMouseEnter={() => setDropdownBackground('whitesmoke')}
          onMouseLeave={() => setDropdownBackground(undefined)}
          options={Object.values(tokens).map(t => ({
            key: t.symbol,
            text: t.symbol,
            value: t.symbol,
            image: {
              src: t.logo,
              style: { boxShadow: tokenShadow, borderRadius: '24px' },
            },
          }))}
          value={fromToken}
          onChange={(_, { value }) => setFromToken(value)}
        />
      </div>
    </Container>
  );
};

const ToRow = ({ toToken, setToToken, toAmount, setToAmount }) => {
  const [balance, setBalance] = useState(0);
  const [dropdownBackground, setDropdownBackground] = useState(undefined);

  const font = { fontWeight: 500, fontSize: '14px', color: 'rgb(86, 90, 105)' };

  return (
    <Container
      style={{
        padding: '1rem',
        borderRadius: '20px',
        border: '1px solid rgb(247, 248, 250)',
        backgroundColor: 'white',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <span style={font}>To</span>
        {flexRowSpace}
        <span
          style={Object.assign({ cursor: 'pointer' }, font)}
          onClick={() => {}}
        >
          Balance: {priceNumberFormat.format(balance)}
        </span>{' '}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Input
          style={{
            padding: 0,
            width: '200px',
          }}
          transparent
          size="massive"
          placeholder="0.0"
          value={toAmount}
          onChange={(_, { value }) => {
            if (isNaN(Number(value))) {
              return;
            }
            setToAmount(Number(value));
          }}
        />
        {flexRowSpace}
        <Dropdown
          style={{
            border: 'none',
            borderRadius: '15px',
            background: dropdownBackground,
          }}
          onMouseEnter={() => setDropdownBackground('whitesmoke')}
          onMouseLeave={() => setDropdownBackground(undefined)}
          options={Object.values(tokens).map(t => ({
            key: t.symbol,
            text: t.symbol,
            value: t.symbol,
            image: {
              src: t.logo,
              style: { boxShadow: tokenShadow, borderRadius: '24px' },
            },
          }))}
          value={toToken}
          onChange={(_, { value }) => setToToken(value)}
        />
      </div>
    </Container>
  );
};

const priceNumberFormat = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 10,
  useGrouping: true,
});

const PriceRow = ({ price, fromToken, toToken }) => {
  const [tokens, setTokens] = useState({
    from: fromToken,
    to: toToken,
    price: priceNumberFormat.format(price),
    priceInvert: priceNumberFormat.format(1 / price), // prevents multiple clicks from distorting the price
  });
  const [exchangeIconBackground, setExchangeIconBackground] = useState(
    'whitesmoke',
  );

  return (
    <div
      style={{
        padding: '1rem',
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center',
      }}
    >
      {' '}
      Price
      {flexRowSpace}
      {`${tokens.price} ${tokens.from} per ${tokens.to}`}
      <Icon
        circular
        size="small"
        name="exchange"
        style={{
          margin: '0 0 0 0.3em',
          background: exchangeIconBackground,
          cursor: 'pointer',
        }}
        onMouseEnter={() => setExchangeIconBackground('rgb(237, 238, 242)')}
        onMouseLeave={() => setExchangeIconBackground('whitesmoke')}
        onClick={() => {
          setTokens({
            from: tokens.to,
            to: tokens.from,
            price: tokens.priceInvert,
            priceInvert: tokens.price, // prevents multiple clicks from distorting the price
          });
        }}
      />
    </div>
  );
};

export const SwapPage = () => {
  const { user } = useStores();
  const [tokens, setTokens] = useState({ from: 'ETH', to: 'SCRT' });
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');

  useEffect(() => {
    // Setup Keplr
    user.signIn();
  }, []);

  useEffect(() => {
    // Keplr is ready
  }, [user.secretjs]);

  return (
    <BaseContainer>
      <PageContainer>
        <Box
          className={styles.faqContainer}
          pad={{ horizontal: 'large', top: 'large' }}
          style={{ alignItems: 'center' }}
        >
          <Box
            style={{
              maxWidth: 420,
            }}
            pad={{ bottom: 'medium' }}
          >
            <Container
              style={{
                borderRadius: '30px',
                backgroundColor: 'white',
                padding: '2rem',
                boxShadow:
                  'rgba(0, 0, 0, 0.01) 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 4px 8px, rgba(0, 0, 0, 0.04) 0px 16px 24px, rgba(0, 0, 0, 0.01) 0px 24px 32px',
              }}
            >
              <FromRow
                fromToken={tokens.from}
                setFromToken={value =>
                  setTokens({ from: value, to: tokens.to })
                }
                fromAmount={fromAmount}
                setFromAmount={setFromAmount}
              />
              <div
                style={{
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'row',
                  alignContent: 'center',
                }}
              >
                {flexRowSpace}
                <span
                  style={{ cursor: 'pointer' }}
                  onClick={() =>
                    setTokens({ to: tokens.from, from: tokens.to })
                  }
                >
                  {downArrow}
                </span>
                {flexRowSpace}
              </div>
              <ToRow
                toToken={tokens.to}
                setToToken={value =>
                  setTokens({ to: value, from: tokens.from })
                }
                toAmount={toAmount}
                setToAmount={setToAmount}
              />
              <PriceRow
                toToken={tokens.to}
                fromToken={tokens.from}
                price={123456} /* TODO */
              />
            </Container>
          </Box>
        </Box>
      </PageContainer>
    </BaseContainer>
  );
};