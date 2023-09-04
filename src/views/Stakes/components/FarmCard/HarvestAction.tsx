import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import { Button, Flex, Heading } from '@archieneko/uikit'
import { useTranslation } from 'contexts/Localization'
import { useAppDispatch } from 'state'
import { fetchStakeUserDataAsync } from 'state/stakes'
import useToast from 'hooks/useToast'
import { getBalanceAmount } from 'utils/formatBalance'
import { BIG_ZERO } from 'utils/bigNumber'
import { useWeb3React } from '@web3-react/core'
import { usePriceCakeBusd } from 'state/stakes/hooks'
import Balance from 'components/Balance'
import useHarvestFarm from '../../hooks/useHarvestStake'

interface FarmCardActionsProps {
  canHarvest?:boolean
  earnings?: BigNumber
  pid?: number
}

const HarvestAction: React.FC<FarmCardActionsProps> = ({ canHarvest, earnings, pid }) => {
  const { account } = useWeb3React()
  const { toastSuccess, toastError } = useToast()
  const { t } = useTranslation()
  const [pendingTx, setPendingTx] = useState(false)
  const { onReward } = useHarvestFarm(pid)
  const cakePrice = usePriceCakeBusd()
  const dispatch = useAppDispatch()
  const rawEarningsBalance = account ? getBalanceAmount(earnings) : BIG_ZERO
  const displayBalance = rawEarningsBalance.toFixed(3, BigNumber.ROUND_DOWN)
  const earningsBusd = rawEarningsBalance ? rawEarningsBalance.multipliedBy(cakePrice).toNumber() : 0
  
  return (
    <>
    <Flex mb="8px" justifyContent="center" alignItems="center">
      <Flex flexDirection="column" alignItems="flex-start">
        <Heading color={rawEarningsBalance.eq(0) ? 'textDisabled' : 'text'}>{displayBalance}</Heading>
        {/* {earningsBusd > 0 && (
          <Balance fontSize="12px" color="textSubtle" decimals={2} value={earningsBusd} unit=" USD" prefix="~" />
        )} */}
      </Flex>     
    </Flex>
    <Flex mb="8px" justifyContent="center" alignItems="center">
    <Button 
    disabled={rawEarningsBalance.eq(0) || pendingTx || !canHarvest}
    onClick={async () => {
      setPendingTx(true)
      try {
        await onReward()
        toastSuccess(
          `${t('Harvested')}!`,
          t('Your %symbol% earnings have been sent to your wallet!', { symbol: 'ARCHIE' }),
        )
      } catch (e) {
        toastError(
          t('Error'),
          t('Please try again. Confirm the transaction and make sure you are paying enough gas!'),
        )
        console.error(e)
      } finally {
        setPendingTx(false)
      }
      dispatch(fetchStakeUserDataAsync({ account, pids: [pid] }))
    }}
  >
    {pendingTx ? t('Harvesting') : t('Harvest')}
  </Button>
    </Flex>
    
  </>
  )
}

export default HarvestAction