+++
title = "MonsterCombatBehaviour"
description = "몬스터 전투 시스템에서 게임의 상태에 따라 몬스터 전투 행동을 관리하는 클래스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 201
+++
## 개요
`MonsterCombatBehaviour` 클래스는 SlimeRush 게임의 몬스터 전투 시스템에서 몬스터 전투 행동을 관리하는 클래스입니다. 이 클래스는 게임 상태 변경에 따라 몬스터의 전투 행동을 제어하는 기능을 제공합니다.

## 역할
- 게임 상태 변경에 따른 전투 행동 제어
- 일시 정지 및 재생 이벤트 처리

## 멤버
### 이벤트
```csharp
/// <summary>
/// 게임이 일시 중지될 때 발생하는 이벤트입니다.
/// 몬스터의 전투 행동을 일시 중지할 때 사용됩니다.
/// </summary>
protected event Action OnPausedEvent;

/// <summary>
/// 게임이 재개될 때 발생하는 이벤트입니다.
/// 몬스터의 전투 행동을 재개할 때 사용됩니다.
/// </summary>
protected event Action OnPlayEvent;
```

### 속성
```csharp
/// <summary>
/// 게임 상태를 관찰하는 인터페이스입니다.
/// 게임 상태 변경을 감지하여 전투 행동을 제어합니다.
/// </summary>
[Inject]
private IGameStateObservable _gameState;
```

### 메서드
```csharp
/// <summary>
/// 게임 상태가 변경될 때 호출됩니다.
/// </summary>
/// <param name="state">변경된 게임 상태</param>
private void OnChangedGameState(GameState state)
```

## 주요 코드 스니펫
### 게임 상태 변경
```csharp
private void OnChangedGameState(GameState state)
{
    // IGameStateObservable에서 GameState를 파라메터로 한 이벤트 발생시
    // Play이벤트
    if (state == GameState.Play)
    {
        OnPlayEvent?.Invoke();
    }
    else
    {
        OnPausedEvent?.Invoke();
    }
}
```

## 기능 설명
### 게임 상태 변경
- 게임 상태가 Play인 경우 재생 이벤트를 호출합니다.(서브클래스: `CommonMonsterCombat`)
- 게임 상태가 Play가 아닌 경우 일시 정지 이벤트를 호출합니다.(서브클래스: `CommonMonsterCombat`)

## 의존성/상속 관계
- `MonoBehaviour`를 상속받습니다.
- `Common.GameStates` 네임스페이스에 의존합니다.

## 사용 예시
#### `GameSystem`에서 게임 상태 변환시 이벤트 발생
```csharp
// MonsterCombatBehaviour에서 IGameStateObservable의 이벤트 구독
private void OnEnable()
{
    _gameState.OnChangedGameState += OnChangedGameState;
}

// CommonMonsterCombat가 활성화 될때 Base클래스의 이벤트 구독
private void OnEnable()
{
    // 몬스터 능력 변경 이벤트를 구독합니다
    // 몬스터의 능력이 변경될 때 전투 설정을 업데이트합니다
    monsterAbilityBehaviour.OnAbilityChanged += OnSetupSetupMonsterCombat;

    // 재생 이벤트를 구독합니다
    // 게임이 재생될 때 거리 체크 코루틴을 시작합니다
    OnPlayEvent += OnPlayed;

    // 일시 정지 이벤트를 구독합니다
    // 게임이 일시 정지될 때 거리 체크 코루틴을 중지합니다
    OnPausedEvent += OnPaused;

    // 거리 체크 간격을 설정합니다
    // 몬스터와 플레이어 사이의 거리를 주기적으로 체크하기 위한 대기 시간을 설정합니다
    _checkDelay = new WaitForSeconds(CheckInterval);
}


// IGameStateObservable을 구현한 GameSystem에서 이벤트 발생
public void UpdateGameState<T>(GameState gameState, T popupData)
{
    ...
    
    OnChangedGameState?.Invoke(gameState);
}

// MonsterCombatBehaviour의 이벤트 리스터에서 다시 이벤트 발생
private void OnChangedGameState(GameState state)
{
    if (state == GameState.Play)
    {
        OnPlayEvent?.Invoke();
    }
    else
    {
        OnPausedEvent?.Invoke();
    }
}

// MonsterCombatBehaviour의 서브클래스 CommonMonsterCombat에서 해당 이벤트를 통해 몬스터 행동 제어
private void OnPlayed()
{
    // 거리 체크 코루틴을 시작합니다
    // 게임이 재생될 때 몬스터와 플레이어 사이의 거리를 주기적으로 체크하는 코루틴을 시작합니다
    _distanceCoroutine = StartCoroutine(CoCheckDistance());
}

private void OnPaused()
{
    // 거리 체크 코루틴이 실행 중이면 중지합니다
    // 게임이 일시 정지될 때 몬스터의 거리 체크를 중지하여 성능을 최적화합니다
    if (_distanceCoroutine != null) StopCoroutine(_distanceCoroutine);
}
```

## 관련 클래스
- `IGameStateObservable`
- `GameState`