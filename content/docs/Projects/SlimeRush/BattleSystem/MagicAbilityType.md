+++
title = "MagicAbilityType"
description = "SlimeRush 게임에서 마법의 부가 효과 종류를 정의하는 열거형"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 207
+++
## 개요
`MagicAbilityType` 열거형은 SlimeRush 게임에서 마법의 부가 효과 종류를 정의하는 열거형입니다. 이 열거형은 마법이 가질 수 있는 다양한 부가 능력의 타입을 구분하고, 타입 안전성을 보장함으로써 마법 시스템의 일관성과 유지보수성을 높이는 역할을 합니다.

## 역할
- 마법의 부가 효과 종류를 명확히 정의
- 열거형을 통해 마법 능력 타입의 오류를 컴파일 타임에 검출
- 새로운 마법 능력 타입 추가 시 체계적으로 관리 가능

## 선언
```csharp
public enum MagicAbilityType
```

## 멤버
### 열거형 값
```csharp
/// <summary>
/// 능력이 없음을 나타냅니다.
/// </summary>
None = 0,

/// <summary>
/// 점화 효과를 나타냅니다.
/// 지속시간동안 일정한 데미지를 줍니다.
/// </summary>
Ignition,

/// <summary>
/// 빙결 효과를 나타냅니다.
/// 지속시간동안 이동속도가 감소합니다.
/// </summary>
Freezing,

/// <summary>
/// 정전기 효과를 나타냅니다.
/// 일정 확율로 정전기 스킬이 발동됩니다.
/// </summary>
Static,

/// <summary>
/// 풍화 효과를 나타냅니다.
/// 지속시간동안 특정 횟수만큼 데미지를 증폭해서 받습니다.
/// </summary>
Weathering
```

## 기능 설명
### 마법 부가 능력 타입 분류
- **None**: 능력이 없음을 나타냅니다 (기본값)
- **Ignition**: 점화 효과를 나타냅니다 (지속 데미지)
- **Freezing**: 빙결 효과를 나타냅니다 (이동 속도 감소)
- **Static**: 정전기 효과를 나타냅니다 (확률 기반 추가 효과)
- **Weathering**: 풍화 효과를 나타냅니다 (데미지 배율 증가)

## 의존성/상속 관계
- [`MagicAbilityInfo`](/docs/projects/SlimeRush/BattleSystem/MagicAbilityInfo) 구조체에서 부가효과 타입 지정

## 사용 예시
#### `MonsterCondition`에서 마법 부가 효과에 따른 데미지 적용
```csharp
public float TakeDamage(IDamageAble damageAble, DamageInfo damageInfo, float damage)
{
    // 약화 효과가 적용된 데미지 계산
    var calculateWeakDamage = CalculateWeakDamage(damage);
    
    // 마법 능력이 없으면 약화된 데미지만 반환
    if (damageInfo.MagicAbilityInfo.AbilityType == MagicAbilityType.None) return calculateWeakDamage;

    // 마법 능력 타입에 따라 다른 상태 효과 적용
    switch (damageInfo.MagicAbilityInfo.AbilityType)
    {
        case MagicAbilityType.Ignition:
            // 점화 효과: 기존 약화 효과 제거 후 점화 효과 적용
            if (weakConditions.IsConditionActive()) weakConditions.DecreaseActive();
            return burnedConditions.TakeDamage(damageAble, damageInfo, calculateWeakDamage);
            
        case MagicAbilityType.Freezing:
            // 얼음 효과: 기존 약화 효과 제거 후 얼음 효과 적용
            if (weakConditions.IsConditionActive()) weakConditions.DecreaseActive();
            return frozenConditions.TakeDamage(damageAble, damageInfo, calculateWeakDamage);
            
        case MagicAbilityType.Weathering:
            // 풍화 효과: 약화 효과 적용 (기존 효과와 중첩 가능)
            return weakConditions.TakeDamage(damageAble, damageInfo, calculateWeakDamage);
            
        default:
            // 기타 마법 능력: 기존 약화 효과 제거 후 기본 데미지 반환
            if (weakConditions.IsConditionActive()) weakConditions.DecreaseActive();
            return calculateWeakDamage;
    }
}
```

## 관련 클래스
- [`MagicAbilityInfo`](/docs/projects/SlimeRush/BattleSystem/MagicAbilityInfo)
- [`DamageInfo`](/docs/projects/SlimeRush/BattleSystem/DamageInfo)
- [`MagicBook`](/docs/projects/SlimeRush/BattleSystem/MagicBook)