import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'Archieneko',
  description:
    'The most popular AMM on BSC by user count! Earn CAKE through yield farming or win it in the Lottery, then stake it in Syrup Pools to earn more tokens! Initial Farm Offerings (new token launch model pioneered by PancakeSwap), NFTs, and more, on a platform you can trust.',
  image: 'https://pancakeswap.finance/images/hero.png',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  let basePath
  if (path.startsWith('/swap')) {
    basePath = '/swap'
  } else if (path.startsWith('/add')) {
    basePath = '/add'
  } else if (path.startsWith('/remove')) {
    basePath = '/remove'
  } else if (path.startsWith('/teams')) {
    basePath = '/teams'
  } else if (path.startsWith('/voting/proposal') && path !== '/voting/proposal/create') {
    basePath = '/voting/proposal'
  } else if (path.startsWith('/nfts/collections')) {
    basePath = '/nfts/collections'
  } else if (path.startsWith('/nfts/profile')) {
    basePath = '/nfts/profile'
  } else if (path.startsWith('/pancake-squad')) {
    basePath = '/pancake-squad'
  } else {
    basePath = path
  }

  switch (basePath) {
    case '/':
      return {
        title: `${t('Home')} | ${t('Archieneko')}`,
      }
    case '/swap':
      return {
        title: `${t('Exchange')} | ${t('Archieneko')}`,
      }
    case '/add':
      return {
        title: `${t('Add Liquidity')} | ${t('Archieneko')}`,
      }
    case '/remove':
      return {
        title: `${t('Remove Liquidity')} | ${t('Archieneko')}`,
      }
    case '/liquidity':
      return {
        title: `${t('Liquidity')} | ${t('Archieneko')}`,
      }
    case '/find':
      return {
        title: `${t('Import Pool')} | ${t('Archieneko')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('Archieneko')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('Archieneko')}`,
      }
    case '/prediction/leaderboard':
      return {
        title: `${t('Leaderboard')} | ${t('Archieneko')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('Archieneko')}`,
      }
    case '/farms/auction':
      return {
        title: `${t('Farm Auctions')} | ${t('Archieneko')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('Archieneko')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('Archieneko')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('Archieneko')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('Archieneko')}`,
      }
    case '/voting':
      return {
        title: `${t('Voting')} | ${t('Archieneko')}`,
      }
    case '/voting/proposal':
      return {
        title: `${t('Proposals')} | ${t('Archieneko')}`,
      }
    case '/voting/proposal/create':
      return {
        title: `${t('Make a Proposal')} | ${t('Archieneko')}`,
      }
    case '/info':
      return {
        title: `${t('Overview')} | ${t('Archieneko Info & Analytics')}`,
        description: 'View statistics for Archieneko exchanges.',
      }
    case '/info/pools':
      return {
        title: `${t('Pools')} | ${t('Archieneko Info & Analytics')}`,
        description: 'View statistics for Archieneko exchanges.',
      }
    case '/info/tokens':
      return {
        title: `${t('Tokens')} | ${t('Archieneko Info & Analytics')}`,
        description: 'View statistics for Archieneko exchanges.',
      }
    case '/nfts':
      return {
        title: `${t('Overview')} | ${t('Archieneko')}`,
      }
    case '/nfts/collections':
      return {
        title: `${t('Collections')} | ${t('Archieneko')}`,
      }
    case '/nfts/profile':
      return {
        title: `${t('Your Profile')} | ${t('Archieneko')}`,
      }
    case '/pancake-squad':
      return {
        title: `${t('Pancake Squad')} | ${t('Archieneko')}`,
      }
    default:
      return null
  }
}
