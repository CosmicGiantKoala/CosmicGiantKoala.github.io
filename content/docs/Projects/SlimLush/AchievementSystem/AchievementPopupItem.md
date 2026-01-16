# AchievementPopupItem

## 개요

`AchievementPopupItem` 클래스는 SlimeRush 게임의 업적 시스템에서 업적 정보를 UI로 표시하는 컴포넌트입니다. 이 클래스는 업적 팝업 창에서 개별 업적을 나타내며, 업적의 이름, 설명, 보상, 완료 상태 등을 시각적으로 표시합니다. 또한 로컬라이제이션 기능을 통해 다국어 지원을 제공하며, 업적 아이템 간의 정렬 기능을 구현합니다.

## 역할

- 업적 정보 UI 표시
- 로컬라이제이션 처리
- 업적 완료 상태 시각화
- 아이템 정렬 기능 제공
- 테스트 기능 지원 (에디터 모드)

## 멤버

### 직렬화 필드

```csharp
/// <summary>
/// 업적 설명 텍스트 UI
/// </summary>
[SerializeField]
private TMP_Text achievementDes;

/// <summary>
/// 업적 보상 설명 텍스트 UI
/// </summary>
[SerializeField]
private TMP_Text achievementRewardDes;

/// <summary>
/// 업적 완료 표시 오브젝트
/// </summary>
[SerializeField]
private GameObject achievementCompletation;

/// <summary>
/// 업적 잠금 표시 오브젝트
/// </summary>
[SerializeField]
private GameObject achievementLock;

/// <summary>
/// 랜덤 회전 범위 (0-180도)
/// </summary>
[SerializeField, Range(0,180)]
private float randomRange;

/// <summary>
/// 설명 로컬라이제이션 이벤트
/// </summary>
[SerializeField]
private LocalizeStringEvent descriptionLocalized;

/// <summary>
/// 보상 설명 로컬라이제이션 이벤트
/// </summary>
[SerializeField]
private LocalizeStringEvent rewardDescriptionLocalized;
```

### 속성

```csharp
/// <summary>
/// 업적의 고유 식별자
/// </summary>
public string AchievementID { get; private set; }
```

### 내부 필드

```csharp
/// <summary>
/// 현재 달성 횟수
/// </summary>
private int _currentSuccess;

/// <summary>
/// 필요한 달성 횟수
/// </summary>
private int _needSuccess;

/// <summary>
/// 완료 여부
/// </summary>
private bool _isComplete;

/// <summary>
/// 로컬라이제이션 테이블 키
/// </summary>
private const string AchievementLocalizeTableKey = "AchievementStringTable";
```

### 메서드

```csharp
/// <summary>
/// 업적 정보 초기화
/// </summary>
/// <param name="info">업적 정보</param>
public void InitializeAchievementInfo(Reward.Achievement info)

/// <summary>
/// 로컬라이제이션 문자열 참조 설정
/// </summary>
private void SetLocalizedStringReference()

/// <summary>
/// 아이템 비교 (정렬용)
/// </summary>
/// <param name="otherItem">비교할 다른 아이템</param>
/// <returns>정렬 결과</returns>
public int CompareTo(AchievementPopupItem otherItem)
```

## 주요 코드 스니펫

### 업적 정보 초기화

```csharp
public void InitializeAchievementInfo(Reward.Achievement info)
{
    achievementDes.text = info.NameKey;
    achievementRewardDes.text = info.Description;

    achievementCompletation.SetActive(info.IsComplete);
    achievementLock.SetActive(!info.IsComplete);

    if (info.IsComplete != _isComplete)
    {
        var randomRot = Random.Range(-randomRange,randomRange);
        achievementCompletation.GetComponent<RectTransform>().rotation = Quaternion.Euler(0f, 0f, randomRot);
    }

    AchievementID = info.Id;
    _currentSuccess = info.CurrentSuccess;
    _needSuccess = info.NeedSuccess;
    _isComplete = info.IsComplete;
    SetLocalizedStringReference();
}
```

### 로컬라이제이션 설정

```csharp
private void SetLocalizedStringReference()
{
    var localizeTableEntryKey = AchievementID.ToLower();
    descriptionLocalized.StringReference.TableReference = AchievementLocalizeTableKey;
    descriptionLocalized.StringReference.TableEntryReference = localizeTableEntryKey + "_desc";
    rewardDescriptionLocalized.StringReference.TableReference = AchievementLocalizeTableKey;
    rewardDescriptionLocalized.StringReference.TableEntryReference = localizeTableEntryKey + "_reward_desc";
    descriptionLocalized.RefreshString();
    rewardDescriptionLocalized.RefreshString();
}
```

### 아이템 비교 로직

```csharp
public int CompareTo(AchievementPopupItem otherItem)
{
    if (_isComplete != otherItem._isComplete)
        return _isComplete ? 1 : -1;
    return String.Compare(AchievementID, otherItem.AchievementID, StringComparison.Ordinal);
}
```

## 기능 설명

### UI 표시 기능

- 업적 이름과 설명 표시
- 보상 정보 표시
- 완료/잠금 상태 시각적 표시
- 완료 시 랜덤 회전 효과 적용

### 로컬라이제이션 시스템

- Unity Localization 패키지 사용
- 다국어 지원 (한국어, 영어 등)
- 로컬라이제이션 테이블 참조
- 동적 문자열 갱신

### 정렬 기능

- `IComparable<AchievementPopupItem>` 인터페이스 구현
- 완료 상태에 따른 우선 정렬
- ID에 따른 보조 정렬
- 업적 목록 정렬에 사용

### 테스트 기능

- 에디터 모드에서만 활성화
- 테스트 버튼을 통한 업적 상태 토글
- 빠른 테스트 및 디버깅 지원

## 의존성/상속 관계

- `MonoBehaviour`를 상속받음 (Unity 컴포넌트)
- `IComparable<AchievementPopupItem>` 인터페이스 구현
- `Reward.Achievement` 클래스에 의존
- Unity Localization 패키지에 의존
- TMP (TextMeshPro) 패키지에 의존

## 사용 예시

### 업적 팝업에서 사용

```csharp
// 업적 팝업에서 아이템 생성 및 초기화
var popupItem = Instantiate(achievementPopupItemPrefab, container);
popupItem.InitializeAchievementInfo(achievement);

// 아이템 정렬
achievementItems.Sort();
```

### 로컬라이제이션 설정

```csharp
// 언어 변경 시 호출
LocalizationSettings.SelectedLocale = Locale.English;
popupItem.SetLocalizedStringReference();
```

## 관련 클래스

- [`Achievement`](/docs/projects/rfice/SlimeRush/AchievementSystem/Achievement): 업적 데이터 모델
- [`AchievementPopup`](/docs/projects/rfice/SlimeRush/AchievementSystem/AchievementPopup): 업적 팝업 관리자
- [`AchievementSystem`](/docs/projects/rfice/SlimeRush/AchievementSystem/AchievementSystem): 업적 시스템 관리자

## 전체 코드

```csharp
using System;
using Reward;
using TMPro;
using UnityEngine;
using UnityEngine.Localization;
using UnityEngine.Localization.Components;
using UnityEngine.Localization.Settings;
using UnityEngine.Localization.Tables;
using UnityEngine.Serialization;
using Button = UnityEngine.UI.Button;
using Random = UnityEngine.Random;

namespace UI.PopupUI.Achievement
{
    public class AchievementPopupItem : MonoBehaviour, IComparable<AchievementPopupItem>
    {
        [SerializeField]
        private TMP_Text achievementDes;

        [SerializeField]
        private TMP_Text achievementRewardDes;

        [SerializeField]
        private GameObject achievementCompletation;

        [SerializeField]
        private GameObject achievementLock;

        [SerializeField, Range(0,180)]
        private float randomRange;

        [SerializeField]
        private LocalizeStringEvent descriptionLocalized;

        [SerializeField]
        private LocalizeStringEvent rewardDescriptionLocalized;

        public string AchievementID { get; private set; }
        private int _currentSuccess;
        private int _needSuccess;
        private bool _isComplete;
        private const string AchievementLocalizeTableKey = "AchievementStringTable";

        public void InitializeAchievementInfo(Reward.Achievement info)
        {
            achievementDes.text = info.NameKey;
            achievementRewardDes.text = info.Description;

            achievementCompletation.SetActive(info.IsComplete);
            achievementLock.SetActive(!info.IsComplete);

            if (info.IsComplete != _isComplete)
            {
                var randomRot = Random.Range(-randomRange,randomRange);
                achievementCompletation.GetComponent<RectTransform>().rotation = Quaternion.Euler(0f, 0f, randomRot);
            }

            AchievementID = info.Id;
            _currentSuccess = info.CurrentSuccess;
            _needSuccess = info.NeedSuccess;
            _isComplete = info.IsComplete;
            SetLocalizedStringReference();
        }

        private void SetLocalizedStringReference()
        {
            var localizeTableEntryKey = AchievementID.ToLower();
            descriptionLocalized.StringReference.TableReference = AchievementLocalizeTableKey;
            descriptionLocalized.StringReference.TableEntryReference = localizeTableEntryKey + "_desc";
            rewardDescriptionLocalized.StringReference.TableReference = AchievementLocalizeTableKey;
            rewardDescriptionLocalized.StringReference.TableEntryReference = localizeTableEntryKey + "_reward_desc";
            descriptionLocalized.RefreshString();
            rewardDescriptionLocalized.RefreshString();
        }

        public int CompareTo(AchievementPopupItem otherItem)
        {
            if (_isComplete != otherItem._isComplete)
                return _isComplete ? 1 : -1;
            return String.Compare(AchievementID, otherItem.AchievementID, StringComparison.Ordinal);
        }

#if UNITY_EDITOR
        #region TestCode
        //Todo - 테스트후 삭제
        [SerializeField]
        private Button testBtn;

        private void Awake()
        {
            testBtn.onClick.AddListener(OnClickTest);
            testBtn.interactable = true;
        }

        private void OnClickTest()
        {
            FindFirstObjectByType<AchievementSystem>().OnChangedAchievementComplete(AchievementID, !_isComplete);
        }
        #endregion
#endif
    }
}
