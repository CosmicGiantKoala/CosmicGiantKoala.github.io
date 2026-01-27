+++
title = "MagicBookLibrary"
description = "마법책 생성 및 활성화된 마법책을 관리하는 클래스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 201
+++
## 개요
`MagicBookLibrary` 클래스는 SlimeRush 게임의 마법 시스템에서 활성화된 마법을 관리하는 클래스입니다. 이 클래스는 플레이어의 마법 정보를 기반으로 마법책을 생성하고, 마법책 목록을 관리합니다.

## 역할
- 활성화된 마법 관리
- 마법책 생성 및 관리
- 플레이어 정보 업데이트

## 멤버
### 속성
```csharp
/// <summary>
/// 마법 핸들러
/// 마법을 할당하고 관리하는 인터페이스입니다.
/// </summary>
[Inject]
private IMagicHandler _magicHandler;

/// <summary>
/// 마법책 생성기
/// 마법책을 생성하는 팩토리입니다.
/// </summary>
[Inject]
private MagicBookCreator _magicBookCreator;

/// <summary>
/// 업적 시스템
/// 업적을 관리하는 시스템입니다.
/// </summary>
[Inject]
private AchievementSystem _achievementSystem;

/// <summary>
/// 마법책 프리팹
/// 마법책을 생성하는 데 사용되는 프리팹입니다.
/// </summary>
[SerializeField]
private MagicBook _magicBookPrefab;

/// <summary>
/// 마법책 목록
/// 현재 활성화된 마법책들의 컬렉션입니다.
/// </summary>
private List<MagicBook> _magicBooks;

/// <summary>
/// 마법책 목록 접근자
/// 외부에서 마법책 목록에 접근할 수 있는 읽기 전용 속성입니다.
/// </summary>
public List<MagicBook> MagicBooks => _magicBooks;

/// <summary>
/// 플레이어 데이터 정보
/// 플레이어의 상태와 정보를 담고 있는 데이터 객체입니다.
/// </summary>
private PlayerDataInfo _playerData;

/// <summary>
/// 기본 마법 속성
/// 플레이어의 첫 번째 마법 속성을 나타내며, 이후 마법의 기본 속성으로 사용됩니다.
/// </summary>
public MagicElement DefaultMagicElement { get; private set; }
```

### 메서드
```csharp
/// <summary>
/// 마법 사용 기록을 저장하는 메서드
/// 개발 빌드에서 마법 사용 기록을 로그와 파일로 저장합니다.
/// </summary>
private void RecordHistory()

/// <summary>
/// 첫 번째 마법 여부를 확인하는 메서드
/// 마법책 목록이 비어있는지 확인합니다.
/// </summary>
/// <returns>첫 번째 마법 여부</returns>
private bool IsFirstMagic() => _magicBooks.Count == 0;

/// <summary>
/// 마법 정보 업데이트 처리 메서드
/// 새로운 마법이 할당되거나 기존 마법이 업데이트될 때 호출됩니다.
/// </summary>
/// <param name="magicInfo">업데이트할 마법 정보</param>
private void OnUpdatedMagic(MagicInfo magicInfo)

/// <summary>
/// 플레이어 정보 초기화 메서드
/// 플레이어 데이터를 설정하고 초기화 상태를 업데이트합니다.
/// </summary>
/// <param name="playerDataInfo">설정할 플레이어 데이터 정보</param>
public void InitPlayerInfo(PlayerDataInfo playerDataInfo)

/// <summary>
/// 플레이어 정보 업데이트 메서드
/// 플레이어 데이터를 업데이트하고 모든 마법책에 변경 사항을 알립니다.
/// </summary>
/// <param name="playerDataInfo">업데이트할 플레이어 데이터 정보</param>
public void UpdatePlayerInfo(PlayerDataInfo playerDataInfo)

/// <summary>
/// 마법책 존재 여부 확인 메서드
/// 동일한 그룹 ID의 마법책이 존재하는지 확인합니다.
/// </summary>
/// <param name="magicInfo">확인할 마법 정보</param>
/// <returns>마법책 존재 여부</returns>
private bool HasMagicBook(MagicInfo magicInfo)

/// <summary>
/// 마법책 생성 코루틴
/// 플레이어 초기화가 완료될 때까지 대기한 후 새로운 마법책을 생성합니다.
/// </summary>
/// <param name="magicInfo">생성할 마법 정보</param>
/// <returns>코루틴 enumerator</returns>
private IEnumerator CreateMagicBook(MagicInfo magicInfo)

/// <summary>
/// 마법책 업데이트 메서드
/// 기존 마법책의 정보를 새로운 마법 정보로 업데이트합니다.
/// </summary>
/// <param name="magicInfo">업데이트할 마법 정보</param>
private void UpdateMagicBook(MagicInfo magicInfo)
```

## 주요 코드 스니펫
### 마법책 생성
```csharp
private IEnumerator CreateMagicBook(MagicInfo magicInfo)
{
    // 플레이어 초기화가 완료될 때까지 대기합니다
    yield return new WaitUntil(() => _playerInitialized);
    // 마법책 생성 매개변수를 설정합니다
    var magicBookParams = new MagicBookParameters(this, _magicBookPrefab, magicInfo, _playerData);
    // 새로운 마법책을 생성합니다
    var newMagicBook = _magicBookCreator.Create(magicBookParams);
    // 첫 번째 마법책인 경우 이벤트를 호출합니다
    if (IsFirstMagic()) OnCreateDefaultMagicBook?.Invoke(newMagicBook);
    // 생성된 마법책을 목록에 추가합니다
    _magicBooks.Add(newMagicBook);
}
```

### 마법책 업데이트
```csharp
private void UpdateMagicBook(MagicInfo magicInfo)
{
    // 동일한 그룹 ID의 마법책을 찾아 정보를 업데이트합니다
    _magicBooks
        .Find(m => m.GetMagicGroupId.Equals(magicInfo.groupId))
        .OnUpdatedMagicInfo(magicInfo);
}
```

### 마법 업데이트
```csharp
private void OnUpdatedMagic(MagicInfo magicInfo)
{
    // 업적 시스템에 마법 획득을 보고합니다
    _achievementSystem.Report(magicInfo.id);

    // 첫 번째 마법인 경우 기본 속성을 설정합니다
    if (IsFirstMagic())
    {
        DefaultMagicElement = magicInfo.element;
    }

    // 이미 해당 마법이 있는 경우 업데이트합니다
    if (HasMagicBook(magicInfo))
    {
        UpdateMagicBook(magicInfo);
    }
    else
    {
        // 새로운 마법을 생성합니다
        StartCoroutine(CreateMagicBook(magicInfo));
    }
}
```

### 플레이어 정보 업데이트
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

## 기능 설명
### 마법책 생성
- 플레이어 초기화가 완료될 때까지 대기
- 마법책 생성 매개변수를 설정
- 새로운 마법책을 생성
- 첫 번째 마법책인 경우 이벤트를 호출
- 생성된 마법책을 목록에 추가

### 마법 업데이트
- 업적 시스템에 마법 획득을 보고
- 첫 번째 마법인 경우 기본 속성을 설정
- 이미 해당 마법이 있는 경우 업데이트
- 새로운 마법을 생성

### 플레이어 정보 업데이트
- 플레이어 정보를 업데이트
- 모든 마법책에 플레이어 정보를 업데이트

## 의존성/상속 관계
- `MonoBehaviour`를 상속받습니다.
- `Battle.Common` 네임스페이스에 의존합니다.
- `Common.Tools` 네임스페이스에 의존합니다.
- `Magics.Handler` 네임스페이스에 의존합니다.
- `Player.Stats` 네임스페이스에 의존합니다.
- `Reward` 네임스페이스에 의존합니다.

## 사용 예시
#### `MagicHandler`에서 마법이 할당 될 때 발생하는 이벤트로 마법 업데이트 발생
```csharp
// MagicBookLibrary.cs
_magicHandler.OnAssignMagicToPlayer += OnUpdatedMagic;

// MagicHandler.cs
public void AssignMagicToPlayer(int playerLevel, string magicId)
{
    RLog.V($"MagicSystem EquipPlayerWithMagic magicId : {magicId}");
    _magicInfoData = _gameStreamingAssets.GetMagicInfos();
    _magicInfo = GetMagicInfo(magicId);
    var magicType = _magicInfo.groupId;
    if (_myMagicInfoDic.Count > 0 && _myMagicInfoDic.ContainsKey(magicType))
    {
        _myMagicInfoDic[magicType] = _magicInfo;
    }
    else
    {
        _myMagicInfoDic.Add(magicType, _magicInfo);
    }
    OnAssignMagicToPlayer?.Invoke(_magicInfo);
}
```

#### `PlayerControl`에서 플레이어 정보가 업데이트 될 때 호출
```csharp
private void ChangedPlayerDataInfo(PlayerDataInfo dataInfo)
{
    _playerDataInfo = dataInfo;
    var playerMoveData = new PlayerMoveData()
    {

        MoveSpeed = _playerDataInfo.MoveSpeed,
        DashCooldown = _playerDataInfo.DashCooldown,
        DashCount = _playerDataInfo.DashCount,
        DashDistance = _playerDataInfo.DashDistance
    };
    UpdatePlayerData(playerMoveData);
    magicBookLibrary.UpdatePlayerInfo(_playerDataInfo);
    _playerTarget.Evasion = _playerDataInfo.Evasion;
    _playerTarget.DamageReduction = _playerDataInfo.DamageReduction;
    _healthRegeneration = _playerDataInfo.HealthRegeneration;
    _healthRegenerator.HealthRegeneration = _healthRegeneration;
    maxHp = _playerDataInfo.MaxHealthPoint;
    OnChangedPlayerMaxHp?.Invoke();
}
```

## 관련 클래스
- `IMagicHandler`
- `MagicBookCreator`
- `AchievementSystem`
- `MagicHistory`
- `MagicBook`
- `PlayerDataInfo`
- `MagicInfo`