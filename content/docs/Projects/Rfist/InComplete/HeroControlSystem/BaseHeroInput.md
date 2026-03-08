+++
title = "BaseHeroInput"
description = "영웅 입력의 기반 추상 클래스"
icon = "code"
date = "2025-03-06T23:17:00+09:00"
lastmod = "2025-03-06T23:17:00+09:00"
draft = false
toc = true
weight = 260
+++

## 개요
`BaseHeroInput` 클래스는 RFist 게임의 영웅 입력 시스템의 기반 추상 클래스입니다.
키보드, 게임패드, 모바일 등 다양한 입력 방식의 공통 인터페이스를 제공하며,
템플릿 메서드 패턴을 통해 구체적인 입력 로직은 하위 클래스에서 구현하도록 합니다.

## 역할
- 다양한 입력 방식(키보드, 게임패드, 모바일)의 공통 인터페이스 제공
- 이동, 전투, 가드, 대시 등의 입력 메서드 정의
- 입력 인스턴스의 중앙 관리 (static 리스트)

## 선언
```csharp
public abstract class BaseHeroInput : MonoBehaviour, IHeroInput, IHeroEvent
```

## 멤버
### 속성
```csharp
/// <summary>
/// 모든 영웅 입력 인스턴스 목록
/// </summary>
private static readonly List<BaseHeroInput> HeroInputs = new List<BaseHeroInput>();

/// <summary>
/// 영웅 입력 리스트 (읽기 전용)
/// </summary>
public static IReadOnlyList<IHeroInput> HeroInputList => HeroInputs;
```

### 메서드
```csharp
/// <summary>
/// 활성화 시 추가 처리 (하위 클래스에서 재정의)
/// </summary>
protected virtual void OnEnabled()

/// <summary>
/// 비활성화 시 추가 처리 (하위 클래스에서 재정의)
/// </summary>
protected virtual void OnDisabled()

/// <summary>
/// 수평 입력값 가져오기 (좌/우)
/// </summary>
/// <returns>수평 입력값 (-1 ~ 1)</returns>
public abstract float GetHorizontal();

/// <summary>
/// 수직 입력값 가져오기 (앞/뒤)
/// </summary>
/// <returns>수직 입력값 (-1 ~ 1)</returns>
public abstract float GetVertical();

/// <summary>
/// 공격 입력 여부
/// </summary>
/// <returns>공격 입력 여부</returns>
public abstract bool IsAttack();

/// <summary>
/// 공격 키 홀드 여부
/// </summary>
/// <returns>공격 키 홀드 여부</returns>
public abstract bool IsAttackHold();

/// <summary>
/// 가드 입력 여부
/// </summary>
/// <returns>가드 입력 여부</returns>
public abstract bool IsGuard();

/// <summary>
/// 대시 입력 여부
/// </summary>
/// <returns>대시 입력 여부</returns>
public abstract bool IsDash();

/// <summary>
/// 궁극기 입력 여부
/// </summary>
/// <returns>궁극기 입력 여부</returns>
public abstract bool IsUltimateAttack();

/// <summary>
/// 공격+가드 동시 입력 여부
/// </summary>
/// <returns>공격+가드 동시 입력 여부</returns>
public abstract bool IsAttackGuardDualInput();
```

## 코드 스니펫
### 컴포넌트 활성화/비활성화시 정적 리스트 `HeroInputList`에 인스턴스 등록/해제
```csharp
/// <summary>
/// 컴포넌트 활성화 시 호출
/// </summary>
private void OnEnable()
{
    heroSystem.RegisterHeroEvent(this);
    HeroInputs.Add(this);
    OnEnabled();
    heroSystem.OnHeroSpawned += OnHeroSpawned;
}

/// <summary>
/// 컴포넌트 비활성화 시 호출
/// </summary>
private void OnDisable()
{
    heroSystem.UnregisterHeroEvent(this);
    HeroInputs.Remove(this);
    OnDisabled();
    heroSystem.OnHeroSpawned -= OnHeroSpawned;
}
```


## 기능 설명
### 입력 카테고리
| 카테고리 | 메서드 | 설명 |
|----------|--------|------|
| **이동** | `GetHorizontal`, `GetVertical` | 좌/우, 앞/뒤 입력값 (-1 ~ 1) |
| **전투** | `IsAttack`, `IsGuard`, `IsDash`, `IsUltimateAttack` | 공격/가드/대시/궁극기 입력 여부 |
| **특수** | `IsAttackGuardDualInput` | 공격+가드 동시 입력 여부 |

### 정적 인스턴스 관리
- 모든 `BaseHeroInput` 인스턴스는 정적리스트 `HeroInputs`에 자동 등록되어 중앙에서 관리
- `HeroInputList`: 읽기 전용으로 외부에서 접근 가능
- 활성화 시 자동 등록, 비활성화 시 자동 제거

## 의존성/상속 관계
- `MonoBehaviour`를 상속받음
- 구현 클래스
  - [`HeroKeyInput`](/docs/projects/rfist/HeroControlSystem/herokeyinput) 클래스에서 키보드 입력 구현
- `HeroSystem`클래스에서 영웅 관련 이벤트 구독
- [`IHeroInput`](/docs/projects/rfist/HeroControlSystem/IHeroInput) 인터페이스 구현
- `IHeroEvent` 인터페이스 구현
- [`NetworkHeroInput`](/docs/projects/rfist/HeroNetworkSystem/networkheroinput) 클래스에서 정적 리스트의 데이터 사용

## 사용 예시
#### [`NetworkHeroInput`](/docs/projects/rfist/HeroNetworkSystem/networkheroinput)에서 정적 리스트 `HeroInputList`를 통해 모든 인풋 데이터 로드
```csharp
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
- [`IHeroInput`](/docs/projects/rfist/HeroControlSystem/IHeroInput)
- [`HeroKeyInput`](/docs/projects/rfist/HeroControlSystem/herokeyinput)
- [`NetworkHeroInput`](/docs/projects/rfist/HeroNetworkSystem/networkheroinput)