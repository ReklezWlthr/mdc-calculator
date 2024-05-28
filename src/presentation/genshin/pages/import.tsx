import classNames from 'classnames'
import _ from 'lodash'
import { useLocalUpdater } from '@src/core/hooks/useLocalUpdater'
import { toLocalStructure } from '@src/core/utils/converter'
import { useGetGenshinData } from '@src/data/api/genshin'
import { useStore } from '@src/data/providers/app_store_provider'
import { CommonModal } from '@src/presentation/components/common_modal'
import { TextInput } from '@src/presentation/components/inputs/text_input'
import { PrimaryButton } from '@src/presentation/components/primary.button'
import { observer } from 'mobx-react-lite'
import { useCallback, useEffect, useState } from 'react'
import { IArtifactEquip, ITeamChar, TravelerIconName, WeaponIcon } from '@src/domain/genshin/constant'
import { findCharacter } from '@src/core/utils/finder'
import { CharacterSelect } from '../components/character_select'
import { CharacterBlock } from '../components/character_block'
import { TalentIcon } from '../components/tables/scaling_wrapper'
import ConditionalsObject from '@src/data/lib/stats/conditionals/conditionals'
import { StatBlock } from '../components/stat_block'
import { calculateFinal, calculateOutOfCombat } from '@src/core/utils/calculator'
import { baseStatsObject } from '@src/data/lib/stats/baseConstant'
import { ArtifactBlock } from '../components/artifact_block'
import { WeaponBlock } from '../components/weapon_block'
import { SetToolTip } from './team_setup'
import { getSetCount } from '@src/core/utils/data_format'

export const ImportExport = observer(() => {
  const { modalStore, settingStore } = useStore()

  const { data, updateData } = useLocalUpdater('genshin')

  const [selected, setSelected] = useState(0)
  const [uid, setUid] = useState('')
  const [importedData, setImportedData] = useState<{
    charData: ITeamChar[]
    artifactData: IArtifactEquip[]
  }>({ charData: [], artifactData: [] })
  const { charData, artifactData } = importedData
  const { data: accountData, refetch, isFetching, isStale } = useGetGenshinData(uid, { enabled: false })

  useEffect(() => {
    if (accountData) {
      setImportedData(toLocalStructure(accountData))
      setSelected(0)
    }
  }, [accountData])

  const char = charData[selected]
  const selectedCharData = findCharacter(char?.cId)
  const talent = _.find(ConditionalsObject, ['id', char?.cId])?.conditionals(
    char?.cons,
    char?.ascension,
    char?.talents,
    []
  )
  const equippedArtifacts = _.filter(artifactData, (item) => _.includes(char?.equipments?.artifacts, item.id))
  const raw = calculateOutOfCombat(_.cloneDeep(baseStatsObject), selected, charData, equippedArtifacts, false)
  const stats = calculateFinal(raw)
  const set = getSetCount(equippedArtifacts)
  const iconCodeName =
    selectedCharData?.codeName === 'Player' ? TravelerIconName[selectedCharData.element] : selectedCharData?.codeName

  const saveFile = async (blob: Blob, suggestedName: string) => {
    const blobURL = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobURL
    a.download = suggestedName
    a.style.display = 'none'
    document.body.append(a)
    a.click()
    // Revoke the blob URL and remove the element.
    setTimeout(() => {
      URL.revokeObjectURL(blobURL)
      a.remove()
    }, 1000)
  }

  const onOpenConfirmModal = useCallback((char: number, build: number, artifact: number, onConfirm: () => void) => {
    modalStore.openModal(
      <CommonModal
        icon="fa-solid fa-circle-question text-yellow"
        title="Overwrite Data?"
        desc={`The file contains ${char} characters, ${build} builds and ${artifact} artifacts. Are you sure you want to overwrite the current data with this?`}
        onConfirm={onConfirm}
      />
    )
  }, [])

  return (
    <div className="flex flex-col w-full gap-5 p-5 overflow-y-auto text-white">
      <div className="flex gap-5">
        <div className="w-1/4 space-y-2">
          <div className="font-bold">Method 1: File</div>
          <div className="flex gap-x-2">
            <PrimaryButton
              title="Import from File"
              onClick={() => {
                document.getElementById('importer').click()
              }}
            />
            <PrimaryButton
              title="Export to File"
              onClick={() => {
                const blob = new Blob([data], { type: 'text/json;charset=utf-8' })
                saveFile(blob, 'export.json')
              }}
            />
          </div>

          <input
            id="importer"
            className="hidden"
            type="file"
            multiple={false}
            onChange={(event) => {
              const file = event.target.files[0]
              const reader = new FileReader()
              reader.addEventListener('load', (event) => {
                const data = JSON.parse(event.target.result.toString())
                onOpenConfirmModal(data?.characters?.length, data?.builds?.length, data?.artifacts?.length, () => {
                  localStorage.setItem(`genshin_local_storage`, event.target.result.toString())
                  updateData(event.target.result.toString())
                })
              })
              reader.readAsText(file)
            }}
          />
        </div>
        <div className="w-1/4 space-y-2">
          <div className="font-bold">Method 2: UID</div>
          <div className="flex gap-2">
            <TextInput value={uid} onChange={(v) => setUid(v)} placeholder="Enter Your UID" />
            <PrimaryButton
              title="Submit"
              onClick={async () => {
                if (uid && isStale) refetch()
              }}
              disabled={!isStale}
              loading={isFetching}
            />
          </div>
        </div>
      </div>
      <p className="flex justify-center gap-2 mb-1 text-2xl font-bold">
        <span className="text-desc">✦</span> Character Data <span className="text-desc">✦</span>
      </p>
      {_.size(charData) ? (
        <>
          <div className="flex items-center justify-between px-3">
            <div className="flex justify-center w-full gap-4">
              {_.map(charData, (item, index) => {
                const x = findCharacter(item.cId)?.codeName
                const y = x === 'Player' ? settingStore.settings.travelerGender : x
                return (
                  <CharacterSelect
                    key={`char_select_${index}`}
                    onClick={() => setSelected(index)}
                    isSelected={index === selected}
                    codeName={y}
                  />
                )
              })}
            </div>
            <PrimaryButton title="Import Character" onClick={() => null} style="shrink-0" />
          </div>
          <div className="flex justify-center w-full gap-5">
            <div className="w-1/3">
              <CharacterBlock index={selected} override={charData} disabled />
              {_.size(charData) ? (
                <div className="flex items-center justify-center gap-6 py-3">
                  <div className="relative">
                    <TalentIcon
                      talent={talent?.talents?.normal}
                      element={selectedCharData?.element}
                      icon={`https://enka.network/ui${WeaponIcon[selectedCharData?.weapon]}`}
                      size="w-9 h-9"
                    />
                    <div
                      className={classNames(
                        'absolute flex items-center justify-center px-1.5 py-0.5 text-xs rounded-full -bottom-2 -right-3 text-white',
                        talent?.upgrade?.normal ? 'bg-cyan-600' : 'bg-primary-light'
                      )}
                    >
                      {char?.talents?.normal + (talent?.upgrade?.normal ? 3 : 0)}
                    </div>
                  </div>
                  <div className="relative ml-3">
                    <TalentIcon
                      talent={talent?.talents?.skill}
                      element={selectedCharData?.element}
                      icon={`https://enka.network/ui/Skill_${
                        iconCodeName === 'PlayerGrass' ? 'E' : 'S'
                      }_${iconCodeName}${iconCodeName === 'Qin' ? '_02' : '_01'}${
                        iconCodeName === 'Diluc' ? '_01' : ''
                      }.png`}
                      size="w-9 h-9"
                    />
                    <div
                      className={classNames(
                        'absolute flex items-center justify-center px-1.5 py-0.5 text-xs rounded-full -bottom-2 -right-3 text-white',
                        talent?.upgrade?.skill ? 'bg-cyan-600' : 'bg-primary-light'
                      )}
                    >
                      {char?.talents?.skill + (talent?.upgrade?.skill ? 3 : 0)}
                    </div>
                  </div>
                  <div className="relative ml-3">
                    <TalentIcon
                      talent={talent?.talents?.burst}
                      element={selectedCharData?.element}
                      icon={`https://enka.network/ui/Skill_${
                        iconCodeName === 'PlayerGrass' ? 'S' : 'E'
                      }_${iconCodeName}${_.includes(['Ayaka', 'Ambor'], iconCodeName) ? '' : '_01'}.png`}
                      size="w-9 h-9"
                    />
                    <div
                      className={classNames(
                        'absolute flex items-center justify-center px-1.5 py-0.5 text-xs rounded-full -bottom-2 -right-3 text-white',
                        talent?.upgrade?.burst ? 'bg-cyan-600' : 'bg-primary-light'
                      )}
                    >
                      {char?.talents?.burst + (talent?.upgrade?.burst ? 3 : 0)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-5" />
              )}
              <StatBlock index={selected} stat={stats} />
            </div>
            <div className="w-1/5 space-y-5">
              <WeaponBlock {...char?.equipments?.weapon} />
              <ArtifactBlock
                index={selected}
                piece={5}
                aId={char?.equipments?.artifacts?.[2]}
                override={artifactData}
                canEdit={false}
              />
              <div className="w-full px-3 py-2 space-y-1 rounded-lg bg-primary-dark">
                {_.every(set, (item) => item < 2) ? (
                  <p className="text-xs text-white">No Set Bonus</p>
                ) : (
                  _.map(set, (item, key) => <SetToolTip item={item} set={key} key={key} />)
                )}
              </div>
            </div>
            <div className="w-1/5 space-y-5">
              <ArtifactBlock
                index={selected}
                piece={4}
                aId={char?.equipments?.artifacts?.[0]}
                override={artifactData}
                canEdit={false}
              />
              <ArtifactBlock
                index={selected}
                piece={1}
                aId={char?.equipments?.artifacts?.[3]}
                override={artifactData}
                canEdit={false}
              />
            </div>
            <div className="w-1/5 space-y-5">
              <ArtifactBlock
                index={selected}
                piece={2}
                aId={char?.equipments?.artifacts?.[1]}
                override={artifactData}
                canEdit={false}
              />
              <ArtifactBlock
                index={selected}
                piece={3}
                aId={char?.equipments?.artifacts?.[4]}
                override={artifactData}
                canEdit={false}
              />
              <div className="flex gap-x-2">
                {/* <PrimaryButton title="Equip Build" onClick={onOpenBuildModal} />
          <PrimaryButton title="Save Build" onClick={onOpenSaveModal} />
          <PrimaryButton title="Unequip All" onClick={onOpenConfirmModal} /> */}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full gap-1 rounded-lg bg-primary-darker">
          <p className="text-2xl font-bold">Enter your UID to display your characters.</p>
          <p className="text-sm text-gray">If the data is not up-to-date, please log out from the game to refresh.</p>
          <p className="text-sm text-red">✦ You may only import data once every minute. ✦</p>
        </div>
      )}
    </div>
  )
})
