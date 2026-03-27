+++
title = "HeroKeyInput"
description = "키보드 입력을 처리하는 입력 컴포넌트"
icon = "code"
date = "2025-03-06T23:32:00+09:00"
lastmod = "2025-03-06T23:32:00+09:00"
draft = false
toc = true
weight = 270
+++

## 개요

`HeroKeyInput` 클래스는 RFist 게임의 키보드 입력을 처리하는 입력 컴포넌트입니다.
[Input System](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.18/manual/index.html)을 사용하여 키보드 및 마우스 입력을 영웅 동작으로 변환하며,
[`BaseHeroInput`](/docs/projects/rfist/HeroControlSystem/BaseHeroInput) 추상 클래스를 상속받아 구현됩니다.

## 역할
- [Input System](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.18/manual/index.html)을 활용한 키보드/마우스 입력 처리
- 이동, 전투, 포커스 등의 입력 상태 관리
- 단발성 입력과 지속성 입력(홀드) 구분

## 선언
```csharp
public class HeroKeyInput : BaseHeroInput
```

## 멤버
### 속성
```csharp
/// <summary>
/// Input System 액션 에셋
/// </summary>
private RFistActions _inputActions;

/// <summary>
/// 공격 입력 플래그
/// </summary>
private bool _isAttack;

/// <summary>
/// 공격 홀드 입력 플래그
/// </summary>
private bool _isAttackHold;

/// <summary>
/// 가드 입력 플래그
/// </summary>
private bool _isGuard;

/// <summary>
/// 대시 입력 플래그
/// </summary>
private bool _isDash;

/// <summary>
/// 포커스 모드 입력 플래그
/// </summary>
private bool _isFocusMode;

/// <summary>
/// 포커스 변경 입력 플래그
/// </summary>
private bool _isFocusChange;

/// <summary>
/// 궁극기 입력 플래그
/// </summary>
private bool _isUltimateAttack;

/// <summary>
/// 공격+가드 동시 입력 플래그
/// </summary>
private bool _isAttackGuardDualInput;

/// <summary>
/// 홀드 입력에 필요한 최소 시간 (초)
/// </summary>
private const float HoldRequiredTime = 0.3f;
```

### 메서드
```csharp
/// <summary>
/// 초기화 - Input System 액션 생성
/// </summary>
private void Awake()

/// <summary>
/// 활성화 시 Input System 이벤트 구독
/// </summary>
protected override void OnEnabled()

/// <summary>
/// 비활성화 시 Input System 이벤트 구독 해제
/// </summary>
protected override void OnDisabled()

/// <summary>
/// 수평 입력값 가져오기
/// </summary>
/// <returns>수평 입력값 (-1 ~ 1)</returns>
public override float GetHorizontal()

/// <summary>
/// 수직 입력값 가져오기
/// </summary>
/// <returns>수직 입력값 (-1 ~ 1)</returns>
public override float GetVertical()

/// <summary>
/// 공격 입력 시 호출
/// </summary>
/// <param name="obj">InputAction 콜백 컨텍스트</param>
private void OnAttackPerformed(InputAction.CallbackContext obj)

/// <summary>
/// 공격 입력 해제 시 호출
/// </summary>
/// <param name="obj">InputAction 콜백 컨텍스트</param>
private void OnAttackReleased(InputAction.CallbackContext obj)

/// <summary>
/// 가드 입력 시 호출
/// </summary>
/// <param name="obj">InputAction 콜백 컨텍스트</param>
private void OnGuardPerformed(InputAction.CallbackContext obj)

/// <summary>
/// 가드 입력 해제 시 호출
/// </summary>
/// <param name="obj">InputAction 콜백 컨텍스트</param>
private void OnGuardReleased(InputAction.CallbackContext obj)

/// <summary>
/// 대시 입력 시 호출
/// </summary>
/// <param name="obj">InputAction 콜백 컨텍스트</param>
private void OnDashPerformed(InputAction.CallbackContext obj)

/// <summary>
/// 궁극기 입력 시 호출
/// </summary>
/// <param name="obj">InputAction 콜백 컨텍스트</param>
private void OnUltimateAttack(InputAction.CallbackContext obj)

/// <summary>
/// 공격+가드 동시 입력 시 호출
/// </summary>
/// <param name="obj">InputAction 콜백 컨텍스트</param>
private void OnAttackGuardDualInput(InputAction.CallbackContext obj)

/// <summary>
/// 공격 입력 여부 (한 프레임만 true 반환 후 자동 리셋)
/// </summary>
/// <returns>공격 입력 여부</returns>
public override bool IsAttack()

/// <summary>
/// 공격 키 홀드 여부
/// </summary>
/// <returns>공격 키 홀드 여부</returns>
public override bool IsAttackHold()

/// <summary>
/// 가드 입력 여부
/// </summary>
/// <returns>가드 입력 여부</returns>
public override bool IsGuard()

/// <summary>
/// 대시 입력 여부 (한 프레임만 true 반환 후 자동 리셋)
/// </summary>
/// <returns>대시 입력 여부</returns>
public override bool IsDash()

/// <summary>
/// 포커스 모드 입력 여부 (한 프레임만 true 반환 후 자동 리셋)
/// </summary>
/// <returns>포커스 모드 입력 여부</returns>
public override bool IsFocusMode()

/// <summary>
/// 포커스 변경 입력 여부 (한 프레임만 true 반환 후 자동 리셋)
/// </summary>
/// <returns>포커스 변경 입력 여부</returns>
public override bool IsFocusChange()

/// <summary>
/// 궁극기 입력 여부 (한 프레임만 true 반환 후 자동 리셋)
/// </summary>
/// <returns>궁극기 입력 여부</returns>
public override bool IsUltimateAttack()

/// <summary>
/// 공격+가드 동시 입력 여부 (한 프레임만 true 반환 후 자동 리셋)
/// </summary>
/// <returns>공격+가드 동시 입력 여부</returns>
public override bool IsAttackGuardDualInput()
```

## 코드 스니펫
### 공격 입력 처리 (홀드 구분)
```csharp
/// <summary>
/// 공격 입력 시 호출
/// </summary>
private void OnAttackPerformed(InputAction.CallbackContext obj)
{
    // 홀드 인터랙션인지 확인
    if (obj.interaction is HoldInteraction)
    {
        _isAttackHold = true;
    }
    else
    {
        _isAttack = true;
    }
}
```

### 단발성 입력 리셋 패턴
```csharp
/// <summary>
/// 공격 입력 여부 (한 프레임만 true 반환 후 자동 리셋)
/// </summary>
public override bool IsAttack()
{
    try
    {
        return _isAttack;
    }
    finally
    {
        _isAttack = false;
    }
}
```

### 이동 입력값 읽기

```csharp
/// <summary>
/// 수평 입력값 가져오기 (A/D 또는 화살표 좌/우)
/// </summary>
public override float GetHorizontal()
{
    return _inputActions?.Hero.Move.ReadValue<Vector2>().x ?? 0f;
}
```

## 기능 설명

### 입력 동작 분류

| 동작 | 입력 타입 | 리셋 방식 | Input Action |
|------|----------|-----------|--------------|
| **이동** | 축 입력 (연속) | 없음 | `Move` (Vector2) |
| **공격** | 버튼 (단발) | 자동 리셋 | `Attack` (Tap) |
| **공격 홀드** | 버튼 (지속) | 수동 리셋 | `Attack` (Hold) |
| **가드** | 버튼 (지속) | 수동 리셋 | `Guard` (Press) |
| **대시** | 버튼 (단발) | 자동 리셋 | `Dash` (Press) |
| **궁극기** | 버튼 (단발) | 자동 리셋 | `UltimateAttack` (Press) |
| **공격+가드** | 버튼 (단발) | 자동 리셋 | `AttackGuardDualInput` (Press) |

### 단발성 vs 지속성 입력
**단발성 입력 (IsAttack, IsDash 등)**:
- 한 프레임만 `true` 반환
- try-finally 패턴으로 자동 리셋
- 연속 입력 방지에 사용

**지속성 입력 (IsGuard, IsAttackHold 등)**:
- 버튼이 눌려있는 동안 계속 `true`
- 수동으로 `false`로 리셋
- 홀드 동작에 사용

## 의존성/상속 관계
- `MonoBehaviour`를 상속받음
- [`BaseHeroInput`](/docs/projects/rfist/HeroControlSystem/BaseHeroInput)를 상속 받음
- [`IHeroInput`](/docs/projects/rfist/HeroControlSystem/iheroinput) 인터페이스 간접 구현([`BaseHeroInput`](/docs/projects/rfist/HeroControlSystem/BaseHeroInput)을 통해 호출됨)
- `RFistActions` 클래스 생성 및 구독([Input System](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.18/manual/index.html) 에셋)

## 사용 예시
#### 해당 클래스 호출은 상위클래스 [`BaseHeroInput`](/docs/projects/rfist/HeroControlSystem/BaseHeroInput)를 통해 호출됨

## 관련 클래스

- [`BaseHeroInput`](/docs/projects/rfist/HeroControlSystem/BaseHeroInput)
- [`IHeroInput`](/docs/projects/rfist/HeroControlSystem/IHeroInput)
- [`HeroController`](/docs/projects/rfist/HeroControlSystem/HeroController)
- [`NetworkHeroController`](/docs/projects/rfist/HeroNetworkSystem/NetworkHeroController)
- [`HeroSystem`](/docs/projects/rfist/HeroControlSystem/HeroSystem)
