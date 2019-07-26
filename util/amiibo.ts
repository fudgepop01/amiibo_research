import { readFileSync, writeFileSync } from "fs";

export default class amiibo {
  binary: Buffer;
  dataChunk: Buffer;
  path: string;
  constructor(path: string) {
    this.path = path;
    this.binary = readFileSync(path);
    this.dataChunk = this.binary.slice(0xE0, 0x1B4);
  }

  debug(offset: number, pattern: number[]) {
    this.dataChunk.fill(0);
    for (const [i, value] of pattern.entries()) {
      this.dataChunk[offset + i] = value;
      if (i > this.dataChunk.length) break;
    }
  }

  get lvExp(): number { return this.dataChunk.readUInt16LE(0x6C) }
  set lvExp(v: number) { this.dataChunk.writeUInt16LE(v, 0x6C) }

  get cpuExp(): number { return this.dataChunk.readUInt16LE(0x6E) }
  set cpuExp(v: number) { this.dataChunk.writeUInt16LE(v, 0x6E) }

  get ability1(): ABILITY { return this.dataChunk.readUInt8(0x0C) }
  set ability1(v: ABILITY) { this.dataChunk.writeUInt8(v, 0x0C) }
  get ability2(): ABILITY { return this.dataChunk.readUInt8(0x0D) }
  set ability2(v: ABILITY) { this.dataChunk.writeUInt8(v, 0x0D) }
  get ability3(): ABILITY { return this.dataChunk.readUInt8(0x0E) }
  set ability3(v: ABILITY) { this.dataChunk.writeUInt8(v, 0x0E) }

  get attack(): number { return this.dataChunk.readInt16LE(0x70) }
  set attack(v: number) { this.dataChunk.writeInt16LE(v, 0x70) }

  get defense(): number { return this.dataChunk.readInt16LE(0x72) }
  set defense(v: number) { this.dataChunk.writeInt16LE(v, 0x72) }

  get gift(): number { return this.dataChunk.readUInt16LE(0x76) }
  set gift(v: number) { this.dataChunk.writeUInt16LE(v, 0x76) }

  get costume(): number { return this.dataChunk.readUInt8(0xC3) }
  set costume(v: number) { this.dataChunk.writeUInt8(v, 0xC3) }

  get personality(): Buffer { return this.dataChunk.slice(0x88, 0xC2) }
  set personality(v: Buffer) { v.copy(this.dataChunk.slice(0x88, 0xC2))  }

  get tauntRate(): number { return this.personality.readUInt8(0x19) }
  set tauntRate(v: number) { this.personality.writeUInt8(v, 0x19) }

  get personalityParamsOffense(): Buffer { return this.personality.slice(0x00, 0x07) }
  set personalityParamsOffense(v: Buffer) { v.copy(this.personality.slice(0x00, 0x07)) }

  get personalityMod1(): Buffer { return this.personality.slice(0x07, 0x0C) }
  set personalityMod1(v: Buffer) { v.copy(this.personality.slice(0x07, 0x0C))  }

  get personalityParamsDefense(): Buffer { return this.personality.slice(0x0C, 0x11) }
  set personalityParamsDefense(v: Buffer) { v.copy(this.personality.slice(0x0C, 0x11)) }

  get personalityUnknown(): Buffer { return this.personality.slice(0x11) }
  set personalityUnknown(v: Buffer) { v.copy(this.personality.slice(0x11)) }


  save() {
    writeFileSync(this.path, this.binary);
  }
}

export enum ABILITY {
  none1,
  moveSpeedUp,
  hyperSmashAttacks1,
  sword1,
  jumpUp,
  additionalMidairJump,
  lifesteal,
  shield1,
  easierDodging,
  easierPerfectShield,
  superArmor,
  slowSuperArmor,
  tradeOffAttackUp,
  tradeOffDefenseUp,
  tradeOffSpeedUp,
  tradeOffAbillityUp,
  criticalHealthAttackUp,
  criticalHealthDefenseUp,
  criticalHealthStatsUp,
  criticalImmunity,
  autoheal,
  poisonImmunity,
  poisonDamageReduced,
  poisonHeals,
  lavaFloorImmunity,
  stickyFloorImmunity,
  beamSwordEquipped,
  lipsStickEquipped,
  starRodEquipped,
  oreClubEquipped,
  homeRunBatEquipped,
  rayGunEquipped,
  superScopeEquipped,
  gustBellowsEquipped,
  drillEquipped,
  greenShellEquipped,
  pokeBallEquipped,
  blank1,
  backShieldEquipped,
  bunnyHoodEquipped,
  madeOfMetal,
  mouthfulOfCurry,
  franklinBadgeEquipped,
  hammerEquipped,
  fairyBottleEquipped,
  fireFlowerEquipped,
  freezieEquipped,
  ramblinEvilMushroomEquipped,
  killingEdgeEquipped,
  blank2,
  physicalAttackUp,
  weaponAttackUp,
  fistAttackUp,
  footAttackUp,
  auraAttackUp,
  magicAttackUp,
  psiAttackUp,
  sword2,
  fireAndExplosionAttackUp,
  sword3,
  electricAttackUp,
  energyShotAttackUp,
  waterAndIceAttackUp,
  magicResistUp,
  psiResistUp,
  shield2,
  fireExplosionResistUp,
  shield3,
  shield4,
  electricResistUp,
  energyShotResistUp,
  shield5,
  waterFreezingResistUp,
  auraResistUp,
  zapFloorImmunity,
  slumberImmunity,
  iceFloorImmunity,
  fallingImmunity,
  buryImmunity,
  brakingAbilityUp,
  shoe1,
  landingLagDown,
  lightweight,
  shieldDamageUp,
  airAttackUp1,
  airDefenseUp,
  neutralSpecialUp,
  sideSpecialUp,
  upSpecialUp,
  downSpecialUp,
  strongThrow,
  unflinchingChargedSmashes,
  tossAndMeteor,
  sword4,
  criticalHitUp,
  swimmer,
  shieldDurabilityUp,
  improvedEscape,
  shield6,
  shield_2,
  x1,
  batteringItemsUp,
  shootingItemsUp,
  thrownItemsUp,
  KOsHealDamage,
  invincibilityAfterEating,
  statsUpAfterEating,
  x2,
  firstStrikeAdvantage,
  x3,
  runningStart,
  x4,
  fastFinalSmashMeter,
  instadrop,
  healingShield,
  shield,
  x5,
  floatyJumps,
  shoe2,
  irreversibleControls,
  recoveryItemsUp,
  transformationDurationUp,
  undamagedAttackUp,
  undamagedSpeedUp,
  undamagedAttackAndSpeedUp,
  x6,
  medkit,
  edgeGrabUp,
  impactRun,
  x7,
  lavaFloorResist,
  itemGravitation,
  blank,
  chanceOfDoubleFinalSmash,
  doubleFinalSmash,
  hammer1_2,
  hammer2_2,
  metalAndGiant,
  giant,
  dashAttackUp,
  armorKnight,
  shield7,
  energyShotAttackResistanceUp,
  hammerDurationUp,
  boomerangEquipped,
  itemAttackUp,
  hammer,
  sword,
  shield8_2,
  shield9_2,
  x8,
  perfectShieldReflect,
  weaponAttackAndMoveSpeedUp,
  shootingAttackUp,
  chargeSpeedAndPowerUp,
  x9,
  screenFlipImmunity,
  fogImmunity,
  gravityChangeImmunity,
  staminaUp,
  strongWindResist,
  strongWindImmunity,
  criticalHealthHealing,
  specialMovePowerUp1,
  x10,
  bobOmbEquipped,
  hotheadEquipped,
  superLeafEquipped,
  superLaunchStarEquipped,
  beastballEquipped,
  deathsScytheEquipped,
  mrSaturnEquipped,
  uniraEquipped,
  rocketBeltEquipped,
  blackHoleEquipped,
  x11,
  statsUpUpAfterEating,
  hammer3_2,
  criticalHealthStatsUpUp,
  criticalHitUpUp,
  greatAutoheal,
  steelDiverEquipped,
  bananaGunEquipped,
  rageBlasterEquipped,
  staffEquipped,
  fireBarEquipped,
  screwAttackEquipped,
  bomberEquipped,
  cuccoEquipped,
  neutralAttackUp1,
  neutralAttackUpUp,
  tiltAttackUp1,
  tiltAttackUpUp,
  airAttackUpUp,
  mightyThrow,
  specialMovePowerUpUp,
  superEasyDodging,
  shoe3,
  landingLagDownDown,
  becomeHeavy,
  meteorSmashesUp,
  poisonedSmash,
  noPenaltyForContinuousDodging,
  airborneEndurance,
  sprintingEndurance,
  perfectShieldRecovery,
  masterfulFallBreak,
  healingItemAttraction,
  attackUpWhenHealthy,
  defenseUpWhenHealthy,
  endlessSmashHolding,
  healWithSmashAttacks,
  activitiesUp,
  giantKiller,
  metalKiller,
  assistKiller,
  jamFinalSmashCharge,
  weaponResistUp,
  hyperSmashAttacks2,
  neutralAttackUp2,
  tiltAttackUp2,
  specialMovePowerUp2,
  airAttackUp2,
  none2,
  none3,
  none4,
  none5,
  itemAutograb,
  none6,
  none7,
  none8,
  none9,
  none10,
  none11,
  none12,
  none13,
  none14,
  none15,
  none16,
  none17,
  none18,
  none19,
  none20,
  none21,
  none22,
  none23,
  none24,
  none25,
  none26,
  none27,
  none28,
  none29,
  none30,
  none31,
  none32,
  none33,
}