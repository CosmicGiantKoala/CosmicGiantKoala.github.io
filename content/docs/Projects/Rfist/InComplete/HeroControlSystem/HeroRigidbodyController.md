+++
title = "HeroRigidbodyController"
description = "Rigidbody 기반의 영웅 이동 컨트롤러 구현체"
icon = "code"
date = "2025-03-06T20:49:00+09:00"
lastmod = "2025-03-06T20:49:00+09:00"
draft = false
toc = true
weight = 230
+++

## 개요

`HeroRigidbodyController` 클래스는 RFist 게임의 Rigidbody 기반 영웅 이동 컨트롤러 구현체입니다.
[`BaseHeroMoveController`](/docs/projects/rfist/HeroControlSystem/BaseHeroMoveController)를 상속받아 물리 기반 이동, DoTween 기반 트윈 이동,
칩메라 기준 이동, 넉백 등의 기능을 구현합니다.

## 역할

- Rigidbody를 사용한 물리 기반 이동 구현
- DoTween 기반 트윈 이동 (대시, 넉백 등) 구현
- 칩메라 기준 상대 이동 및 회전 처리
- 벽/아바타 충돌 감지 및 처리
- 포커스 모드 이동 (타겟 추적) 구현

## 선언

```csharp
/// <summary>
/// Rigidbody 기반의 영웅 이동 컨트롤러 구현체
/// BaseHeroMoveController를 상속받아 물리 기반 이동, 치트 이동, 넉백 등을 구현합니다.
/// </summary>
public class HeroRigidbodyController : BaseHeroMoveController
```

## 멤버

### Serialized Fields

```csharp
/// <summary>
/// Rigidbody 컴포넌트 참조
/// </summary>
[SerializeField]
private Rigidbody rigidBody;

/// <summary>
/// 칩메라 기준 이동 사용 여부
/// </summary>
[SerializeField]
private bool moveUsingCamera = true;
```

### Constants

```csharp
/// <summary>
/// LookAt 회전 완료 임계값 (각도)
/// </summary>
private const float LookAtThreshold = 0.01f;

/// <summary>
/// LookAt 회전 속도
/// </summary>
private const float LookAtSpeed = 20f;

/// <summary>
/// 기본 넉백 지속 시간
/// </summary>
private const float DefaultKnockBackDuration = 0.2f;

/// <summary>
/// 기본 레이캐스트 거리
/// </summary>
private const float DefaultRaycastDistance = 0.5f;

/// <summary>
/// 기본 반경 속도
/// </summary>
private const float BaseRadiusSpeed = 100f;
```

### Private Fields

```csharp
/// <summary>
/// 목표 회전 방향
/// </summary>
private Quaternion _targetDirection;

/// <summary>
/// 포커스 타겟 트랜스폼
/// </summary>
private Transform _targetTransform;

/// <summary>
/// 현재 DoTween 인스턴스
/// </summary>
private Tween _currentTween;

/// <summary>
/// 현재 이동 방향
/// </summary>
private Vector2 _direction;

/// <summary>
/// 착지 여부
/// </summary>
private bool _isGrounded;

/// <summary>
/// 점프 중 여부
/// </summary>
private bool _isJumping;

/// <summary>
/// 리모트(네트워크 원격) 여부
/// </summary>
private bool _isRemote = true;

/// <summary>
/// 컨트롤러 활성화 상태
/// </summary>
private bool _controllerActive = false;

/// <summary>
/// 아바타 레이어 마스크
/// </summary>
private int _avatarLayer;

/// <summary>
/// 벽 레이어 마스크
/// </summary>
private int _wallLayer;

/// <summary>
/// 바닥 레이어 마스크
/// </summary>
private int _groundLayer;

/// <summary>
/// 메인 칩메라 트랜스폼
/// </summary>
private Transform cameraTransform;
```

### Unity Lifecycle

```csharp
/// <summary>
/// 초기화 - 레이어 마스크 설정 및 칩메라 참조
/// </summary>
private void Awake()

/// <summary>
/// 물리 업데이트 - 중력 처리 및 회전 보간
/// </summary>
private void FixedUpdate()
```

### Protected Override Methods - Movement

```csharp
/// <summary>
/// 포커스 모드 이동 구현
/// </summary>
protected override void OnFocusMove(Vector2 direction, float deltaTime, Transform focusTarget = null)

/// <summary>
/// 일반 이동 구현
/// </summary>
protected override void OnMove(Vector2 moveDirection, float deltaTime, Vector2 turnDirection = default)

/// <summary>
/// 칩메라 기준 이동 처리
/// </summary>
private void MoveUsingCamera(Vector2 direction, float speed, float deltaTime)

/// <summary>
/// 직접 이동 처리
/// </summary>
private void Move(Vector2 direction, float speed, float deltaTime)

/// <summary>
/// 포커스 모드 이동 처리
/// </summary>
private void FocusMove(Vector2 direction, float speed, float deltaTime, Transform focusTarget = null)

/// <summary>
/// 칩메라 기준 XZ 평면 방향 벡터 계산
/// </summary>
private (Vector3 forwardXZ, Vector3 rightXZ) GetCameraBasisXZ()
```

### Protected Override Methods - Teleport

```csharp
/// <summary>
/// 순간 이동 구현
/// </summary>
protected override void OnTeleport(Vector3 position, Quaternion rotation)
```

### Protected Override Methods - Rotation

```csharp
/// <summary>
/// 특정 방향을 바라볼도록 회전
/// </summary>
protected override void OnLookAt(Vector3 targetDirection)

/// <summary>
/// 특정 트랜스폼을 바라볼도록 회전
/// </summary>
protected override void OnLookAt(Transform targetTransform)

/// <summary>
/// 목표 회전으로 보간하여 회전
/// </summary>
private void LookAt(Quaternion targetRotation)
```

### Protected Override Methods - Tween Movement

```csharp
/// <summary>
/// 절대 방향 이동 구현 (DoTween 기반)
/// </summary>
protected override void OnMoveToAbsoluteDirection(float distance, float time, Vector3 direction)

/// <summary>
/// 상대 방향 이동 구현 (DoTween 기반)
/// </summary>
protected override void OnMoveToRelativeDirection(float distance, float time, Vector3 direction)

/// <summary>
/// 목표 위치 조정 (벽 충돌 시 거리 조정)
/// </summary>
private Vector3 AdjustTargetPos(float distance, Vector3 direction, Vector3 targetPos)
```

### Protected Override Methods - KnockBack

```csharp
/// <summary>
/// 넉백 구현 (DoTween 기반)
/// </summary>
protected override void OnKnockBack(Vector3 attackerPos, float force)
```

### Protected Override Methods - Control

```csharp
/// <summary>
/// 트윈 이동 취소
/// </summary>
protected override void OnCancelTween()

/// <summary>
/// 현재 회전값 가져오기
/// </summary>
protected override Quaternion GetRotation()

/// <summary>
/// 초기 설정
/// </summary>
protected override void _Setup()

/// <summary>
/// 활성화/비활성화 설정
/// </summary>
protected override void _SetActive(bool isActive)
```

### Public Override Methods - Network

```csharp
/// <summary>
/// FixedNetworkLateUpdate 처리
/// </summary>
public override void OnFixedNetworkLateUpdate(float deltaTime)
```

### Private Methods - Collision Check & Tween

```csharp
/// <summary>
/// 해당 방향으로 이동 가능한지 체크
/// </summary>
private bool IsMoveableDirection(Vector3 rayDir, float rayDist, int targetLayer)

/// <summary>
/// 방향 이동 트윈 생성
/// </summary>
private Tween CreateMoveDirectionTween(HeroTweenMoveData moveData)
```

### Nested Struct

```csharp
/// <summary>
/// DoTween 이동에 필요한 데이터 구조체
/// </summary>
private struct HeroTweenMoveData
{
    public Vector3 Destination;
    public float Duration;
    public Vector3 RayDir;
    public float RayDist;
    public int RayDetectLayer;
    
    public HeroTweenMoveData(Vector3 destination, float duration, Vector3 rayDir, float rayDist, int rayDetectLayer)
}
```

## 코드 스니펫

### 칩메라 기준 이동

```csharp
/// <summary>
/// 칩메라 기준 이동 처리
/// </summary>
private void MoveUsingCamera(Vector2 direction, float speed, float deltaTime)
{
    // 입력이 없거나 키네마틱이면 리턴
    if (direction.sqrMagnitude < 0.01f || rigidBody.isKinematic) return;

    // 칩메라 기준 방향 벡터 계산
    var (camForward, camRight) = GetCameraBasisXZ();

    Vector3 moveWorld = (camForward * direction.y + camRight * direction.x);
    moveWorld.y = 0f;

    if (moveWorld.sqrMagnitude > 1f) moveWorld.Normalize();

    // 속도 적용
    var yVelocity = _isGrounded ? 0 : Physics.gravity.y;
    var targetLinearVelocity = moveWorld * speed;
    rigidBody.linearVelocity = new Vector3(targetLinearVelocity.x, yVelocity, targetLinearVelocity.z);

    // 목표 회전 설정
    _targetDirection = Quaternion.LookRotation(moveWorld);
    _targetTransform = null;
}
```

### 칩메라 방향 벡터 계산

```csharp
/// <summary>
/// 칩메라 기준 XZ 평면 방향 벡터 계산
/// </summary>
private (Vector3 forwardXZ, Vector3 rightXZ) GetCameraBasisXZ()
{
    // 칩메라 없거나 기울기 심해서 투영이 0에 가까우면 캐릭터 전방으로 폴08
    Vector3 f = Vector3.forward, r = Vector3.right;

    if (cameraTransform)
    {
        var rawF = cameraTransform.forward;
        rawF.y = 0f;
        if (rawF.sqrMagnitude > 0.0001f)
        {
            f = rawF.normalized;
            r = Vector3.Cross(Vector3.up, f);
            r.Normalize();
        }
        else
        {
            // 탑다운에 가까운 극단적 피치일 때 폴08
            var fallback = transform.forward;
            fallback.y = 0f;
            f = fallback.sqrMagnitude > 0.0001f ? fallback.normalized : Vector3.forward;
            r = Vector3.Cross(Vector3.up, f).normalized;
        }
    }

    return (f, r);
}
```

### DoTween 이동 트윈 생성

```csharp
/// <summary>
/// 방향 이동 트윈 생성
/// </summary>
private Tween CreateMoveDirectionTween(HeroTweenMoveData moveData)
{
    Vector3 startPos = rigidBody.position;
    
    return DOVirtual.Float(0, 1, moveData.Duration, (prograss) =>
    {
        // 이동 중 충돌 체크
        if (IsMoveableDirection(moveData.RayDir, moveData.RayDist, moveData.RayDetectLayer) == false)
        {
            OnCancelTween();
            return;
        }

        // 수평 위치 보간
        Vector3 targetHorizontalPos = Vector3.Lerp(
            new Vector3(startPos.x, 0, startPos.z), 
            new Vector3(moveData.Destination.x, 0, moveData.Destination.z),prograss);

        // 새 위치 적용
        Vector3 newPos = new Vector3(targetHorizontalPos.x, rigidBody.position.y, targetHorizontalPos.z);
        rigidBody.MovePosition(newPos);

        // 중력 적용
        rigidBody.linearVelocity = new Vector3(0, _isGrounded ? 0 : Physics.gravity.y, 0);

    }).SetUpdate(UpdateType.Fixed)
    .OnComplete(() =>
    {
        _currentTween = null;
    });
}
```

### 벽 충돌 감지 및 위치 조정

```csharp
/// <summary>
/// 목표 위치 조정 (벽 충돌 시 거리 조정)
/// </summary>
private Vector3 AdjustTargetPos(float distance, Vector3 direction, Vector3 targetPos)
{
    // 벽과 충돌하면 거리 조정
    if (Physics.Raycast(rigidBody.position, direction, out RaycastHit hit, distance, LayerMask.GetMask("Wall")))
    {
        var adjustedDistance = hit.distance - 0.2f;
        if (adjustedDistance > 0)
        {
            targetPos = rigidBody.position + direction * adjustedDistance;
        }
    }
    return targetPos;
}
```

## 기능 설명

### 이동 시스템

HeroRigidbodyController는 두 가지 이동 방식을 제공합니다:

1. **물리 기반 이동**: `MoveUsingCamera()`, `Move()` - Rigidbody.velocity를 직접 설정
2. **트윈 기반 이동**: `CreateMoveDirectionTween()` - DoTween을 사용한 보간 이동

### 칩메라 기준 이동

`moveUsingCamera`가 true일 때, 이동 입력은 칩메라의 시점을 기준으로 변환됩니다:
- 칩메라의 forward/right 벡터를 XZ 평면에 투영
- 극단적인 칩메라 각도(탑다운 등)에서는 캐릭터 전방으로 폴08

### 충돌 감지

이동 전 `IsMoveableDirection()`으로 충돌 체크:
- 레이캐스트로 벽/아바타 레이어 체크
- 트윈 이동 중에도 지속적으로 체크하여 즉시 중단 가능

### 회전 처리

- **포커스 모드**: `_targetTransform`이 있으면 해당 타겟을 향해 즉시 회전
- **일반 모드**: `_targetDirection`을 향해 FixedUpdate에서 보간 회전
- **임계값**: `LookAtThreshold` 이내이면 회전 중단 (성능 최적화)

### 넉백 시스템

`OnKnockBack`은 다음 단계로 실행:
1. 공격자 반대 방향 계산
2. 이동 가능 여부 체크
3. DoTween 트윈 생성 및 실행

## 의존성/상속 관계

### 상속/구현
- [`BaseHeroMoveController`](/docs/projects/rfist/HeroControlSystem/BaseHeroMoveController) 상속

### 의존 클래스
- `Rigidbody` - 물리 이동
- `HeroBaseStat` - 이동 속도 등 능력치
- `IControllerState` - 이동 가능 상태 체크
- `IHeroObjectInfo` - 리모트 여부 확인
- `DG.Tweening` - 트윈 이동

### 사용 위치
- [`HeroController`](/docs/projects/rfist/HeroControlSystem/HeroController) - 이동 위임

## 사용 예시

### HeroController에서 HeroRigidbodyController 사용

```csharp
/// <summary>
/// HeroController가 HeroRigidbodyController를 사용하는 예시
/// </summary>
public class HeroController : MonoBehaviour, IHeroController
{
    [SerializeField] private BaseHeroMoveController heroMoveController;
    
    private void Start()
    {
        // HeroRigidbodyController가 BaseHeroMoveController로서 주입됨
        // (Inspector에서 HeroRigidbodyController 컴포넌트 할당)
    }
    
    /// <summary>
    /// 이동 처리
    /// </summary>
    public void Move(float horizontal, float vertical, float deltaTime)
    {
        // BaseHeroMoveController 인터페이스로 호출
        // 난부적으로 HeroRigidbodyController.OnMove() 실행
        heroMoveController.Move(horizontal, vertical, deltaTime, _moveDirection);
    }
    
    /// <summary>
    /// 대시 (트윈 이동)
    /// </summary>
    public void Dash(float distance, float time, Vector3 direction)
    {
        // DoTween 기반 이동 실행
        heroMoveController.MoveToRelativeDirection(distance, time, direction);
    }
}
```

### 스킬에서 넉백 사용

```csharp
/// <summary>
/// 공격 스킬에서 넉백 적용
/// </summary>
public class AttackSkill : BaseHeroSkill
{
    [SerializeField] private float knockbackForce = 5f;
    
    private void OnHitTarget(HitInfo hitInfo)
    {
        // 타겟의 HeroController를 통해 넉백 적용
        var targetController = hitInfo.Target.GetComponent<HeroController>();
        if (targetController != null)
        {
            // 난부적으로 HeroRigidbodyController.OnKnockBack() 실행
            targetController.KnockBack(
                transform.position,  // 공격자 위치
                knockbackForce       // 넉백 힘
            );
        }
    }
}
```

## 관련 클래스

- [`BaseHeroMoveController`](/docs/projects/rfist/HeroControlSystem/BaseHeroMoveController)
- [`HeroController`](/docs/projects/rfist/HeroControlSystem/HeroController)
- [`NetworkKCCController`](/docs/projects/rfist/HeroControlSystem/NetworkKCCController)
- [`HeroBaseStat`](/docs/projects/rfist/HeroAbilitySystem/HeroBaseStat)
- [`IControllerState`](/docs/projects/rfist/HeroControlSystem/IControllerState)
