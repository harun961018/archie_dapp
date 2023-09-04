import { SerializedStakeConfig } from 'config/constants/types'
import fetchStake from './fetchStake'

const fetchStakes = async (stakesToFetch: SerializedStakeConfig[]) => {
  const data = await Promise.all(
    stakesToFetch.map(async (stakeConfig) => {
      const stake = await fetchStake(stakeConfig)
      const serializedStake = { ...stake, token: stake.token, quoteToken: stake.quoteToken }
      return serializedStake
    }),
  )
  return data
}

export default fetchStakes
