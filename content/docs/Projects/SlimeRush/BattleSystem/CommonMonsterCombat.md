+++
title = "CommonMonsterCombat"
description = "SlimeRush 게임의 전투 시스템에서 일반 몬스터의 전투 행동을 관리"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 208
+++
## 개요
`CommonMonsterCombat` 클래스는 SlimeRush 게임의 전투 시스템에서 일반 몬스터의 전투 행동을 관리합니다. 이 클래스는 몬스터의 능력(`MonsterAbilityBehaviour`) 클래스를 사용해 거리 체크, 몬스터 능력 핸들러([`MonsterAbilityHandler`](/docs/projects/SlimeRush/BattleSystem/MonsterAbilityHandler)) 관리 등을 담당합니다.

## 역할
- 거리 체크 및 전투 행동 관리
- 몬스터 능력 핸들러([`MonsterAbilityHandler`](/docs/projects/SlimeRush/BattleSystem/MonsterAbilityHandler)) 생성 및 관리
- 코루틴을 통한 거리 체크 및 전투 행동 업데이트

## 선언
```csharp
public class CommonMonsterCombat : MonsterCombatBehaviour
```

## 멤버
### 속성
```csharp
/// <summary>
/// 타겟 시스템
/// 플레이어 타겟을 관리하고, 몬스터와 플레이어 사이의 거리를 계산하는 데 사용됩니다.
/// </summary>
[Inject]
private TargetSystem _targetSystem;

/// <summary>
/// 몬스터 능력 행동
/// 몬스터의 공격 능력을 관리하고, 능력 변경 이벤트를 제공합니다.
/// </summary>
[SerializeField]
private MonsterAbilityBehaviour monsterAbilityBehaviour;

/// <summary>
/// 전투 행동 델리게이트 인스턴스
/// 몬스터의 전투 행동을 처리하는 델리게이트로, 거리와 간격을 매개변수로 받아 전투 행동을 결정합니다.
/// </summary>
private OnUpdate _combatBehaviour;

/// <summary>
/// 능력 핸들러 목록
/// 몬스터의 공격 능력 핸들러 목록으로, 각 능력에 대한 핸들러를 관리합니다.
/// </summary>
private readonly List<MonsterAbilityHandler> _abilityHandlers = new List<MonsterAbilityHandler>();

/// <summary>
/// 거리 체크 대기 시간
/// 몬스터와 플레이어 사이의 거리를 주기적으로 체크하기 위한 대기 시간으로, 설정된 간격만큼 대기한 후 다시 거리를 체크합니다.
/// </summary>
private WaitForSeconds _checkDelay;

/// <summary>
/// 거리 체크 간격
/// 몬스터와 플레이어 사이의 거리를 체크하는 주기로, 몬스터의 전투 행동을 결정하는 데 사용됩니다.
/// </summary>
private const float CheckInterval = 0.1f;

/// <summary>
/// 거리 체크 코루틴
/// 몬스터와 플레이어 사이의 거리를 주기적으로 체크하는 코루틴으로, 전투 행동을 호출합니다.
/// </summary>
private Coroutine _distanceCoroutine;
```

### 메서드
```csharp
/// <summary>
/// 오브젝트가 활성화될 때 호출됩니다.
/// 몬스터 능력 변경 이벤트를 구독하고, 재생 및 일시 정지 이벤트를 구독하며, 거리 체크 간격을 설정합니다.
/// </summary>
private void OnEnable()

/// <summary>
/// 오브젝트가 비활성화될 때 호출됩니다.
/// 재생 및 일시 정지 이벤트 구독을 해제하고, 몬스터 능력을 초기화합니다.
/// </summary>
private void OnDisable()

/// <summary>
/// 일시 정지될 때 호출됩니다.
/// 거리 체크 코루틴을 중지합니다.
/// </summary>
private void OnPaused()

/// <summary>
/// 재생될 때 호출됩니다.
/// 거리 체크 코루틴을 시작합니다.
/// </summary>
private void OnPlayed()

/// <summary>
/// 거리를 체크하는 코루틴입니다.
/// 플레이어가 초기화될 때까지 대기한 후, 몬스터와 플레이어 사이의 거리를 주기적으로 체크하고 전투 행동을 호출합니다.
/// </summary>
/// <returns>코루틴</returns>
private IEnumerator CoCheckDistance()

/// <summary>
/// 몬스터 능력을 초기화합니다.
/// 몬스터 능력 변경 이벤트 구독을 해제하고, 코루틴 참조, 전투 행동 델리게이트, 능력 핸들러 목록을 초기화합니다.
/// </summary>
private void ResetMonsterAbility()

/// <summary>
/// 몬스터 전투를 설정합니다.
/// 몬스터의 공격 능력을 가져와 각 능력에 대한 핸들러를 생성하고, 핸들러를 목록에 추가한 후 전투 행동을 등록합니다.
/// </summary>
private void OnSetupMonsterCombat()
```

## 주요 코드 스니펫
### 몬스터 능력 설정
```csharp
private void OnSetupMonsterCombat()
{
    // 기존 능력 핸들러를 초기화합니다
    _abilityHandlers.Clear();
    // 몬스터의 공격 능력을 가져옵니다
    var abilities = monsterAbilityBehaviour.GetAttackAbilities();
    foreach (var ability in abilities)
    {
        // 각 공격 능력에 대한 핸들러를 생성합니다
        var handler = new MonsterAbilityHandler(
            ability: ability,
            playerTarget: _targetSystem.PlayerTarget,
            playerDamageable: _targetSystem.PlayerTarget.GetDamageAble());
        // 핸들러를 목록에 추가합니다
        _abilityHandlers.Add(handler);
        // 핸들러의 업데이트 메서드를 전투 행동에 등록합니다
        _combatBehaviour += handler.Update;
    }
    // 거리 체크 코루틴을 시작합니다
    _distanceCoroutine = StartCoroutine(CoCheckDistance());
}
```

### 몬스터 <-> 플레이어간 거리 체크 코루틴
```csharp
private IEnumerator CoCheckDistance()
{
    // 플레이어가 초기화될 때까지 대기합니다
    yield return new WaitUntil(() => _targetSystem.IsPlayerInit());
    while (true)
    {
        // 몬스터와 플레이어 사이의 거리를 계산합니다
        var distance = Vector3.Distance(transform.position, _targetSystem.PlayerTarget.GetPosition());
        // 거리와 간격을 매개변수로 전투 행동을 호출합니다
        _combatBehaviour?.Invoke(distance, CheckInterval);
        // 다음 체크까지 대기합니다
        yield return _checkDelay;
    }
}
```

## 기능 설명
### 몬스터 능력 설정
- `MonsterAbilityBehaviour` 클래스에서 몬스터의 공격 능력(`List<IMonsterAttackAbility>`) 인터페이스 반환
- 각 공격 능력에 대한 핸들러([`MonsterAbilityHandler`](/docs/projects/SlimeRush/BattleSystem/MonsterAbilityHandler))를 생성
- 핸들러 목록 관리
- 핸들러 업데이트 메서드 동작
- 거리 체크 코루틴 동작

### 거리 체크 코루틴
- 몬스터와 플레이어 사이의 거리(`float`)를 계산
- 거리와 인터벌 간격을 매개변수로 핸들러 `Update(<float>, <float>)` 호출

### 몬스터 능력 핸들러 업데이트
- 거리가 공격 범위 내인 경우, 쿨타임에 따라 공격 실행
- 거리가 공격 범위 밖인 경우, 쿨타임을 감소

## 의존성/상속 관계
- `MonoBehaviour`를 상속받음([`MonsterCombatBehaviour`](/docs/projects/SlimeRush/BattleSystem/MonsterCombatBehaviour)에서)
- [`MonsterCombatBehaviour`](/docs/projects/SlimeRush/BattleSystem/MonsterCombatBehaviour) 클래스를 상속받고 이벤트에 따라 동작 제어
- [`MonsterAbilityHandler`](/docs/projects/SlimeRush/BattleSystem/MonsterAbilityHandler) 클래스 생성 및 관리
- [`TargetSystem`](/docs/projects/SlimeRush/BattleSystem/TargetSystem) 클래스를 통해 거리체크 동작

## 관련 클래스
- [`MonsterCombatBehaviour`](/docs/projects/SlimeRush/BattleSystem/MonsterCombatBehaviour)
- [`TargetSystem`](/docs/projects/SlimeRush/BattleSystem/TargetSystem)
- [`MonsterAbilityHandler`](/docs/projects/SlimeRush/BattleSystem/MonsterAbilityHandler)
