+++
title = "IHeroInput"
description = "영웅 입력 인터페이스"
icon = "code"
date = "2025-03-06T23:29:00+09:00"
lastmod = "2025-03-06T23:29:00+09:00"
draft = false
toc = true
weight = 265
+++

## 개요

`IHeroInput` 인터페이스는 RFist 게임의 영웅 입력 계약을 정의합니다.
이동, 전투, 포커스 등 다양한 입력 메서드를 제공하며,
[`BaseHeroInput`](/docs/projects/rfist/HeroControlSystem/BaseHeroInput) 추상 클래스가 이 인터페이스를 구현합니다.

## 역할

- 영웅 캐릭터의 입력 메서드 계약 정의
- 이동/전투/포커스 입력값 제공
- 입력 시스템의 표준 인터페이스

## 선언

```csharp
/// <summary>
/// 영웅 입력 인터페이스
/// 이동, 전투, 포커스 등의 입력 메서드를 정의합니다.
/// </summary>
public interface IHeroInput
```

## 멤버

### Movement Input

```csharp
/// <summary>
/// 수평 입력값 가져오기 (좌/우)
/// </summary>
/// <returns>수평 입력값 (-1 ~ 1)</returns>
public float GetHorizontal();

/// <summary>
/// 수직 입력값 가져오기 (앞/뒤)
/// </summary>
/// <returns>수직 입력값 (-1 ~ 1)</returns>
public float GetVertical();
```

### Combat Input

```csharp
/// <summary>
/// 공격 입력 여부
/// </summary>
/// <returns>공격 입력 여부</returns>
public bool IsAttack();

/// <summary>
/// 공격 키 홀드 여부
/// </summary>
/// <returns>공격 키 홀드 여부</returns>
public bool IsAttackHold();

/// <summary>
/// 가드 입력 여부
/// </summary>
/// <returns>가드 입력 여부</returns>
public bool IsGuard();

/// <summary>
/// 대시 입력 여부
/// </summary>
/// <returns>대시 입력 여부</returns>
public bool IsDash();

/// <summary>
/// 궁극기 입력 여부
/// </summary>
/// <returns>궁극기 입력 여부</returns>
public bool IsUltimateAttack();
```

### Focus Input

```csharp
/// <summary>
/// 포커스 모드 입력 여부
/// </summary>
/// <returns>포커스 모드 입력 여부</returns>
public bool IsFocusMode();

/// <summary>
/// 포커스 변경 입력 여부
/// </summary>
/// <returns>포커스 변경 입력 여부</returns>
public bool IsFocusChange();
```

### Special Input

```csharp
/// <summary>
/// 공격+가드 동시 입력 여부
/// </summary>
/// <returns>공격+가드 동시 입력 여부</returns>
public bool IsAttackGuardDualInput();
```

### Events

```csharp
/// <summary>
/// 입력 종료 이벤트
/// </summary>
public event Action OnExitEvent;
```

## 기능 설명

### 입력 카테고리

`IHeroInput`은 4가지 입력 카테고리를 정의합니다:

| 카테고리 | 메서드 | 설명 |
|----------|--------|------|
| **이동** | `GetHorizontal`, `GetVertical` | 좌/우, 앞/뒤 입력값 (-1 ~ 1) |
| **전투** | `IsAttack`, `IsGuard`, `IsDash`, `IsUltimateAttack` | 공격/가드/대시/궁극기 입력 여부 |
| **포커스** | `IsFocusMode`, `IsFocusChange` | 포커스 모드/변경 입력 여부 |
| **특수** | `IsAttackGuardDualInput` | 공격+가드 동시 입력 여부 |

### 입력값 반환 타입

- **float (-1 ~ 1)**: `GetHorizontal`, `GetVertical` - 축 입력값
- **bool**: `IsAttack`, `IsGuard` 등 - 버튼 입력 여부
- **event Action**: `OnExitEvent` - 이벤트 구독

## 의존성/상속 관계

### 구현 클래스
- [`BaseHeroInput`](/docs/projects/rfist/HeroControlSystem/BaseHeroInput): IHeroInput의 주요 구현체 (추상 클래스)
- `HeroKeyInput`: 키보드 입력 구현
- `NetworkHeroInput`: 네트워크 입력 구현 (예상)

### 사용 위치
- [`HeroController`](/docs/projects/rfist/HeroControlSystem/HeroController): 입력값을 받아 이동/전투 처리
- [`NetworkHeroController`](/docs/projects/rfist/HeroNetworkSystem/NetworkHeroController): 네트워크 환경에서 입력 처리

## 사용 예시

### BaseHeroInput에서 IHeroInput 구현

```csharp
/// <summary>
/// IHeroInput을 구현하는 BaseHeroInput 추상 클래스 예시
/// </summary>
public abstract class BaseHeroInput : MonoBehaviour, IHeroInput, IHeroEvent
{
    // 이동 입력
    public abstract float GetHorizontal();
    public abstract float GetVertical();
    
    // 전투 입력
    public abstract bool IsAttack();
    public abstract bool IsGuard();
    public abstract bool IsDash();
    
    // 포커스 입력
    public abstract bool IsFocusMode();
    
    // 이벤트
    public abstract event Action OnExitEvent;
}
```

### HeroController에서 IHeroInput 사용

```csharp
/// <summary>
/// HeroController에서 IHeroInput을 사용하는 예시
/// </summary>
public class HeroController : MonoBehaviour, IHeroController
{
    private IHeroInput _heroInput;
    
    /// <summary>
    /// 입력 컴포넌트 설정
    /// </summary>
    public void SetupInput(IHeroInput heroInput)
    {
        _heroInput = heroInput;
    }
    
    /// <summary>
    /// 입력 처리
    /// </summary>
    private void Update()
    {
        // 이동 입력
        float horizontal = _heroInput.GetHorizontal();
        float vertical = _heroInput.GetVertical();
        
        if (horizontal != 0 || vertical != 0)
        {
            Move(horizontal, vertical, Time.deltaTime);
        }
        
        // 공격 입력
        if (_heroInput.IsAttack())
        {
            Attack();
        }
        
        // 가드 입력
        if (_heroInput.IsGuard())
        {
            Guard();
        }
    }
}
```

### NetworkHeroController에서 IHeroInput 사용

```csharp
/// <summary>
/// NetworkHeroController에서 IHeroInput을 사용하는 예시
/// </summary>
public class NetworkHeroController : NetworkBehaviourCallback
{
    [SerializeField] private IHeroInput _heroInput;
    [SerializeField] private HeroController _heroController;
    
    public override void FixedUpdateNetwork()
    {
        if (GetInput(out HeroInputSyncData input))
        {
            // 입력값 수집
            float horizontal = _heroInput.GetHorizontal();
            float vertical = _heroInput.GetVertical();
            
            // 이동 처리
            _heroController.Move(horizontal, vertical, Time.deltaTime);
            
            // 공격 입력
            if (_heroInput.IsAttack())
            {
                _heroController.Attack(input);
            }
        }
    }
}
```

## 관련 클래스

- [`BaseHeroInput`](/docs/projects/rfist/HeroControlSystem/BaseHeroInput)
- [`HeroController`](/docs/projects/rfist/HeroControlSystem/HeroController)
- [`NetworkHeroController`](/docs/projects/rfist/HeroNetworkSystem/NetworkHeroController)
- [`IHeroEvent`](/docs/projects/rfist/HeroControlSystem/IHeroEvent)
