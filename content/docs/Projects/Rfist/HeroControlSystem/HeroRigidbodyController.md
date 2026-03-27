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
[`BaseHeroMoveController`](/docs/projects/rfist/HeroControlSystem/BaseHeroMoveController)를 상속받아 물리 기반 이동,[`DoTween`](https://dotween.demigiant.com/documentation.php) 기반 트윈 이동,
카메라 기준 이동, 넉백 등의 기능을 구현합니다.

## 역할
- Rigidbody를 사용한 물리 기반 이동 구현
- [`DoTween`](https://dotween.demigiant.com/documentation.php) 기반 트윈 이동 (대시, 넉백 등) 구현
- 카메라 기준 상대 이동 및 회전 처리
- 벽/아바타 충돌 감지 및 처리

## 선언
```csharp
public class HeroRigidbodyController : BaseHeroMoveController
```

## 멤버
### 중첩 구조체
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

### 속성
```csharp
/// <summary>
/// Rigidbody 컴포넌트 참조
/// </summary>
[SerializeField]
private Rigidbody rigidBody;

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
/// 목표 회전 방향
/// </summary>
private Quaternion _targetDirection;

/// <summary>
/// 타겟 트랜스폼
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
/// 메인 카메라 트랜스폼
/// </summary>
private Transform cameraTransform;
```

### 메서드
```csharp
/// <summary>
/// 초기화 - 레이어 마스크 설정 및 카메라 참조
/// </summary>
private void Awake()

/// <summary>
/// 물리 업데이트 - 중력 처리 및 회전 보간
/// </summary>
private void FixedUpdate()

/// <summary>
/// 일반 이동 구현
/// </summary>
protected override void OnMove(Vector2 moveDirection, float deltaTime, Vector2 turnDirection = default)

/// <summary>
/// 카메라 기준 이동 처리
/// </summary>
private void MoveUsingCamera(Vector2 direction, float speed, float deltaTime)

/// <summary>
/// 직접 이동 처리
/// </summary>
private void Move(Vector2 direction, float speed, float deltaTime)

/// <summary>
/// 순간 이동 구현
/// </summary>
protected override void OnTeleport(Vector3 position, Quaternion rotation)

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

/// <summary>
/// 넉백 구현 (DoTween 기반)
/// </summary>
protected override void OnKnockBack(Vector3 attackerPos, float force)

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

/// <summary>
/// 해당 방향으로 이동 가능한지 체크
/// </summary>
private bool IsMoveableDirection(Vector3 rayDir, float rayDist, int targetLayer)

/// <summary>
/// 방향 이동 트윈 생성
/// </summary>
private Tween CreateMoveDirectionTween(HeroTweenMoveData moveData)
```

## 코드 스니펫
### `FixedUpdate`에서 회전 및 중력처리 
```csharp
private void FixedUpdate()
{
    // 리모트 또는 비활성화 상태면 처리하지 않음
    if (_isRemote || _controllerActive == false) return;

    // 착지 상태 체크
    _isGrounded = Physics.CheckSphere(rigidBody.position, 0.25f, _groundLayer);
    
    // 이동 불가 또는 입력 없으면 수평 속도 0으로
    if (ControllerState.CanMove == false || 
        _direction == Vector2.zero)
    {
        rigidBody.linearVelocity = new Vector3(0, Physics.gravity.y, 0);
    }
    else
    {
        // 공중에 있고 점프 중이 아니면 중력 적용
        if (_isGrounded == false && _isJumping == false)
        {
            rigidBody.linearVelocity = new Vector3(
                rigidBody.linearVelocity.x, Physics.gravity.y, rigidBody.linearVelocity.z);
        }
    }

    // 회전 처리
    if (_targetTransform != null)
    {
        OnLookAt(_targetTransform);
    }
    else
    {
        LookAt(_targetDirection);
    }
}
```

### 이동 처리
```csharp
protected override void OnMove(Vector2 moveDirection, float deltaTime, Vector2 turnDirection = default)
{
    // 리모트면 처리하지 않음
    if (_isRemote) return;

    _direction = moveDirection;
    
    // 카메라 기준 이동
    if (moveUsingCamera)
    {
        MoveUsingCamera(moveDirection, HeroBaseStat.defaultMoveSpeed, deltaTime);

        // 방향 전환 필요 시
        if (turnDirection != default)
        {
            var (camF, camR) = GetCameraBasisXZ();
            var turnWorld = (camF * turnDirection.y + camR * turnDirection.x);
            if (turnWorld.sqrMagnitude > 0.0001f)
                _targetDirection = Quaternion.LookRotation(turnWorld);
        }
    }
    else
    {
        // 직접 이동
        Move(moveDirection, HeroBaseStat.defaultMoveSpeed, deltaTime);
        if (turnDirection == default) return;
        _targetDirection = Quaternion.LookRotation(new Vector3(turnDirection.x, 0, turnDirection.y));
    }
}

private void MoveUsingCamera(Vector2 direction, float speed, float deltaTime)
{
    // 입력이 없거나 키네마틱이면 리턴
    if (direction.sqrMagnitude < 0.01f || rigidBody.isKinematic) return;

    // 카메라 기준 방향 벡터 계산
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

private void Move(Vector2 direction, float speed, float deltaTime)
{
    // 입력이 없거나 키네마틱이면 리턴
    if(direction.sqrMagnitude < 0.01f || rigidBody.isKinematic) return;
    
    // 속도 적용
    rigidBody.linearVelocity = new Vector3(direction.x * speed, 0, direction.y * speed);
    _targetTransform = null;
}
```

### 회전 및 보간회전
```csharp
protected override void OnLookAt(Vector3 targetDirection)
{
    var (camForward, camRight) = GetCameraBasisXZ();

    Vector3 moveWorld = (camForward * targetDirection.z + camRight * targetDirection.x);
    moveWorld.y = 0f;

    if (moveWorld.sqrMagnitude > 1f) moveWorld.Normalize();

    _targetDirection = Quaternion.LookRotation(moveWorld);
    rigidBody.MoveRotation(_targetDirection);
}

protected override void OnLookAt(Transform targetTransform)
{
    if (!targetTransform) return;
    var directionToTarget = (targetTransform.position - transform.position);
    var targetRotation = Quaternion.LookRotation(directionToTarget);
    
    _targetDirection = targetRotation;
    rigidBody.MoveRotation(targetRotation);
}

private void LookAt(Quaternion targetRotation)
{
    // 임계값 이내이면 리턴
    if (Quaternion.Angle(rigidBody.rotation, targetRotation) < LookAtThreshold) return;
    
    // 보간하여 회전
    var rotation = Quaternion.Lerp(rigidBody.rotation, targetRotation, LookAtSpeed * Time.deltaTime);
    rigidBody.MoveRotation(rotation);
}
```

### 절대/상대방향 트윈 이동
```csharp
protected override void OnMoveToAbsoluteDirection(float distance, float time, Vector3 direction)
{
    // 리모트면 처리하지 않음
    if (_isRemote) return;
    
    // 이동 가능 여부 체크
    if (IsMoveableDirection(direction, DefaultRaycastDistance, _wallLayer | _avatarLayer)==false) return;
    
    // 기존 트윈 취소
    _currentTween?.Kill();
    
    // 목표 위치 조정 (벽 충돌 고려)
    var targetPos = AdjustTargetPos(distance, direction, rigidBody.position + direction * distance);
    
    // 이동 데이터 생성 및 트윈 실행
    var moveData = new HeroTweenMoveData(
        destination: targetPos,
        duration: time,
        rayDir: direction,
        rayDist: DefaultRaycastDistance,
        rayDetectLayer: _wallLayer | _avatarLayer);

    _currentTween = CreateMoveDirectionTween(moveData);
}

protected override void OnMoveToRelativeDirection(float distance, float time, Vector3 direction)
{
    // 리모트면 처리하지 않음
    if (_isRemote) return;
    
    // 로컬 방향을 월드 방향으로 변환
    var dir = _targetDirection * direction;
    
    // 이동 가능 여부 체크
    if (IsMoveableDirection(dir ,DefaultRaycastDistance, _wallLayer | _avatarLayer) == false) return;
    
    // 기존 트윈 취소
    _currentTween?.Kill();
    
    // 목표 위치 조정
    var targetPos = AdjustTargetPos(distance, dir, rigidBody.position + dir * distance);

    // 이동 데이터 생성 및 트윈 실행
    var moveData = new HeroTweenMoveData(
        destination: targetPos,
        duration: time,
        rayDir: dir,
        rayDist: DefaultRaycastDistance,
        rayDetectLayer: _wallLayer | _avatarLayer);
    
    _currentTween = CreateMoveDirectionTween(moveData); 
}

private bool IsMoveableDirection(Vector3 rayDir, float rayDist, int targetLayer)
{
    // 레이캐스트로 충돌 체크
    if (Physics.Raycast(rigidBody.position + rigidBody.centerOfMass, rayDir, out RaycastHit hit, rayDist, targetLayer))
    {
        return false;
    }
    return true;
}
```

### 넉백 구현
```csharp
protected override void OnKnockBack(Vector3 attackerPos, float force)
{
    // 리모트면 처리하지 않음
    if (_isRemote) return;
    
    // 넉백 방향 계산 (공격자 반대 방향)
    var knockBackDir = -(attackerPos - rigidBody.position).normalized;
    
    // 이동 가능 여부 체크
    if (IsMoveableDirection(knockBackDir,DefaultRaycastDistance, _wallLayer | _avatarLayer) == false) return;
    
    // 목표 위치 계산
    var destination = rigidBody.position + knockBackDir * force;

    // 이동 데이터 생성 및 트윈 실행
    var moveData = new HeroTweenMoveData(
        destination: destination,
        duration: DefaultKnockBackDuration,
        rayDir: knockBackDir,
        rayDist: DefaultRaycastDistance,
        rayDetectLayer: _wallLayer | _avatarLayer);
    
    _currentTween = CreateMoveDirectionTween(moveData);
}
```

### DoTween 이동 트윈 생성
```csharp
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
- `HeroRigidbodyController`는 두 가지 이동 방식을 제공
  1. **물리 기반 이동**: `MoveUsingCamera()`, `Move()` - Rigidbody.velocity를 직접 설정
  2. **트윈 기반 이동**: `CreateMoveDirectionTween()` - DoTween을 사용한 보간 이동

### 충돌 감지
- 이동 전 `IsMoveableDirection()`으로 충돌 체크
- 레이캐스트로 벽/아바타 레이어 체크
- 트윈 이동 중에도 지속적으로 체크하여 즉시 중단 가능

### 회전 처리
- `_targetDirection`을 향해 FixedUpdate에서 보간 회전
- `LookAtThreshold` 이내이면 회전 중단

### 넉백 시스템
- `OnKnockBack`은 다음 단계로 실행
  1. 공격자 반대 방향 계산
  2. 이동 가능 여부 체크
  3. DoTween 트윈 생성 및 실행

## 의존성/상속 관계
### 상속/구현
- [`BaseHeroMoveController`](/docs/projects/rfist/HeroControlSystem/BaseHeroMoveController) 클래스를 상속 받음
- [`HeroBaseStat`](/docs/projects/rfist/HeroAbilitySystem/HeroBaseStat) 클래스에서 영웅 기본 능력치 정보 확인
- [`IControllerState`](/docs/projects/rfist/HeroControlSystem/IControllerState) 인터페이스를 통해 컨트롤러 상태 정보 확인
- `IHeroObjectInfo` 인터페이스를 통해 리모트 여부 확인
- [`DoTween`](https://dotween.demigiant.com/documentation.php) 패키지를 통해 트윈 이동 구현

## 사용 예시
#### 부모 클래스 [`BaseHeroMoveController`](/docs/projects/rfist/HeroControlSystem/BaseHeroMoveController)를 통해 기능 호출 받음

## 관련 클래스
- [`BaseHeroMoveController`](/docs/projects/rfist/HeroControlSystem/BaseHeroMoveController)
- [`HeroController`](/docs/projects/rfist/HeroControlSystem/HeroController)
- [`HeroBaseStat`](/docs/projects/rfist/HeroAbilitySystem/HeroBaseStat)
- [`IControllerState`](/docs/projects/rfist/HeroControlSystem/IControllerState)
- [`DoTween`](https://dotween.demigiant.com/documentation.php)
