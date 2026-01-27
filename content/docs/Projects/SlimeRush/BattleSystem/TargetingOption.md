+++
title = "TargetingOption"
description = "마법 시스템에서 마법의 타겟팅 옵션을 정의하는 구조체"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 201
+++
## 개요
`TargetingOption` 구조체는 SlimeRush 게임의 마법 시스템에서 마법의 타겟팅 옵션을 정의하는 구조체입니다. 이 구조체는 마법의 타겟팅 타입, 타겟 수, 타겟팅 범위를 설정하여 마법의 타겟팅 동작을 제어합니다.

## 역할
- 마법의 타겟팅 타입 설정
- 마법의 타겟 수 설정
- 마법의 타겟팅 범위 설정
- 타겟팅 옵션 초기화

## 멤버
### 속성
```csharp
/// <summary>
/// 타겟 타입
/// 마법의 타겟팅 타입을 나타냅니다.(enum MagicTargetType => {None, Mouse, Nearest, RandomTarget})
/// </summary>
public MagicTargetType TargetType; 

/// <summary>
/// 타겟 수
/// 마법의 타겟 수를 나타냅니다.
/// </summary>
public int TargetCount;

/// <summary>
/// 타겟팅 범위
/// 마법의 타겟팅 범위를 나타냅니다.
/// </summary>
public float TargetingRange;
```

### 생성자
```csharp
/// <summary>
/// 타겟팅 옵션 생성자
/// 타겟팅 옵션을 초기화합니다.
/// </summary>
/// <param name="targetType">타겟 타입</param>
/// <param name="targetCount">타겟 수</param>
/// <param name="targetingRange">타겟팅 범위</param>
public TargetingOption(MagicTargetType targetType, int targetCount, float targetingRange)
```

## 기능 설명
### 타겟팅 옵션 생성자
- **타겟 타입 설정**: 타겟 타입을 설정하여 마법의 타겟팅 타입을 결정합니다.
- **타겟 수 설정**: 타겟 수를 설정하여 마법의 타겟 수를 결정합니다.
- **타겟팅 범위 설정**: 타겟팅 범위를 설정하여 마법의 타겟팅 범위를 결정합니다.

## 의존성/상속 관계
- `MagicTargetType` 열거형에 의존합니다.

## 사용 예시
#### `MagicBook`에서 마법 생성시 `TargetingOption` 구조체를 생성해 타겟팅 프로세스 설정 
```csharp
public void InitializeMagicBook(MagicInfo magicInfo, PlayerDataInfo playerDataInfo)
{
    // 마법 정보를 설정합니다
    // 마법의 세부 정보를 포함하는 객체를 설정합니다.
    _magicInfo = magicInfo;

    // 플레이어 정보를 설정합니다
    // 플레이어의 데이터를 포함하는 정보를 설정합니다.
    _playerInfo = playerDataInfo;

    // 플레이어 타겟을 설정합니다
    // 플레이어의 타겟 인터페이스를 설정합니다.
    _player = targetSystem.PlayerTarget;

    // 타겟 수를 계산합니다 (명중 횟수와 공격 반복 횟수 중 큰 값)
    // 마법의 명중 횟수와 공격 반복 횟수 중 큰 값을 타겟 수로 설정합니다.
    var targetCount = Mathf.Max(magicInfo.hitCount, magicInfo.attackRepeatCount);

    // 타겟팅 옵션을 설정합니다
    // 마법의 타겟팅 타입, 타겟 수, 타겟팅 범위를 설정합니다.
    _targetingOption = new TargetingOption(magicInfo.targetingType, targetCount, magicInfo.attackRange);

    // 타겟팅 프로세스를 설정합니다
    // 타겟팅 옵션을 기반으로 타겟팅 프로세스를 설정합니다.
    _targetSearcher = SetTargetingProcess(_targetingOption);

    // 초기화 완료를 표시합니다
    // 마법책이 초기화되었음을 표시합니다.
    _isInitialized = true;

    // 마법책 정보를 업데이트합니다
    // 마법책의 쿨타임과 타겟팅 옵션을 다시 계산합니다.
    UpdateMagicBook();
}
```

## 관련 클래스
- `MagicBook`
- `MagicTargetType`