+++
title = "TargetSystem"
description = "SlimeRush 게임의 전투 시스템에서 타겟을 관리하는 클래스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 217
+++
## 개요
`TargetSystem` 클래스는 SlimeRush 게임의 전투 시스템에서 타겟([`ITarget`](/docs/projects/SlimeRush/BattleSystem/ITarget))을 관리하는 클래스입니다. 이 클래스는 플레이어 타겟과 적 타겟을 관리하고, 타겟을 찾는 기능을 제공합니다.

## 역할
- 타겟([`ITarget`](/docs/projects/SlimeRush/BattleSystem/ITarget)) 관리
- 플레이어 타겟 초기화
- 적 타겟 추가 및 제거
- 타겟 찾기

## 멤버
### 속성
```csharp
/// <summary>
/// 타겟 스캐너를 의존성 주입받는 필드입니다.
/// 타겟 탐색 및 위치 찾기 기능을 제공합니다.
/// </summary>
[Inject]
private TargetScanner targetScanner;

/// <summary>
/// 현재 플레이어 타겟을 반환합니다.
/// </summary>
public ITarget PlayerTarget => _player;

/// <summary>
/// 현재 플레이어 타겟을 저장하는 필드입니다.
/// </summary>
private ITarget _player;

/// <summary>
/// 플레이어가 초기화되었는지 여부를 나타내는 플래그입니다.
/// </summary>
private bool _playerInit;

/// <summary>
/// 현재 등록된 적 타겟들을 저장하는 HashSet입니다.
/// 중복 등록을 방지하고 빠른 탐색을 위해 사용됩니다.
/// </summary>
private HashSet<ITarget> _enemies = new();

/// <summary>
/// 기본 스캔 반경입니다.
/// 타겟 탐색 시 기본으로 사용되는 반경 값입니다.
/// </summary>
private const float DefaultScanRadius = 10f;

/// <summary>
/// 기본 방향 거리입니다.
/// 플레이어 앞쪽 위치를 계산할 때 사용되는 기본 거리 값입니다.
/// </summary>
private const float DefaultDirectionDistance = 10f;

/// <summary>
/// 마우스 레이캐스트의 최대 거리입니다.
/// 마우스로 지정한 위치를 감지할 때 사용됩니다.
/// </summary>
private const float MouseRaycasyMaxDistance = 50.0f;

/// <summary>
/// 마우스 레이캐스트 타겟 레이어 이름입니다.
/// 마우스로 지정한 위치를 감지할 때 사용되는 레이어입니다.
/// </summary>
private const string MouseRaycastLayerName = "MouseRaycastTarget";
```

### 메서드
```csharp
/// <summary>
/// 플레이어를 초기화합니다.
/// </summary>
/// <param name="player">플레이어 타겟</param>
public void InitPlayer(ITarget player)

/// <summary>
/// 플레이어가 초기화되었는지 확인합니다.
/// </summary>
/// <returns>플레이어 초기화 여부</returns>
public bool IsPlayerInit()

/// <summary>
/// 적을 추가합니다.
/// </summary>
/// <param name="enemy">적 타겟</param>
public void AddEnemy(ITarget enemy)

/// <summary>
/// 적 타겟을 제거합니다.
/// </summary>
/// <param name="enemy">적 타겟</param>
public void RemoveEnemy(ITarget enemy)

/// <summary>
/// 타겟을 찾습니다.
/// </summary>
/// <param name="scanPoint">스캔 위치</param>
/// <param name="magicTargetType">마법 타겟 타입</param>
/// <param name="targetRadius">타겟 반경</param>
/// <returns>찾은 타겟</returns>
public ITarget FindTarget(
    Vector3 scanPoint, MagicTargetType magicTargetType, float targetRadius = DefaultScanRadius)

/// <summary>
/// 타겟을 여러 개 찾습니다.
/// </summary>
/// <param name="scanPoint">스캔 위치</param>
/// <param name="magicTargetType">마법 타겟 타입</param>
/// <param name="targetLength">찾을 타겟 수</param>
/// <param name="targetRadius">타겟 반경</param>
/// <returns>찾은 타겟 배열</returns>
public ITarget[] FindTargets(
    Vector3 scanPoint, MagicTargetType magicTargetType, int targetLength, float targetRadius = DefaultScanRadius)

/// <summary>
/// 위치를 찾습니다.
/// </summary>
/// <param name="scanPoint">스캔 위치</param>
/// <param name="magicTargetType">마법 타겟 타입</param>
/// <param name="targetRadius">타겟 반경</param>
/// <returns>찾은 위치</returns>
public Vector3 FindPosition(Vector3 scanPoint, MagicTargetType magicTargetType, float targetRadius = DefaultScanRadius)

/// <summary>
/// 위치를 여러 개 찾습니다.
/// </summary>
/// <param name="scanPoint">스캔 위치</param>
/// <param name="magicTargetType">마법 타겟 타입</param>
/// <param name="targetLength">찾을 위치 수</param>
/// <param name="targetRadius">타겟 반경</param>
/// <returns>찾은 위치 배열</returns>
public Vector3[] FindPositions(Vector3 scanPoint, MagicTargetType magicTargetType, int targetLength,
    float targetRadius = DefaultScanRadius)
    
/// <summary>
/// 플레이어의 앞 위치를 가져옵니다.
/// </summary>
/// <returns>플레이어의 앞 위치</returns>
private Vector3 GetPlayerForward()

/// <summary>
/// 마우스 위치를 가져옵니다.
/// </summary>
/// <param name="resultPos">결과 위치</param>
/// <returns>마우스 위치 가져오기 성공 여부</returns>
public bool TryGetMousePosition(out Vector3 resultPos)
```

## 주요 코드 스니펫
### 타겟 찾기
```csharp
public ITarget FindTarget(
    Vector3 scanPoint, MagicTargetType magicTargetType, float targetRadius = DefaultScanRadius)
{
    // 마법 타겟 타입에 따라 다른 타겟 찾기 방법을 사용합니다
    switch (magicTargetType)
    {
        case MagicTargetType.RandomTarget:
            // 랜덤 타겟을 찾습니다
            var randomTarget = targetScanner.FindRandomTarget(scanPoint,_enemies.ToArray(), targetRadius);
            return randomTarget;
        case MagicTargetType.Nearest:
            // 가장 가까운 타겟을 찾습니다
            var nearTarget = targetScanner.FindNearestTarget(scanPoint,_enemies.ToArray(), targetRadius);
            return nearTarget;
        default:
            // 지원하지 않는 타입인 경우 null을 반환합니다
            return null;
    }
}

public ITarget[] FindTargets(
    Vector3 scanPoint, MagicTargetType magicTargetType, int targetLength, float targetRadius = DefaultScanRadius)
{
    // 마법 타겟 타입에 따라 다른 타겟 찾기 방법을 사용합니다
    switch (magicTargetType)
    {
        case MagicTargetType.RandomTarget:
            // 랜덤 타겟을 여러 개 찾습니다
            var randomTargets = targetScanner.FindRandomTarget(
                scanPoint, _enemies.ToArray(),targetLength, targetRadius);
            return randomTargets?.ToArray();
        case MagicTargetType.Nearest:
            // 가장 가까운 타겟을 여러 개 찾습니다
            var nearTargets = targetScanner.FindNearestTarget(
                scanPoint, _enemies.ToArray(), targetLength, targetRadius);
            return nearTargets?.ToArray();
        default:
            // 지원하지 않는 타입인 경우 null을 반환합니다
            return null;
    }
}
```

### 위치 찾기
```csharp
public Vector3 FindPosition(Vector3 scanPoint, MagicTargetType magicTargetType, float targetRadius = DefaultScanRadius)
{
    // 마법 타겟 타입에 따라 다른 위치 찾기 방법을 사용합니다
    switch (magicTargetType)
    {
        default:
        case MagicTargetType.None:
            // 랜덤 위치를 찾습니다
            return targetScanner.FindRandomPosition(scanPoint, targetRadius);
        case MagicTargetType.Mouse:
        {
            // 마우스 위치를 가져오고, 실패하면 플레이어 앞 위치를 사용합니다
            return TryGetMousePosition(out var resultPos) ? resultPos : GetPlayerForward();
        }
    }
}

public Vector3[] FindPositions(Vector3 scanPoint, MagicTargetType magicTargetType, int targetLength,
    float targetRadius = DefaultScanRadius)
{
    // 마법 타겟 타입에 따라 다른 위치 찾기 방법을 사용합니다
    switch (magicTargetType)
    {
        default:
        case MagicTargetType.None:
            // 랜덤 위치를 여러 개 찾습니다
            return targetScanner.FindRandomPosition(scanPoint, targetLength, targetRadius);
        case MagicTargetType.Mouse:
        {
            // 마우스 위치를 가져오고, 실패하면 플레이어 앞 위치를 사용합니다
            return new Vector3[] { TryGetMousePosition(out var resultPos) ? resultPos : GetPlayerForward() };
        }
    }
}
```

## 기능 설명
### 플레이어 설정
- 플레이어 타겟을 설정 및 반환([`ITarget`](/docs/projects/SlimeRush/BattleSystem/ITarget))
- 플레이어 타겟 초기화 여부 확인

### 몬스터 설정
- 몬스터 타겟([`ITarget`](/docs/projects/SlimeRush/BattleSystem/ITarget))을 추가 및 제거

### 타겟([`ITarget`](/docs/projects/SlimeRush/BattleSystem/ITarget)) 찾기
- 타겟 타입(`MagicTargetType`)에 따라 타겟 반환(([`ITarget`](/docs/projects/SlimeRush/BattleSystem/ITarget)))
- 가장 가까운 타겟 반환
- 랜덤한 타겟 반환

### 위치(`Vector3`) 찾기
- 타겟 타입(`MagicTargetType`)에 따라 위치(`Vector3`) 반환
- 마우스 위치 반환

## 의존성/상속 관계
- `MonoBehaviour`를 상속받음
- ([`ITarget`](/docs/projects/SlimeRush/BattleSystem/ITarget)) 인터페이스 등록 및 관리
- `MagicTargetType` 열거형과 [`TargetScanner`](/docs/projects/SlimeRush/BattleSystem/TargetScanner) 클래스를 호출해 조건에 맞는 타겟 및 위치 반환

## 사용 예시
#### [`CommonMonsterCombat`](/docs/projects/SlimeRush/BattleSystem/CommonMonsterCombat)에서 플레이어 타겟의 초기화 여부(`bool`)를 확인하여 몬스터 동작
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

#### `BaseMonster`에서 몬스터가 초기화 시 `TargetSystem`에 등록, 사망 시 `TargetSystem`에서 제거
```csharp
public void RegisterTarget()
{
    _targetSystem.AddEnemy(this);
}

public void DeregisterTarget()
{
    _targetSystem.RemoveEnemy(this);
}
```

#### [`MagicBook`](/docs/projects/SlimeRush/BattleSystem/MagicBook) 에서 타겟팅 프로세스 설정 시 `TargetSystem`의 메서드 사용
```csharp
private IEnumerator SetTargetingProcess(TargetingOption option)
{
    // 타겟 타입이 자기 자신인 경우 자신을 대상으로 공격하는 코루틴을 반환합니다.
    if (option.TargetType == MagicTargetType.Self)
    {
        return CoSearchSelf(CastToTarget);
    }

    // 타겟 수를 확인하여 단일 타겟인지 여부를 결정합니다.
    var isSingleTarget = option.TargetCount <= 1;

    // 단일 타겟인 경우 타겟 타입에 따라 다른 코루틴을 반환합니다.
    if (isSingleTarget)
    {
        switch (option.TargetType)
        {
            case MagicTargetType.None:
            case MagicTargetType.Mouse:
                // 마우스 위치를 찾고 해당 위치를 대상으로 공격하는 코루틴을 반환합니다.
                return
                    CoSearch(CastToPosition,
                        type =>
                        {
                            // 마우스 위치를 찾습니다.
                            Vector3 position = targetSystem.FindPosition(_player.GetPosition(), option.TargetType,
                                option.TargetingRange);
                            return new Vector3[] {position};
                        });
            case MagicTargetType.Nearest:
            case MagicTargetType.RandomTarget:
                // 가장 가까운 또는 랜덤 타겟을 찾고 해당 타겟을 대상으로 공격하는 코루틴을 반환합니다.
                return
                    CoSearch(CastToTarget,
                        type =>
                        {
                            // 타겟을 찾습니다.
                            ITarget target = targetSystem.FindTarget(_player.GetPosition(), option.TargetType,
                                option.TargetingRange);
                            return new ITarget[] { target };
                        });
        }
    }
    else
    {
        // 다중 타겟인 경우 타겟 타입에 따라 다른 코루틴을 반환합니다.
        switch (option.TargetType)
        {
            case MagicTargetType.None:
            case MagicTargetType.Mouse:
                // 여러 마우스 위치를 찾고 해당 위치를 대상으로 공격하는 코루틴을 반환합니다.
                return
                    CoSearch(CastToPosition,
                        type => targetSystem.FindPositions(
                            _player.GetPosition(),
                            option.TargetType,
                            option.TargetCount,
                            option.TargetingRange));
            case MagicTargetType.Nearest:
            case MagicTargetType.RandomTarget:
                // 여러 타겟을 찾고 해당 타겟을 대상으로 공격하는 코루틴을 반환합니다.
                return
                    CoSearch(CastToTarget,
                        type => targetSystem.FindTargets(
                            _player.GetPosition(),
                            option.TargetType,
                            option.TargetCount,
                            option.TargetingRange));
        }
    }
    return null;
}
```

## 관련 클래스
- [`TargetScanner`](/docs/projects/SlimeRush/BattleSystem/TargetScanner)
- [`TargetingOption`](/docs/projects/SlimeRush/BattleSystem/TargetingOption)
- [`MagicBook`](/docs/projects/SlimeRush/BattleSystem/MagicBook)
- [`CommonMonsterCombat`](/docs/projects/SlimeRush/BattleSystem/CommonMonsterCombat)