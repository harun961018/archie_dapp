import { SerializedStake } from 'state/types'
import fetchPublicStakeData from './fetchPublicStakeData'

const fetchStake = async (stake: SerializedStake): Promise<SerializedStake> => {
  const stakePublicData = await fetchPublicStakeData(stake)

  return { ...stake, ...stakePublicData }
}

export default fetchStake
