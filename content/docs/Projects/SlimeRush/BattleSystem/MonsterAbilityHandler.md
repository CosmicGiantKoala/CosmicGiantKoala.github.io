+++
title = "MonsterAbilityHandler"
description = "SlimeRush 게임의 몬스터의 공격 능력을 처리하는 핸들러"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 209
+++
## 개요
`MonsterAbilityHandler` 클래스는 SlimeRush 게임의 몬스터의 공격 능력을 처리하는 핸들러입니다. 이 클래스는 몬스터와 플레이어 사이의 거리를 기반으로 공격 범위 내에 플레이어가 있는지 확인하고, 쿨타임에 따라 공격을 수행합니다. [`CommonMonsterCombat`](/docs/projects/SlimeRush/BattleSystem/CommonMonsterCombat) 클래스 내에서 내부 클래스로 사용됩니다.

## 역할
- 몬스터와 플레이어 사이의 거리를 기반으로 공격 범위를 확인
- 쿨타임을 관리하고, 쿨타임이 완료되면 공격을 수행
- 공격 범위 내에 쿨타임이 완료되지 않거나 플레이어가 없는 경우 쿨타임을 감소

## 선언
```csharp
public class CommonMonsterCombat : MonsterCombatBehaviour
{
    ...
    private class MonsterAbilityHandler
}
```

## 멤버
### 속성
```csharp
/// <summary>
/// 남은 쿨타임
/// 몬스터의 공격 능력이 다시 사용 가능할 때까지 남은 시간을 나타냅니다.
/// </summary>
private float _remainCoolTime;

/// <summary>
/// 몬스터 공격 능력
/// 몬스터의 공격 능력을 정의하는 인터페이스입니다.
/// </summary>
private readonly IMonsterAttackAbility _ability;

/// <summary>
/// 플레이어 타겟
/// 플레이어의 위치를 제공하는 타겟 인터페이스입니다.
/// </summary>
private readonly ITarget _playerTarget;

/// <summary>
/// 데미지 가능 오브젝트
/// 데미지를 입힐 수 있는 오브젝트를 정의하는 인터페이스입니다.
/// </summary>
private readonly IDamageAble _damageAble;

/// <summary>
/// 공격 범위
/// 몬스터의 공격 범위를 나타내며, 이 범위 내에 플레이어가 있으면 공격을 수행합니다.
/// </summary>
private float _range;
```

### 생성자
```csharp
/// <summary>
/// 몬스터 능력 핸들러를 생성합니다.
/// </summary>
/// <param name="ability">몬스터 공격 능력</param>
/// <param name="playerTarget">플레이어 타겟</param>
/// <param name="playerDamageable">플레이어 대미지 가능 오브젝트</param>
public MonsterAbilityHandler(
    IMonsterAttackAbility ability, ITarget playerTarget, IDamageAble playerDamageable)
{
```

### 메서드
```csharp
/// <summary>
/// 업데이트합니다.
/// 몬스터와 플레이어 사이의 거리를 기반으로 공격 범위 내에 플레이어가 있는지 확인하고, 쿨타임에 따라 공격을 수행합니다.
/// </summary>
/// <param name="distance">거리</param>
/// <param name="interval">간격</param>
internal void Update(float distance, float interval)
```

## 주요 코드 스니펫
### 공격 범위 확인 및 공격 수행
```csharp
internal void Update(float distance, float interval)
{
    // 거리가 공격 범위 내인 경우
    if (_range >= distance)
    {
        switch (_remainCoolTime)
        {
            // 쿨타임이 0 이하인 경우 (공격 준비 완료)
            case <= 0 :
                // 플레이어를 대상으로 공격 능력을 실행합니다
                _ability.Attack(_playerTarget, _damageAble);
                // 공격 후 쿨타임을 설정합니다
                _remainCoolTime = _ability.CoolDown();
                // 공격 범위를 업데이트합니다
                _range = _ability.Range();
                break;
            // 쿨타임이 0 초과인 경우 (공격 준비 중)
            case > 0 :
                // 쿨타임을 간격만큼 감소시킵니다
                _remainCoolTime -= interval;
                break;
        }
    }
    else
    {
        // 거리가 공격 범위 밖인 경우
        switch (_remainCoolTime)
        {
            // 쿨타임이 0 이하인 경우 (공격 준비 완료)
            case <= 0:
                // 쿨타임을 0으로 초기화합니다
                _remainCoolTime = 0;
                break;
            // 쿨타임이 0 초과인 경우 (공격 준비 중)
            case > 0:
                // 쿨타임을 간격만큼 감소시킵니다
                _remainCoolTime -= interval;
                break;
        }
    }

}
```

## 기능 설명
### 공격 범위 확인
- 몬스터와 플레이어 사이의 거리를 기반으로 공격 범위를 확인
- 거리가 공격 범위 내에 있는 경우, 쿨타임을 확인하여 공격을 수행

### 쿨타임 관리
- 쿨타임이 0 이하인 경우, 공격(`IMonsterAttackAbility`)을 수행하고 쿨타임을 재설정
- 쿨타임이 0 초과인 경우, 쿨타임을 간격만큼 감소

### 공격 수행
- 공격 범위 내에 플레이어가 있고 쿨타임이 0 이하인 경우, 공격(`IMonsterAttackAbility`)을 수행
- 공격 후 쿨타임을 재설정하고, 공격 범위를 업데이트

## 의존성/상속 관계
- `IMonsterAttackAbility` 인터페이스를 통해 몬스터 공격 능력 호출
- [`ITarget`](/docs/projects/SlimeRush/BattleSystem/ITarget) 인터페이스를 통해 플레이어 타겟 정의
- [`IDamageAble`](/docs/projects/SlimeRush/BattleSystem/IDamageAble)` 인터페이스를 통해 데미지 메서드 호출
- [`CommonMonsterCombat`](/docs/projects/SlimeRush/BattleSystem/CommonMonsterCombat) 내부에 정의된 클래스

## 사용 예시
#### [`CommonMonsterCombat`](/docs/projects/SlimeRush/BattleSystem/CommonMonsterCombat)에서 이벤트 호출을 통해 `MonsterAbilityHandler`의 `Update`호출
```csharp
private IEnumerator CoCheckDistance()
{
    // 플레이어가 초기화될 때까지 대기합니다
    // 플레이어 타겟 시스템이 초기화될 때까지 대기하여 안전하게 거리 체크를 수행합니다
    yield return new WaitUntil(() => _targetSystem.IsPlayerInit());

    while (true)
    {
        // 몬스터와 플레이어 사이의 거리를 계산합니다
        // 몬스터의 현재 위치와 플레이어 타겟의 위치를 기준으로 거리를 계산합니다
        var distance = Vector3.Distance(transform.position, _targetSystem.PlayerTarget.GetPosition());

        // 거리와 간격을 매개변수로 전투 행동을 호출합니다
        // 몬스터의 공격 범위와 쿨타임을 기반으로 전투 행동을 결정합니다
        _combatBehaviour?.Invoke(distance, CheckInterval);

        // 다음 체크까지 대기합니다
        // 설정된 간격만큼 대기한 후 다시 거리를 체크합니다
        yield return _checkDelay;
    }
}
```

## 관련 클래스
- [`CommonMonsterCombat`](/docs/projects/SlimeRush/BattleSystem/CommonMonsterCombat)
- [`ITarget`](/docs/projects/SlimeRush/BattleSystem/ITarget)
- [`IDamageAble`](/docs/projects/SlimeRush/BattleSystem/IDamageAble)