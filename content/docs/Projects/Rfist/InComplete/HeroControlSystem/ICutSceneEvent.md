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
특수 스킬 컷씬의 시작과 종료를 알리는 이벤트를 정의하며, [`HeroControllerStateHandler`](/docs/projects/rfist/HeroControlSystem/HeroControllerStateHandler), `HitPanel` 클래스가 이 인터페이스를 구현합니다.

## 역할
- 특수 스킬 컷씬 시작/종료 이벤트 정의

## 선언
```csharp
public interface ICutSceneEvent
```

## 멤버
### 메서드
```csharp
/// <summary>
/// 특수 스킬 컷씬 시작 시 호출
/// </summary>
public void OnSpecialMoveSequenceStart();

/// <summary>
/// 특수 스킬 컷씬 종료 시 호출
/// </summary>
public void OnSpecialMoveSequenceEnd();
```

## 기능 설명
### 컷씬 이벤트

| 메서드 | 호출 시점 | 역할 |
|--------|----------|------|
| **OnSpecialMoveSequenceStart** | 특수 스킬(궁극기 등) 사용 시 | 컷씬 시작, 컨트롤 비활성화 |
| **OnSpecialMoveSequenceEnd** | 컷씬 애니메이션 종료 시 | 컨트롤 복원, 상태 초기화 |


### 이벤트 흐름
1. 컷씬 발생
2. `TimelineManager`등에서 [`CutSceneController`](/docs/projects/rfist/HeroControlSystem/CutSceneController)를 통해 [`ICutSceneEventInvoker`](/docs/projects/rfist/HeroControlSystem/icutsceneeventinvoker) 이벤트 발신자 사용
3. 이벤트 발신자가 모든 `ICutSceneEvent` 구독자에게 알림(컷씬 재생 및 종료)

## 의존성/상속 관계
- [`HeroControllerStateHandler`](/docs/projects/rfist/HeroControlSystem/HeroControllerStateHandler)에서 통해 컨트롤러 상태 변경
- `HitPanel`에서 히트정보 표시 제어
- [`CutSceneController`](/docs/projects/rfist/HeroControlSystem/CutSceneController)에서 컷씬 시작/종료 시 이벤트 발신
- [`ICutSceneEventInvoker`](/docs/projects/rfist/HeroControlSystem/ICutSceneEventInvoker) 인터페이스를 통해 이벤트 발신
- [`HeroController`](/docs/projects/rfist/HeroControlSystem/herocontroller)에서 이벤트 수신자 등록 및 관리

## 사용 예시
#### [`HeroController`](/docs/projects/rfist/HeroControlSystem/herocontroller)에서 이벤트 리스너 등록 및 관리
```csharp
private readonly HashSet<ICutSceneEvent> _cutSceneEvents = new HashSet<ICutSceneEvent>();

public void Register(ICutSceneEvent cutSceneEvent)
{
    _cutSceneEvents.Add(cutSceneEvent);
}

public void UnRegister(ICutSceneEvent cutSceneEvent)
{
    _cutSceneEvents.Remove(cutSceneEvent);
}
```

#### [`HeroControllerStateHandler`](/docs/projects/rfist/HeroControlSystem/HeroControllerStateHandler)에서 컨트롤러 활성화/비활성화 제어
```csharp
public void OnSpecialMoveSequenceStart()
{
    _playingCutScene = true;
    UpdateState();  // 상태 업데이트로 컨트롤 비활성화
}

public void OnSpecialMoveSequenceEnd()
{
    _playingCutScene = false;
    UpdateState();  // 상태 업데이트로 컨트롤 복원
}

private void UpdateState()
{
    // 이동 가능: 피격 회복 중 아님, 스킬 사용 중 아님, 서있음, 컷씬 아님, 가드 중 아님
    CanMove = _hitRecovering == false
              && _usingSkill == false
              && _standing
              && _playingCutScene == false
              && _usingGuard == false;
    
    // 대시 가능: 피격 회복 중 아님, 컷씬 아님, 대시 횟수 체크, 쿨다운 아님
    CanDash = _hitRecovering == false
                && _playingCutScene == false
                && CheckDashCount()
                && _dashCooldown == false;
    
    // 공격 가능: 피격 회복 중 아님, 컷씬 아님
    CanAttack = _hitRecovering == false &&
                _playingCutScene == false;
    
    // 가드 가능: 스킬 사용 중 아님, 피격 회복 중 아님, 컷씬 아님, 가드 중 아님
    CanGuard = _usingSkill == false
                  && _hitRecovering == false
                  && _playingCutScene == false
                  && _usingGuard == false;
    
    // 전반적 제어 가능: 피격 회복 중 아님, 컷씬 아님
    CanControllable = _hitRecovering == false 
                      && _playingCutScene == false;
}

```



## 관련 클래스
- [`HeroControllerStateHandler`](/docs/projects/rfist/HeroControlSystem/HeroControllerStateHandler)
- [`CutSceneController`](/docs/projects/rfist/HeroControlSystem/CutSceneController)
- [`ICutSceneEventInvoker`](/docs/projects/rfist/HeroControlSystem/ICutSceneEventInvoker)
- [`HeroController`](/docs/projects/rfist/HeroControlSystem/HeroController)
