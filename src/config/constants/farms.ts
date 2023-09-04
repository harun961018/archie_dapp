import { serializeTokens } from './tokens'
import { SerializedFarmConfig } from './types'

const serializedTokens = serializeTokens()

const farms: SerializedFarmConfig[] = [
  /**
   * These 3 farms (PID 0, 251, 252) should always be at the top of the file.
   */
  {
    pid: 0,
    lpSymbol: 'Archieneko-ETH LP',
    lpAddresses: {
      97: '0x9C21123D94b93361a29B2C2EFB3d5CD8B17e0A9e',
      56: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
      4: '0x23e95267b3FE4Cf1Dc9E53449A94A649E7e58256',
      1: '0xFE5F69dfa2d4501E78078266F6d430c079098f90'
    },
    token: serializedTokens.archieneko,
    quoteToken: serializedTokens.archieneko,
    lockPeriod: '1D',
    APY: '2%'
  },
  {
    pid: 4,
    lpSymbol: 'Archieneko-ETH LP',
    lpAddresses: {
      97: '0x3ed8936cAFDF85cfDBa29Fbe5940A5b0524824F4',
      56: '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0',
      4: '0x23e95267b3FE4Cf1Dc9E53449A94A649E7e58256',
      1: '0x07d292188b0562ca63a86c5b1e368a80047b147c'
    },
    token: serializedTokens.archieneko,
    quoteToken: serializedTokens.eth,
    lockPeriod: '30D',
    APY: '72%'
  },
  {
    pid: 5,
    lpSymbol: 'Archieneko-ETH LP',
    lpAddresses: {
      97: '',
      56: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16',
      4: '0x23e95267b3FE4Cf1Dc9E53449A94A649E7e58256',
      1: '0x07d292188b0562ca63a86c5b1e368a80047b147c'
    },
    token: serializedTokens.archieneko,
    quoteToken: serializedTokens.eth,
    lockPeriod: '60D',
    APY: '78%'
  },
  {
    pid: 6,
    lpSymbol: 'Archieneko-ETH LP',
    lpAddresses: {
      97: '',
      56: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16',
      4: '0x23e95267b3FE4Cf1Dc9E53449A94A649E7e58256',
      1: '0x07d292188b0562ca63a86c5b1e368a80047b147c'
    },
    token: serializedTokens.archieneko,
    quoteToken: serializedTokens.eth,
    lockPeriod: '90D',
    APY: '84%'
  },
  /**
   * V3 by order of release (some may be out of PID order due to multiplier boost)
   */
  
]

export default farms
