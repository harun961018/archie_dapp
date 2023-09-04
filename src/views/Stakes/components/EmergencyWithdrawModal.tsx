import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import { Button, Modal, Text } from '@archieneko/uikit'
import { ModalActions } from 'components/Modal'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance } from 'utils/formatBalance'
import useToast from 'hooks/useToast'

interface EmergencyWithdrawModalProps {
  max: BigNumber
  onConfirm: () => void
  onDismiss?: () => void
  tokenName?: string
}

const EmergencyWithdrawModal: React.FC<EmergencyWithdrawModalProps> = ({ onConfirm, onDismiss, max, tokenName = '' }) => {
  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const { t } = useTranslation()

  return (
    <Modal title={t('Emergency Withdrawal ArchieNeko tokens')} onDismiss={onDismiss}>
      <Text color="red" textAlign="center">
          {t(
            'E.W is only needed for early withdrawal before staking period is finished',
          )}
        </Text>
        <Text color="red" textAlign="center">
          {t(
            'If staking period is over, you do not need to E.W',
          )}
        </Text>
      <ModalActions>
        <Button variant="secondary" onClick={onDismiss} width="100%" disabled={pendingTx}>
          {t('Cancel')}
        </Button>
        <Button
          disabled={pendingTx}
          onClick={async () => {
            setPendingTx(true)
            try {
              await onConfirm()
              toastSuccess(t('Unstaked!'), t('You have not get earning because you did emergencywithdraw'))
              onDismiss()
            } catch (e) {
              toastError(
                t('Error'),
                t('Please try again. Confirm the transaction and make sure you are paying enough gas!'),
              )
              console.error(e)
            } finally {
              setPendingTx(false)
            }
          }}
          width="100%"
        >
          {pendingTx ? t('Confirming') : t('Confirm')}
        </Button>
      </ModalActions>
    </Modal>
  )
}

export default EmergencyWithdrawModal
