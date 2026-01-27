+++
title = "DamageResult"
description = "전투 시스템에서 대미지 결과 정보를 저장하는 구조체"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 201
+++
## 개요
`DamageResult` 구조체는 SlimeRush 게임의 전투 시스템에서 대미지 결과를 저장하는 구조체입니다. 이 구조체는 공격 받은 대상이 죽었는지 여부, 공격 대미지, 크리티컬 히트 여부, 적용된 대미지, 대미지를 입게 된 타겟 등 다양한 대미지 결과 관련 정보를 담고 있습니다.

## 역할
- 대미지 결과를 저장하고 관리
- 공격 받은 대상이 죽었는지 여부 확인
- 크리티컬 히트 여부 확인

## 멤버
### 속성
```csharp
/// <summary>
/// 공격 받은 대상이 죽었는지 여부
/// </summary>
public bool IsDead;

/// <summary>
/// 플레이어가 몬스터에게 또는 몬스터가 플레이어에게 OnDamaged로 호출한 데미지 수치를 나타냅니다.
/// </summary>
public float AttackDamage;

/// <summary>
/// 해당 공격이 치명타로 적용되었는지 여부
/// </summary>
public bool IsCriticalHit;

/// <summary>
/// 데미지 감소 방어 등이 적용된 이후의 최종 데미지 값입니다.
/// </summary>
public float AppliedDamage;

/// <summary>
/// 데미지를 입게 된 타겟, 즉 게임오브젝트입니다.
/// </summary>
public GameObject DamagedObject;
```

## 기능 설명
### 대미지 결과 저장
- 공격 받은 대상이 죽었는지 여부를 저장합니다.
- 플레이어가 몬스터에게 또는 몬스터가 플레이어에게 OnDamaged로 호출한 데미지 수치를 저장합니다.
- 해당 공격이 치명타로 적용되었는지 여부를 저장합니다.
- 데미지 감소 방어 등이 적용된 이후의 최종 데미지 값을 저장합니다.
- 데미지를 입게 된 타겟, 즉 게임오브젝트를 저장합니다.

## 사용 예시
### DamageInfo를 기반으로 데미지를 계산하고, DamageResult를 반환
```csharp
/// <summary>
/// 몬스터가 데미지를 받을 때 호출됩니다.
/// DamageInfo를 기반으로 데미지를 계산하고, DamageResult를 반환합니다.
/// </summary>
/// <param name="damageInfo">데미지 정보</param>
/// <returns>데미지 결과</returns>
public DamageResult OnDamaged(DamageInfo damageInfo)
{
    // 몬스터가 불사 상태인 경우
    // 불사 상태인 몬스터는 데미지를 받지 않으며, DamageResult의 AppliedDamage를 0으로 설정합니다.
    if (_isImmortal)
    {
        return new DamageResult
        {
            // 몬스터가 죽었는지 여부
            IsDead = status.IsDead(),
            // 공격자가 호출한 데미지 수치
            AttackDamage = damageInfo.CommonDamage,
            // 데미지 감소 방어 등이 적용된 이후의 최종 데미지 값
            AppliedDamage = 0.0f,
            // 데미지를 입게 된 타겟, 즉 게임오브젝트
            DamagedObject = gameObject,
            // 해당 공격이 치명타로 적용되었는지 여부
            IsCriticalHit = false
        };
    }

    // 치명타 여부와 데미지를 결정합니다.
    // CommonBattleManager를 사용하여 치명타 여부와 데미지를 계산합니다.
    var (isCriticalHit, damage) = CommonBattleManager.DecisionCriticalHit(damageInfo);

    // 회피 여부와 계산된 데미지를 결정합니다.
    // 몬스터의 능력 행동을 사용하여 회피 여부와 계산된 데미지를 계산합니다.
    var (evasion, calculatedDamage) =
        monsterAbilityBehaviour.CalculateTakeDamage(damageInfo.AttackingClassification, damage);

    // 계산된 데미지가 0보다 큰 경우
    // 데미지를 적용하고, 몬스터 모델과 상태를 업데이트합니다.
    if (calculatedDamage > 0)
    {
        // 몬스터 조건을 사용하여 데미지를 적용합니다.
        calculatedDamage = _monsterCondition.TakeDamage(_conditionDamageProxy, damageInfo, calculatedDamage);

        // 몬스터 모델에 데미지를 적용합니다.
        monsterModel.OnDamage(damageInfo.ElementalType);

        // 물리적인 힘을 적용합니다.
        if (isPushedPhysicalStrength && damageInfo.PhysicalStrength != 0.0f)
        {
            monsterMovement.AddForce(damageInfo.PhysicalDirection, damageInfo.PhysicalStrength);
        }

        // 몬스터 상태에 데미지를 적용합니다.
        status.OnDamage(calculatedDamage);

        // 데미지 UI를 표시합니다.
        if (_isDamagePopup)
        {
            ShowDamageUI(calculatedDamage, isCriticalHit);
        }
    }

    // DamageResult를 반환합니다.
    // 몬스터의 상태와 계산된 데미지를 기반으로 DamageResult를 생성합니다.
    return new DamageResult()
    {
        // 몬스터가 죽었는지 여부
        IsDead = status.IsDead(),
        // 공격자가 호출한 데미지 수치
        AttackDamage = damageInfo.CommonDamage,
        // 데미지 감소 방어 등이 적용된 이후의 최종 데미지 값
        AppliedDamage = calculatedDamage,
        // 데미지를 입게 된 타겟, 즉 게임오브젝트
        DamagedObject = gameObject,
        // 해당 공격이 치명타로 적용되었는지 여부
        // 회피하지 않고 치명타인 경우에만 true로 설정합니다.
        IsCriticalHit = evasion == false && isCriticalHit
    };
}
```

## 관련 클래스
- `DamageInfo`