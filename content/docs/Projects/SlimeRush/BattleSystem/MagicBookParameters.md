+++
title = "MagicBookParameters"
description = "마법책 생성을 위한 매개변수를 담고 있는 구조체"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 205
+++
## 개요
`MagicBookParameters` 구조체는 마법책([`MagicBook`](/docs/projects/SlimeRush/BattleSystem/MagicBook)) 생성을 위한 매개변수를 담고 있는 구조체입니다. 이 구조체는 마법책 생성 시 필요한 모든 정보를 캡슐화하여 [`MagicBookCreator`](/docs/projects/SlimeRush/BattleSystem/MagicBookCreator)에 전달합니다.

## 역할
- 마법책([`MagicBook`](/docs/projects/SlimeRush/BattleSystem/MagicBook)) 생성에 필요한 매개변수를 하나의 구조체로 통합
- [`MagicBookCreator`](/docs/projects/SlimeRush/BattleSystem/MagicBookCreator)에 마법책 생성 정보를 전달
- 마법책 생성 프로세스의 데이터 캡슐화

## 선언
```csharp
public struct MagicBookParameters
```

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
- 마법책(
  [`MagicBook`](/docs/projects/SlimeRush/BattleSystem/MagicBook)) 생성에 필요한 모든 매개변수를 하나의 구조체로 통합
- 코드의 가독성과 유지보수성 향상
- 매개변수 전달의 일관성 보장
- 읽기 전용 설계

## 의존성/상속 관계
- `MagicInfo` 클래스에 의존
- `PlayerDataInfo` 클래스에 의존
- [`MagicBookLibrary`](/docs/projects/SlimeRush/BattleSystem/MagicBookLibrary) 클래스에서 필요에 의해 해당 구조체 생성
- [`MagicBook`](/docs/projects/SlimeRush/BattleSystem/MagicBook) 클래스 생성에 필요한 파라메터 포함
- [`MagicBookCreator`](/docs/projects/SlimeRush/BattleSystem/MagicBookCreator) 클래스에서 해당 구조체를 파라메터로 사용

## 사용 예시
#### [`MagicBookLibrary`](/docs/projects/SlimeRush/BattleSystem/MagicBookLibrary)에서 마법 생성시 [`MagicBookCreator`](/docs/projects/SlimeRush/BattleSystem/MagicBookCreator)로 해당 구조체를 파라메터로 전달
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