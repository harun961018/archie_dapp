import { ChainId, Token } from '@archie-dapp/sdk'
import { serializeToken } from 'state/user/hooks/helpers'
import { SerializedToken } from './types'

const { MAINNET, TESTNET } = ChainId;

interface TokenList {
  [symbol: string]: Token
}

interface SerializedTokenList {
  [symbol: string]: SerializedToken
}

export const mainnetTokens = {
  
  usdt: new Token(
    MAINNET,
    '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    18,
    'USDT',
    'Tether USD',
    'https://tether.to/',
  ),
  
  eth: new Token(
    MAINNET,
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    18,
    'ETH',
    'ETH',
    'https://ethereum.org/en/',
  ),
  weth: new Token(
    MAINNET,
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    18,
    'WETH',
    'Wrapped ETH',
    'https://weth.io/ ',
  ),
  
  archieneko: new Token(
    MAINNET,
    '0xFE5F69dfa2d4501E78078266F6d430c079098f90',
    9,
    'ARCHIE',
    'Archieneko',
    ''
  )
}

export const testnetTokens = {
  usdt: new Token(
    TESTNET,
    '0x6EE856Ae55B6E1A249f04cd3b947141bc146273c',
    18,
    'USDT',
    'Tether USD',
    'https://tether.to/',
  ),
  
  eth: new Token(
    TESTNET,
    '0xc778417E063141139Fce010982780140Aa0cD5Ab',
    18,
    'ETH',
    'ETH',
    'https://ethereum.org/en/',
  ),
  weth: new Token(
    TESTNET,
    '0xc778417E063141139Fce010982780140Aa0cD5Ab',
    18,
    'WETH',
    'Wrapped ETH',
    'https://weth.io/ ',
  ),
  archieneko: new Token(
    TESTNET,
    '0x23e95267b3FE4Cf1Dc9E53449A94A649E7e58256',
    18,
    'ARCHIE',
    'Archieneko',
    ''
  )
}

const tokens = (): TokenList => {
  const chainId = process.env.REACT_APP_CHAIN_ID

  // If testnet - return list comprised of testnetTokens wherever they exist, and mainnetTokens where they don't
  if (parseInt(chainId, 10) === ChainId.TESTNET) {
    return Object.keys(mainnetTokens).reduce((accum, key) => {
      return { ...accum, [key]: testnetTokens[key] || mainnetTokens[key] }
    }, {})
  }

  return mainnetTokens
}

export const serializeTokens = (): SerializedTokenList => {
  const unserializedTokens = tokens()
  const serializedTokens = Object.keys(unserializedTokens).reduce((accum, key) => {
    return { ...accum, [key]: serializeToken(unserializedTokens[key]) }
  }, {})

  return serializedTokens
}

export default tokens()
