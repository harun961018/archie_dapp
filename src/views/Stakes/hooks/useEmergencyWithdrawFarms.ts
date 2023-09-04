import { useCallback } from 'react'
import { emergencyWithdrawFarm } from 'utils/calls'
import { useMasterchef } from 'hooks/useContract'

const useEmergencyWithdrawFarms = (pid: number) => {
  console.log("step1", pid);
  const masterChefContract = useMasterchef()

  const handleEmergencyWithdraw = useCallback(
    async () => {
      await emergencyWithdrawFarm(masterChefContract, pid)
    },
    [masterChefContract, pid],
  )

  return { onEmergencyWithdraw: handleEmergencyWithdraw }
}

export default useEmergencyWithdrawFarms
