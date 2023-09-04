import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Contract, providers, Wallet, ethers } from 'ethers';
import { useAppDispatch } from 'state'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceAmount } from 'utils/formatBalance'
import { stakesConfig } from 'config/constants'
import useRefresh from 'hooks/useRefresh'
import { deserializeToken } from 'state/user/hooks/helpers'
import { fetchStakesPublicDataAsync, fetchStakeUserDataAsync, nonArchivedStakes } from '.'
import { State, SerializedStake, DeserializedStakeUserData, DeserializedStake, DeserializedStakesState } from '../types'
import erc20Abi from '../../config/abi/erc20.json'

const usdtAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7'
const wethAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
const archienekoAddress = '0xFE5F69dfa2d4501E78078266F6d430c079098f90'
const lptokenAddress = '0x07d292188b0562ca63a86c5b1e368a80047b147c'
const usdtEthlpAddress = '0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852'
const RPC_URL = 'https://mainnet.infura.io/v3/2fe44f346c8a455eb33c52ed2f077bfc'
const provider = new providers.JsonRpcProvider(RPC_URL);


const deserializeStakeUserData = (stake: SerializedStake): DeserializedStakeUserData => {
  return {
    allowance: stake.userData ? new BigNumber(stake.userData.allowance) : BIG_ZERO,
    tokenBalance: stake.userData ? new BigNumber(stake.userData.tokenBalance) : BIG_ZERO,
    stakedBalance: stake.userData ? new BigNumber(stake.userData.stakedBalance) : BIG_ZERO,
    earnings: stake.userData ? new BigNumber(stake.userData.earnings) : BIG_ZERO,
    canHarvest: stake.userData ? stake.userData.canHarvest : true,
  }
}

const deserializeStake = (stake: SerializedStake): DeserializedStake => {
  const { lpAddresses, lpSymbol, pid, dual, multiplier, isCommunity, quoteTokenPriceBusd, tokenPriceBusd, lockPeriod, APY } = stake

  return {
    lpAddresses,
    lpSymbol,
    pid,
    dual,
    multiplier,
    isCommunity,
    quoteTokenPriceBusd,
    tokenPriceBusd,
    token: deserializeToken(stake.token),
    quoteToken: deserializeToken(stake.quoteToken),
    lockPeriod,
    APY,
    userData: deserializeStakeUserData(stake),
    tokenAmountTotal: stake.tokenAmountTotal ? new BigNumber(stake.tokenAmountTotal) : BIG_ZERO,
    lpTotalInQuoteToken: stake.lpTotalInQuoteToken ? new BigNumber(stake.lpTotalInQuoteToken) : BIG_ZERO,
    lpTotalSupply: stake.lpTotalSupply ? new BigNumber(stake.lpTotalSupply) : BIG_ZERO,
    tokenPriceVsQuote: stake.tokenPriceVsQuote ? new BigNumber(stake.tokenPriceVsQuote) : BIG_ZERO,
    poolWeight: stake.poolWeight ? new BigNumber(stake.poolWeight) : BIG_ZERO,
  }
}

export const usePollStakesPublicData = (includeArchive = false) => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    const stakesToFetch = includeArchive ? stakesConfig : nonArchivedStakes
    const pids = stakesToFetch.map((stakeToFetch) => stakeToFetch.pid)

    dispatch(fetchStakesPublicDataAsync(pids))
  }, [includeArchive, dispatch, slowRefresh])
}

export const usePollStakesWithUserData = (includeArchive = false) => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()
  const { account } = useWeb3React()

  useEffect(() => {
    const stakesToFetch = includeArchive ? stakesConfig : nonArchivedStakes
    const pids = stakesToFetch.map((stakeToFetch) => stakeToFetch.pid)

    dispatch(fetchStakesPublicDataAsync(pids))

    if (account) {
      dispatch(fetchStakeUserDataAsync({ account, pids }))
    }
  }, [includeArchive, dispatch, slowRefresh, account])
}

/**
 * Fetches the "core" stake data used globally
 * 251 = CAKE-BNB LP
 * 252 = BUSD-BNB LP
 */
export const usePollCoreStakeData = () => {
  const dispatch = useAppDispatch()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    dispatch(fetchStakesPublicDataAsync([251, 252]))
  }, [dispatch, fastRefresh])
}

export const useStakes = (): DeserializedStakesState => {
  const stakes = useSelector((state: State) => state.stakes)
  const deserializedStakesData = stakes.data.map(deserializeStake)
  const { loadArchivedStakesData, userDataLoaded } = stakes
  return {
    loadArchivedStakesData,
    userDataLoaded,
    data: deserializedStakesData,
  }
}

export const useStakeFromPid = (pid: number): DeserializedStake => {
  const stake = useSelector((state: State) => state.stakes.data.find((f) => f.pid === pid))
  return deserializeStake(stake)
}

export const useStakeFromLpSymbol = (lpSymbol: string): DeserializedStake => {
  const stake = useSelector((state: State) => state.stakes.data.find((f) => f.lpSymbol === lpSymbol))
  return deserializeStake(stake)
}

export const useStakeUser = (pid): DeserializedStakeUserData => {
  const { userData } = useStakeFromPid(pid)
  const { allowance, tokenBalance, stakedBalance, earnings, canHarvest } = userData
  return {
    allowance,
    tokenBalance,
    stakedBalance,
    earnings,
    canHarvest,
  }
}

// Return the base token price for a stake, from a given pid
export const useBusdPriceFromPid = (pid: number): BigNumber => {
  const stake = useStakeFromPid(pid)
  return stake && new BigNumber(stake.tokenPriceBusd)
}

export const useLpTokenPrice = (symbol: string) => {
  const stake = useStakeFromLpSymbol(symbol)
  const stakeTokenPriceInUsd = useBusdPriceFromPid(stake.pid)
  let lpTokenPrice = BIG_ZERO

  if (stake.lpTotalSupply.gt(0) && stake.lpTotalInQuoteToken.gt(0)) {
    // Total value of base token in LP
    const valueOfBaseTokenInStake = stakeTokenPriceInUsd.times(stake.tokenAmountTotal)
    // Double it to get overall value in LP
    const overallValueOfAllTokensInStake = valueOfBaseTokenInStake.times(2)
    // Divide total value of all tokens, by the number of LP tokens
    const totalLpTokens = getBalanceAmount(stake.lpTotalSupply)
    lpTokenPrice = overallValueOfAllTokensInStake.div(totalLpTokens)
  }

  return lpTokenPrice
}

// /!\ Deprecated , use the BUSD hook in /hooks

export const usePriceCakeBusd = (): BigNumber => {
  const [cakePrice, setCakePrice] = useState(null);

  useEffect(() => {
    const fn = async () => {
      const usdtContract = new ethers.Contract(usdtAddress,  erc20Abi, provider);
      const wethContract = new ethers.Contract(wethAddress, erc20Abi, provider);
      const archienekoContract = new ethers.Contract(archienekoAddress, erc20Abi, provider);
      const usdtAmountonLP = await usdtContract.balanceOf(usdtEthlpAddress);
      const wethAmountonLp = await wethContract.balanceOf(usdtEthlpAddress);
      const archienekoonLp1 = await archienekoContract.balanceOf(lptokenAddress);
      const wethAmountonLp1 = await wethContract.balanceOf(lptokenAddress);
      const ethPriceUSDT = parseFloat("1000000000000") * parseFloat(usdtAmountonLP) / parseFloat(wethAmountonLp);
      const archienekoPerEth = parseFloat(wethAmountonLp1) /(parseFloat(archienekoonLp1) * parseFloat("1000000000"));
      const archienekoPrice = (ethPriceUSDT * archienekoPerEth).toFixed(20);
      console.log("usdtAmount", archienekoPrice);
      setCakePrice(archienekoPrice);
    }
    fn();
  }, [])

  // const cakePriceBusdAsString = '0.000000000000000429618';
  const cakePriceBusdAsString = cakePrice;
  
  const cakePriceBusd = useMemo(() => {
    return new BigNumber(cakePriceBusdAsString)
  }, [cakePriceBusdAsString])

  return cakePriceBusd
}