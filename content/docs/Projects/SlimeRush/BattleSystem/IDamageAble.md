+++
title = "ITarget"
description = "전투 시스템에서 플레이어 혹은 몬스터가 데미지를 입을 수 있는 기능을 정의하는 인터페이스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 201
+++
## 개요
`IDamageAble` 인터페이스는 SlimeRush 게임의 전투 시스템에서 플레이어 혹은 몬스터가 데미지를 입을 수 있는 기능을 정의하는 핵심 인터페이스입니다. 이 인터페이스를 구현하는 클래스는 데미지 정보를 받아 처리하고, 그 결과를 반환하는 표준화된 방식을 제공합니다. 전투 시스템에서 플레이어, 몬스터등 다양한 타입의 객체가 데미지 시스템에 참여할 수 있도록 유연한 설계를 제공합니다.

## 역할
- 플레이어 혹은 몬스터가 데미지를 받을 때의 처리 로직을 인터페이스로 표준화
- 데미지 적용 후의 결과를 구조화된 형태로 반환
- 다양한 타입의 오브젝트가 동일한 인터페이스로 데미지 처리 가능
- 전투 시스템의 핵심 컴포넌트로 작동

## 멤버
### 메서드
```csharp
/// <summary>
/// 오브젝트가 데미지를 받을 때 호출됩니다.
/// </summary>
/// <param name="damageInfo">가하는 피해에 대한 정보 구조체</param>
/// <returns>공격 피해량, 적용된 피해량 및 손상된 대상에 대한 정보를 포함하는 DamageResult 구조체를 반환합니다.</returns>
public DamageResult OnDamaged(DamageInfo damageInfo);
```

## 기능 설명
### 데미지 처리 흐름
1. **데미지 정보 수신**: `DamageInfo` 구조체를 통해 데미지 관련 모든 정보를 전달받음
2. **데미지 계산**: 내부 로직에 따라 실제 적용될 데미지량을 계산
3. **상태 변경**: 객체의 체력, 상태 등을 데미지에 따라 업데이트
4. **결과 반환**: `DamageResult` 구조체를 통해 데미지 적용 결과를 반환

### 핵심 특징
- **유연한 데미지 처리**: 각 구현체마다 다른 데미지 처리 로직을 가질 수 있음
- **결과 추적 가능**: 데미지 적용 결과를 상세히 추적할 수 있는 구조 제공
- **확장성**: 새로운 객체 타입이 데미지 시스템에 쉽게 참여 가능

## 의존성/상속 관계
- **의존 클래스**:
    - [`DamageInfo`](/docs/projects/SlimeRush/BattleSystem/DamageInfo): 데미지 정보 구조체
    - [`DamageResult`](/docs/projects/SlimeRush/BattleSystem/DamageResult): 데미지 결과 구조체

## 사용 예시
#### `MagicObject`에서 마법 오브젝트가 몬스터와 접촉했을 때 호출
```csharp
/// <summary>
/// 마법 객체가 대상에게 대미지를 가하는 메서드
/// </summary>
/// <param name="damageAble">대미지를 받을 수 있는 객체</param>
/// <param name="physicalDirection">물리적 힘의 방향 벡터</param>
/// <param name="useEffect">대미지 적용 시 시각 효과를 재생할지 여부</param>
public void Attack(IDamageAble damageAble, Vector3 physicalDirection, bool useEffect = true)
{
    // 대미지 가할 수 있는 상태인지 확인
    if (!IsPossibleToDamage()) return;
    
    // 플레이어 정보와 마법 정보를 기반으로 대미지 정보 생성
    var damageInfo = CommonBattleManager.CreateDamageInfo(_playerDataInfo, _magicInfo);
    
    // 물리적 방향 벡터의 Y축 값을 0으로 설정 (수평 방향만 적용)
    physicalDirection.y = 0.0f;
    damageInfo.PhysicalDirection = physicalDirection;
    
    // 대상 객체에 대미지 적용
    var damageResult = damageAble.OnDamaged(damageInfo);
    
    // 실제 적용된 대미지가 0 이하이면 처리 종료
    if (damageResult.AppliedDamage <= 0.0f)
    {
        return;
    }

    // 대미지 히스토리에 적용된 대미지량 추가 (그룹별 통계용)
    _magicHistory.AddValue(GroupId, damageResult.AppliedDamage);
    
    // 대상이 사망하지 않았고 마법 능력이 있을 경우 추가 효과 적용
    if (_magicAbility != null && !damageResult.IsDead)
    {
        _magicAbility.ApplyDamage(_playerDataInfo, damageInfo, damageResult);
    }

    // 시각 효과 재생 옵션이 활성화되어 있으면 효과 재생
    if (useEffect)
    {
        _magicEffect.HitMagic(transform.position, magicObjectId);
    }
}
```

#### `AttackMelee`에서  몬스터가 플레이어에게 근접공격을 가할 때 호출
```csharp
/// <summary>
/// 근접 공격 대상에게 대미지를 가하는 메서드
/// </summary>
/// <param name="target">공격 대상 타겟</param>
/// <param name="damageAble">대미지를 받을 수 있는 객체</param>
/// <param name="power">공격 파워 (대미지량)</param>
protected override void OnAttackTarget(ITarget target, IDamageAble damageAble, float power)
{
    // 근접 공격용 대미지 정보 생성
    var dmgInfo = new DamageInfo()
    {
        CommonDamage = power,
        CriticalChance = _criticalChance,
        AttackingClassification = DamageInfo.AttackClassification.Melee,
        Attacker = _monsterName
    };
    
    // 대상 객체에 대미지 적용
    damageAble.OnDamaged(dmgInfo);
}
```

## 관련 클래스

- **[`DamageInfo`](/docs/projects/SlimeRush/BattleSystem/DamageInfo)**
- **[`DamageResult`](/docs/projects/SlimeRush/BattleSystem/DamageResult)**
- **[`CommonBattleManager`](/docs/projects/SlimeRush/BattleSystem/CommonBattleManager)**
- **[`MagicBook`](/docs/projects/SlimeRush/BattleSystem/MagicBook)**
