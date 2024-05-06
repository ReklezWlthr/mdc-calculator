import _ from 'lodash'
import { Weapons } from '@src/data/db/weapons'
import { useStore } from '@src/data/providers/app_store_provider'
import { observer } from 'mobx-react-lite'
import { TextInput } from '@src/presentation/components/inputs/text_input'
import { useParams } from '@src/core/hooks/useParams'
import { useMemo } from 'react'
import { RarityGauge } from '@src/presentation/components/rarity_gauge'
import { StatIcons, Stats } from '@src/domain/genshin/constant'
import classNames from 'classnames'

interface WeaponModalProps {
  index: number
}

export const WeaponModal = observer(({ index }: WeaponModalProps) => {
  const { teamStore, modalStore } = useStore()
  const { setParams, params } = useParams({
    searchWord: '',
    stat: [],
  })

  const filteredWeapon = useMemo(
    () =>
      _.filter(
        Weapons.sort((a, b) => a.name.localeCompare(b.name)),
        (item) => {
          const regex = new RegExp(params.searchWord, 'i')
          const nameMatch = item.name.match(regex)
          const typeMatch = teamStore.characters[index]?.data?.weapon === item.type
          const statMatch = _.size(params.stat) ? _.includes(params.stat, item.ascStat) : true

          return nameMatch && typeMatch && statMatch
        }
      ),
    [params]
  )

  const FilterIcon = ({ stat }: { stat: Stats }) => {
    const checked = _.includes(params.stat, stat)
    return (
      <div
        className={classNames('w-8 h-8 duration-200 rounded-full cursor-pointer hover:bg-primary-lighter', {
          'bg-primary-light': checked,
        })}
        onClick={() => setParams({ stat: checked ? _.without(params.stat, stat) : [...params.stat, stat] })}
        title={stat}
      >
        <img src={`/icons/${StatIcons[stat]}`} className="p-1" />
      </div>
    )
  }

  return (
    <div className="w-[85vw] p-4 text-white rounded-xl bg-primary-dark space-y-3 font-semibold">
      <div className="flex items-center gap-6">
        <p className="shrink-0">Select a Weapon</p>
        <div className="w-1/3">
          <TextInput
            onChange={(value) => setParams({ searchWord: value })}
            value={params.searchWord}
            placeholder="Search Weapon Name"
          />
        </div>
        <div className="flex gap-2">
          <FilterIcon stat={Stats.P_HP} />
          <FilterIcon stat={Stats.P_ATK} />
          <FilterIcon stat={Stats.P_DEF} />
          <FilterIcon stat={Stats.EM} />
          <FilterIcon stat={Stats.ER} />
          <FilterIcon stat={Stats.CRIT_RATE} />
          <FilterIcon stat={Stats.CRIT_DMG} />
          <FilterIcon stat={Stats.PHYSICAL_DMG} />
        </div>
      </div>
      <div className="grid w-full grid-cols-9 gap-4">
        {_.map(filteredWeapon, (item) => (
          <div
            className="text-xs duration-200 border rounded-lg cursor-pointer bg-primary border-primary-border hover:scale-105"
            onClick={() => {
              teamStore.setWeapon(index, { data: item })
              if (item.name === 'Kagotsurube Isshin') teamStore.setWeapon(index, { refinement: 1 })
              modalStore.closeModal()
            }}
            key={item.name}
          >
            <div className="relative">
              <img
                src={`/icons/${StatIcons[item.ascStat]}`}
                className="absolute p-1 rounded-full w-7 h-7 top-2 left-2 bg-primary"
                title={item.ascStat}
              />
              <div className="absolute bg-primary-darker py-0.5 px-1.5 rounded-full right-1 bottom-0.5">
                <RarityGauge rarity={item.rarity} />
              </div>
              <img
                src={`https://enka.network/ui/${item.icon || 'UI_EquipIcon_Sword_Blunt'}.png`}
                className="object-contain rounded-t-lg bg-primary-darker aspect-square"
              />
            </div>
            <p className="flex justify-center w-full px-2 py-1 text-center line-clamp-2">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
})
