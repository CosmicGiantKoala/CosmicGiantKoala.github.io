+++
title = "DamageInfo"
description = "전투 시스템에서 기본적인 전투 매니저 기능을 제공"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 201
+++
## 개요
`DamageInfo` 구조체는 SlimeRush 게임의 전투 시스템에서 데미지 정보를 저장합니다. 이 구조체는 일반 데미지, 크리티컬 데미지, 넉백수치, 데미지 속성, 공격 분류, 마법 특수능력 등 다양한 데미지 관련 정보를 담고 있습니다.

## 역할
- 데미지 정보를 저장
- 데미지 속성 및 공격 분류를 나타냄
- 마법 속성을 데미지 속성으로 변환

## 멤버
### 속성
```csharp
/// <summary>
/// 일반 대미지
/// 기본적인 대미지량을 나타내며, 모든 공격의 기본 대미지 값입니다.
/// </summary>
public float CommonDamage;

/// <summary>
/// 치명타 확률
/// 치명타가 발생할 확률을 나타내며, 0부터 1 사이의 값으로 표현됩니다.
/// </summary>
public float CriticalChance;

/// <summary>
/// 치명타 대미지
/// 치명타가 발생했을 때 적용되는 대미지를 나타냅니다.
/// </summary>
public float CriticalDamage;

/// <summary>
/// 물리력
/// 물리적인 힘을 나타내며, 넉백의 강도를 결정합니다.
/// </summary>
public float PhysicalStrength;

/// <summary>
/// 물리 방향
/// 물리적인 공격의 방향을 나타내며, 벡터로 표현됩니다.
/// </summary>
public Vector3 PhysicalDirection;

/// <summary>
/// 대미지 속성
/// 대미지의 속성을 나타내며, 불, 얼음, 번개, 바람 등 다양한 속성을 가질 수 있습니다.
/// </summary>
public DamageElemental ElementalType;

/// <summary>
/// 공격 분류
/// 공격의 분류를 나타내며, 근접, 원거리, 범위 등 다양한 분류를 가질 수 있습니다.
/// </summary>
public AttackClassification AttackingClassification;

/// <summary>
/// 마법 부가 능력 정보
/// 마법 공격의 부가 능력을 나타내며, 부가 능력의 세부 정보를 포함합니다.
/// </summary>
public MagicAbilityInfo MagicAbilityInfo;

/// <summary>
/// 공격자
/// 공격을 수행한 객체의 이름을 나타내며, 문자열로 표현됩니다.
/// </summary>
public string Attacker;
```

### 열거형
```csharp
/// <summary>
/// 데미지 속성을 나타냅니다.
/// </summary>
public enum DamageElemental
{
    None,
    Physical,
    Fire,
    Ice,
    Lightning,
    Air,
}

/// <summary>
/// 공격 분류를 나타냅니다.
/// </summary>
public enum AttackClassification
{
    Melee = 0,
    Range = 1,
    Area = 2
}
```

### 메서드
```csharp
/// <summary>
/// 마법 속성을 데미지 속성으로 변환합니다.
/// </summary>
/// <param name="magicElement">마법 속성</param>
/// <returns>변환된 데미지 속성</returns>
public static DamageElemental From(MagicElement magicElement)
```

## 주요 코드 스니펫
### 마법 속성 변환
```csharp
public static DamageElemental From(MagicElement magicElement)
{
    // 마법 속성을 데미지 속성으로 매핑합니다
    return magicElement switch
    {
        MagicElement.Fire => DamageElemental.Fire, // 불 속성 마법을 불 속성 데미지로 변환
        MagicElement.Ice => DamageElemental.Ice, // 얼음 속성 마법을 얼음 속성 데미지로 변환
        MagicElement.Lightning => DamageElemental.Lightning, // 번개 속성 마법을 번개 속성 데미지로 변환
        MagicElement.Air => DamageElemental.Air, // 바람 속성 마법을 바람 속성 데미지로 변환
        // 지원하지 않는 마법 속성이 전달되면 예외를 발생시킵니다
        _ => throw new ArgumentOutOfRangeException(nameof(magicElement), magicElement, null)
    };
}
```

## 기능 설명
### 데미지 정보 저장
- 일반 데미지, 크리티컬 확률, 크리티컬 데미지, 물리적 힘, 물리적 방향, 데미지 속성, 공격 분류, 마법 부가 능력 정보, 공격자 등을 저장합니다.

### 데미지 속성 및 공격 분류
- 데미지 속성은 Fire, Ice, Lightning, Air를 나타냅니다.
- 공격 분류는 Melee, Range, Area를 나타냅니다.

### 마법 속성 변환
- 마법 속성을 데미지 속성으로 변환합니다.
- 불 속성 마법을 불 속성 데미지로 변환합니다.
- 얼음 속성 마법을 얼음 속성 데미지로 변환합니다.
- 번개 속성 마법을 번개 속성 데미지로 변환합니다.
- 바람 속성 마법을 바람 속성 데미지로 변환합니다.
- 지원하지 않는 마법 속성이 전달되면 예외를 발생시킵니다.

## 사용 예시
#### `CommonBattleManager`에서 `DamageInfo` 생성 및 마법 속성 변환
```csharp
public static DamageInfo CreateDamageInfo(PlayerDataInfo playerInfo, MagicInfo magicInfo)
{
    // 플레이어의 기본 공격력과 마법의 기본 대미지를 기반으로 일반 대미지를 계산합니다
    var damage = CalculateCommonDamage(playerInfo, magicInfo);
    // 일반 대미지를 기반으로 크리티컬 대미지를 계산합니다
    var criticalDamage = CalculateCriticalDamage(damage, playerInfo.CriticalDamage);

    // 대미지 정보를 생성하여 반환합니다
    DamageInfo damageInfo = new DamageInfo
    {
        CommonDamage = damage, // 일반 대미지 값 설정
        CriticalDamage = criticalDamage, // 크리티컬 대미지 값 설정
        CriticalChance = playerInfo.CriticalChance, // 크리티컬 확률 설정
        PhysicalStrength = magicInfo.physicalPower, // 물리적 힘 설정
        ElementalType = DamageInfo.From(magicInfo.element), // 마법 속성을 대미지 속성으로 변환하여 설정
        MagicAbilityInfo = CreateMagicAbility(playerInfo, magicInfo) // 마법 능력 정보 생성 및 설정
    };
    return damageInfo;
}
```

## 관련 클래스
- `MagicElement`: 마법 속성을 나타내는 열거형
- `MagicAbilityInfo`: 마법 능력 정보를 담는 클래스