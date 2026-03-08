+++
title = "ICutSceneEvent"
description = "컷씬(특수 스킬) 이벤트 인터페이스"
icon = "code"
date = "2025-03-06T23:43:00+09:00"
lastmod = "2025-03-06T23:43:00+09:00"
draft = false
toc = true
weight = 285
+++

## 개요

`ICutSceneEvent` 인터페이스는 RFist 게임의 컷씬(특수 스킬) 이벤트를 정의합니다.
특수 스킬 시퀀스의 시작과 종료를 알리는 이벤트를 제공하며,
[`HeroControllerStateHandler`](/docs/projects/rfist/HeroControlSystem/HeroControllerStateHandler) 클래스가 이 인터페이스를 구현합니다.

## 역할

- 특수 스킬(컷씬) 시퀀스 시작 이벤트 계약 정의
- 특수 스킬(컷씬) 시퀀스 종료 이벤트 계약 정의
- 컷씬 중 컨트롤러 상태 변경 알림

## 선언

```csharp
/// <summary>
/// 컷씬(특수 스킬) 이벤트 인터페이스
/// 특수 스킬 시퀀스의 시작과 종료를 알리는 이벤트를 정의합니다.
/// </summary>
public interface ICutSceneEvent
```

## 멤버

### 메서드

```csharp
/// <summary>
/// 특수 스킬 시퀀스(컷씬) 시작 시 호출
/// </summary>
public void OnSpecialMoveSequenceStart();

/// <summary>
/// 특수 스킬 시퀀스(컷씬) 종료 시 호출
/// </summary>
public void OnSpecialMoveSequenceEnd();
```

## 기능 설명

### 이벤트 흐름

`ICutSceneEvent`는 특수 스킬 시퀀스(컷씬)의 생명주기를 관리합니다:

```
[스킬 사용] → [OnSpecialMoveSequenceStart] → [컷씬 재생] → [OnSpecialMoveSequenceEnd] → [컨트롤 복원]
```

| 메서드 | 호출 시점 | 역할 |
|--------|----------|------|
| **OnSpecialMoveSequenceStart** | 특수 스킬(궁극기 등) 사용 시 | 컷씬 시작, 컨트롤 비활성화 |
| **OnSpecialMoveSequenceEnd** | 컷씬 애니메이션 종료 시 | 컨트롤 복원, 상태 초기화 |

### 상태 변경

`ICutSceneEvent` 구현체는 일반적으로 다음 상태를 변경합니다:

- **OnSpecialMoveSequenceStart**: `_playingCutScene = true`
  - `CanMove = false`
  - `CanAttack = false`
  - `CanDash = false`
  - `CanControllable = false`

- **OnSpecialMoveSequenceEnd**: `_playingCutScene = false`
  - 모든 컨트롤 상태 복원

## 의존성/상속 관계

### 구현 클래스
- [`HeroControllerStateHandler`](/docs/projects/rfist/HeroControlSystem/HeroControllerStateHandler): ICutSceneEvent의 주요 구현체

### 사용 위치
- [`CutSceneController`](/docs/projects/rfist/HeroControlSystem/CutSceneController): 컷씬 시작/종료 시 이벤트 발신
- [`BaseHeroSkill`](/docs/projects/rfist/HeroSkillSystem/BaseHeroSkill): 궁극기 등 특수 스킬에서 이벤트 발생

### 의존 클래스
- `ICutSceneEventInvoker`: 이벤트 발신자 인터페이스

## 사용 예시

### HeroControllerStateHandler에서 ICutSceneEvent 구현

```csharp
/// <summary>
/// ICutSceneEvent를 구현하는 HeroControllerStateHandler 예시
/// </summary>
public class HeroControllerStateHandler : MonoBehaviour, ICutSceneEvent
{
    private bool _playingCutScene;
    
    /// <summary>
    /// 특수 스킬 시퀀스(컷씬) 시작 시 호출
    /// </summary>
    public void OnSpecialMoveSequenceStart()
    {
        _playingCutScene = true;
        UpdateState();  // 상태 업데이트로 컨트롤 비활성화
    }

    /// <summary>
    /// 특수 스킬 시퀀스(컷씬) 종료 시 호출
    /// </summary>
    public void OnSpecialMoveSequenceEnd()
    {
        _playingCutScene = false;
        UpdateState();  // 상태 업데이트로 컨트롤 복원
    }
    
    /// <summary>
    /// 상태 업데이트
    /// </summary>
    private void UpdateState()
    {
        CanMove = _hitRecovering == false
                  && _usingSkill == false
                  && _standing
                  && _playingCutScene == false;  // 컷씬 중 이동 불가
        
        CanControllable = _hitRecovering == false 
                          && _playingCutScene == false;  // 컷씬 중 제어 불가
    }
}
```

### CutSceneController에서 이벤트 발신

```csharp
/// <summary>
/// CutSceneController에서 ICutSceneEvent 발신 예시
/// </summary>
public class CutSceneController : MonoBehaviour
{
    private HashSet<ICutSceneEventInvoker> _cutSceneEventInvokers;
    
    /// <summary>
    /// 컷씬 시작
    /// </summary>
    public void StartCutScene()
    {
        // 모든 구독자에게 컷씬 시작 알림
        foreach (var invoker in _cutSceneEventInvokers)
        {
            invoker.NotifyCutSceneEvents(action => action?.OnSpecialMoveSequenceStart());
        }
    }

    /// <summary>
    /// 컷씬 종료
    /// </summary>
    public void OnEndCutScene()
    {
        // 모든 구독자에게 컷씬 종료 알림
        foreach (var invoker in _cutSceneEventInvokers)
        {
            invoker.NotifyCutSceneEvents(action => action?.OnSpecialMoveSequenceEnd());
        }
    }
}
```

### 궁극기 스킬에서 사용

```csharp
/// <summary>
/// 궁극기 스킬에서 ICutSceneEvent 사용 예시
/// </summary>
public class UltimateSkill : BaseHeroSkill
{
    [SerializeField] private CutSceneController _cutSceneController;
    
    public override void OnSkillStart()
    {
        // 컷씬 컨트롤러 초기화 및 시작
        _cutSceneController.Initialize(attacker, target);
        _cutSceneController.StartCutScene();  // OnSpecialMoveSequenceStart 발신
        
        // 궁극기 애니메이션 및 연출 시작
        PlayUltimateAnimation();
    }
    
    /// <summary>
    /// 애니메이션 종료 콜백
    /// </summary>
    public void OnAnimationEnd()
    {
        _cutSceneController.OnEndCutScene();  // OnSpecialMoveSequenceEnd 발신
    }
}
```

## 관련 클래스

- [`HeroControllerStateHandler`](/docs/projects/rfist/HeroControlSystem/HeroControllerStateHandler)
- [`CutSceneController`](/docs/projects/rfist/HeroControlSystem/CutSceneController)
- [`ICutSceneEventInvoker`](/docs/projects/rfist/HeroControlSystem/ICutSceneEventInvoker)
- [`BaseHeroSkill`](/docs/projects/rfist/HeroSkillSystem/BaseHeroSkill)
- [`HeroController`](/docs/projects/rfist/HeroControlSystem/HeroController)
