import React, { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Button, Flex, Heading, IconButton, AddIcon, MinusIcon, useModal } from '@archieneko/uikit'
import { useLocation } from 'react-router-dom'
import Balance from 'components/Balance'
import { useTranslation } from 'contexts/Localization'
import { useAppDispatch } from 'state'
import { fetchStakeUserDataAsync } from 'state/stakes'
import { useLpTokenPrice } from 'state/stakes/hooks'
import { getBalanceAmount, getBalanceNumber } from 'utils/formatBalance'
import DepositModal from '../DepositModal'
import WithdrawModal from '../WithdrawModal'
import EmergencyWithdrawModal from '../EmergencyWithdrawModal'
import useUnstakeFarms from '../../hooks/useUnstakes'
import useStakeFarms from '../../hooks/useStakes'
import useEmergencyWithdrawFarms from '../../hooks/useEmergencyWithdrawFarms'

interface FarmCardActionsProps {
  stakedBalance?: BigNumber
  canHarvest?:boolean
  tokenBalance?: BigNumber
  tokenName?: string
  pid?: number
  multiplier?: string
  apr?: number
  displayApr?: string
  addLiquidityUrl?: string
  cakePrice?: BigNumber
  lpLabel?: string
}

const IconButtonWrapper = styled.div`
  display: flex;
  svg {
    width: 20px;
  }
`

const StakeAction: React.FC<FarmCardActionsProps> = ({
  stakedBalance,
  canHarvest,
  tokenBalance,
  tokenName,
  pid,
  multiplier,
  apr,
  displayApr,
  addLiquidityUrl,
  cakePrice,
  lpLabel,
}) => {
  const { t } = useTranslation()
  const { onStake } = useStakeFarms(pid)
  const { onUnstake } = useUnstakeFarms(pid)
  const { onEmergencyWithdraw } = useEmergencyWithdrawFarms(pid)
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const lpPrice = useLpTokenPrice(tokenName)
  const disabled = true
  const handleStake = async (amount: string) => {
    await onStake(amount)
    dispatch(fetchStakeUserDataAsync({ account, pids: [pid] }))
  }

  const handleUnstake = async (amount: string) => {
    await onUnstake(amount)
    dispatch(fetchStakeUserDataAsync({ account, pids: [pid] }))
  }

  const handleEmergencyWithdraw = async () => {
    await onEmergencyWithdraw()
    dispatch(fetchStakeUserDataAsync({ account, pids: [pid] }))
  }

  const displayBalance = useCallback(() => {
    const stakedBalanceBigNumber = getBalanceAmount(stakedBalance)
    if (stakedBalanceBigNumber.gt(0) && stakedBalanceBigNumber.lt(0.0000001)) {
      return '<0.0000001'
    }
    if (stakedBalanceBigNumber.gt(0)) {
      return stakedBalanceBigNumber.toFixed(3, BigNumber.ROUND_DOWN)
    }
    return stakedBalanceBigNumber.toFixed(3, BigNumber.ROUND_DOWN)
  }, [stakedBalance])

  const [onPresentDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      stakedBalance={stakedBalance}
      onConfirm={handleStake}
      tokenName={tokenName}
      multiplier={multiplier}
      lpPrice={lpPrice}
      lpLabel={lpLabel}
      apr={apr}
      displayApr={displayApr}
      addLiquidityUrl={addLiquidityUrl}
      cakePrice={cakePrice}
    />,
  )
  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={stakedBalance} onConfirm={handleUnstake} tokenName={tokenName} />,
  )

  const [onWithdraw] = useModal(
    <EmergencyWithdrawModal max={stakedBalance} onConfirm={handleEmergencyWithdraw} tokenName={tokenName} />
  )

  const renderStakingButtons = () => {
    return stakedBalance.eq(0) ? (
      // <Button
      //   onClick={onPresentDeposit}\        
      //   disabled={['history', 'archived'].some((item) => location.pathname.includes(item))}
      // >
      <Button
        onClick={onPresentDeposit}
        disabled={disabled}
      >
        {t('Stake ARCHIE')}
      </Button>
    ) : (
      <IconButtonWrapper>
        <Button width="20px" mr="24px"
        onClick={onWithdraw}
        disabled={canHarvest}
      >
        {t('E.W')}
      </Button>
        <Button width="20px" mr="24px"
        onClick={onPresentWithdraw}
        disabled={!canHarvest}
        >
          {t(' - ')}
          </Button>

          {/* <Button width="20px" mr="24px"
        onClick={onPresentDeposit}
        disabled={['history', 'archived'].some((item) => location.pathname.includes(item))}
          > */}
            <Button width="20px" mr="24px"
        onClick={onPresentDeposit}
        disabled={disabled}
          >
          {t(' + ')}
          </Button>
        {/* <IconButton variant="tertiary" onClick={onPresentWithdraw} mr="24px">
          <MinusIcon color="primary" width="14px" />
        </IconButton> */}
        {/* <IconButton
          variant="tertiary"
          onClick={onPresentDeposit}
          disabled={['history', 'archived'].some((item) => location.pathname.includes(item))}
        >
          <AddIcon color="primary" width="14px" />
        </IconButton> */}
      </IconButtonWrapper>
    )
  }

  return (
    <>
    <Flex justifyContent="center" alignItems="center">
      <Flex flexDirection="column" alignItems="flex-start">
        <Heading color={stakedBalance.eq(0) ? 'textDisabled' : 'text'}>{displayBalance()}</Heading>
        {stakedBalance.gt(0) && lpPrice.gt(0) && (
          <Balance
            fontSize="12px"
            color="textSubtle"
            decimals={2}
            value={getBalanceNumber(lpPrice.times(stakedBalance))}
            unit=" USD"
            prefix="~"
          />
        )}
      </Flex>
      
    </Flex>
    <Flex justifyContent="center" alignItems="center">
     {renderStakingButtons()}
    </Flex>
    </>
  )
}

export default StakeAction
