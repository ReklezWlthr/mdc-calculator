import { StatsObject } from '../../baseConstant'
import { calcRefinement } from '../../../../../core/utils/data_format'
import { Stats } from '@src/domain/genshin/constant'

const WeaponBonus: { id: string; scaling: (base: StatsObject, refinement: number) => StatsObject }[] = [
  {
    id: '15502',
    scaling: (base, r) => {
      base.BASIC_DMG += calcRefinement(0.12, 0.03, r)
      base.CHARGE_DMG += calcRefinement(0.12, 0.03, r)
      return base
    },
  },
  {
    id: '15508',
    scaling: (base, r) => {
      base[Stats.P_HP] += calcRefinement(0.16, 0.04, r)
      return base
    },
  },
  {
    id: '11501',
    scaling: (base, r) => {
      base[Stats.P_ATK] += calcRefinement(0.2, 0.05, r)
      return base
    },
  },
  {
    id: '13507',
    scaling: (base, r) => {
      base[Stats.ALL_DMG] += calcRefinement(0.12, 0.03, r)
      return base
    },
  },
  {
    id: '15503',
    scaling: (base, r) => {
      base[Stats.EM] += calcRefinement(60, 15, r)
      return base
    },
  },
  {
    id: '14506',
    scaling: (base, r) => {
      base[Stats.HEAL] += calcRefinement(0.1, 0.025, r)
      return base
    },
  },
  {
    id: '11503',
    scaling: (base, r) => {
      base[Stats.ALL_DMG] += calcRefinement(0.1, 0.025, r)
      return base
    },
  },
  {
    id: '11510',
    scaling: (base, r) => {
      base[Stats.ELEMENTAL_DMG] += calcRefinement(0.12, 0.03, r)
      return base
    },
  },
  {
    id: '15511',
    scaling: (base, r) => {
      base[Stats.ELEMENTAL_DMG] += calcRefinement(0.12, 0.03, r)
      return base
    },
  },
  {
    id: '11511',
    scaling: (base, r) => {
      base[Stats.P_HP] += calcRefinement(0.2, 0.05, r)
      return base
    },
  },
  {
    id: '11512',
    scaling: (base, r) => {
      base[Stats.CRIT_RATE] += calcRefinement(0.04, 0.01, r)
      return base
    },
  },
  {
    id: '14504',
    scaling: (base, r) => {
      base[Stats.SHIELD] += calcRefinement(0.2, 0.05, r)
      return base
    },
  },
  {
    id: '11509',
    scaling: (base, r) => {
      base[Stats.ELEMENTAL_DMG] += calcRefinement(0.12, 0.03, r)
      return base
    },
  },
  {
    id: '15507',
    scaling: (base, r) => {
      base.SKILL_DMG += calcRefinement(0.12, 0.03, r)
      base.BURST_DMG += calcRefinement(0.12, 0.03, r)
      return base
    },
  },
  {
    id: '11505',
    scaling: (base, r) => {
      base[Stats.P_HP] += calcRefinement(0.2, 0.05, r)
      return base
    },
  },
  {
    id: '12510',
    scaling: (base, r) => {
      base[Stats.P_DEF] += calcRefinement(0.27, 0.08, r)
      return base
    },
  },
  {
    id: '14501',
    scaling: (base, r) => {
      base[Stats.ELEMENTAL_DMG] += calcRefinement(0.12, 0.03, r)
      return base
    },
  },
  {
    id: '11502',
    scaling: (base, r) => {
      base[Stats.CRIT_RATE] += calcRefinement(0.04, 0.01, r)
      return base
    },
  },
  {
    id: '15501',
    scaling: (base, r) => {
      base[Stats.CRIT_DMG] += calcRefinement(0.2, 0.05, r)
      return base
    },
  },
  {
    id: '12501',
    scaling: (base, r) => {
      base[Stats.ALL_DMG] += calcRefinement(0.08, 0.02, r)
      return base
    },
  },
  {
    id: '13502',
    scaling: (base, r) => {
      base[Stats.CRIT_RATE] += calcRefinement(0.08, 0.02, r)
      base.ATK_SPD += 0.12
      return base
    },
  },
  {
    id: '12503',
    scaling: (base, r) => {
      base[Stats.P_ATK] += calcRefinement(0.16, 0.04, r)
      return base
    },
  },
  {
    id: '13501',
    scaling: (base, r) => {
      base[Stats.P_HP] += calcRefinement(0.2, 0.05, r)
      return base
    },
  },
  {
    id: '11504',
    scaling: (base, r) => {
      base[Stats.SHIELD] += calcRefinement(0.2, 0.05, r)
      return base
    },
  },
  {
    id: '15512',
    scaling: (base, r) => {
      base.CHARGE_DMG += calcRefinement(0.16, 0.04, r)
      return base
    },
  },
  {
    id: '12504',
    scaling: (base, r) => {
      base[Stats.SHIELD] += calcRefinement(0.16, 0.04, r)
      return base
    },
  },
  {
    id: '11509',
    scaling: (base, r) => {
      base[Stats.ELEMENTAL_DMG] += calcRefinement(0.2, 0.05, r)
      return base
    },
  },
  {
    id: '15509',
    scaling: (base, r) => {
      base[Stats.P_ATK] += calcRefinement(0.2, 0.05, r)
      return base
    },
  },
  {
    id: '14514',
    scaling: (base, r) => {
      base[Stats.P_HP] += calcRefinement(0.16, 0.04, r)
      return base
    },
  },
  {
    id: '14512',
    scaling: (base, r) => {
      base.ATK_SPD += calcRefinement(0.1, 0.025, r)
      return base
    },
  },
  {
    id: '11514',
    scaling: (base, r) => {
      base[Stats.P_DEF] += calcRefinement(0.2, 0.05, r)
      base.BASIC_DMG += calcRefinement(0.16, 0.04, r)
      base.SKILL_DMG += calcRefinement(0.24, 0.06, r)
      return base
    },
  },
  {
    id: '12512',
    scaling: (base, r) => {
      base[Stats.P_ATK] += calcRefinement(0.2, 0.05, r)
      return base
    },
  },
  {
    id: '13504',
    scaling: (base, r) => {
      base[Stats.SHIELD] += calcRefinement(0.2, 0.05, r)
      return base
    },
  },
  {
    id: '12502',
    scaling: (base, r) => {
      base[Stats.P_ATK] += calcRefinement(0.2, 0.05, r)
      return base
    },
  },
  {
    id: '12426',
    scaling: (base, r) => {
      base[Stats.P_ATK] += calcRefinement(0.12, 0.03, r)
      return base
    },
  },
  {
    id: '13301',
    scaling: (base, r) => {
      base.BASIC_DMG += calcRefinement(0.24, 0.06, r)
      return base
    },
  },
  {
    id: '11424',
    scaling: (base, r) => {
      base.SKILL_DMG += calcRefinement(0.16, 0.04, r)
      base.BURST_DMG += calcRefinement(0.16, 0.04, r)
      return base
    },
  },
  {
    id: '15402',
    scaling: (base, r) => {
      base.SKILL_DMG += calcRefinement(0.24, 0.06, r)
      base.BURST_DMG += calcRefinement(0.24, 0.06, r)
      return base
    },
  },
  {
    id: '11409',
    scaling: (base, r) => {
      base.BASIC_DMG += calcRefinement(0.2, 0.05, r)
      base.CHARGE_DMG += calcRefinement(0.2, 0.05, r)
      return base
    },
  },
  {
    id: '15405',
    scaling: (base, r) => {
      base.BASIC_DMG += calcRefinement(0.4, 0.1, r)
      base.CHARGE_DMG -= 0.1
      return base
    },
  },
  {
    id: '12412',
    scaling: (base, r) => {
      base.BURST_DMG += calcRefinement(0.12, 0.03, r)
      return base
    },
  },
  {
    id: '13414',
    scaling: (base, r) => {
      base.SKILL_DMG += calcRefinement(0.06, 0.015, r)
      return base
    },
  },
  {
    id: '12414',
    scaling: (base, r) => {
      base.SKILL_DMG += calcRefinement(0.06, 0.015, r)
      return base
    },
  },
  {
    id: '15414',
    scaling: (base, r) => {
      base.BASIC_DMG += calcRefinement(0.16, 0.04, r)
      base.CHARGE_DMG -= calcRefinement(0.16, 0.04, r)
      return base
    },
  },
  {
    id: '11426',
    scaling: (base, r) => {
      base.SKILL_CR += calcRefinement(0.08, 0.02, r)
      return base
    },
  },
  {
    id: '11413',
    scaling: (base, r) => {
      base.SKILL_DMG += calcRefinement(0.16, 0.04, r)
      base.SKILL_CR += calcRefinement(0.06, 0.015, r)
      return base
    },
  },
  {
    id: '13415',
    scaling: (base, r) => {
      base.BURST_DMG += calcRefinement(0.4, 0.1, r)
      base.BURST_CR += calcRefinement(0.06, 0.015, r)
      return base
    },
  },
]

export default WeaponBonus