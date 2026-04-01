+++
title = "IHeroInput"
description = "영웅 입력 인터페이스"
icon = "code"
date = "2025-03-06T23:29:00+09:00"
lastmod = "2025-03-06T23:29:00+09:00"
draft = false
toc = true
weight = 203
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
public interface IHeroInput
```

## 멤버
### 메서드
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

/// <summary>
/// 공격+가드 동시 입력 여부
/// </summary>
/// <returns>공격+가드 동시 입력 여부</returns>
public bool IsAttackGuardDualInput();
```

## 기능 설명
### 입력 카테고리
| 카테고리 | 메서드 | 설명 |
|----------|--------|------|
| **이동** | `GetHorizontal`, `GetVertical` | 좌/우, 앞/뒤 입력값 (-1 ~ 1) |
| **전투** | `IsAttack`, `IsGuard`, `IsDash`, `IsUltimateAttack` | 공격/가드/대시/궁극기 입력 여부 |
| **특수** | `IsAttackGuardDualInput` | 공격+가드 동시 입력 여부 |

### 입력값 반환 타입
- **float (-1 ~ 1)**: `GetHorizontal`, `GetVertical` - 축 입력값
- **bool**: `IsAttack`, `IsGuard` 등 - 버튼 입력 여부

## 의존성/상속 관계
### 구현 클래스
- [`BaseHeroInput`](/docs/projects/rfist/HeroControlSystem/BaseHeroInput) 추상 클래스에서 구현
- [`HeroKeyInput`](/docs/projects/rfist/incomplete/herocontrolsystem/herokeyinput/)에서 키보드 입력 구현
- [`NetworkHeroInput`](/docs/projects/rfist/heronetworksystem/networkheroinput/)에서 입력소스 수집

## 사용 예시
#### [`NetworkHeroInput`](/docs/projects/rfist/heronetworksystem/networkheroinput/)에서 입력 소스 수집시 사용
```csharp
// BaseHeroInput.cs
public static IReadOnlyList<IHeroInput> HeroInputList => HeroInputs;

// NetworkHeroInput.cs
public override void OnInput(NetworkRunner runner, NetworkInput input)
{
    // 입력 권한이 없으면 처리하지 않음
    if (!Object.HasInputAuthority) return;
    
    // 새로운 입력 데이터 생성
    var heroInputData = new HeroInputData();
    
    // 등록된 모든 입력 소스에서 입력 수집
    foreach (var heroInput in BaseHeroInput.HeroInputList)
    {
        // 수평 이동 입력 수집 (이미 값이 있으면 건드리지 않음)
        if (heroInputData.Horizontal == 0)
        {
            heroInputData.Horizontal = heroInput.GetHorizontal();    
        }

        // 수직 이동 입력 수집 (이미 값이 있으면 건드리지 않음)
        if (heroInputData.Vertical == 0)
        {
            heroInputData.Vertical = heroInput.GetVertical();    
        }

        // 대시 입력 수집
        if (heroInput.IsDash())
        {
            heroInputData.Buttons |= HeroInputData.Dash;
        }
        
        // 공격 입력 수집 및 타임스탬프 기록
        if (heroInput.IsAttack())
        {
            heroInputData.Buttons |= HeroInputData.Attack;
            heroInputData.AttackTimeStamp = runner.SimulationTime;
        }

        // 공격 홀드(차지) 입력 수집 및 타임스탬프 기록
        if (heroInput.IsAttackHold())
        {
            heroInputData.Buttons |= HeroInputData.AttackHold;
            heroInputData.AttackTimeStamp = runner.SimulationTime;
        }
        else
        {
            // 홀드 해제 시에도 타임스탬프 갱신
            heroInputData.AttackTimeStamp = runner.SimulationTime;
        }

        // 가드 입력 수집 및 타임스탬프 기록
        if (heroInput.IsGuard())
        {
            heroInputData.Buttons |= HeroInputData.Guard;  
            heroInputData.AttackTimeStamp = runner.SimulationTime;   
        }

        // 포커스 모드 입력 수집
        if (heroInput.IsFocusMode())
        {
            heroInputData.Buttons |= HeroInputData.FocusMode;
        }

        // 포커스 변경 입력 수집
        if (heroInput.IsFocusChange())
        {
            heroInputData.Buttons |= HeroInputData.FocusChange;
        }

        // 궁극기 입력 수집 및 타임스탬프 기록
        if (heroInput.IsUltimateAttack())
        {
            heroInputData.Buttons |= HeroInputData.UltimateAttack;
            heroInputData.AttackTimeStamp = runner.SimulationTime;
        }

        // 공격+가드 동시 입력 수집 및 타임스탬프 기록
        if (heroInput.IsAttackGuardDualInput())
        {
            heroInputData.Buttons |= HeroInputData.AttackGuardDualInput;
            heroInputData.AttackTimeStamp = runner.SimulationTime;   
        }
    }
    
    // 수집된 입력 데이터를 네트워크 입력으로 설정
    input.Set(heroInputData);
}
```

## 관련 클래스
- [`BaseHeroInput`](/docs/projects/rfist/HeroControlSystem/BaseHeroInput)
- [`HeroKeyInput`](/docs/projects/rfist/incomplete/herocontrolsystem/herokeyinput/)
- [`NetworkHeroController`](/docs/projects/rfist/HeroNetworkSystem/NetworkHeroController)
