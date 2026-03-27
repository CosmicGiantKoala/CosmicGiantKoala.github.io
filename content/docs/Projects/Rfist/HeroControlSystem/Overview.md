+++
title = "영웅 컨트롤 시스템(Hero Control System) 소개"
description = "RFist 게임의 영웅 캐릭터 입력, 이동, 상태 관리를 통합 제어하는 시스템"
icon = "sports_esports"
date = "2025-03-24T00:00:00+09:00"
lastmod = "2025-03-24T00:00:00+09:00"
draft = false
toc = true
weight = 201
+++

## 1. 기능 개요

- **HeroControlSystem**은 RFist 게임의 **영웅 캐릭터 제어 시스템**으로, **입력 처리, 이동 제어, 상태 관리, 컷씬 제어**를 통합적으로 관리하는 시스템입니다. 6가지 이벤트 타입을 기반으로 한 옵저버 패턴을 통해 애니메이션, 스킬, 피격 등의 시스템과 느슨하게 결합되어 동작합니다.

### 개발 배경 및 요구사항
- **다양한 입력 방식 지원**: 키보드, 게임패드 등 다양한 입력 디바이스를 추상화하여 일관된 인터페이스 제공
- **물리 기반 + 트윈 기반 이동**: Rigidbody 기반이동과 DoTween 기반 스킬 동작 이동 지원
- **상태 기반 행동 제어**: 스킬 사용, 피격, 다운, 쿨다운 등 상태에 따라 입력 가능 여부를 동적으로 제어
- **네트워크 동기화 지원**: Fusion 네트워크 환경에서 입력 데이터를 효율적으로 동기화
- **컷씬(궁극기) 제어**: Timeline 기반 특수 스킬 실행 중 캐릭터 제어 및 데미지 처리

### 주요 기능
{{< table "table-striped">}} 
| 기능 | 설명 |
|-----|-----|
|**입력 처리**| Input System 기반 키보드 입력 처리 및 네트워크 동기화용 데이터 구조 제공 |
|**이동 제어**| Rigidbody 기반 이동 + DoTween 트윈 기반 이동 지원 |
|**상태 관리**| 스킬/피격/가드/대시/컷씬/쿨다운 상태에 따른 행동 가능 여부 동적 관리 |
|**이벤트 관리 및 통지**| 6가지 이벤트 타입(MoveControl, Hit, Skill, Attack, Stance, CutScene) 옵저버 패턴 구현 |
|**컷씬 유틸리티**| Timeline 기반 궁극기 컷씬 중 이벤트 처리 및 데미지 적용 |
{{< /table >}}

## 2. 사용된 기술 요소
### 핵심 기술 요소 및 API 활용

{{< table "table-striped">}}
| 요소 | 설명 |
|-----|-----|
|**C#**| 전체 핵심 로직 및 유니티 컴포넌트 구현 |
|[**Input System**](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.18/manual/index.html)| Action 기반 입력 처리 및 디바이스 독립적 입력 추상화 |
|[**DoTween**](https://dotween.demigiant.com/documentation.php)| 트윈 기반 이동(대시, 넉백, 스킬 동작) 구현 |
|[**Fusion**](https://doc.photonengine.com/fusion/v2/manual)| 네트워크 입력 동기화 및 RPC 기반 입력 데이터 전송 |
|├ [**NetworkInput**](https://doc.photonengine.com/fusion/v1/manual/network-input)| 입력 데이터 네트워크 동기화 |
{{< /table >}}

### 설계 활용 패턴
{{< table "table-striped">}}
| 요소 | 설명 |
|-----|-----|
|**옵저버 패턴 (Observer Pattern)**| HeroController에서 6가지 이벤트 타입을 관리하고, 관련 시스템(애니메이션, 스킬 등)에 이벤트 통지 |
|**템플릿 메서드 패턴 (Template Method Pattern)**| BaseHeroInput, BaseHeroMoveController에서 공통 인터페이스 정의 및 하위 클래스에서 구체적 구현 |
|**전략 패턴 (Strategy Pattern)**| IHeroInput 인터페이스를 통해 다양한 입력 구현체를 런타임에 교체 가능 |
{{< /table >}}

## 3. 전체 시스템 구조도(간략)
```mermaid
classDiagram
    direction TD
    namespace HeroNetworkSystem {
        class NetworkHeroObject
        class NetworkHeroController
        class NetworkHeroStatus
        class HeroInputSyncData
        class NetworkHeroInput
    }
    
    NetworkHeroObject --> HeroController
    NetworkHeroController --> HeroController
    NetworkHeroStatus --> HeroController
    NetworkHeroInput --> BaseHeroInput : uses
    
    namespace Events{
        class HeroEvents
        class ICutSceneEvent
    }
    
    class HeroController
    HeroController --> BaseHeroMoveController : uses
    HeroController ..|> IHeroController : implements
    HeroController "1" o--> "*" HeroEvents : manages
    HeroController "1" o--> "*" ICutSceneEvent : manages
    HeroController ..|> ICutSceneEventInvoker : implements
    HeroController ..|> ISkillEventInvoker : implements
    HeroController --> IControllerState : uses
    HeroController --> BaseHeroAbility : uses
    
    namespace EventInvokers{
        class ICutSceneEventInvoker
        class ISkillEventInvoker
 }
    
    class IHeroInput {
        <<interface>>
    }
    
    class BaseHeroInput {
        <<abstract>>
    }
    BaseHeroInput ..|> IHeroInput : implements
    
    class HeroKeyInput
    HeroKeyInput --|> BaseHeroInput : implements
    HeroKeyInput --> RFistInput : subscribe
    
    namespace BaseHeroComponents{
        class BaseHeroAbility
        class BaseSkillManager
        class BaseHeroSkill
        class BaseHeroMoveController
 }
    
    BaseHeroAbility --> IHeroController
    BaseSkillManager --> IHeroController
    BaseHeroSkill --> IHeroController
    class IHeroController {
        <<interface>>
    }

    class BaseHeroMoveController {
        <<abstract>>
    }
    BaseHeroMoveController --> IHeroController
    BaseHeroMoveController --> IControllerState
    
    class HeroRigidbodyController
    HeroRigidbodyController ..|> BaseHeroMoveController : implements
    
    
    class IControllerState {
        <<interface>>
    }
    
    class HeroControllerStateHandler
    HeroControllerStateHandler ..|> IControllerState : implements
    HeroControllerStateHandler ..|> ICutSceneEvent : implements
    
    class ICutSceneEvent {
        <<interface>>
    }
    HitPanel ..|> ICutSceneEvent : implements
    
    class CutSceneClass {
        <<groups>>
        TimelineManager
        SuperAttackEventBehaviour
        SuperAttackEventClip
        SuperAttackEventTrack
    }
    CutSceneClass --> CutSceneController : uses
    class CutSceneController 
    CutSceneController --> NetworkHeroObject : uses
    CutSceneController "1" --> "n" ICutSceneEventInvoker : manages
    
    class HeroEvents {
        <<interface groups>>
        IHitEvent
        IMoveControlEvent
        ISkillEvent
        IAttackEvent
        IStanceEvent
 }
    
```

## 4. 주요 클래스별 역할 및 관계
### 핵심 컨트롤러

{{< table "table-striped">}}
| 클래스 | 역할 |
|-----|-----|
|[**HeroController**](/docs/projects/rfist/HeroControlSystem/herocontroller/)<br> *: IHeroController, IHeroDetector,*<br> *ISkillEventInvoker, ICutSceneEventInvoker*| 💡 영웅 캐릭터의 **중앙 제어 관리자**<br> 💡 6가지 이벤트 타입의 등록 및 통지 시스템 관리<br> 💡 입력 수신 → 상태 확인 → 이동/스킬 실행 흐름 제어<br> 💡 컨트롤러 상태(IControllerState) 기반 행동 제어<br> 💡 자동 타겟팅 및 방향 전환 처리 |
{{< /table >}}
```mermaid
classDiagram
    direction LR
    class HeroControllerStateHandler
    HeroControllerStateHandler --> HeroController
    
    class NetworkHeroSystem{
        <<groups>>
        NetworkHeroController
        NetworkHeroObject
        NetworkHeroStatus
    }
    NetworkHeroSystem --> HeroController
    
    class RFistCameraEffect
    RFistCameraEffect --> HeroController
    
    class SkillTimelineController
    SkillTimelineController --> HeroController
    
    class HeroController {
        - heroMoveController : ~BaseHeroMoveController~
        - baseHeroAbility : ~BaseHeroAbility~
        - moveControlEvents : HashSet~IMoveControlEvent~
        - hitEvents : HashSet~IHitEvent~
        - skillEvents : HashSet~ISkillEvent~
        - attackEvents : HashSet~IAttackEvent~
        - stanceEvents : HashSet~IStanceEvent~
        - cutSceneEvents : HashSet~ICutSceneEvent~
        - controllerState : ~IControllerState~
        - lastMoveDirection : ~Vector2~
        - moveDirection : ~Vector2~
        - isLocalPlayer : ~bool~
        + SetActive(~bool~)
        + SetupControllerStateHandler(~IControllerState~)
        + SetUp(~BaseHeroAbility~, ~IHeroObjectInfo~)
        + SetLocalPlayer(~bool~)
        + Move(~float~, ~float~, ~float~)
        + Dash(~float~, ~float~)
        + SetPositionAndRotation(~Vector3~, ~Quaternion~)
        + Attack(~HeroInputSyncData~)
        + AttackHold(~HeroInputSyncData~)
        + StopAttackHold(~HeroInputSyncData~)
        + Guard(~HeroInputSyncData~)
        + StopGuard(~HeroInputSyncData~)
        + UltimateSkill(~HeroInputSyncData~)
        + AttackGuardDualInput(~HeroInputSyncData~)
        + OnHitReceive(~IHitEvent.HitInfo~)
        + OnStanceChanged(~IHeroStatus.Stance~)
        + NotifyHitEvents(Action~IHitEvent~)
        + NotifyMoveControlEvents(Action~IMoveControlEvent~)
        + NotifyStanceEvents(Action~IStanceEvent~)
        + Register(*event interface*)
        + UnRegister(*event interface*)
        + SkillEventNotifier() : ~ISkillEventNotifier~
        + HeroObjectController() : ~IHeroController~
    }
    HeroController o--> BaseHeroMoveController
    HeroController o--> BaseHeroAbility
    HeroController o--> IControllerState


    namespace NetworkHeroController Nested {
        class NetworkHeroController
        class HeroInputSyncData
    }
    HeroController ..> HeroInputSyncData
    NetworkHeroController *-- HeroInputSyncData : nested
    class HeroInputSyncData{
        <<struct>>
    }
    
    namespace IHeroStatus Nested {
        class IHeroStatus
        class HitInfo
        class Stance
    }
    class IHeroStatus{
        <<interface>>>>
    }
    
    
    HeroController ..> HitInfo
    IHeroStatus *-- HitInfo : nested
    class HitInfo{
        <<struct>>
    }
    
    HeroController ..> Stance
    IHeroStatus *-- Stance : nested
    class Stance{
        <<enumeration>>
        StandUp
        Down
        Stun
 }



    HeroController ..|> IHeroController : implements
    class IHeroController{
        <<interface>>
        + MoveToAbsoluteDirection(~float~,~float~,~Vector3~)
        + MoveToRelativeDirection(~float~, ~float~, ~Vector3~)
        + KnockBack(~Vector3~, ~float~)
        + Dash(~float~, ~float~, ~Vector3~)
        + OnCancel()
        + GetRigidbodyRotation(): ~Quaternion~
        + FindAndLookTarget(~float~, ~int~)
        + FindTarget(~float~, ~int~, out ~Transform~)
        + LookAt(~Transform~)
        + LookAt(~Vector3~)
    }
    
    HeroController ..|> ISkillEventInvoker : implements
    class ISkillEventInvoker{
        <<interface>>
        + NotifySkillEvents(Action~ISkillEvent~)
        + NotifyAttackEvents(Action~IAttackEvent~)
    }
    
    HeroController ..|> ICutSceneEventInvoker : implements
    class ICutSceneEventInvoker {
        <<interface>>
        + NotifyCutSceneEvents(Action~ICutSceneEvent~)
    }
    

```

### 입력 처리 클래스

{{< table "table-striped">}}
| 클래스 | 역할 |
|-----|-----|
|[**IHeroInput**](/docs/projects/rfist/HeroControlSystem/iheroinput/)<br> *<<interface>>*| 💡 영웅 입력 계약 정의 <br> 💡 이동/전투/포커스 입력값 제공 <br> 💡 입력 시스템 표준 인터페이스 |
|[**BaseHeroInput**](/docs/projects/rfist/HeroControlSystem/baseheroinput/)<br> *<<abstract>>* <br> *: IHeroInput, IHeroEvent*| 💡 입력 시스템의 **기반 추상 클래스**<br> 💡 정적 리스트 `HeroInputList`로 인스턴스 중앙 관리<br> 💡 템플릿 메서드 패턴으로 하위 클래스 확장 지원 |
|[**HeroKeyInput**](/docs/projects/rfist/HeroControlSystem/herokeyinput/)<br> : BaseHeroInput | _💡_ **Input System 기반 키보드/마우스 입력 처리**<br> 💡 단발성/지속성 입력 구분 (IsAttack vs IsAttackHold)<br> 💡 try-finally 패턴으로 자동 입력 리셋 구현 |

{{< /table >}}

```mermaid
classDiagram
    direction LR
    class IHeroInput {
        <<interface>>
        + GetHorizontal() : ~float~
        + GetVertical() : ~float~
        + IsAttack() : ~bool~
        + IsAttackHold() : ~bool~
        + IsGuard() : ~bool~
        + IsDash() : ~bool~
        + IsUltimateAttack() : ~bool~
        + IsAttackGuardDualInput() : ~bool~
    }
    
    NetworkHeroInput ..> BaseHeroInput
    class BaseHeroInput {
        <<abstract>>
        - HeroInputs : static readonly List~BaseHeroInput~
        + HeroInputList : static IReadOnlyList~IHeroInput~
        # OnEnabled()*
        # OnDisabled()*
        + GetHorizontal()* : ~float~
        + GetVertical()* : ~float~
        + IsAttack()* : ~bool~
        + IsAttackHold()* : ~bool~
        + IsGuard()* : ~bool~
        + IsDash()* : ~bool~
        + IsUltimateAttack()* : ~bool~
        + IsAttackGuardDualInput()* : ~bool~
    }
    BaseHeroInput ..|> IHeroInput : implements
    class HeroKeyInput {
        - inputActions : ~RFistActions~
        - isAttack: ~bool~
        - isAttackHold: ~bool~
        - isGuard : ~bool~
        - isDash : ~bool~
        - isUltimateAttack: ~bool~
        - isAttackGuardDualInput: ~bool~
        - holdRequiredTime : ~float~
        - OnAttackPerformed(~InputAction.CallbackContext~)
        - OnAttackReleased(~InputAction.CallbackContext~)
        - OnGuardPerformed(~InputAction.CallbackContext~)
        - OnGuardReleased(~InputAction.CallbackContext~)
        - OnDashPerformed(~InputAction.CallbackContext~)
        - OnUltimateAttack(~InputAction.CallbackContext~)
        - OnAttackGuardDualInput(~InputAction.CallbackContext~)
    }
    HeroKeyInput --> RFistActions : input event subscribes
    HeroKeyInput ..|> BaseHeroInput : implements
    class RFistActions {
        <<InputActionAsset>>
    }
```

### 동작 제어 클래스
{{< table "table-striped">}}
| 클래스 | 역할 |
|-----|-----|
|[**IHeroController**](/docs/projects/rfist/HeroControlSystem/iherocontroller/)<br> *<<interface>>*| 💡 영웅 이동 및 제어 기능 계약 정의<br> 💡 DoTween 기반 절대/상대 이동, 넉백, 대시 인터페이스 제공 <br> 💡 타겟팅 및 방향전환 기능 정의 <br> 💡 Tween 동작 취소 기능 정의 |
|[**BaseHeroMoveController**](/docs/projects/rfist/HeroControlSystem/baseheromovecontroller/)<br> *<<abstract>>*| 💡 이동 제어의 **기반 추상 클래스**<br> 💡 템플릿 메서드 패턴을 통한 구현체 확장 지원<br> 💡 이동, 회전, 순간 이동, 넉백 등 기본 동작 정의 |
|[**HeroRigidbodyController**](/docs/projects/rfist/HeroControlSystem/herorigidbodycontroller/)<br> : BaseHeroMoveController| 💡 **Rigidbody/Tween 기반 이동 구현체**<br> 💡 카메라 기준 상대 이동 및 회전 처리<br> 💡 DoTween 트윈 이동 + 벽/아바타 충돌 감지<br> 💡 넉백, 대시 등 특수 이동 구현 |
|[**IMoveControlEvent**](/docs/projects/rfist/HeroControlSystem/imovecontrolevent/)<br> *<<interface>>*| 💡 이동 입력 이벤트 및 실제 이동 발생 이벤트 정의<br> 💡 이동 방향, 포커스 모드, 제어 가능 여부 전달 |
{{< /table >}}

```mermaid
classDiagram
    direction TD
    
    HeroController ..|> IHeroController : implements
    class IHeroController{
        <<interface>>
        + MoveToAbsoluteDirection(~float~,~float~,~Vector3~)
        + MoveToRelativeDirection(~float~, ~float~, ~Vector3~)
        + KnockBack(~Vector3~, ~float~)
        + Dash(~float~, ~float~, ~Vector3~)
        + OnCancel()
        + GetRigidbodyRotation(): ~Quaternion~
        + FindAndLookTarget(~float~, ~int~)
        + FindTarget(~float~, ~int~, out ~Transform~)
        + LookAt(~Transform~)
        + LookAt(~Vector3~)
    }
    namespace BaseHeroComps {
        class BaseHeroAbility
        class BaseHeroSkill
        class BaseHeroSkillManager
    }
    BaseHeroAbility --> IHeroController : uses
    BaseHeroSkill --> IHeroController : uses
    BaseHeroSkillManager --> IHeroController : uses
    
    HeroController o--> BaseHeroMoveController : uses
    class BaseHeroMoveController {
        <<abstract>>
        # ControllerState : ~IControllerState~
        # HeroBaseStat : ~HeroBaseStat~
        # HeroObjectInfo : ~IHeroObjectInfo~
        + Move(~float~, ~float~, ~float~, ~Vector2~)
        # OnMove(~Vector2~, ~float~, ~Vector2~)*
        + MoveToAbsoluteDirection(~float~, ~float~, ~Vector3~)
        # OnMoveToAbsoluteDirection(~float~, ~float~, ~Vector3~)*
        + MoveToRelativeDirection(~float~, ~float~, ~Vector3~)
        # OnMoveToRelativeDirection(~float~, ~float~, ~Vector3~)*
        + KnockBack(~Vector3~, ~float~)
        # OnKnockBack(~Vector3~, ~float~)*
        + LookAt(~Transform~)
        # OnLookAt(~Transform~)*
        + LookAt(~Vector3~)
        # OnLookAt(~Vector3~)*
        + SetPositionAndRotation(~Vector3~, ~Quaternion~)
        # OnTeleport(~Vector3~, ~Quaternion~)*
        + Cancel()
        # OnCancelTween()*
        + SetUp(~IControllerState~, ~IHeroObjectInfo~, ~HeroBaseStat~)
        # _Setup()*
        + SetActive(~bool~)
        # _SetActive(~bool~)*
    }
    
    class HeroRigidbodyController {
        - rigidBody : ~Rigidbody~
        - LookAtThreshold : ~float~
        - LookAtSpeed : ~float~
        - DefaultKnockBackDuration : ~float~
        - DefaultRaycastDistance : ~float~
        - targetDirection : ~Quaternion~
        - targetTransform : ~Transform~
        - currentTween : ~Tween~
        - direction : ~Vector2~
        - isGrounded : ~bool~
        - isRemote : ~bool~
        - controllerActive : ~bool~
        - FixedUpdate()
        - MoveUsingCamera(~Vector2~, ~float~, ~float~)
        - Move(~Vector2~, ~float~, ~float~)
        - LookAt(~Quaternion~)
        - AdjustTargetPos(~float~, ~Vector3~, ~Vector3~) : ~Vector3~
        - IsMoveableDirection(~Vector3~, ~float~, ~int~) : ~bool~
        - CreateMoveDirectionTween(~HeroTweenMoveData) : ~Tween~
    }
    HeroRigidbodyController ..|> BaseHeroMoveController : implements
    HeroRigidbodyController *-- HeroTweenMoveData : nested
    class HeroTweenMoveData{
        <<struct>>
        + Destination : ~Vector3~
        + Duration : ~float~
        + RayDir : ~Vector3~
        + RayDist : ~float~
        + RayDetectLayer : ~int~
    }
    
    HeroController "1" --> "n" IMoveControlEvent : managed
    class IMoveControlEvent {
        <<interface>>
        + OnMoveControlEvent(~Vector2~, ~bool~, ~bool~)
        + OnMoveEvent(~Vector2~, ~bool~)
    }
    BaseHeroAbility ..|> IMoveControlEvent : implements
    HeroAnimationController ..|> IMoveControlEvent : implements
```

### 상태 관리 클래스

{{< table "table-striped">}}
| 클래스 | 역할 |
|-----|-----|
|[**IControllerState**](/docs/projects/rfist/HeroControlSystem/icontrollerstate/)<br> *<<interface>>*| 💡 컨트롤러 상태 계약 정의 (CanMove, CanAttack, CanGuard, CanDash, CanControllable) <br> 💡 상태 기반 행동 제어의 표준 인터페이스|
|[**HeroControllerStateHandler**](/docs/projects/rfist/HeroControlSystem/herocontrollerstatehandler/)<br> *: IControllerState, ISkillEvent, IHitEvent, IStanceEvent, ICutSceneEvent*| 💡 **상태 기반 행동 제어의 핵심 구현체**<br> 💡 스킬 시작/종료, 피격, 자세 변경, 컷씬 등의 이벤트 수신 및 컨트롤 제한<br> 💡 대시 횟수 및 쿨다운 관리 |
{{< /table >}}

```mermaid
classDiagram
    direction LR
    class IControllerState {
        <<interface>>
        + Setup(~BaseHeroAbility~)
        + CanMove() : ~bool~
        + CanDash() : ~bool~
        + CanAttack() : ~bool~
        + CanGuard() : ~bool~
        + CanControllable() : ~bool~
    }
    BaseHeroMoveController --> IControllerState : uses
    HeroController --> IControllerState : uses
    
    class HeroControllerStateHandler {
        - heroController : ~HeroController~
        - takeDownRecovery : ~float~
        - attackFinishedDelay : ~float~
        - stunRecovery : ~float~
        - hitRecoveryCoroutine : ~Coroutine~
        - baseStat : ~HeroBaseStat~
        - usingSkill : ~bool~
        - usingDash : ~bool~
        - dashCooldown : ~bool~
        - hitRecovering : ~bool~
        - standing : ~bool~
        - usingGuard : ~bool~
        - playingCutScene : ~bool~
        - dashCount:~int~
        + ResetState()
        - UpdateState()
        - CheckDashCount() : ~bool~
        - OnSkillStart()
        - OnSkillComplete
        - OnDash(~float~)
        - OnDashCompleted()
        - OnGuard()
        - OnGuardComplete()
        - OnStandUpComplete()
        - CoWaitHitRecovery(~float~) : ~IEnumerator~
        - CoWaitDashCooldown(~float~) : ~IEnumerator~
    }
    HeroControllerStateHandler ..|> IControllerState :implements
    HeroControllerStateHandler ..|> ISkillEvent :implements
    HeroControllerStateHandler ..|> IHitEvent :implements
    HeroControllerStateHandler ..|> IStanceEvent :implements
    HeroControllerStateHandler ..|> ICutSceneEvent :implements
    class ISkillEvent {
        <<interface>>
        + OnSkill(~BaseHeroSkill.SkillStartResult~)
        + OnSkillFinished(~BaseHeroSkill.SkillStartResult~)
    }
    class IHitEvent {
        <<interface>>
        + OnHitReceive(~HitInfo~)
    }
    class IStanceEvent {
        <<interface>>
        + WakeUp()
        + TakeDown()
        + Stun()
    }
    class ICutSceneEvent {
        <<interface>>
        + OnSpecialMoveSequenceStart()
        + OnSpecialMoveSequenceEnd()
    }
```

### 컷씬 관리 클래스

{{< table "table-striped">}}
| 클래스 | 역할 |
|-----|-----|
|[**ICutSceneEvent**](/docs/projects/rfist/HeroControlSystem/icutsceneevent/)<br> *<<interface>>*| 💡 컷씬(특수 스킬) 시작/종료 이벤트 정의 |
|[**ICutSceneEventInvoker**](/docs/projects/rfist/HeroControlSystem/icutsceneeventinvoker/)<br> *<<interface>>*| 💡 컷씬 이벤트 발신자 역할 정의<br> 💡 `NotifyCutSceneEvents()`로 모든 구독자에게 일괄 발신 |
|[**CutSceneController**](/docs/projects/rfist/HeroControlSystem/cutscenecontroller/) | 💡 `TimelineManager`에서 발생하는 컷씬 이벤트 처리 (시작/종료)<br> 💡 컷씬 중 피격자에게 데미지 적용<br> 💡 로컬/원격 플레이어 구분에 따른 공격 이벤트 처리 |
{{< /table >}}

```mermaid
classDiagram
    direction LR
    HeroControllerStateHandler ..|> ICutSceneEvent :implements
    HitPanel ..|> ICutSceneEvent : implements
    HeroController "1" --> "n" ICutSceneEvent : managed
    class ICutSceneEvent {
        <<interface>>
        + OnSpecialMoveSequenceStart()
        + OnSpecialMoveSequenceEnd()
    }
    
    HeroController ..|> ICutSceneEventInvoker : implements
    class ICutSceneEventInvoker {
        <<interface>>
        + NotifyCutSceneEvents(Action~ICutSceneEvent~)
    }
    ICutSceneEventInvoker --> ICutSceneEvent : notifying
    
    class CutSceneController{
        - attacker : ~NetworkHeroObject~
        - hitter : ~NetworkHeroObject~
        - attackerIsLocal : ~bool~
        - cutSceneEventInvokers : readonly HashSet~ICutSceneEventInvoker~
        + Initialize(~NetworkHeroObject~, ~NetworkHeroObject~)
        + StartCutScene()
        + OnEndCutScene()
        + ApplyDamageToHitter(~int~, ~bool~)
    }
    CutSceneController "1"--> "n"ICutSceneEventInvoker : manged
    CutSceneController --> NetworkHeroObject : uses
    
```

## 5. 주요 특징

### 기능의 특징

- **입력 추상화 계층**: `IHeroInput` 인터페이스와 `BaseHeroInput` 추상 클래스를 통해 키보드, 게임패드, 모바일 등 다양한 입력 방식을 추상화하고, `HeroInputData` 비트 마스크로 네트워크 효율성 극대화
- **이중 이동 시스템**: Rigidbody 기반 물리 이동(자유로운 이동)과 DoTween 기반 트윈 이동(정밀한 스킬 동작)을 상황에 맞게 선택 가능
- **상태 기반 행동 제어**: `IControllerState` 인터페이스를 통해 스킬 사용, 피격, 다운, 스턴, 컷씬 등의 상태에 따라 이동/공격/가드/대시 가능 여부를 정밀하게 제어
- **6중 이벤트 옵저버 패턴**: MoveControl, Hit, Skill, Attack, Stance, CutScene 6가지 이벤트 타입을 독립적으로 관리하여 애니메이션, 스킬, 피격 시스템과 느슨한 결합 유지
- **컷씬 제어 통합**: Timeline 기반 궁극기 컷씬 실행 중에도 캐릭터 상태 관리 및 데미지 처리가 가능한 통합 컨트롤 시스템

## 6. UseCase

### 전투 입력 처리 시나리오

1. **입력 수집**: `HeroKeyInput`이 Input System으로부터 키 입력을 감지
2. **네트워크 동기화**: `NetworkHeroInput`이 `BaseHeroInput.HeroInputList`에서 모든 입력 소스의 데이터를 수집하여 `HeroInputData`로 변환
3. **입력 전송**: Fusion `NetworkRunner`를 통해 모든 클라이언트에 입력 데이터 동기화
4. **입력 처리**: `HeroController`가 동기화된 입력을 수신하여 상태 확인 (`IControllerState.CanAttack` 등)
5. **동작 실행**: 상태가 허용하면 `BaseHeroAbility`를 통해 공격/가드/대시 등의 스킬 실행
6. **이벤트 통지**: 스킬 시작/종료 시 `HeroController.NotifySkillEvents()`로 관련 시스템에 이벤트 발신

### 피격 및 넉백 시나리오

1. **피격 수신**: `HeroController.OnHitReceive()`로 피격 정보 수신
2. **상태 전환**: `HeroControllerStateHandler.OnHitReceive()`에서 피격 회복 상태로 전환 및 `CanMove/CanAttack` 비활성화
3. **넉백 실행**: `HeroController.KnockBack()` → `HeroRigidbodyController.OnKnockBack()`으로 DoTween 기반 넉백 동작 실행
4. **상태 복원**: 회복 시간 경과 후 `UpdateState()`로 행동 가능 상태 복원

### 궁극기(컷씬) 실행 시나리오

1. **컷씬 시작**: `CutSceneController.StartCutScene()` 호출
2. **이벤트 발신**: `ICutSceneEventInvoker.NotifyCutSceneEvents()`로 모든 구독자에게 컷씬 시작 통지
3. **상태 제한**: `HeroControllerStateHandler.OnSpecialMoveSequenceStart()`에서 `_playingCutScene = true` 설정으로 모든 행동 제한
4. **데미지 처리**: Timeline 프레임 이벤트에서 `CutSceneController.ApplyDamageToHitter()`로 피격자 데미지 적용
5. **컷씬 종료**: `OnEndCutScene()`에서 `_playingCutScene = false` 설정으로 행동 가능 상태 복원

### 주요 사용처

- **PvP 전투 게임의 캐릭터 제어**: 입력 → 이동 → 스킬 → 피격의 전체 흐름 관리
- **네트워크 동기화 환경**: Fusion 기반 멀티플레이어 게임의 입력 동기화
- **복잡한 상태 머신이 필요한 캐릭터**: 스킬 캔슬, 피격 경직, 다운/스턴 등 다양한 상태 전환이 필요한 캐릭터
- **컷씬 기반 특수 스킬**: Timeline 연동 궁극기 시스템이 필요한 게임
