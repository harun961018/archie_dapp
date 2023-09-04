import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import masterchefABI from 'config/abi/masterchef.json'
import multicall from 'utils/multicall'
import { getAddress, getMasterChefAddress } from 'utils/addressHelpers'
import { SerializedStakeConfig } from 'config/constants/types'

export const fetchStakeUserAllowances = async (account: string, stakesToFetch: SerializedStakeConfig[]) => {
  const masterChefAddress = getMasterChefAddress()

  const calls = stakesToFetch.map((stake) => {
    const lpContractAddress = getAddress(stake.lpAddresses)
    return { address: lpContractAddress, name: 'allowance', params: [account, masterChefAddress] }
  })

  const rawLpAllowances = await multicall(erc20ABI, calls)
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON()
  })
  return parsedLpAllowances
}

export const fetchStakeUserTokenBalances = async (account: string, stakesToFetch: SerializedStakeConfig[]) => {
  const calls = stakesToFetch.map((stake) => {
    const lpContractAddress = getAddress(stake.lpAddresses)
    return {
      address: lpContractAddress,
      name: 'balanceOf',
      params: [account],
    }
  })

  const rawTokenBalances = await multicall(erc20ABI, calls)
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance).toJSON()
  })
  return parsedTokenBalances
}

export const fetchStakeUserStakedBalances = async (account: string, stakesToFetch: SerializedStakeConfig[]) => {
  const masterChefAddress = getMasterChefAddress()

  const calls = stakesToFetch.map((stake) => {
    return {
      address: masterChefAddress,
      name: 'userInfo',
      params: [stake.pid, account],
    }
  })

  const rawStakedBalances = await multicall(masterchefABI, calls)
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0]._hex).toJSON()
  })
  return parsedStakedBalances
}

export const fetchStakeUserEarnings = async (account: string, stakesToFetch: SerializedStakeConfig[]) => {
  const masterChefAddress = getMasterChefAddress()

  const calls = stakesToFetch.map((stake) => {
    return {
      address: masterChefAddress,
      name: 'pendingToken',
      params: [stake.pid, account],
    }
  })

  const rawEarnings = await multicall(masterchefABI, calls)
  const parsedEarnings = rawEarnings.map((earnings) => {
    return new BigNumber(earnings).toJSON()
  })
  return parsedEarnings
}

export const fetchStakeUserCanhavest = async (account: string, stakesToFetch: SerializedStakeConfig[]) => {
  const masterChefAddress = getMasterChefAddress()

  const calls = stakesToFetch.map((stake) => {
    return {
      address: masterChefAddress,
      name: 'canHarvest',
      params: [stake.pid, account],
    }
  })

  const rawCanHarvest = await multicall(masterchefABI, calls)
  return rawCanHarvest
}
