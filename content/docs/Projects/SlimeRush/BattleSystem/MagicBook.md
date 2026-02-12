+++
title = "MagicBook"
description = "SlimeRush 게임의 마법 시스템에서 마법 쿨타임 관리 및 마법 캐스팅을 담당하는 클래스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 204
+++
## 개요
`MagicBook` 클래스는 SlimeRush 게임의 마법 시스템에서 마법 쿨타임 관리 및 마법 캐스팅을 담당하는 클래스입니다. 이 클래스는 플레이어의 마법 정보(
[`마법시트데이터(예시)`](/docs/projects/SlimeRush/BattleSystem/ExampleMagicSheetData))를 기반으로 마법(`Magic`)을 생성하고, 타겟을 검색([`TargetSystem`](/docs/projects/SlimeRush/BattleSystem/TargetSystem))하여 마법을 시전하는 기능을 제공합니다.

## 역할
- 마법 쿨타임 관리
- 타겟 검색([`TargetSystem`](/docs/projects/SlimeRush/BattleSystem/TargetSystem)) 및 마법 시전
- 마법 정보([`마법시트데이터(예시)`](/docs/projects/SlimeRush/BattleSystem/ExampleMagicSheetData)) 업데이트

## 선언
```csharp
public class MagicBook : MonoBehaviour
```

## 멤버
### 이벤트
```csharp
/// <summary>
/// 마법 시전 이벤트
/// </summary>
public event Action<string, float> OnCastMagic;
```

### 속성
```csharp
/// <summary>
/// 타겟 시스템
/// 타겟을 찾고 관리하는 시스템입니다.
/// </summary>
[Inject]
private TargetSystem targetSystem;

/// <summary>
/// 게임 상태 관찰자
/// 게임 상태 변화를 관찰하고 알리는 인터페이스입니다.
/// </summary>
[Inject]
private IGameStateObservable _gameSystem;

/// <summary>
/// 마법 팩토리
/// 마법 객체를 생성하는 팩토리입니다.
/// </summary>
[Inject]
private MagicHolderFactory _magicFactory;

/// <summary>
/// 마법 프리팹
/// 마법 객체의 프리팹입니다.
/// </summary>
[SerializeField]
private Magic magicPrefab;

/// <summary>
/// 마법 효과
/// 마법 시전 효과를 관리하는 객체입니다.
/// </summary>
[Inject]
private MagicEffect _magicEffect;

/// <summary>
/// 마법 ID
/// 현재 사용 중인 마법의 ID입니다.
/// </summary>
private string _magicId;

/// <summary>
/// 계산된 쿨타임
/// 마법의 쿨타임을 계산한 값입니다.
/// </summary>
private float _calculatedCoolTime;
public float CalculatedCoolTime => _calculatedCoolTime;

/// <summary>
/// 남은 쿨타임
/// 마법의 남은 쿨타임입니다.
/// </summary>
private float _remainCoolTime = 0;
public float RemainCoolTime => _remainCoolTime;

/// <summary>
/// 타겟팅 옵션
/// 마법의 타겟팅 옵션을 설정합니다.
/// </summary>
private TargetingOption _targetingOption;

/// <summary>
/// 쿨타임 체커 코루틴
/// 쿨타임을 체크하는 코루틴입니다.
/// </summary>
private Coroutine _coolTimeChecker;

/// <summary>
/// 쿨타임 대기 시간
/// 쿨타임을 대기하는 시간입니다.
/// </summary>
private WaitForSeconds _coolTime;

/// <summary>
/// 플레이어 정보
/// 플레이어의 데이터를 포함하는 정보입니다.
/// </summary>
private PlayerDataInfo _playerInfo;

/// <summary>
/// 마법 정보
/// 마법의 세부 정보를 포함하는 객체입니다.
/// </summary>
private MagicInfo _magicInfo;

/// <summary>
/// 플레이어 타겟
/// 플레이어의 타겟 인터페이스입니다.
/// </summary>
private ITarget _player;

/// <summary>
/// 일시 정지 여부
/// 게임이 일시 정지 상태인지 여부를 나타냅니다.
/// </summary>
private bool _isPause = false;

/// <summary>
/// 검색 루틴 코루틴
/// 타겟을 검색하는 코루틴입니다.
/// </summary>
private Coroutine _searchRoutine;

/// <summary>
/// 타겟 검색기 코루틴
/// 타겟을 검색하는 코루틴입니다.
/// </summary>
private IEnumerator _targetSearcher;

/// <summary>
/// 타겟 검색 지연 시간
/// 타겟을 검색하는 시간 간격입니다.
/// </summary>
private const float TargetSearchDelay = 0.1f;

/// <summary>
/// 타겟 검색 대기 시간
/// 타겟을 검색하는 대기 시간입니다.
/// </summary>
private WaitForSeconds _targetSearchSeconds;

/// <summary>
/// 마법 그룹 ID 가져오기
/// 현재 마법의 그룹 ID를 반환합니다.
/// </summary>
public string GetMagicGroupId => _magicInfo.groupId;

/// <summary>
/// 마법 정보 가져오기
/// 현재 마법의 정보를 반환합니다.
/// </summary>
public MagicInfo GetMagicInfo => _magicInfo;
```

### 메서드
```csharp
/// <summary>
/// 마법 시전 네이티브 메서드
/// 마법이 시전될 때 호출되어 마법 시전 이벤트를 발생시킵니다.
/// </summary>
/// <param name="magicId">마법 ID</param>
/// <param name="castTime">시전 시간</param>
private void OnCastMagicNative(string magicId, float castTime)

/// <summary>    
/// 게임 상태 변경 메서드
/// 게임 상태가 변경될 때 호출되어 일시 정지 상태를 설정합니다.
/// </summary>
/// <param name="gameState">게임 상태</param>
private void OnChangedGameState(GameState gameState)

/// <summary>
/// 플레이어 정보 업데이트 메서드
/// 플레이어 정보가 업데이트될 때 호출되어 플레이어 정보를 갱신하고 마법책 정보를 업데이트합니다.
/// </summary>
/// <param name="playerDataInfo">플레이어 데이터 정보</param>
public void OnUpdatedPlayerInfo(PlayerDataInfo playerDataInfo)

/// <summary>
/// 마법 정보 업데이트 메서드
/// 마법 정보가 업데이트될 때 호출되어 마법 정보를 갱신하고 마법책 정보를 업데이트합니다.
/// </summary>
/// <param name="magicInfo">마법 정보</param>
public void OnUpdatedMagicInfo(MagicInfo magicInfo)

/// <summary>
/// 마법책 초기화 메서드
/// 마법책을 초기화하여 마법 정보, 플레이어 정보, 타겟팅 옵션을 설정합니다.
/// </summary>
/// <param name="magicInfo">마법 정보</param>
/// <param name="playerDataInfo">플레이어 데이터 정보</param>
public void InitializeMagicBook(MagicInfo magicInfo, PlayerDataInfo playerDataInfo)

/// <summary>
/// 마법책 업데이트 메서드
/// 마법책의 쿨타임과 타겟팅 옵션을 다시 계산하여 업데이트합니다.
/// </summary>
private void UpdateMagicBook()

/// <summary>
/// 타겟으로 마법 시전 메서드
/// 타겟을 대상으로 마법을 시전합니다.
/// </summary>
/// <param name="targets">타겟 배열</param>
private void CastToTarget(ITarget[] targets)

/// <summary>
/// 위치로 마법 시전 메서드
/// 위치를 대상으로 마법을 시전합니다.
/// </summary>
/// <param name="positions">위치 배열</param>
private void CastToPosition(Vector3[] positions)

/// <summary>
/// 자기 자신을 대상으로 검색하는 코루틴
/// 자신을 대상으로 마법을 시전하는 코루틴입니다.
/// </summary>
/// <param name="castAction">시전 액션</param>
/// <returns>코루틴</returns>
private IEnumerator CoSearchSelf(Action<ITarget[]> castAction)

/// <summary>
/// 타겟을 검색하는 코루틴
/// 타겟을 검색하고 마법을 시전하는 코루틴입니다.
/// </summary>
/// <param name="castAction">시전 액션</param>
/// <param name="findMethod">타겟 찾기 메서드</param>
/// <returns>코루틴</returns>
private IEnumerator CoSearch<T>(Action<T> castAction, Func<MagicTargetType, T> findMethod)

/// <summary>
/// 타겟팅 프로세스를 설정하는 메서드
/// 타겟팅 옵션을 기반으로 타겟팅 프로세스를 설정합니다.
/// </summary>
/// <param name="option">타겟팅 옵션</param>
/// <returns>코루틴</returns>
private IEnumerator SetTargetingProcess(TargetingOption option)
```

## 주요 코드 스니펫
### 마법책 초기화
```csharp
public void InitializeMagicBook(MagicInfo magicInfo, PlayerDataInfo playerDataInfo)
{
    // 마법의 세부 정보를 포함하는 객체를 설정합니다.
    _magicInfo = magicInfo;

    // 플레이어의 데이터를 포함하는 정보를 설정합니다.
    _playerInfo = playerDataInfo;

    // 플레이어의 타겟 인터페이스를 설정합니다.
    _player = targetSystem.PlayerTarget;

    // 마법의 명중 횟수와 공격 반복 횟수 중 큰 값을 타겟 수로 설정합니다.
    var targetCount = Mathf.Max(magicInfo.hitCount, magicInfo.attackRepeatCount);

    // 마법의 타겟팅 타입, 타겟 수, 타겟팅 범위를 설정합니다.
    _targetingOption = new TargetingOption(magicInfo.targetingType, targetCount, magicInfo.attackRange);

    // 타겟팅 옵션을 기반으로 타겟팅 프로세스를 설정합니다.
    _targetSearcher = SetTargetingProcess(_targetingOption);

    // 마법책이 초기화되었음을 표시합니다.
    _isInitialized = true;

    // 마법책 정보를 업데이트합니다
    UpdateMagicBook();
}

private void UpdateMagicBook()
{
    // 기존 검색 루틴이 실행 중이면 중지합니다
    if (_searchRoutine.IsNotNull()) StopCoroutine(_searchRoutine);

    // 새로운 검색 루틴을 시작합니다
    _searchRoutine = StartCoroutine(_targetSearcher);

    // 마법 ID를 추출합니다 (첫 번째 언더스코어 전까지)
    _magicId = _magicInfo.id.Substring(0, _magicInfo.id.IndexOf("_", StringComparison.Ordinal));

    // 마법의 공격 속도와 플레이어의 공격 속도를 기반으로 쿨타임을 계산합니다.
    _calculatedCoolTime = CommonBattleManager.GetCoolTime(_magicInfo.attackSpeed, _playerInfo.AttackSpeed);

    // 계산된 쿨타임을 기반으로 대기 시간을 설정합니다.
    _coolTime = new WaitForSeconds(_calculatedCoolTime);
}
```

### 타겟팅 프로세스 설정
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
                // 마우스 위치를 찾고 해당 위치를 대상으로 공격하는 코루틴을 반환합니다.
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
    // 지원하지 않는 타겟 타입인 경우 null을 반환합니다.
    return null;
}
```


### 타겟을 대상으로 마법 시전
```csharp
private void CastToTarget(ITarget[] targets)
{
    // 타겟 배열이 null인 경우 처리하지 않습니다
    if (targets.IsNull()) return;

    // 타겟 배열에서 null이 아닌 타겟만 필터링합니다.
    var validTarget = targets.Where(t => t.IsNotNull()).ToArray();

    // 유효한 타겟이 없는 경우 처리하지 않습니다
    if (validTarget.Length == 0) return;

    // 마법을 생성할 위치를 플레이어의 현재 위치로 설정합니다.
    var createPos = _player.GetPosition();

    // 마법 팩토리를 사용하여 마법 객체를 생성합니다.
    var magic = _magicFactory.Create(new MagicParams(magicPrefab, createPos, _playerInfo, _magicInfo));

    // 생성된 마법 객체를 사용하여 타겟을 공격합니다.
    magic.AttackToTarget(_player, validTarget);
}
```

### 위치를 대상으로 마법 시전
```csharp
private void CastToPosition(Vector3[] positions)
{
    // 위치 배열이 null인 경우 처리하지 않습니다
    if (positions.IsNull()) return;

    // 마법을 생성할 위치를 플레이어의 현재 위치로 설정합니다.
    var createPos = _player.GetPosition();

    // 마법 팩토리를 사용하여 마법 객체를 생성합니다.
    var magic = _magicFactory.Create(new MagicParams(magicPrefab, createPos, _playerInfo, _magicInfo));

    // 생성된 마법 객체를 사용하여 위치를 공격합니다.
    magic.AttackToPosition(_player, positions);
}
```

### 자신을 대상으로 마법 시전
```csharp
private IEnumerator CoSearchSelf(Action<ITarget[]> castAction)
{
    // 남은 쿨타임을 계산된 쿨타임으로 초기화합니다.
    _remainCoolTime = _calculatedCoolTime;

    while (true)
    {
        // 게임이 일시 정지 상태인 경우 일시 정지가 해제될 때까지 대기합니다.
        yield return new WaitUntil(() => !_isPause);

        // 쿨타임이 0 이하인 경우 마법을 시전합니다.
        if (_remainCoolTime <= 0)
        {
            // 마법 시전 효과를 재생하여 마법을 시전합니다.
            _magicEffect.CastingMagic(_player, _magicInfo.attackObjectID, _calculatedCoolTime);

            // 자신을 대상으로 마법을 시전합니다.
            castAction(new [] { _player });

            // 남은 쿨타임을 계산된 쿨타임으로 초기화합니다.
            _remainCoolTime = _calculatedCoolTime;
        }
        else
        {
            // 쿨타임이 0 이하인 경우 쿨타임을 0으로 설정합니다.
            if (_remainCoolTime <= 0)
            {
                _remainCoolTime = 0;
            }
            else
            {
                // 남은 쿨타임을 감소시킵니다.
                _remainCoolTime -= TargetSearchDelay;
            }
        }
        // 다음 타겟 검색까지 대기합니다.
        yield return _targetSearchSeconds;
    }
}
```



### 타겟 검색 코루틴
```csharp
private IEnumerator CoSearch<T>(Action<T> castAction, Func<MagicTargetType, T> findMethod)
{
    // 남은 쿨타임을 계산된 쿨타임으로 초기화합니다.
    _remainCoolTime = _calculatedCoolTime;

    while (true)
    {
        // 게임이 일시 정지 상태인 경우 일시 정지가 해제될 때까지 대기합니다.
        yield return new WaitUntil(() => !_isPause);

        // 타겟을 찾는 메서드를 호출하여 타겟을 찾습니다.
        var result = findMethod(_magicInfo.targetingType);

        // 타겟이 존재하고 쿨타임이 0 이하인 경우 마법을 시전합니다.
        if (result.IsNotNull() && _remainCoolTime <= 0)
        {
            // 마법 시전 효과를 재생하여 마법을 시전합니다.
            _magicEffect.CastingMagic(_player, _magicInfo.attackObjectID, _calculatedCoolTime);

            // 타겟을 공격합니다.
            castAction(result);

            // 남은 쿨타임을 계산된 쿨타임으로 초기화합니다.
            _remainCoolTime = _calculatedCoolTime;
        }
        else
        {
            // 쿨타임이 0 이하인 경우 쿨타임을 0으로 설정합니다.
            if (_remainCoolTime <= 0)
            {
                _remainCoolTime = 0;
            }
            else
            {
                // 남은 쿨타임을 감소시킵니다.
                _remainCoolTime -= TargetSearchDelay;
            }
        }

        // 다음 타겟 검색까지 대기합니다.
        yield return _targetSearchSeconds;
    }
}
```

## 기능 설명
### 마법책 초기화 프로세스
- 마법 정보([`마법시트데이터(예시)`](/docs/projects/SlimeRush/BattleSystem/ExampleMagicSheetData)) 캐싱 및 업데이트
- 플레이어 정보([`플레이어시트데이터(예시)`](/docs/projects/SlimeRush/BattleSystem/ExamplePlayerSheetData)) 캐싱 및 업데이트
- 타겟팅 옵션([`TargetingOption`](/docs/projects/SlimeRush/BattleSystem/TargetingOption)) 및 프로세스 설정

### 타겟팅 프로세스 설정
- 타겟 타입이 자기 자신인 경우 자신의 포지션에서 발동하는 프로세스 반환.
- 단일 타겟인 경우 마우스 위치 또는 가장 가까운 또는 랜덤 타겟을 타겟팅하는 코루틴을 반환.
- 다중 타겟인 경우 마우스 위치 또는 여러 타겟을 타겟팅하는 코루틴을 반환.

### 타겟 or 위치를 대상으로 마법 시전
- `MagicHolderFactory`를 사용해 마법 생성 후 마법 시전
- 위치 기준 마법시전이면 파라메터로 `Vector3`배열을 받아 시전
- 타겟 기준 마법시전이면 Parameter를 [`ITarget`](/docs/projects/SlimeRush/BattleSystem/ITarget) 배열을 받아 시전

## 의존성/상속 관계
- `MonoBehaviour`를 상속받음
- `Magic` 컴포넌트를 가진 마법 객체 생성
- `MagicEffect` 클래스를 통해 마법 시전 효과 재생
- `MagicInfo` 구조체를 통해 마법 생성 및 정보 업데이트
- [`TargetingOption`](/docs/projects/SlimeRush/BattleSystem/TargetingOption) 구조체를 통해 타겟팅에 관련된 옵션을 설정
- [`TargetSystem`](/docs/projects/SlimeRush/BattleSystem/TargetSystem) 클래스를 통해 타겟 서칭
- [`ITarget`](/docs/projects/SlimeRush/BattleSystem/ITarget)을 통해 마법의 타겟이 되는 객체 구분

## 사용 예시
#### [`MagicBookCreator`](/docs/projects/SlimeRush/BattleSystem/MagicBookCreator)에서 마법책이 생성 될 때 `MagicBook.InitializeMagicBook(<MagicInfo>, <PlayerDataInfo>)` 호출
```csharp
public MagicBook Create(MagicBookParameters param)
{
    if (param.MagicBooksParent == null)
    {
        return null;
    }

    var magicBook = _container.InstantiatePrefabForComponent<MagicBook>(param.MagicBookPrefab);
    magicBook.transform.parent = param.MagicBooksParent.transform;
    magicBook.InitializeMagicBook(param.MagicInfo, param.PlayerInfo);
    return magicBook;
}
```

#### [`MagicBookLibrary`](/docs/projects/SlimeRush/BattleSystem/MagicBookLibrary)에서 플레이어 정보가 변경 될 때 `MagicBook.OnUpdatedPlayerInfo(<PlayerDataInfo>)` 호출
```csharp
public void UpdatePlayerInfo(PlayerDataInfo playerDataInfo)
{
    // 플레이어 정보를 업데이트합니다
    _playerData = playerDataInfo;

    // 모든 마법책에 플레이어 정보 업데이트를 알립니다
    foreach (var magicBook in _magicBooks)
    {
        magicBook.OnUpdatedPlayerInfo(_playerData);
    }
}
```

#### [`MagicBookLibrary`](/docs/projects/SlimeRush/BattleSystem/MagicBookLibrary)에서 마법 정보가 업데이트 될 때 `MagicBook.OnUpdatedMagicInfo(<MagicInfo>)` 호출
```csharp
private void UpdateMagicBook(MagicInfo magicInfo)
{
    // 동일한 그룹 ID의 마법책을 찾아 정보를 업데이트합니다
    _magicBooks
        .Find(m => m.GetMagicGroupId.Equals(magicInfo.groupId))
        .OnUpdatedMagicInfo(magicInfo);
}
```

## 관련 클래스
- [`TargetSystem`](/docs/projects/SlimeRush/BattleSystem/TargetSystem)
- [`ITarget`](/docs/projects/SlimeRush/BattleSystem/ITarget)
- [`TargetingOption`](/docs/projects/SlimeRush/BattleSystem/TargetingOption)
- [`TargetScanner`](/docs/projects/SlimeRush/BattleSystem/TargetScanner)
- [`MagicBookCreator`](/docs/projects/SlimeRush/BattleSystem/MagicBookCreator)
- [`MagicBookLibrary`](/docs/projects/SlimeRush/BattleSystem/MagicBookLibrary)
