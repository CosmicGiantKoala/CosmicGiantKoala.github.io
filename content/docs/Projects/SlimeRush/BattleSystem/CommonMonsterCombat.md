+++
title = "CommonMonsterCombat"
description = "전투 시스템에서 일반 몬스터의 전투 행동을 관리"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 201
+++
## 개요
`CommonMonsterCombat` 클래스는 SlimeRush 게임의 전투 시스템에서 일반 몬스터의 전투 행동을 관리합니다. 이 클래스는 몬스터의 능력 설정, 거리 체크, 몬스터 능력 핸들러 관리 등을 담당합니다.

## 역할
- 거리 체크 및 전투 행동 관리
- 몬스터 능력 핸들러 생성 및 관리
- 코루틴을 통한 거리 체크 및 전투 행동 업데이트

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
private void OnSetupSetupMonsterCombat()
```

## 주요 코드 스니펫
### 몬스터 능력 설정
```csharp
private void OnSetupSetupMonsterCombat()
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
- 기존 능력 핸들러를 초기화합니다.
- 몬스터의 공격 능력을 가져옵니다.
- 각 공격 능력에 대한 핸들러를 생성합니다.
- 핸들러를 목록에 추가합니다.
- 핸들러의 업데이트 메서드를 전투 행동에 등록합니다.
- 거리 체크 코루틴을 시작합니다.

### 거리 체크 코루틴
- 플레이어가 초기화될 때까지 대기합니다.
- 몬스터와 플레이어 사이의 거리를 계산합니다.
- 거리와 간격을 매개변수로 전투 행동을 호출합니다.
- 다음 체크까지 대기합니다.

### 몬스터 능력 핸들러 업데이트
- 거리가 공격 범위 내인 경우, 쿨타임에 따라 공격을 실행합니다.
- 거리가 공격 범위 밖인 경우, 쿨타임을 감소시킵니다.

## 의존성/상속 관계
- `Zenject` 네임스페이스에 의존합니다.
- `MonsterCombatBehaviour` 클래스를 상속받습니다.

## 관련 클래스
- `MonsterCombatBehaviour`: 몬스터 전투 행동을 정의하는 클래스
- `TargetSystem`: 타겟 시스템을 관리하는 클래스
- `MonsterAbilityBehaviour`: 몬스터 능력 행동을 정의하는 클래스
- `MonsterAbilityHandler`: 몬스터 능력 핸들러를 정의하는 클래스