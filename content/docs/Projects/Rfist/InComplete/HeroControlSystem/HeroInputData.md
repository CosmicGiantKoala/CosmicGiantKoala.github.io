+++
title = "HeroInputData"
description = "Fusion 네트워크 동기화를 위한 입력 데이터 구조체"
icon = "code"
date = "2025-03-06T23:36:00+09:00"
lastmod = "2025-03-06T23:36:00+09:00"
draft = false
toc = true
weight = 275
+++

## 개요

`HeroInputData` 구조체는 RFist 게임의 Fusion 네트워크 동기화를 위한 입력 데이터를 담는 구조체입니다.
비트 마스크(Bit Mask)를 사용하여 효율적인 네트워크 전송을 지원하며, 이동 및 전투 입력을 네트워크 상에서 동기화합니다.

## 역할

- Fusion 네트워크 입력 데이터 동기화
- 비트 마스크를 활용한 효율적인 버튼 상태 전송
- 클라이언트 입력을 서버로 전송 및 모든 클라이언트 동기화
- 이동 및 전투 입력 데이터 캡슐화

## 선언

```csharp
/// <summary>
/// 영웅 입력 데이터 구조체
/// Fusion 네트워크 동기화를 위한 입력 데이터를 담는 구조체입니다.
/// 비트 마스크를 사용하여 효율적인 네트워크 전송을 지원합니다.
/// </summary>
public struct HeroInputData: INetworkInput
```

## 멤버

### Constants - Button Bit Masks

```csharp
/// <summary>
/// 공격 버튼 비트 마스크
/// </summary>
public const uint Attack = 0x0000_0001;

/// <summary>
/// 공격 홀드 버튼 비트 마스크
/// </summary>
public const uint AttackHold = 0x0000_0002;

/// <summary>
/// 가드 버튼 비트 마스크
/// </summary>
public const uint Guard = 0x0000_0004;

/// <summary>
/// 공격+가드 동시 입력 버튼 비트 마스크
/// </summary>
public const uint AttackGuardDualInput = 0x0000_0008;

/// <summary>
/// 궁극기 버튼 비트 마스크
/// </summary>
public const uint UltimateAttack = 0x0000_0100;

/// <summary>
/// 대시 버튼 비트 마스크
/// </summary>
public const uint Dash = 0x0001_0000;

/// <summary>
/// 포커스 모드 버튼 비트 마스크
/// </summary>
public const uint FocusMode = 0x0010_0000;

/// <summary>
/// 포커스 변경 버튼 비트 마스크
/// </summary>
public const uint FocusChange = 0x0020_0000;
```

### Properties

```csharp
/// <summary>
/// 수평 이동 입력값 (-1 ~ 1)
/// </summary>
public float Horizontal { get; set; }

/// <summary>
/// 수직 이동 입력값 (-1 ~ 1)
/// </summary>
public float Vertical { get; set; }

/// <summary>
/// 공격 타임스탬프
/// </summary>
public float AttackTimeStamp { get; set; }

/// <summary>
/// 버튼 상태 비트 마스크
/// </summary>
public uint Buttons { get; set; }
```

### Button Check Methods

```csharp
/// <summary>
/// 공격 입력 여부 확인
/// </summary>
/// <returns>공격 입력 여부</returns>
public bool IsAttack() => (Buttons & Attack) == Attack;

/// <summary>
/// 공격 홀드 입력 여부 확인
/// </summary>
/// <returns>공격 홀드 입력 여부</returns>
public bool IsAttackHold() => (Buttons & AttackHold) == AttackHold;

/// <summary>
/// 가드 입력 여부 확인
/// </summary>
/// <returns>가드 입력 여부</returns>
public bool IsGuard() => (Buttons & Guard) == Guard;

/// <summary>
/// 대시 입력 여부 확인
/// </summary>
/// <returns>대시 입력 여부</returns>
public bool IsDash() => (Buttons & Dash) == Dash;

/// <summary>
/// 포커스 모드 입력 여부 확인
/// </summary>
/// <returns>포커스 모드 입력 여부</returns>
public bool IsFocusMode() => (Buttons & FocusMode) == FocusMode;

/// <summary>
/// 포커스 변경 입력 여부 확인
/// </summary>
/// <returns>포커스 변경 입력 여부</returns>
public bool IsFocusChange() => (Buttons & FocusChange) == FocusChange;

/// <summary>
/// 궁극기 입력 여부 확인
/// </summary>
/// <returns>궁극기 입력 여부</returns>
public bool IsUltimateSkill() => (Buttons & UltimateAttack) == UltimateAttack;

/// <summary>
/// 공격+가드 동시 입력 여부 확인
/// </summary>
/// <returns>공격+가드 동시 입력 여부</returns>
public bool IsAttackGuardDualInput() => (Buttons & AttackGuardDualInput) == AttackGuardDualInput;
```

## 기능 설명

### 비트 마스크 구조

`HeroInputData`는 uint 타입의 `Buttons` 필드에 여러 버튼 상태를 비트 단위로 저장합니다:

| 상수 | 비트 위치 | 16진수 값 | 설명 |
|------|----------|-----------|------|
| `Attack` | 0 | 0x0000_0001 | 공격 |
| `AttackHold` | 1 | 0x0000_0002 | 공격 홀드 |
| `Guard` | 2 | 0x0000_0004 | 가드 |
| `AttackGuardDualInput` | 3 | 0x0000_0008 | 공격+가드 동시 입력 |
| `UltimateAttack` | 8 | 0x0000_0100 | 궁극기 |
| `Dash` | 16 | 0x0001_0000 | 대시 |
| `FocusMode` | 20 | 0x0010_0000 | 포커스 모드 |
| `FocusChange` | 21 | 0x0020_0000 | 포커스 변경 |

### 네트워크 동기화

`HeroInputData`는 `INetworkInput` 인터페이스를 구현하여 Fusion의 네트워크 동기화 시스템과 통합됩니다:

- 클라이언트에서 입력 수집
- `Buttons` 비트 마스크로 효율적인 전송
- 서버에서 모든 클라이언트로 상태 복제

### 비트 연산 메서드

각 `Is*` 메서드는 비트 AND 연산을 통해 해당 버튼이 눌려있는지 확인합니다:

```csharp
public bool IsAttack() => (Buttons & Attack) == Attack;
// 예시: Buttons = 0b0000_0101, Attack = 0b0000_0001
//       0b0000_0101 & 0b0000_0001 = 0b0000_0001 == Attack → true
```

### 입력 데이터 구성

```
[Horizontal: float][Vertical: float][AttackTimeStamp: float][Buttons: uint]
  4 bytes      +    4 bytes      +      4 bytes       +    4 bytes   = 16 bytes
```

## 의존성/상속 관계

### 구현
- `INetworkInput` (Fusion 인터페이스) 구현

### 의존 클래스
- `Fusion.INetworkInput` - Fusion 네트워크 입력 인터페이스

### 사용 위치
- `NetworkHeroController` - 입력 수집 및 동기화
- `NetworkHeroInput` - 로컬 입력을 HeroInputData로 변환

## 사용 예시

### NetworkHeroController에서 HeroInputData 사용

```csharp
/// <summary>
/// NetworkHeroController에서 HeroInputData를 사용하는 예시
/// </summary>
public class NetworkHeroController : NetworkBehaviourCallback
{
    [SerializeField] private HeroKeyInput _heroKeyInput;
    
    /// <summary>
    /// 네트워크 입력 수집
    /// </summary>
    public override void FixedUpdateNetwork()
    {
        if (GetInput(out HeroInputData input))
        {
            // 이동 입력 적용
            _heroController.Move(input.Horizontal, input.Vertical, Time.deltaTime);
            
            // 공격 입력
            if (input.IsAttack())
            {
                _heroController.Attack();
            }
            
            // 가드 입력
            if (input.IsGuard())
            {
                _heroController.Guard();
            }
            
            // 대시 입력
            if (input.IsDash())
            {
                _heroController.Dash(input.Vertical, input.Horizontal);
            }
        }
    }
}
```

### 입력 데이터 생성

```csharp
/// <summary>
/// HeroInputData 생성 예시
/// </summary>
public HeroInputData CreateInputData(HeroKeyInput heroKeyInput)
{
    var inputData = new HeroInputData
    {
        Horizontal = heroKeyInput.GetHorizontal(),
        Vertical = heroKeyInput.GetVertical(),
        AttackTimeStamp = Time.time
    };
    
    // 버튼 상태 비트 마스크 설정
    uint buttons = 0;
    if (heroKeyInput.IsAttack()) buttons |= HeroInputData.Attack;
    if (heroKeyInput.IsGuard()) buttons |= HeroInputData.Guard;
    if (heroKeyInput.IsDash()) buttons |= HeroInputData.Dash;
    if (heroKeyInput.IsFocusMode()) buttons |= HeroInputData.FocusMode;
    if (heroKeyInput.IsUltimateAttack()) buttons |= HeroInputData.UltimateAttack;
    
    inputData.Buttons = buttons;
    
    return inputData;
}
```

### 복수 버튼 상태 확인

```csharp
/// <summary>
/// 여러 버튼 상태 동시 확인
/// </summary>
public void CheckMultipleInputs(HeroInputData input)
{
    // 공격 + 가드 동시 입력 확인
    bool attackAndGuard = input.IsAttack() && input.IsGuard();
    
    // 또는 비트 마스크 직접 확인
    uint comboMask = HeroInputData.Attack | HeroInputData.Guard;
    bool isCombo = (input.Buttons & comboMask) == comboMask;
}
```

## 관련 클래스

- [`NetworkHeroController`](/docs/projects/rfist/HeroNetworkSystem/NetworkHeroController)
- [`NetworkHeroInput`](/docs/projects/rfist/HeroNetworkSystem/NetworkHeroInput)
- [`HeroKeyInput`](/docs/projects/rfist/HeroControlSystem/HeroKeyInput)
- [`BaseHeroInput`](/docs/projects/rfist/HeroControlSystem/BaseHeroInput)
- [`IHeroInput`](/docs/projects/rfist/HeroControlSystem/IHeroInput)
