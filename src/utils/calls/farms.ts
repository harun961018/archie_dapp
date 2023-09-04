import BigNumber from 'bignumber.js'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL, ARCHIE_TOKEN_DECIMAL } from 'config'
import getGasPrice from 'utils/getGasPrice'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

export const stakeFarm = async (masterChefContract, pid, amount) => {
  const gasPrice = getGasPrice()
  const value = new BigNumber(amount).times(ARCHIE_TOKEN_DECIMAL).toString()
  console.log("stake valance", value)
  if (pid === 0) {
    // const tx = await masterChefContract.enterStaking(value, { ...options, gasPrice })
    const tx = await masterChefContract.enterStaking(value, { ...options, gasPrice })
    const receipt = await tx.wait()
    return receipt.status
  }

  const referer = '0x0000000000000000000000000000000000000000'

  // const tx = await masterChefContract.deposit(pid, value, referer, { ...options, gasPrice })
  const tx = await masterChefContract.deposit(pid, value, referer)
  const receipt = await tx.wait()
  return receipt.status
}

export const unstakeFarm = async (masterChefContract, pid, amount) => {
  const gasPrice = getGasPrice()
  const value = new BigNumber(amount).times(ARCHIE_TOKEN_DECIMAL).toString()
  if (pid === 0) {
    const tx = await masterChefContract.leaveStaking(value, { ...options, gasPrice })
    const receipt = await tx.wait()
    return receipt.status
  }

  const tx = await masterChefContract.withdraw(pid, value)
  const receipt = await tx.wait()
  return receipt.status
}

export const emergencyWithdrawFarm = async (masterChefContract, pid) => {
  const gasPrice = getGasPrice()
  const value = new BigNumber(0).times(ARCHIE_TOKEN_DECIMAL).toString()
  if (pid === 0) {
    const tx = await masterChefContract.leaveStaking(value, { ...options, gasPrice })
    const receipt = await tx.wait()
    return receipt.status
  }

  const tx = await masterChefContract.emergencyWithdaw(pid)
  const receipt = await tx.wait()
  return receipt.status
}

export const harvestFarm = async (masterChefContract, pid) => {
  const gasPrice = getGasPrice()
  if (pid === 0) {
    const tx = await masterChefContract.leaveStaking('0', { ...options, gasPrice })
    const receipt = await tx.wait()
    return receipt.status
  }

  const referer = '0x0000000000000000000000000000000000000000'
  const tx = await masterChefContract.deposit(pid, '0', referer)
  const receipt = await tx.wait()
  return receipt.status
}
