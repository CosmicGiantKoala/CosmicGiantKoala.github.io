+++
title = "BaseHeroMoveController"
description = "영웅 이동 제어의 기반 추상 클래스"
icon = "code"
date = "2025-03-06T20:43:00+09:00"
lastmod = "2025-03-06T20:43:00+09:00"
draft = false
toc = true
weight = 220
+++

## 개요

`BaseHeroMoveController` 클래스는 RFist 게임의 영웅 이동 제어를 위한 기반 추상 클래스입니다.
Rigidbody 기반, KCC(Kinematic Character Controller) 등 다양한 이동 구현체의 공통 인터페이스를 제공하며,
템플릿 메서드 패턴을 통해 구체적인 이동 로직은 하위 클래스에서 구현하도록 합니다.

## 역할

- 다양한 이동 구현체(Rigidbody, KCC 등)의 공통 인터페이스 제공
- 이동, 회전, 순간 이동, 넉백 등의 기본 동작 정의
- 템플릿 메서드 패턴을 통한 구현체 확장 지원
- 이동 관련 이벤트 발행 및 상태 관리

## 선언

```csharp
/// <summary>
/// 영웅 이동 제어의 기반 추상 클래스
/// Rigidbody 기반, KCC(Kinematic Character Controller) 등 다양한 이동 구현체의 공통 인터페이스를 제공합니다.
/// </summary>
[DisallowMultipleComponent]
public abstract class BaseHeroMoveController : MonoBehaviour
```

## 멤버

### 이벤트

```csharp
/// <summary>
/// 순간 이동(Teleport) 완료 시 발생하는 이벤트
/// </summary>
public Action<Vector3, Quaternion> OnTeleported;

/// <summary>
/// 상대 방향 이동 시작 시 발생하는 이벤트
/// </summary>
public Action<Vector3, float> OnMoveToRelativeDirectioned;

/// <summary>
/// 절대 방향 이동 시작 시 발생하는 이벤트
/// </summary>
public Action<Vector3, float> OnMoveToAbsoluteDirectioned;

/// <summary>
/// 넉백 발생 시 발생하는 이벤트
/// </summary>
public Action<Vector3> OnKnockBacked;

/// <summary>
/// 이동 취소 시 발생하는 이벤트
/// </summary>
public Action OnMoveCanceled;

/// <summary>
/// 방향 전환 시 발생하는 이벤트
/// </summary>
public Action<Vector3> OnLookAted;
```

### Protected Fields

```csharp
/// <summary>
/// 컨트롤러 상태 인터페이스
/// </summary>
protected IControllerState ControllerState;

/// <summary>
/// 영웅 오브젝트 정보 인터페이스
/// </summary>
protected IHeroObjectInfo HeroObjectInfo;

/// <summary>
/// 영웅 기본 능력치
/// </summary>
protected HeroBaseStat HeroBaseStat;
```

### Abstract Methods - Movement

```csharp
/// <summary>
/// 포커스 모드 이동 처리 (구현체에서 재정의)
/// </summary>
/// <param name="direction">이동 방향 (수평/수직 입력값)</param>
/// <param name="deltaTime">델타 타임</param>
/// <param name="focusTarget">포커스 대상 트랜스폼</param>
protected abstract void OnFocusMove(Vector2 direction, float deltaTime,
    Transform focusTarget = null);

/// <summary>
/// 일반 이동 처리 (구현체에서 재정의)
/// </summary>
/// <param name="moveDirection">이동 방향</param>
/// <param name="deltaTime">델타 타임</param>
/// <param name="turnDirection">전환 방향 (기본값: default)</param>
protected abstract void OnMove(Vector2 moveDirection, float deltaTime,
    Vector2 turnDirection = default);

/// <summary>
/// 절대 방향 이동 처리 (구현체에서 재정의)
/// </summary>
/// <param name="distance">이동 거리</param>
/// <param name="time">이동 시간</param>
/// <param name="direction">이동 방향 (월드 좌표계)</param>
protected abstract void OnMoveToAbsoluteDirection(float distance, float time, Vector3 direction);

/// <summary>
/// 상대 방향 이동 처리 (구현체에서 재정의)
/// </summary>
/// <param name="distance">이동 거리</param>
/// <param name="time">이동 시간</param>
/// <param name="direction">이동 방향 (로컬 좌표계)</param>
protected abstract void OnMoveToRelativeDirection(float distance, float time, Vector3 direction);

/// <summary>
/// 넉백 처리 (구현체에서 재정의)
/// </summary>
/// <param name="attackerPos">공격자 위치</param>
/// <param name="force">넉백 힘</param>
protected abstract void OnKnockBack(Vector3 attackerPos, float force);
```

### Abstract Methods - Rotation

```csharp
/// <summary>
/// 특정 트랜스폼을 바라볼도록 회전 (구현체에서 재정의)
/// </summary>
/// <param name="targetPosition">바라볼 대상 트랜스폼</param>
protected abstract void OnLookAt(Transform targetPosition);

/// <summary>
/// 특정 방향을 바라볼도록 회전 (구현체에서 재정의)
/// </summary>
/// <param name="targetDirection">바라볼 방향 벡터</param>
protected abstract void OnLookAt(Vector3 targetDirection);

/// <summary>
/// 현재 회전값 가져오기 (구현체에서 재정의)
/// </summary>
/// <returns>현재 회전값(Quaternion)</returns>
protected abstract Quaternion GetRotation();
```

### Abstract Methods - Control

```csharp
/// <summary>
/// 순간 이동 처리 (구현체에서 재정의)
/// </summary>
/// <param name="position">이동할 위치</param>
/// <param name="rotation">설정할 회전값</param>
protected abstract void OnTeleport(Vector3 position, Quaternion rotation);

/// <summary>
/// 트윈 이동 취소 (구현체에서 재정의)
/// </summary>
protected abstract void OnCancelTween();

/// <summary>
/// 초기 설정 (구현체에서 재정의)
/// </summary>
protected abstract void _Setup();

/// <summary>
/// 활성화/비활성화 설정 (구현체에서 재정의)
/// </summary>
/// <param name="isActive">활성화 여부</param>
protected abstract void _SetActive(bool isActive);
```

### Abstract Methods - Network Update

```csharp
/// <summary>
/// FixedNetworkLateUpdate 처리 (구현체에서 재정의)
/// </summary>
/// <param name="deltaTime">델타 타임</param>
public abstract void OnFixedNetworkLateUpdate(float deltaTime);
```

### Public Methods - Setup

```csharp
/// <summary>
/// 이동 컨트롤러 초기 설정
/// </summary>
/// <param name="controllerState">컨트롤러 상태 인터페이스</param>
/// <param name="heroObjectInfo">영웅 오브젝트 정보</param>
/// <param name="heroBaseStat">영웅 기본 능력치</param>
public void Setup(IControllerState controllerState, IHeroObjectInfo heroObjectInfo, HeroBaseStat heroBaseStat)

/// <summary>
/// 컨트롤러 활성화/비활성화 설정
/// </summary>
/// <param name="isActive">활성화 여부</param>
public void SetActive(bool isActive)
```

### Public Methods - Movement

```csharp
/// <summary>
/// 포커스 모드 이동
/// </summary>
/// <param name="horizontal">수평 입력값</param>
/// <param name="vertical">수직 입력값</param>
/// <param name="deltaTime">델타 타임</param>
/// <param name="focusTarget">포커스 대상 트랜스폼</param>
public void FocusMove(float horizontal, float vertical, float deltaTime, Transform focusTarget = null)

/// <summary>
/// 일반 이동
/// </summary>
/// <param name="horizontal">수평 입력값</param>
/// <param name="vertical">수직 입력값</param>
/// <param name="deltaTime">델타 타임</param>
/// <param name="targetDirection">전환 방향 (기본값: default)</param>
public void Move(float horizontal, float vertical, float deltaTime, Vector2 targetDirection = default)

/// <summary>
/// 절대 방향으로 이동 (DoTween 기반)
/// </summary>
/// <param name="distance">이동 거리</param>
/// <param name="time">이동 시간</param>
/// <param name="direction">이동 방향 (월드 좌표계)</param>
public void MoveToAbsoluteDirection(float distance, float time, Vector3 direction)

/// <summary>
/// 상대 방향으로 이동 (DoTween 기반)
/// </summary>
/// <param name="distance">이동 거리</param>
/// <param name="time">이동 시간</param>
/// <param name="direction">이동 방향 (로컬 좌표계)</param>
public void MoveToRelativeDirection(float distance, float time, Vector3 direction)

/// <summary>
/// 넉백 처리
/// </summary>
/// <param name="attackerPos">공격자 위치</param>
/// <param name="force">넉백 힘</param>
public void KnockBack(Vector3 attackerPos, float force)

/// <summary>
/// 위치 및 회전값 설정 (순간 이동)
/// </summary>
/// <param name="position">설정할 위치</param>
/// <param name="rotation">설정할 회전값</param>
public void SetPositionAndRotation(Vector3 position, Quaternion rotation)
```

### Public Methods - Rotation

```csharp
/// <summary>
/// 특정 트랜스폼을 바라볼도록 회전
/// </summary>
/// <param name="skillResultHitTransform">바라볼 대상 트랜스폼</param>
public void LookAt(Transform skillResultHitTransform)

/// <summary>
/// 특정 방향을 바라볼도록 회전
/// </summary>
/// <param name="targetDirection">바라볼 방향 벡터</param>
public void LookAt(Vector3 targetDirection)

/// <summary>
/// 현재 Rigidbody 회전값 가져오기
/// </summary>
/// <returns>현재 회전값(Quaternion)</returns>
public Quaternion GetRigidbodyRotation()
```

### Public Methods - Control

```csharp
/// <summary>
/// 현재 진행 중인 트윈 이동 취소
/// </summary>
public void Cancel()
```

## 코드 스니펫

### 이동 메서드 템플릿 패턴

```csharp
/// <summary>
/// 일반 이동 - 템플릿 메서드 패턴 적용
/// </summary>
public void Move(float horizontal, float vertical, float deltaTime, Vector2 targetDirection = default)
{
    // 방향 전환 여부에 따라 추상 메서드 호출
    if (targetDirection == default)
    {
        OnMove(new Vector2(horizontal, vertical), deltaTime);
    }
    else
    {
        OnMove(new Vector2(horizontal, vertical), deltaTime, targetDirection);
    }
}
```

### 초기 설정 흐름

```csharp
/// <summary>
/// 이동 컨트롤러 초기 설정
/// </summary>
public void Setup(IControllerState controllerState, IHeroObjectInfo heroObjectInfo, HeroBaseStat heroBaseStat)
{
    // 의존성 주입
    ControllerState = controllerState;
    HeroObjectInfo = heroObjectInfo;
    HeroBaseStat = heroBaseStat;
    
    // 구현체별 추가 설정 호출
    _Setup();
}
```

### 포커스 모드 이동 호출

```csharp
/// <summary>
/// 포커스 모드 이동
/// </summary>
public void FocusMove(float horizontal, float vertical, float deltaTime, Transform focusTarget = null)
{
    // 입력값을 Vector2로 변환하여 추상 메서드 호출
    OnFocusMove(new Vector2(horizontal, vertical), deltaTime, focusTarget);
}
```

## 기능 설명

### 템플릿 메서드 패턴

`BaseHeroMoveController`는 템플릿 메서드 패턴을 사용하여 이동 로직의 일관된 인터페이스를 제공합니다:

1. **Public 메서드**: 공통 전처리/후처리 수행
2. **Protected abstract 메서드**: 구현체에서 반드시 구현해야 하는 핵심 로직

이를 통해 Rigidbody 기반, KCC 기반 등 다양한 이동 방식을 동일한 인터페이스로 사용할 수 있습니다.

### 이동 유형

| 이동 유형 | 메서드 | 설명 |
|----------|--------|------|
| 일반 이동 | `Move` | 입력값 기반의 기본 이동 |
| 포커스 이동 | `FocusMove` | 타겟을 바라볼 수 있도록 회전하며 이동 |
| 절대 이동 | `MoveToAbsoluteDirection` | 월드 좌표계 기준 DoTween 이동 |
| 상대 이동 | `MoveToRelativeDirection` | 로컬 좌표계 기준 DoTween 이동 |
| 넉백 | `KnockBack` | 물리 기반 넉백 |
| 순간 이동 | `SetPositionAndRotation` | 위치/회전 즉시 변경 |

### 이벤트 시스템

이동 컨트롤러는 6가지 이벤트를 제공하여 외부 시스템(애니메이션, 이펙트 등)과 연동:

- `OnTeleported`: 순간 이동 완료 시
- `OnMoveToRelativeDirectioned`: 상대 이동 시작 시
- `OnMoveToAbsoluteDirectioned`: 절대 이동 시작 시
- `OnKnockBacked`: 넉백 발생 시
- `OnMoveCanceled`: 이동 취소 시
- `OnLookAted`: 방향 전환 시

## 의존성/상속 관계

### 상속/구현
- `MonoBehaviour` 상속
- 추상 클래스로서 직접 인스턴스화 불가

### 구현/상속하는 서브클릭스
- [`HeroRigidbodyController`](/docs/projects/rfist/HeroControlSystem/HeroRigidbodyController): Rigidbody 기반 이동 구현
- [`NetworkKCCController`](/docs/projects/rfist/HeroControlSystem/NetworkKCCController): KCC 기반 이동 구현 (네트워크)

### 의존 클래스
- [`IControllerState`](/docs/projects/rfist/HeroControlSystem/IControllerState) - 컨트롤러 상태 인터페이스
- [`IHeroObjectInfo`](/docs/projects/rfist/HeroNetworkSystem/IHeroObjectInfo) - 영웅 오브젝트 정보
- [`HeroBaseStat`](/docs/projects/rfist/HeroAbilitySystem/HeroBaseStat) - 영웅 기본 능력치

### 사용 위치
- [`HeroController`](/docs/projects/rfist/HeroControlSystem/HeroController) - 이동 제어 위임
- [`BaseHeroAbility`](/docs/projects/rfist/HeroAbilitySystem/BaseHeroAbility) - 스킬 실행 중 이동 제어

## 사용 예시

### HeroController에서 BaseHeroMoveController 사용

```csharp
/// <summary>
/// HeroController가 BaseHeroMoveController를 사용하는 예시
/// </summary>
public class HeroController : MonoBehaviour, IHeroController
{
    [SerializeField] private BaseHeroMoveController heroMoveController;
    
    /// <summary>
    /// 컨트롤러 초기 설정 시 이동 컨트롤러도 설정
    /// </summary>
    public void Setup(BaseHeroAbility heroAbility, IHeroStatus heroStatus, IHeroObjectInfo heroObjectInfo)
    {
        // ... 다른 초기화 ...
        
        // 이동 컨트롤러 설정 (HeroControllerState와 HeroObjectInfo 전달)
        heroMoveController.Setup(_controllerState, heroObjectInfo, heroAbility.GetHeroStat());
    }
    
    /// <summary>
    /// 이동 처리 - BaseHeroMoveController에 위임
    /// </summary>
    public void Move(float horizontal, float vertical, float deltaTime)
    {
        if (_controllerState.CanMove == false) return;
        
        if (!_isFocusMode)
        {
            // 일반 이동
            heroMoveController.Move(horizontal, vertical, deltaTime, _moveDirection);
        }
        else
        {
            // 포커스 모드 이동
            heroMoveController.FocusMove(horizontal, vertical, deltaTime, _focusTarget.transform);
        }
    }
    
    /// <summary>
    /// DoTween 기반 절대 방향 이동
    /// </summary>
    public void MoveToAbsoluteDirection(float distance, float time, Vector3 direction)
    {
        heroMoveController.MoveToAbsoluteDirection(distance, time, direction);
    }
    
    /// <summary>
    /// 넉백 처리
    /// </summary>
    public void KnockBack(Vector3 attackerPos, float force)
    {
        heroMoveController.KnockBack(attackerPos, force);
    }
    
    /// <summary>
    /// 방향 전환
    /// </summary>
    public void LookAt(Vector3 direction)
    {
        heroMoveController.LookAt(direction);
    }
}
```

### HeroRigidbodyController에서 BaseHeroMoveController 구현

```csharp
/// <summary>
/// Rigidbody 기반 이동 구현체
/// </summary>
public class HeroRigidbodyController : BaseHeroMoveController
{
    [SerializeField] private Rigidbody _rigidbody;
    private Vector3 _moveDirection;
    
    /// <summary>
    /// 초기 설정 구현
    /// </summary>
    protected override void _Setup()
    {
        // Rigidbody 참조 확인
        if (_rigidbody == null)
            _rigidbody = GetComponent<Rigidbody>();
    }
    
    /// <summary>
    /// 일반 이동 구현 (물리 기반)
    /// </summary>
    protected override void OnMove(Vector2 moveDirection, float deltaTime, Vector2 turnDirection = default)
    {
        // 이동 방향 계산
        _moveDirection = new Vector3(moveDirection.x, 0, moveDirection.y);
        
        // 속도 적용 (HeroBaseStat에서 이동 속도 가져오기)
        float speed = HeroBaseStat.MoveSpeed;
        Vector3 velocity = _moveDirection * speed;
        
        // Rigidbody에 속도 적용
        _rigidbody.velocity = new Vector3(velocity.x, _rigidbody.velocity.y, velocity.z);
        
        // 방향 전환이 필요한 경우 회전 처리
        if (turnDirection != default)
        {
            Vector3 turnDir = new Vector3(turnDirection.x, 0, turnDirection.y);
            Quaternion targetRotation = Quaternion.LookRotation(turnDir);
            _rigidbody.rotation = Quaternion.Slerp(_rigidbody.rotation, targetRotation, deltaTime * 10f);
        }
    }
    
    /// <summary>
    /// 넉백 구현 (AddForce 사용)
    /// </summary>
    protected override void OnKnockBack(Vector3 attackerPos, float force)
    {
        // 공격자 반대 방향 계산
        Vector3 knockbackDir = (transform.position - attackerPos).normalized;
        knockbackDir.y = 0.3f; // 약간 위로
        
        // Impulse 힘 적용
        _rigidbody.AddForce(knockbackDir * force, ForceMode.Impulse);
        
        // 이벤트 발생
        OnKnockBacked?.Invoke(knockbackDir);
    }
    
    /// <summary>
    /// DoTween 기반 절대 방향 이동 구현
    /// </summary>
    protected override void OnMoveToAbsoluteDirection(float distance, float time, Vector3 direction)
    {
        Vector3 targetPos = transform.position + direction.normalized * distance;
        
        // 이벤트 발생
        OnMoveToAbsoluteDirectioned?.Invoke(direction, distance);
        
        // DoTween 이동 실행
        _rigidbody.DOMove(targetPos, time).SetEase(Ease.OutQuad);
    }
    
    /// <summary>
    /// 회전값 가져오기
    /// </summary>
    protected override Quaternion GetRotation()
    {
        return _rigidbody.rotation;
    }
    
    // ... 기타 추상 메서드 구현 ...
}
```

## 관련 클래스

- [`HeroController`](/docs/projects/rfist/HeroControlSystem/HeroController)
- [`HeroRigidbodyController`](/docs/projects/rfist/HeroControlSystem/HeroRigidbodyController)
- [`NetworkKCCController`](/docs/projects/rfist/HeroControlSystem/NetworkKCCController)
- [`IControllerState`](/docs/projects/rfist/HeroControlSystem/IControllerState)
- [`IHeroObjectInfo`](/docs/projects/rfist/HeroNetworkSystem/IHeroObjectInfo)
- [`HeroBaseStat`](/docs/projects/rfist/HeroAbilitySystem/HeroBaseStat)
- [`IHeroController`](/docs/projects/rfist/HeroControlSystem/IHeroController)
