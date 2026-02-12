+++
title = "CommonBattleManager"
description = "SlimeRush 게임의 전투 시스템에서 공통 전투 계산 로직을 제공하는 정적 유틸리티 클래스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 210
+++
## 개요
`CommonBattleManager` 클래스는 SlimeRush 게임의 전투 시스템에서 공통 전투 계산 로직을 제공하는 유틸리티 클래스입니다. 이 클래스는 정적 클래스로, 데미지 계산, 크리티컬 판정, 쿨타임 계산 등의 핵심 전투 로직을 캡슐화하여 플레이어와 몬스터 모두에서 재사용할 수 있도록 설계되었습니다.

## 역할
- 플레이어의 정보([`플레이어시트데이터(예시)`](/docs/projects/SlimeRush/BattleSystem/ExamplePlayerSheetData))와 마법 정보([`마법시트데이터(예시)`](/docs/projects/SlimeRush/BattleSystem/ExampleMagicSheetData))를 기반으로 데미지 정보 구조체([`DamageInfo`](/docs/projects/SlimeRush/BattleSystem/DamageInfo))를 생성
- 마법 부가 능력 정보([`MagicAbilityInfo`](/docs/projects/SlimeRush/BattleSystem/MagicAbilityInfo)) 생성
- 일반 데미지 및 크리티컬 데미지 계산
- 크리티컬 히트 여부 결정
- 쿨타임 계산

## 선언
```csharp
public static class CommonBattleManager
```

## 멤버
### 속성
```csharp
/// <summary>
/// 퍼센트 값을 실제 값으로 변환하는 데 사용되는 상수입니다.
/// 예를 들어, 크리티컬 데미지 계산에서 150%를 1.5로 변환하는 데 사용됩니다.
/// </summary>
private const float ConversionRate = 100f;

/// <summary>
/// 데미지 배율 계산의 기본값으로 사용되는 상수입니다.
/// 예를 들어, 마법 데미지 배율 계산에서 100%를 기본값으로 사용합니다.
/// </summary>
private const float DefaultMultiplierRate = 100f;
```

### 메서드
```csharp
/// <summary>
/// DamageInfo 구조체를 생성합니다.
/// </summary>
/// <param name="playerInfo">플레이어 데이터 정보</param>
/// <param name="magicInfo">마법 정보</param>
/// <returns>생성된 데미지 정보(DamageInfo)</returns>
public static DamageInfo CreateDamageInfo(PlayerDataInfo playerInfo, MagicInfo magicInfo)
```

```csharp
/// <summary>
/// MagicAbilityInfo 구조체를 생성합니다.
/// </summary>
/// <param name="playerInfo">플레이어 데이터 정보</param>
/// <param name="magicInfo">마법 정보</param>
/// <returns>생성된 마법 부가 능력 정보(MagicAbilityInfo)</returns>
private static MagicAbilityInfo CreateMagicAbility(PlayerDataInfo playerInfo, MagicInfo magicInfo)
```

```csharp
/// <summary>
/// 일반 데미지를 계산합니다.
/// </summary>
/// <param name="playerInfo">플레이어 데이터 정보</param>
/// <param name="magicInfo">마법 정보</param>
/// <returns>계산된 일반 데미지</returns>
private static float CalculateCommonDamage(PlayerDataInfo playerInfo, MagicInfo magicInfo)
```

```csharp
/// <summary>
/// 능력 데미지를 계산합니다.
/// </summary>
/// <param name="playerInfo">플레이어 데이터 정보</param>
/// <param name="magicInfo">마법 정보</param>
/// <returns>계산된 능력 데미지</returns>
private static float CalculateAbilityDamage(PlayerDataInfo playerInfo, MagicInfo magicInfo)
```

```csharp
/// <summary>
/// 속성에 의한 마법 데미지 증가율을 계산합니다.
/// </summary>
/// <param name="playerInfo">플레이어 데이터 정보</param>
/// <param name="magicInfo">마법 정보</param>
/// <returns>계산된 마법 데미지 증가율</returns>
private static float MagicDamageIncreaseFromElement(PlayerDataInfo playerInfo, MagicInfo magicInfo)
```

```csharp
/// <summary>
/// 크기에 의한 마법 데미지 증가율 계산합니다.
/// </summary>
/// <param name="playerInfo">플레이어 데이터 정보</param>
/// <param name="magicInfo">마법 정보</param>
/// <returns>계산된 마법 데미지 증가율</returns>
private static float MagicDamageIncreaseFromSize(PlayerDataInfo playerInfo, MagicInfo magicInfo)
```

```csharp
/// <summary>
/// 크리티컬 데미지를 계산합니다.
/// </summary>
/// <param name="damage">기본 데미지</param>
/// <param name="playerCriticalMagnification">플레이어 크리티컬 배율</param>
/// <returns>계산된 크리티컬 데미지</returns>
private static float CalculateCriticalDamage(float damage, float playerCriticalMagnification)
```

```csharp
/// <summary>
/// 크리티컬 히트를 결정합니다.
/// </summary>
/// <param name="damageInfo">데미지 정보</param>
/// <returns>크리티컬 히트 여부와 데미지</returns>
public static (bool, float) DecisionCriticalHit(DamageInfo damageInfo)
```

```csharp
/// <summary>
/// 쿨타임을 계산합니다.
/// </summary>
/// <param name="attackerSpeed">공격자 공격속도(s)</param>
/// <param name="speedMultiplierRate">(Optional) 공격 스킬 속도(%)</param>
/// <returns>계산된 쿨타임</returns>
public static float GetCoolTime(float attackerSpeed, float speedMultiplierRate = DefaultMultiplierRate)
```

## 주요 코드 스니펫
- **예시 데이터**
  - `PlayerDataInfo` - [`플레이어시트데이터(예시)`](/docs/projects/SlimeRush/BattleSystem/ExamplePlayerSheetData)
    - StrikingPower = 100
    - CriticalChance = 10
    - CriticalDamage = 150
  - `MagicInfo` - [`마법시트데이터(예시)`](/docs/projects/SlimeRush/BattleSystem/ExampleMagicSheetData)
    - StrikingPower = 70
    - PhysicalPower = 0.1
    - Element = Fire
  - 생성된 `DamageInfo`
    - CommonDamage = 70
    - CriticalDamage = 105
    - CriticalChange = 10
    - PhysicalStrength = 0
    - ElementalType = `DamageElemental.Fire`
    - AttackingClassification = `AttackClassification.Range`
    - `MagicAbilityInfo`
      - AbilityType = `MagicAbilityType.None`

### DamageInfo 생성
```csharp
private const float ConversionRate = 100f;
private const float DefaultMultiplierRate = 100f;

public static DamageInfo CreateDamageInfo(PlayerDataInfo playerInfo, MagicInfo magicInfo)
{
    // 플레이어의 정보와 마법 정보를 기반으로 일반 데미지를 계산합니다
    var damage = CalculateCommonDamage(playerInfo, magicInfo);
    // 일반 데미지를 기반으로 크리티컬 데미지를 계산합니다
    var criticalDamage = CalculateCriticalDamage(damage, playerInfo.CriticalDamage);

    // 데미지 정보를 생성하여 반환합니다
    DamageInfo damageInfo = new DamageInfo
    {
        CommonDamage = damage, // 일반 데미지 값 설정
        CriticalDamage = criticalDamage, // 크리티컬 데미지 값 설정
        CriticalChance = playerInfo.CriticalChance, // 크리티컬 확률 설정
        PhysicalStrength = magicInfo.physicalPower, // 물리적 힘 설정(넉백)
        ElementalType = DamageInfo.From(magicInfo.element), // 마법 속성을 데미지 속성으로 변환하여 설정
        MagicAbilityInfo = CreateMagicAbility(playerInfo, magicInfo) // 마법 부가 능력 정보 생성 및 설정
    };
    return damageInfo;
}

private static float CalculateCommonDamage(PlayerDataInfo playerInfo, MagicInfo magicInfo)
{
    // 마법 속성에 따른 데미지 증가량을 계산합니다
    
    // 예시 계산1 : 플레이어 룬(아이템)의 불속성 마법 데미지 증가효과 = 0, 마법 속성 = 불
    // 속성별 마법 데미지 배율 = 0
    
    // 예시 계산2 : 플레이어 룬(아이템)의 불속성 마법 데미지 증가효과 = 10, 마법 속성 = 불
    // 속성별 마법 데미지 배율 = 10
    var increaseFromElement = MagicDamageIncreaseFromElement(playerInfo, magicInfo);
    
    // 마법 크기에 따른 데미지 증가량을 계산합니다
    
    // 예시 계산1 : 플레이어 룬(아이템)의 소형 마법 데미지 증가효과 = 0, 마법 크기 = 소형
    // 크기별 마법 데미지 배율 = 0
    
    // 예시 계산2 : 플레이어 룬(아이템)의 소형 마법 데미지 증가효과 = 10, 마법 크기 = 소형
    // 크기별 마법 데미지 배율 = 10
    var increaseFromSize = MagicDamageIncreaseFromSize(playerInfo, magicInfo);
    
    // 데미지 배율을 계산합니다 (1 + (속성 증가 + 크기 증가) / 100)
    
    // 예시 계산1 : 1 + ((0 + 0) / 100);
    // 최종 마법 데미지 배율 = 1   
    
    // 예시 계산2 : 1 + ((10 + 10) / 100);
    // 최종 마법 데미지 배율 = 1.2 
    var magicDamageMultiplierRate = 1.0f + ((increaseFromSize + increaseFromElement) / DefaultMultiplierRate);
    
    // 최종 데미지를 계산합니다 (플레이어 공격력 * (마법 기본 데미지 * 최종 마법 데미지 배율) / 100)
    // 예시 계산1 : 100 * (70 * 1) / 100 = 70
    // 예시 계산2 : 100 * (70 * 1.2) / 100 = 84
    return playerInfo.StrikingPower * (magicInfo.strikingPower * magicDamageMultiplierRate) / DefaultMultiplierRate;
}

private static float MagicDamageIncreaseFromElement(PlayerDataInfo playerInfo, MagicInfo magicInfo)
{
    // 마법 속성에 따라 다른 데미지 증가량을 반환합니다
    return magicInfo.element switch
    {
        MagicElement.Air => playerInfo.PlayerRuneInfo.AirMagicDamage, // 바람 속성 마법 데미지 증가량
        MagicElement.Fire => playerInfo.PlayerRuneInfo.FireMagicDamage, // 불 속성 마법 데미지 증가량
        MagicElement.Ice => playerInfo.PlayerRuneInfo.IceMagicDamage, // 얼음 속성 마법 데미지 증가량
        MagicElement.Lightning => playerInfo.PlayerRuneInfo.LightningMagicDamage, // 번개 속성 마법 데미지 증가량
        _ => throw new ArgumentOutOfRangeException() // 지원하지 않는 마법 속성인 경우 예외 발생
    };
}

private static float MagicDamageIncreaseFromSize(PlayerDataInfo playerInfo, MagicInfo magicInfo)
{
    // 마법 크기에 따라 다른 데미지 증가량을 반환합니다
    return magicInfo.sizeType switch
    {
        MagicSizeType.Small => playerInfo.PlayerRuneInfo.SmallMagicDamage, // 작은 마법 크기 데미지 증가량
        MagicSizeType.Medium => playerInfo.PlayerRuneInfo.MediumMagicDamage, // 중간 마법 크기 데미지 증가량
        MagicSizeType.Large => playerInfo.PlayerRuneInfo.LargeMagicDamage, // 큰 마법 크기 데미지 증가량
        _ => throw new ArgumentOutOfRangeException() // 지원하지 않는 마법 크기인 경우 예외 발생
    };
}

private static float CalculateCriticalDamage(float damage, float playerCriticalMagnification)
{
    // 크리티컬 데미지를 계산합니다 (기본 데미지 * 크리티컬 배율 / 100)
    // 예시 계산 : 70 * (105/100) = 73.5
    return damage * (playerCriticalMagnification / ConversionRate);
}
```

### 마법 능력 생성
```csharp
private static MagicAbilityInfo CreateMagicAbility(PlayerDataInfo playerInfo, MagicInfo magicInfo)
{
    // 플레이어의 룬능력 정보를 가져옵니다
    var runeAbility = playerInfo.PlayerRuneInfo.Ability;
    // 룬능력이 없는 경우 능력 없는 상태를 반환합니다
    if (runeAbility == RuneStat.RuneAbility.None)
    {
        return new MagicAbilityInfo().NoAbility();
    }

    // 마법의 속성에 따라 다른 룬능력을 적용합니다
    switch (magicInfo.element)
    {
        case MagicElement.Fire:
            // 불 속성 마법이고 점화 룬능력이 있는 경우
            if (runeAbility.HasFlag(RuneStat.RuneAbility.Ignition))
                return new MagicAbilityInfo().CreateIgnition(CalculateAbilityDamage(playerInfo, magicInfo));
            break;
        case MagicElement.Ice:
            // 얼음 속성 마법이고 동결 룬능력이 있는 경우
            if (runeAbility.HasFlag(RuneStat.RuneAbility.Freezing))
                return new MagicAbilityInfo().CreateFreezing();
            break;
        case MagicElement.Air:
            // 바람 속성 마법이고 풍화 룬능력이 있는 경우
            if (runeAbility.HasFlag(RuneStat.RuneAbility.Weathering))
                return new MagicAbilityInfo().CreateWeathering();
            break;
        case MagicElement.Lightning:
            // 번개 속성 마법이고 정전기 룬능력이 있는 경우
            if (runeAbility.HasFlag(RuneStat.RuneAbility.Static))
                return new MagicAbilityInfo().CreateStatic();
            break;
    }
    // 해당하는 룬능력이 없는 경우 능력 없는 상태를 반환합니다
    return new MagicAbilityInfo().NoAbility();
}
```

### 크리티컬 히트 결정
```csharp
public static (bool, float) DecisionCriticalHit(DamageInfo damageInfo)
{
    // 크리티컬 확률이 0이면 일반 데미지만 반환합니다
    if (damageInfo.CriticalChance == 0) return (false,damageInfo.CommonDamage);

    // 0부터 1 사이의 랜덤 값을 생성합니다
    float criticalValue = Random.value;
    // 크리티컬 확률이 랜덤 값보다 크거나 같으면 크리티컬 히트입니다
    if (damageInfo.CriticalChance / ConversionRate >= criticalValue) return (true, damageInfo.CriticalDamage);
    // 크리티컬 히트가 아니면 일반 데미지를 반환합니다
    return (false,damageInfo.CommonDamage);
}
```

### 쿨타임 계산
```csharp
public static float GetCoolTime(float attackerSpeed, float speedMultiplierRate = DefaultMultiplierRate)
{
    // 쿨타임을 계산합니다 (공격 속도 / (스킬 속도 / 100))
    return attackerSpeed / (speedMultiplierRate/ConversionRate);
}
```

## 기능 설명
### 데미지 정보 생성
- 플레이어의 정보와 마법 정보를 기반으로 일반 데미지를 계산
- 일반 데미지를 기반으로 크리티컬 데미지를 계산
- 데미지 정보를 생성하여 반환

### 마법 부가 능력 생성
- 플레이어의 룬능력 정보 기반하여
  - 룬능력에 부가 능력이 없는 경우 부가 능력 없는 상태를 반환
  - 마법의 속성과 조건에 따라 다른 룬 부가 능력을 적용

### 크리티컬 히트 결정
- 크리티컬 확률이 0이면 일반 데미지만 반환
- 0부터 1 사이의 랜덤 값을 생성
- 크리티컬 확률이 랜덤 값보다 크거나 같으면 크리티컬 히트 처리
- 크리티컬 히트가 아니면 일반 데미지를 반환

## 의존성/상속 관계
- `PlayerDataInfo` 및 `MagicInfo`에 기반하여 [`DamageInfo`](/docs/projects/SlimeRush/BattleSystem/DamageInfo) 생성
- `PlayerDataInfo` 및 `MagicInfo`에 기반하여 [`MagicAbilityInfo`](/docs/projects/SlimeRush/BattleSystem/MagicAbilityInfo) 생성

## 사용 예시
#### 적에게 피해를 줄 때 데미지 정보 생성
```csharp
public void ApplyDamage(PlayerDataInfo playerDataInfo, DamageInfo damageInfo, DamageResult damageResult)
{
    if (!IsInvokeAttackEvent(damageInfo)) return;

    var target = damageResult.DamagedObject.GetComponent<IDamageAble>();
    if (target == null) return;
    
    var newDamageInfo = CommonBattleManager.CreateDamageInfo(playerDataInfo, _staticMagicInfo);
    target.OnDamaged(newDamageInfo);

    var effectGo = _magicEffectFactory.Create(new MagicEffectParams(staticEffectPrefab));
    if (effectGo != null)
    {
        var targetPos = damageResult.DamagedObject.transform.position;
        effectGo.transform.position = targetPos;
    }
}
```

## 관련 클래스
- [`DamageInfo`](/docs/projects/SlimeRush/BattleSystem/DamageInfo)
- [`MagicAbilityInfo`](/docs/projects/SlimeRush/BattleSystem/MagicAbilityInfo)
- [`MagicAbilityType`](/docs/projects/SlimeRush/BattleSystem/MagicAbilityType)