+++
title = "MagicAbilityInfo"
description = "SlimeRush 게임에서 마법의 부가 효과 정보를 저장하고 관리하는 데이터 구조체"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 206
+++
## 개요
`MagicAbilityInfo` 구조체는 SlimeRush 게임에서 마법의 부가 효과 정보를 저장하고 관리하는 핵심 데이터 구조체입니다. 이 구조체는 마법이 가진 특수 능력의 종류([`MagicAbilityType`](/docs/projects/SlimeRush/BattleSystem/MagicAbilityType)), 파라미터, 지속 시간 등을 정의하며, 메서드 체이닝을 지원하는 Factory 패턴을 통해 다양한 마법 능력 정보를 간편하게 생성할 수 있도록 설계되었습니다.

## 역할
- 마법의 부가 효과에 대한 모든 파라미터를 구조화된 형태로 저장
- 다양한 마법 능력 정보를 생성하는 Factory 메서드 제공
- 연쇄 호출을 통해 간결한 코드 작성 가능

## 선언
```csharp
public struct MagicAbilityInfo
```

## 멤버
### 속성
```csharp
/// <summary>
/// 마법 능력의 타입을 나타냅니다.
/// </summary>
public MagicAbilityType AbilityType { get; private set; }

/// <summary>
/// 적용될 데미지량을 나타냅니다.
/// </summary>
public float AppliedDamage { get; private set; }

/// <summary>
/// 능력의 지속 시간을 나타냅니다.
/// </summary>
public float Duration { get; private set; }

/// <summary>
/// 감소 효과의 수치를 나타냅니다 (예: 이동 속도 감소).
/// </summary>
public float DecreaseValue { get; private set; }

/// <summary>
/// 능력이 활성화될 확률을 나타냅니다.
/// </summary>
public float ActiveProbability { get; private set; }

/// <summary>
/// 데미지 배율을 나타냅니다.
/// </summary>
public float DamageMagnification { get; private set; }

/// <summary>
/// 능력이 활성화될 횟수를 나타냅니다.
/// </summary>
public int ActiveTimes { get; private set; }
```

### 메서드
```csharp
/// <summary>
/// 부가능력을 없음으로 설정합니다.
/// </summary>
/// <returns>부가 능력이 없는 마법 능력 정보</returns>
public MagicAbilityInfo NoAbility()

/// <summary>
/// 점화 능력을 생성합니다.
/// </summary>
/// <param name="dmg">데미지</param>
/// <param name="duration">지속 시간</param>
/// <returns>점화 마법 능력 정보</returns>
public MagicAbilityInfo CreateIgnition(float dmg, float duration = 5f)

/// <summary>
/// 동결 능력을 생성합니다.
/// </summary>
/// <param name="decreaseValue">감소 값</param>
/// <param name="duration">지속 시간</param>
/// <returns>얼음 마법 능력 정보</returns>
public MagicAbilityInfo CreateFreezing(float decreaseValue = 0.3f, float duration = 3f)

/// <summary>
/// 정전기 능력을 생성합니다.
/// </summary>
/// <param name="probability">활성화 확률</param>
/// <returns>정전기 마법 능력 정보</returns>
public MagicAbilityInfo CreateStatic(float probability = 0.5f)

/// <summary>
/// 풍화 능력을 생성합니다.
/// </summary>
/// <param name="magnification">데미지 배율</param>
/// <param name="activeTimes">활성화 횟수</param>
/// <param name="duration">지속 시간</param>
/// <returns>풍화 마법 능력 정보</returns>
public MagicAbilityInfo CreateWeathering(float magnification = 0.1f, int activeTimes =1, float duration = 3f)
```

## 주요 코드 스니펫
### 메서드 체이닝 및 Factory 메서드
```csharp
public MagicAbilityInfo CreateIgnition(float dmg, float duration = 5f)
{
    // 능력 타입을 점화로 설정합니다
    AbilityType = MagicAbilityType.Ignition;
    // 적용될 대미지를 설정합니다
    AppliedDamage = dmg;
    // 지속 시간을 설정합니다
    Duration = duration;
    return this;
}

public MagicAbilityInfo CreateFreezing(float decreaseValue = 0.3f, float duration = 3f)
{
    // 능력 타입을 얼음으로 설정합니다
    AbilityType = MagicAbilityType.Freezing;
    // 이동 속도 감소 값을 설정합니다
    DecreaseValue = decreaseValue;
    // 지속 시간을 설정합니다
    Duration = duration;
    return this;
}

public MagicAbilityInfo CreateStatic(float probability = 0.5f)
{
    // 능력 타입을 정전기로 설정합니다
    AbilityType = MagicAbilityType.Static;
    // 활성화 확률을 설정합니다
    ActiveProbability = probability;
    return this;
}

public MagicAbilityInfo CreateWeathering(float magnification = 0.1f, int activeTimes =1, float duration = 3f)
{
    // 능력 타입을 풍화로 설정합니다
    AbilityType = MagicAbilityType.Weathering;
    // 대미지 배율을 설정합니다
    DamageMagnification = magnification;
    // 활성화 횟수를 설정합니다
    ActiveTimes = activeTimes;
    // 지속 시간을 설정합니다
    Duration = duration;
    return this;
}
```

## 기능 설명
### Factory 패턴
- 정적 메서드를 통해 다양한 마법 능력 정보를 생성하는 Factory 패턴 구현
- 각 메서드는 해당 마법 능력에 맞는 기본값을 제공하며, 필요에 따라 파라미터를 커스터마이징

## 의존성/상속 관계
- 구조체 생성시 호출된 메서드에 따라 마법 능력 타입 열거형([`MagicAbilityType`](/docs/projects/SlimeRush/BattleSystem/MagicAbilityType) ) 설정

## 사용 예시
#### [`CommonBattleManager`](/docs/projects/SlimeRush/BattleSystem/CommonBattleManager)에서 마법 부가 능력이 생성될 때, 데이터의 열거형 값에 따라 부가 능력 생성
```csharp
private static MagicAbilityInfo CreateMagicAbility(PlayerDataInfo playerInfo, MagicInfo magicInfo)
{
    // 플레이어의 룬능력 정보를 가져옵니다
    var runeAbility = playerInfo.PlayerRuneInfo.Ability;
    // 룬능력이 없는 경우 부가 능력 없는 상태를 반환합니다
    if (runeAbility == RuneStat.RuneAbility.None)
    {
        return new MagicAbilityInfo().NoAbility();
    }

    // 마법의 속성에 따라 다른 룬능력을 적용합니다
    switch (magicInfo.element)
    {
        case MagicElement.Fire:
            // 불 속성 마법이고 점화 부가 룬 능력이 있는 경우
            if (runeAbility.HasFlag(RuneStat.RuneAbility.Ignition))
                return new MagicAbilityInfo().CreateIgnition(CalculateAbilityDamage(playerInfo, magicInfo));
            break;
        case MagicElement.Ice:
            // 얼음 속성 마법이고 동결 부가 룬 능력이 있는 경우
            if (runeAbility.HasFlag(RuneStat.RuneAbility.Freezing))
                return new MagicAbilityInfo().CreateFreezing();
            break;
        case MagicElement.Air:
            // 바람 속성 마법이고 풍화 부가 룬 능력이 있는 경우
            if (runeAbility.HasFlag(RuneStat.RuneAbility.Weathering))
                return new MagicAbilityInfo().CreateWeathering();
            break;
        case MagicElement.Lightning:
            // 번개 속성 마법이고 정전기 부가 룬 능력이 있는 경우
            if (runeAbility.HasFlag(RuneStat.RuneAbility.Static))
                return new MagicAbilityInfo().CreateStatic();
            break;
    }
    // 해당하는 부가 룬 능력이 없는 경우 부가 능력 없는 상태를 반환합니다
    return new MagicAbilityInfo().NoAbility();
}
```

#### `BurnedCondition`에서 점화 상태가 될 시 점화 데미지 적용
```csharp
private IEnumerator TakeBurnDamage(IDamageAble damageAble, DamageInfo damageInfo)
{
    var ignition = damageInfo.MagicAbilityInfo;
    while (IsConditionActive())
    {
        var applyDamage = new DamageInfo
        {
            Attacker = damageInfo.Attacker,
            AttackingClassification = damageInfo.AttackingClassification,
            CommonDamage = ignition.AppliedDamage,
            CriticalDamage = ignition.AppliedDamage,
            ElementalType = damageInfo.ElementalType,
            CriticalChance = 0,
            PhysicalDirection = Vector3.zero,
            PhysicalStrength = 0
        };
        damageAble?.OnDamaged(applyDamage);
        yield return Second;
    }
    _burnedCoroutine = null;
}
```

## 관련 클래스
- [`MagicAbilityType`](/docs/projects/SlimeRush/BattleSystem/MagicAbilityType)
- [`DamageInfo`](/docs/projects/SlimeRush/BattleSystem/DamageInfo)
- [`MagicBook`](/docs/projects/SlimeRush/BattleSystem/MagicBook)