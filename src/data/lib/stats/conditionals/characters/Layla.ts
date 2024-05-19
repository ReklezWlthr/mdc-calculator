import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/genshin/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/genshin/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Layla = (c: number, a: number, t: ITalentLevel) => {
  const upgrade = {
    normal: false,
    skill: c >= 3,
    burst: c >= 5,
  }
  const normal = t.normal + (upgrade.normal ? 3 : 0)
  const skill = t.skill + (upgrade.skill ? 3 : 0)
  const burst = t.burst + (upgrade.burst ? 3 : 0)

  const talents: ITalent = {
    normal: {
      title: `Sword of the Radiant Path`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 3 rapid strikes.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina to unleash 2 rapid sword strikes.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.
      `,
    },
    skill: {
      title: `Nights of Formal Focus`,
      content: `Puts forth a shield known as the Curtain of Slumber, dealing <b class="text-genshin-cryo">AoE Cryo DMG</b>.
      <br />The Curtain of Slumber's DMG Absorption is based on Layla's Max HP and absorbs <b class="text-genshin-cryo">Cryo DMG</b> with 250% effectiveness. When the shield is deployed, Layla will have <b class="text-genshin-cryo">Cryo</b> applied to her briefly.
      <br />
      <br /><b>Night Stars and Shooting Stars</b>
      <br />While the Curtain of Slumber is active, it will create <span class="text-desc">1</span> Night Star that will be attached to it every <span class="text-desc">1.5</span>s. When a character protected by this shield uses an Elemental Skill, <span class="text-desc">2</span> Night Stars will be created. Night Stars can be created once every <span class="text-desc">0.3</span>s in this way. A maximum of <span class="text-desc">4</span> Night Stars can be accumulated at any one time.
      <br />Once the Curtain of Slumber has accumulated <span class="text-desc">4</span> Night Stars and there are opponents nearby, these Night Stars will transform into homing Shooting Stars that will be fired off in sequence, dealing <b class="text-genshin-cryo">Cryo DMG</b> to any opponents hit.
      <br />If the Curtain of Slumber's duration ends or it is destroyed, the Night Stars will disappear. If they are already being fired off as Shooting Stars, these Shooting Stars will last until this wave of shots ends.
      <br />
      <br />New Night Stars cannot be created until the previous wave of Shooting Stars has been fired completely.
      `,
    },
    burst: {
      title: `Dream of the Star-Stream Shaker	`,
      content: `Unleashes a Celestial Dreamsphere that constantly fires Starlight Slugs at opponents within its AoE, dealing <b class="text-genshin-cryo">Cryo DMG</b>.
      <br />When a Starlight Slug hits, it will generate <span class="text-desc">1</span> Night Star for nearby Curtains of Slumber. Each Curtain of Slumber can gain <span class="text-desc">1</span> Night Star this way every <span class="text-desc">0.5</span>s.`,
    },
    a1: {
      title: `A1: Like Nascent Light`,
      content: `While the Curtain of Slumber is active, the Deep Sleep effect will activate each time the Curtain gains <span class="text-desc">1</span> Night Star:
      <br />- The Shield Strength of a character under the effect of the Curtain of Slumber increases by <span class="text-desc">6%</span>.
      <br />- This effect can have a maximum of <span class="text-desc">4</span> stacks and persists until the Curtain of Slumber disappears.`,
    },
    a4: {
      title: `A4: Sweet Slumber Undisturbed`,
      content: `The DMG dealt by the Shooting Stars fired by Nights of Formal Focus is increased by <span class="text-desc">1.5%</span> of Layla's Max HP.`,
    },
    util: {
      title: `Shadowy Dream-Signs`,
      content: `When Layla crafts Character Talent Materials, she has a <span class="text-desc">10%</span> chance to receive double the product.`,
    },
    c1: {
      title: `C1: Fortress of Fantasy`,
      content: `The Shield Absorption of the Curtain of Slumber generated by Nights of Formal Focus is increased by <span class="text-desc">20%</span>.
      <br />Additionally, when unleashing Nights of Formal Focus, she will generate a shield for any nearby party members who are not being protected by a Curtain of Slumber. This shield will have <span class="text-desc">35%</span> of the absorption of a Curtain of Slumber, will last for <span class="text-desc">12</span>s, and will absorb <b class="text-genshin-cryo">Cryo DMG</b> with <span class="text-desc">250%</span> effectiveness.`,
    },
    c2: {
      title: `C2: Light's Remit`,
      content: `When Shooting Stars from Nights of Formal Focus strike opponents, they will each restore <span class="text-desc">1</span> Energy to Layla. Each Shooting Star can restore Energy to her in this manner once.`,
    },
    c3: {
      title: `C3: Secrets of the Night`,
      content: `Increases the Level of Nights of Formal Focus by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      title: `C4: Starry Illumination`,
      content: `When Nights of Formal Focus starts to fire off Shooting Stars, it will grant all nearby party members the Dawn Star effect, causing their Normal and Charged Attack DMG to increase based on <span class="text-desc">5%</span> of Layla's Max HP.
      <br />Dawn Star can last up to <span class="text-desc">3</span>s and will be removed <span class="text-desc">0.05</span>s after dealing Normal or Charged Attack DMG.`,
    },
    c5: {
      title: `C5: Stream of Consciousness`,
      content: `Increases the Level of Dream of the Star-Stream Shaker by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      title: `C6: Radiant Soulfire`,
      content: `Shooting Stars from Nights of Formal Focus deal <span class="text-desc">40%</span> increased DMG, and Starlight Slugs from Dream of the Star-Stream Shaker deal <span class="text-desc">40%</span> increased DMG.
      <br />Additionally, the interval between the creation of Night Stars via Nights of Formal Focus is decreased by <span class="text-desc">20%</span>.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'number',
      id: 'layla_a1',
      text: `A1 Night Star Shield Strength`,
      ...talents.a1,
      show: a >= 1,
      default: 4,
      min: 0,
      max: 4,
    },
    {
      type: 'toggle',
      id: 'layla_c4',
      text: `Dawn Star`,
      ...talents.c4,
      show: c >= 4,
      default: true,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'layla_c4')]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)
      base.MAX_ENERGY = 60

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.5122, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.4848, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.7297, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack DMG [1]',
          value: [{ scaling: calcScaling(0.4773, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
        {
          name: 'Charged Attack DMG [2]',
          value: [{ scaling: calcScaling(0.5255, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('base', normal)

      const a4Dmg = a >= 4 ? [{ scaling: 0.015, multiplier: Stats.HP }] : []
      base.SKILL_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(0.128, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Shooting Star DMG',
          value: [{ scaling: calcScaling(0.1472, skill, 'elemental', '1'), multiplier: Stats.ATK }, ...a4Dmg],
          element: Element.CRYO,
          property: TalentProperty.SKILL,
          bonus: c >= 6 ? 0.4 : 0,
        },
        {
          name: 'Curtain of Slumber Shield',
          value: [{ scaling: calcScaling(0.108, skill, 'elemental', '1'), multiplier: Stats.HP }],
          flat: calcScaling(1040, skill, 'special', 'flat'),
          element: TalentProperty.SHIELD,
          property: TalentProperty.SHIELD,
          bonus: c >= 1 ? 0.2 : 0,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Starlight Slug DMG',
          value: [{ scaling: calcScaling(0.0465, burst, 'elemental', '1'), multiplier: Stats.HP }],
          element: Element.CRYO,
          property: TalentProperty.BURST,
          bonus: c >= 6 ? 0.4 : 0,
        },
      ]

      if (form.layla_a1) base[Stats.SHIELD] += 0.06 * form.layla_a1
      if (c >= 2)
        base.SKILL_SCALING.push({
          name: 'Allied Curtain of Slumber Shield',
          value: [{ scaling: calcScaling(0.108, skill, 'elemental', '1') * 0.35, multiplier: Stats.HP }],
          flat: calcScaling(1040, skill, 'special', 'flat') * 0.35,
          element: TalentProperty.SHIELD,
          property: TalentProperty.SHIELD,
          bonus: 0.2,
        })
      if (form.kuki_c6) base[Stats.EM] += 125

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.layla_c4) {
        base.BASIC_SCALING = _.map(base.BASIC_SCALING, (item) => ({
          ...item,
          value: [...item.value, { scaling: 0.05, multiplier: Stats.HP, override: own.getHP() }],
        }))
        base.CHARGE_SCALING = _.map(base.CHARGE_SCALING, (item) => ({
          ...item,
          value: [...item.value, { scaling: 0.05, multiplier: Stats.HP, override: own.getHP() }],
        }))
      }

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      if (form.layla_c4) {
        base.BASIC_SCALING = _.map(base.BASIC_SCALING, (item) => ({
          ...item,
          value: [...item.value, { scaling: 0.05, multiplier: Stats.HP }],
        }))
        base.CHARGE_SCALING = _.map(base.CHARGE_SCALING, (item) => ({
          ...item,
          value: [...item.value, { scaling: 0.05, multiplier: Stats.HP }],
        }))
      }

      return base
    },
  }
}

export default Layla
