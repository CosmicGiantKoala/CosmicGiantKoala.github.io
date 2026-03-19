+++
title = "ICutSceneEventInvoker"
description = "컷씬 이벤트 발신자 인터페이스"
icon = "code"
date = "2025-03-06T23:47:00+09:00"
lastmod = "2025-03-06T23:47:00+09:00"
draft = false
toc = true
weight = 290
+++

## 개요
`ICutSceneEventInvoker` 인터페이스는 RFist 게임의 컷씬 이벤트 발신자 역할을 정의합니다.
[`ICutSceneEvent`](/docs/projects/rfist/HeroControlSystem/ICutSceneEvent)를 구현하는 모든 구독자에게 이벤트를 발신하는 기능을 제공합니다.

## 역할
- ICutSceneEvent 구독자 관리
- 컷씬 이벤트 일괄 발신
- 발신자-구독자 간 느슨한 결합 제공

## 선언
```csharp
public interface ICutSceneEventInvoker
```

## 멤버
### 메서드
```csharp
/// <summary>
/// 컷씬 이벤트 발신
/// ICutSceneEvent를 구현하는 모든 구독자에게 지정된 액션을 실행합니다.
/// </summary>
/// <param name="action">구독자에게 실행할 액션 (예: OnSpecialMoveSequenceStart)</param>
public void NotifyCutSceneEvents(Action<ICutSceneEvent> action);
```

## 기능 설명
### 관찰자 패턴 구조
- `ICutSceneEventInvoker`는 관찰자 패턴의 발신자 역할
- `NotifyCutSceneEvents(Action<ICutSceneEvent> action)`를 통해 이벤트 발신
- [`ICutSceneEvent`](/docs/projects/rfist/HeroControlSystem/ICutSceneEvent) 구독자에게 알림

### 이벤트 흐름
1. 컷씬 발생
2. `TimelineManager`등에서 [`CutSceneController`](/docs/projects/rfist/HeroControlSystem/CutSceneController)를 통해 [`ICutSceneEventInvoker`](/docs/projects/rfist/HeroControlSystem/icutsceneeventinvoker) 이벤트 발신자 사용
3. 이벤트 발신자가 모든 `ICutSceneEvent` 구독자에게 알림(컷씬 재생 및 종료)

### Action<ICutSceneEvent> 활용
- `NotifyCutSceneEvents(Action<ICutSceneEvent> action)`는 제네릭 Action 델리게이트를 사용하여 유연하게 이벤트 발신
```csharp
// 컷씬 시작 시 모든 구독자에게 OnSpecialMoveSequenceStart 호출
invoker.NotifyCutSceneEvents(action => action?.OnSpecialMoveSequenceStart());

// 컷씬 종료 시 모든 구독자에게 OnSpecialMoveSequenceEnd 호출
invoker.NotifyCutSceneEvents(action => action?.OnSpecialMoveSequenceEnd());
```

## 의존성/상속 관계
- [`ICutSceneEvent`](/docs/projects/rfist/HeroControlSystem/ICutSceneEvent) 인터페이스 발신 대상
- [`CutSceneController`](/docs/projects/rfist/HeroControlSystem/CutSceneController): 컷씬 시작/종료 시 이벤트 발신
- [`HeroController`](/docs/projects/rfist/HeroControlSystem/herocontroller)에서 해당 인터페이스 구현

## 사용 예시
#### [`HeroController`](/docs/projects/rfist/HeroControlSystem/herocontroller) 해당 인터페이스를 구현하여 [`ICutSceneEvent`](/docs/projects/rfist/HeroControlSystem/ICutSceneEvent)로 이벤트 발신
```csharp
public void NotifyCutSceneEvents(Action<ICutSceneEvent> action)
{
    foreach (var cutSceneEvent in _cutSceneEvents)
    {
        action?.Invoke(cutSceneEvent);
    }
}
```

#### [`CutSceneController`](/docs/projects/rfist/HeroControlSystem/CutSceneController)에서 해당 인터페이스를 통해 이벤트 발신
```csharp
public void StartCutScene()
{
    if (IsInitialized() == false)
    {
        Debug.LogError($"[CutSceneController] Not Initialized");
        return;
    }
    
    // 공격자가 로컬인지 확인
    _attackIsLocal = !_attacker.IsRemote();

    // 모든 컷씬 이벤트 리스너에게 시작 통지
    foreach (var cutSceneEventInvoker in _cutSceneEventInvokers)
    {
        cutSceneEventInvoker.NotifyCutSceneEvents(action => action?.OnSpecialMoveSequenceStart());
    }
}

public void OnEndCutScene()
{
    _attacker = null;
    _hitter = null;
    
    // 모든 컷씬 이벤트 리스너에게 종료 통지
    foreach (var cutSceneEventInvoker in _cutSceneEventInvokers)
    {
        cutSceneEventInvoker.NotifyCutSceneEvents(action => action?.OnSpecialMoveSequenceEnd());
    }
    _cutSceneEventInvokers.Clear();
}
```

## 관련 클래스

- [`ICutSceneEvent`](/docs/projects/rfist/HeroControlSystem/ICutSceneEvent)
- [`CutSceneController`](/docs/projects/rfist/HeroControlSystem/CutSceneController)
- [`HeroController`](/docs/projects/rfist/HeroControlSystem/herocontroller)
