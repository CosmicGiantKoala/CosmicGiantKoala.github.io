+++
title = "MagicBookParameters"
description = "마법책 생성을 위한 매개변수를 담고 있는 구조체"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 201
+++
## 개요
MagicBookParameters는 마법책 생성을 위한 매개변수를 담고 있는 구조체입니다. 이 구조체는 마법책 생성 시 필요한 모든 정보를 캡슐화하여 MagicBookCreator에 전달합니다.

## 역할
- 마법책 생성에 필요한 매개변수를 하나의 구조체로 통합
- MagicBookCreator에 마법책 생성 정보를 전달
- 마법책 생성 프로세스의 데이터 캡슐화

## 멤버
### 속성
```csharp
/// <summary>
/// 마법책 부모 객체
/// 생성된 마법책의 부모가 될 MagicBookLibrary 객체입니다.
/// </summary>
public MagicBookLibrary MagicBooksParent { get; }

/// <summary>
/// 마법책 프리팹
/// 마법책을 생성하는 데 사용할 프리팹입니다.
/// </summary>
public MagicBook MagicBookPrefab { get; }

/// <summary>
/// 마법 정보
/// 생성할 마법의 정보 객체입니다.
/// </summary>
public MagicInfo MagicInfo { get; }

/// <summary>
/// 플레이어 정보
/// 마법책을 소유할 플레이어의 정보입니다.
/// </summary>
public PlayerDataInfo PlayerInfo { get; }
```

### 생성자
```csharp
/// <summary>
/// MagicBookParameters 생성자
/// 마법책 생성을 위한 매개변수를 초기화합니다.
/// </summary>
/// <param name="magicBookLibrary">마법책 부모 객체</param>
/// <param name="magicBookPrefab">마법책 프리팹</param>
/// <param name="magicInfo">마법 정보</param>
/// <param name="playerInfo">플레이어 정보</param>
public MagicBookParameters(MagicBookLibrary magicBookLibrary, MagicBook magicBookPrefab, MagicInfo magicInfo,
    PlayerDataInfo playerInfo)
```

## 기능 설명
### 매개변수 캡슐화
- 마법책 생성에 필요한 모든 매개변수를 하나의 구조체로 통합
- 코드의 가독성과 유지보수성 향상
- 매개변수 전달의 일관성 보장
- 읽기 전용 설계

### 의존성 관리
- MagicBookCreator와 MagicBookLibrary 간의 의존성 분리
- 단일 책임 원칙 준수
- 코드 결합도 감소

## 의존성/상속 관계
- `MagicBookLibrary` 클래스에 의존
- `MagicBook` 클래스에 의존
- `MagicInfo` 클래스에 의존
- `PlayerDataInfo` 클래스에 의존

## 사용 예시
#### `MagicBookLibrary`에서 마법 생성시 `MagicBookCreator`로 해당 구조체를 파라메터로 전달
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

## 관련 클래스
- [`MagicBookLibrary`](/docs/projects/SlimeRush/BattleSystem/MagicBookLibrary)
- [`MagicBookCreator`](/docs/projects/SlimeRush/BattleSystem/MagicBookCreator)
- [`MagicBook`](/docs/projects/SlimeRush/BattleSystem/MagicBook)