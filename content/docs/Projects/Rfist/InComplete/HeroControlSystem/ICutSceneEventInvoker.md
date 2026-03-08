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
이 인터페이스는 관찰자 패턴(Observer Pattern)에서 발신자(Publisher)의 역할을 담당합니다.

## 역할

- ICutSceneEvent 구독자 관리
- 컷씬 이벤트 일괄 발신
- 발신자-구독자 간 느슨한 결합 제공

## 선언

```csharp
/// <summary>
/// 컷씬 이벤트 발신자 인터페이스
/// ICutSceneEvent를 구현하는 모든 구독자에게 이벤트를 발신합니다.
/// </summary>
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

`ICutSceneEventInvoker`는 관찰자 패턴의 발신자 역할을 합니다:

```
┌─────────────────────────┐
│ ICutSceneEventInvoker   │  ← 발신자 (Publisher)
│ (NotifyCutSceneEvents)  │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ ICutSceneEvent          │  ← 구독자 (Subscriber)
│ - OnSpecialMoveSeqStart │
│ - OnSpecialMoveSeqEnd   │
└─────────────────────────┘
```

### 이벤트 발신 흐름

```
[스킬 사용] → [ICutSceneEventInvoker.NotifyCutSceneEvents] 
                                      ↓
                    [모든 ICutSceneEvent 구독자에게 알림]
                                      ↓
        ┌─────────────┬──────────────┬──────────────┐
        ▼             ▼              ▼              ▼
   [상태핸들러]  [애니메이션]    [이펙트]     [사운드]
```

### Action<ICutSceneEvent> 활용

`NotifyCutSceneEvents`는 제네릭 Action 델리게이트를 사용하여 유연하게 이벤트를 발신합니다:

```csharp
// 컷씬 시작 시 모든 구독자에게 OnSpecialMoveSequenceStart 호출
invoker.NotifyCutSceneEvents(action => action?.OnSpecialMoveSequenceStart());

// 컷씬 종료 시 모든 구독자에게 OnSpecialMoveSequenceEnd 호출
invoker.NotifyCutSceneEvents(action => action?.OnSpecialMoveSequenceEnd());
```

## 의존성/상속 관계

### 의존 클래스
- [`ICutSceneEvent`](/docs/projects/rfist/HeroControlSystem/ICutSceneEvent) - 발신 대상 인터페이스

### 구현 클래스 (예상)
- `HeroSystem`: HeroControllerStateHandler 등록 및 이벤트 발신 관리
- `CutSceneManager`: 컷씬 이벤트 중앙 관리

### 사용 위치
- [`CutSceneController`](/docs/projects/rfist/HeroControlSystem/CutSceneController): 컷씬 시작/종료 시 이벤트 발신
- [`BaseHeroSkill`](/docs/projects/rfist/HeroSkillSystem/BaseHeroSkill): 특수 스킬 이벤트 발신

## 사용 예시

### HeroSystem에서 ICutSceneEventInvoker 구현

```csharp
/// <summary>
/// ICutSceneEventInvoker를 구현하는 HeroSystem 예시
/// </summary>
public class HeroSystem : MonoBehaviour, ICutSceneEventInvoker
{
    /// <summary>
    /// ICutSceneEvent 구독자 목록
    /// </summary>
    private HashSet<ICutSceneEvent> _cutSceneEventSubscribers;
    
    private void Awake()
    {
        _cutSceneEventSubscribers = new HashSet<ICutSceneEvent>();
        
        // HeroControllerStateHandler 등 ICutSceneEvent 구현체 등록
        var stateHandler = GetComponent<HeroControllerStateHandler>();
        _cutSceneEventSubscribers.Add(stateHandler);
    }

    /// <summary>
    /// 컷씬 이벤트 발신
    /// </summary>
    public void NotifyCutSceneEvents(Action<ICutSceneEvent> action)
    {
        // 모든 구독자에게 이벤트 발신
        foreach (var subscriber in _cutSceneEventSubscribers)
        {
            try
            {
                action?.Invoke(subscriber);
            }
            catch (Exception e)
            {
                Debug.LogError($"CutSceneEvent 발신 중 오류: {e.Message}");
            }
        }
    }
    
    /// <summary>
    /// 구독자 등록
    /// </summary>
    public void Subscribe(ICutSceneEvent subscriber)
    {
        _cutSceneEventSubscribers.Add(subscriber);
    }
    
    /// <summary>
    /// 구독자 해제
    /// </summary>
    public void Unsubscribe(ICutSceneEvent subscriber)
    {
        _cutSceneEventSubscribers.Remove(subscriber);
    }
}
```

### CutSceneController에서 사용

```csharp
/// <summary>
/// CutSceneController에서 ICutSceneEventInvoker 사용 예시
/// </summary>
public class CutSceneController : MonoBehaviour
{
    [SerializeField] private ICutSceneEventInvoker _eventInvoker;
    
    /// <summary>
    /// 컷씬 시작 - 모든 구독자에게 OnSpecialMoveSequenceStart 발신
    /// </summary>
    public void StartCutScene()
    {
        // HeroSystem.NotifyCutSceneEvents 호출
        _eventInvoker.NotifyCutSceneEvents(
            action => action?.OnSpecialMoveSequenceStart()
        );
        
        // 컷씬 연출 시작
        PlayCutSceneAnimation();
    }

    /// <summary>
    /// 컷씬 종료 - 모든 구독자에게 OnSpecialMoveSequenceEnd 발신
    /// </summary>
    public void OnEndCutScene()
    {
        _eventInvoker.NotifyCutSceneEvents(
            action => action?.OnSpecialMoveSequenceEnd()
        );
    }
}
```

### Lambda 식을 활용한 이벤트 발신

```csharp
/// <summary>
/// Lambda 식을 활용한 컷씬 이벤트 발신 예시
/// </summary>
public void NotifyCutSceneExamples(ICutSceneEventInvoker invoker)
{
    // 컷씬 시작 시
    invoker.NotifyCutSceneEvents(action => {
        Debug.Log("컷씬 시작 이벤트 발신");
        action?.OnSpecialMoveSequenceStart();
    });
    
    // 조걶적 이벤트 발신
    bool isUltimate = true;
    invoker.NotifyCutSceneEvents(action => {
        if (isUltimate)
        {
            action?.OnSpecialMoveSequenceStart();
        }
    });
    
    // 안전한 이벤트 발신 (null 조걶 연산자)
    invoker.NotifyCutSceneEvents(action => action?.OnSpecialMoveSequenceEnd());
}
```

## 관련 클래스

- [`ICutSceneEvent`](/docs/projects/rfist/HeroControlSystem/ICutSceneEvent)
- [`HeroControllerStateHandler`](/docs/projects/rfist/HeroControlSystem/HeroControllerStateHandler)
- [`CutSceneController`](/docs/projects/rfist/HeroControlSystem/CutSceneController)
- [`HeroSystem`](/docs/projects/rfist/HeroControlSystem/HeroSystem)
