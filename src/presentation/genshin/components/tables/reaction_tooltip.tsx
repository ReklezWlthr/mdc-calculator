import { toPercentage } from '@src/core/utils/converter'
import { TransformativeT } from '@src/data/lib/stats/conditionals/transformative'
import { Tooltip } from '@src/presentation/components/tooltip'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'

export const ReactionTooltip = observer(({ base, mult, emBonus, dmg, name }: TransformativeT & { name: string }) => {
  const calc = base * mult * (1 + emBonus + dmg)

  const formulaString = `<b class="text-red">${_.round(
    calc
  ).toLocaleString()}</b> = <b class="text-indigo-400">${mult}</b> <i class="text-[10px]">Reaction Multiplier</i> \u{00d7} <b>${_.round(
    base
  ).toLocaleString()}</b> <i class="text-[10px]">Base DMG</i>${
    emBonus + dmg ? ` \u{00d7} (1 + <b class="text-yellow">${toPercentage(emBonus + dmg)}</b>)` : ''
  }`

  return (
    <Tooltip
      title={name}
      body={
        <div className="space-y-1">
          <p className='whitespace-nowrap' dangerouslySetInnerHTML={{ __html: formulaString }} />
          {!!emBonus && (
            <p className="text-xs">
              EM Bonus: <span className="text-desc">{toPercentage(emBonus)}</span>
            </p>
          )}
          {!!dmg && (
            <p className="text-xs">
              Reaction Bonus: <span className="text-desc">{toPercentage(dmg)}</span>
            </p>
          )}
        </div>
      }
      style="w-fit"
    >
      <p className="font-bold text-center text-red">{_.round(calc)}</p>
    </Tooltip>
  )
})
