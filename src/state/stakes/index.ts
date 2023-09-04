import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import stakesConfig from 'config/constants/stakes'
import isArchivedPid from 'utils/stakeHelpers'
import priceHelperLpsConfig from 'config/constants/priceHelperLps'
import fetchStakes from './fetchStakes'
import fetchStakesPrices from './fetchStakesPrices'
import {
  fetchStakeUserEarnings,
  fetchStakeUserAllowances,
  fetchStakeUserTokenBalances,
  fetchStakeUserStakedBalances,
  fetchStakeUserCanhavest,
} from './fetchStakeUser'
import { SerializedStakesState, SerializedStake } from '../types'

const noAccountStakeConfig = stakesConfig.map((stake) => ({
  ...stake,
  userData: {
    allowance: '0',
    tokenBalance: '0',
    stakedBalance: '0',
    earnings: '0',
    canHarvest: true,
  },
}))

const initialState: SerializedStakesState = {
  data: noAccountStakeConfig,
  loadArchivedStakesData: false,
  userDataLoaded: false,
}

export const nonArchivedStakes = stakesConfig.filter(({ pid }) => !isArchivedPid(pid))

// Async thunks
export const fetchStakesPublicDataAsync = createAsyncThunk<SerializedStake[], number[]>(
  'stakes/fetchStakesPublicDataAsync',
  async (pids) => {
    const stakesToFetch = stakesConfig.filter((stakeConfig) => pids.includes(stakeConfig.pid))

    // Add price helper stakes
    // const farmsWithPriceHelpers = stakesToFetch.concat(priceHelperLpsConfig)
    const stakesWithPriceHelpers = stakesToFetch

    const stakes = await fetchStakes(stakesWithPriceHelpers)
    const stakesWithPrices = await fetchStakesPrices(stakes)

    // Filter out price helper LP config stakes
    const stakesWithoutHelperLps = stakesWithPrices.filter((stake: SerializedStake) => {
      return stake.pid || stake.pid === 0
    })

    return stakesWithoutHelperLps
  },
)

interface StakeUserDataResponse {
  pid: number
  allowance: string
  tokenBalance: string
  stakedBalance: string
  earnings: string
  canHarvest: boolean
}

export const fetchStakeUserDataAsync = createAsyncThunk<StakeUserDataResponse[], { account: string; pids: number[]}>(
  'stakes/fetchStakeUserDataAsync',
  async ({ account, pids }) => {
    const stakesToFetch = stakesConfig.filter((stakeConfig) => pids.includes(stakeConfig.pid))
    const userStakeAllowances = await fetchStakeUserAllowances(account, stakesToFetch)
    const userStakeTokenBalances = await fetchStakeUserTokenBalances(account, stakesToFetch)
    const userStakedBalances = await fetchStakeUserStakedBalances(account, stakesToFetch)
    const userStakeEarnings = await fetchStakeUserEarnings(account, stakesToFetch)
    const userCanHarvest = await fetchStakeUserCanhavest(account, stakesToFetch)
    return userStakeAllowances.map((stakeAllowance, index) => {
      return {
        pid: stakesToFetch[index].pid,
        allowance: userStakeAllowances[index],
        tokenBalance: userStakeTokenBalances[index],
        stakedBalance: userStakedBalances[index],
        earnings: userStakeEarnings[index],
        canHarvest: userCanHarvest[index],
      }
    })
  },
)

export const stakesSlice = createSlice({
  name: 'Stakes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Update stakes with live data
    builder.addCase(fetchStakesPublicDataAsync.fulfilled, (state, action) => {
      state.data = state.data.map((stake) => {
        const liveStakeData = action.payload.find((stakeData) => stakeData.pid === stake.pid)
        return { ...stake, ...liveStakeData }
      })
    })

    // Update stakes with user data
    builder.addCase(fetchStakeUserDataAsync.fulfilled, (state, action) => {
      action.payload.forEach((userDataEl) => {
        const { pid } = userDataEl
        const index = state.data.findIndex((stake) => stake.pid === pid)
        state.data[index] = { ...state.data[index], userData: userDataEl }
      })
      state.userDataLoaded = true
    })
  },
})

export default stakesSlice.reducer
