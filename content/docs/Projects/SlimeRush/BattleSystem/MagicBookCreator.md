+++
title = "MagicBookCreator"
description = "마법책을 생성하는 팩토리 클래스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 201
+++
## 개요
MagicBookCreator는 마법책을 생성하는 팩토리 클래스입니다. Zenject의 PlaceholderFactory를 상속받아 의존성 주입을 활용한 객체 생성을 지원합니다.

## 역할
- MagicBookParameters를 사용하여 마법책 인스턴스 생성
- Zenject 의존성 주입 컨테이너를 통한 객체 관리
- 마법책 생성 프로세스의 캡슐화

## 멤버
### 속성
```csharp
/// <summary>
/// 의존성 주입 컨테이너
/// 객체 인스턴스 생성을 위한 Zenject 컨테이너입니다.
/// </summary>
private readonly DiContainer _container;
```

### 생성자
```csharp
/// <summary>
/// MagicBookCreator 생성자
/// 의존성 주입 컨테이너를 초기화합니다.
/// </summary>
/// <param name="container">Zenject 의존성 주입 컨테이너</param>
public MagicBookCreator(DiContainer container)
```

### 메서드
```csharp
/// <summary>
/// 마법책 생성 메서드
/// 제공된 매개변수를 사용하여 새로운 마법책을 생성합니다.
/// </summary>
/// <param name="param">마법책 생성 매개변수</param>
/// <returns>생성된 마법책 인스턴스</returns>
public MagicBook Create(MagicBookParameters param)
```

## 주요 코드 스니펫
### 생성 프로세스
```csharp
public MagicBook Create(MagicBookParameters param)
{
    // 파라메터 유효성 검사
    if (param.MagicBooksParent == null)
    {
        return null;
    }

    // 프리팹 인스턴스화
    var magicBook = _container.InstantiatePrefabForComponent<MagicBook>(param.MagicBookPrefab);

    // 계층 구조 설정
    magicBook.transform.parent = param.MagicBooksParent.transform;

    // 마법책 초기화
    magicBook.InitializeMagicBook(param.MagicInfo, param.PlayerInfo);

    // 생성된 마법책 반환
    return magicBook;
}
```

## 기능 설명
### 팩토리 패턴
- Zenject 컨테이너를 통해 객체 생성 및 관리
- 객체 생성 로직을 캡슐화하여 클라이언트 코드와 분리
- 생성 프로세스의 일관성 보장
- 코드 유지보수성 향상

## 의존성/상속 관계
- `PlaceholderFactory<MagicBookParameters, MagicBook>`를 상속
- `DiContainer` 클래스에 의존
- `MagicBookParameters` 구조체에 의존
- `MagicBook` 클래스에 의존

## 사용 예시
#### `MagicBookLibrary`에서 마법책 생성 시 파라메터와 함께 호출
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
- [`MagicBookParameters`](/docs/projects/SlimeRush/BattleSystem/MagicBookParameters)
- [`MagicBook`](/docs/projects/SlimeRush/BattleSystem/MagicBook)
- [`MagicBookLibrary`](/docs/projects/SlimeRush/BattleSystem/MagicBookLibrary)
- `DiContainer`

