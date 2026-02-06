+++
title = "AchievementPopupItem"
description = "업적 팝업창에서 개별 업적 정보를 UI로 표시하는 컴포넌트"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 201
+++
## 개요
`AchievementPopupItem` 클래스는 SlimeRush 게임의 업적 시스템에서 개별 업적 정보를 UI로 표시하는 컴포넌트입니다.
이 클래스는 업적 팝업 창에서 개별 업적을 나타내며, 업적의 이름, 설명, 보상(해금요소), 완료 상태 등을 시각적으로 표시합니다.
또한 로컬라이제이션 기능을 통해 다국어 지원을 제공하며, 업적 아이템 간의 정렬 기능을 구현합니다.

## 역할
- 개별 업적 아이템 UI 관리
- 업적 정보 표시 및 시각적 피드백 제공
- 다국어 로컬라이제이션 지원
- 아이템 정렬 기능을 위한 비교 로직 제공
- 완료 상태에 따른 시각적 효과 적용

## 선언
```csharp
public class AchievementPopupItem : MonoBehaviour, IComparable<AchievementPopupItem>
```

## 멤버
### 속성
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

/// <summary>
/// 업적의 고유 식별자
/// </summary>
public string AchievementID { get; private set; }

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
/// 업적 정보를 초기화합니다.
/// </summary>
/// <param name="info">초기화할 업적 정보</param>
public void InitializeAchievementInfo(Reward.Achievement info)

/// <summary>
/// 로컬라이제이션 문자열 참조를 설정합니다.
/// 업적 ID를 기반으로 로컬라이제이션 테이블에서 적절한 문자열을 로드합니다.
/// </summary>
private void SetLocalizedStringReference()

/// <summary>
/// 다른 업적 항목과 비교합니다.
/// 완료된 업적은 미완료 업적보다 뒤에 정렬되며, 같은 상태의 업적은 ID 순으로 정렬됩니다.
/// </summary>
/// <param name="otherItem">비교할 다른 업적 항목</param>
/// <returns>정렬 순서</returns>
public int CompareTo(AchievementPopupItem otherItem)
```

## 주요 코드 스니펫
### 업적 정보 초기화
```csharp
public void InitializeAchievementInfo(Reward.Achievement info)
{
    // 업적 이름 키를 설정합니다
    achievementDes.text = info.NameKey;
    // 업적 설명을 설정합니다
    achievementRewardDes.text = info.Description;
    // 완료 표시 오브젝트를 활성화/비활성화합니다
    achievementCompletation.SetActive(info.IsComplete);
    // 잠금 표시 오브젝트를 활성화/비활성화합니다 (완료 상태의 반대)
    achievementLock.SetActive(!info.IsComplete);

    // 완료 상태가 변경되었을 때 애니메이션 효과를 적용합니다
    if (info.IsComplete != _isComplete)
    {
        // 랜덤한 회전 값을 생성합니다
        var randomRot = Random.Range(-randomRange,randomRange);
        // 완료 표시 오브젝트의 회전을 설정합니다
        achievementCompletation.GetComponent<RectTransform>().rotation = Quaternion.Euler(0f, 0f, randomRot);
    }

    // 업적 정보를 내부 변수에 저장합니다
    AchievementID = info.Id;
    _currentSuccess = info.CurrentSuccess;
    _needSuccess = info.NeedSuccess;
    _isComplete = info.IsComplete;
    
    // 로컬라이제이션 문자열을 설정합니다
    SetLocalizedStringReference();
}
```

### 로컬라이제이션 설정

```csharp
private void SetLocalizedStringReference()
{
    // 로컬라이제이션 테이블 엔트리 키를 생성합니다 (소문자로 변환)
    var localizeTableEntryKey = AchievementID.ToLower();
    
    // 설명 텍스트의 로컬라이제이션 테이블/엔트리 참조를 설정합니다
    descriptionLocalized.StringReference.TableReference = AchievementLocalizeTableKey;
    descriptionLocalized.StringReference.TableEntryReference = localizeTableEntryKey + "_desc";
    
    // 보상 설명 텍스트의 로컬라이제이션 테이블/엔트리 참조를 설정합니다
    rewardDescriptionLocalized.StringReference.TableReference = AchievementLocalizeTableKey;
    rewardDescriptionLocalized.StringReference.TableEntryReference = localizeTableEntryKey + "_reward_desc";
    
    // 설명/보상 텍스트를 새로고침하여 로컬라이제이션을 적용합니다
    descriptionLocalized.RefreshString();
    rewardDescriptionLocalized.RefreshString();
}
```

### 아이템 비교 로직
```csharp
public int CompareTo(AchievementPopupItem otherItem)
{
    // 완료 상태가 다르면 완료된 업적이 뒤에 오도록 정렬합니다
    if (_isComplete != otherItem._isComplete)
        return _isComplete ? 1 : -1;
    // 완료 상태가 같으면 ID 순으로 정렬합니다
    return String.Compare(AchievementID, otherItem.AchievementID, StringComparison.Ordinal);
}
```

## 기능 설명
### UI 표시 기능
- 업적 이름과 설명 표시
- 보상 정보 표시(해금요소)
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

## 의존성/상속 관계
- `MonoBehaviour`를 상속받음
- `IComparable<AchievementPopupItem>` 인터페이스 구현
- [`Achievement`](/docs/projects/SlimeRush/AchievementSystem/Achievement) 클래스에 의존
- [`Unity Localization`](https://docs.unity3d.com/Packages/com.unity.localization@1.5/manual/index.html) 패키지에 의존
- [`TMP (TextMeshPro)`](https://docs.unity3d.com/Packages/com.unity.textmeshpro@4.0/manual/index.html) 패키지에 의존

## 사용 예시
#### [`AchievementPopup`](/docs/projects/SlimeRush/AchievementSystem/AchievementPopup)에서 개별 업적 아이템들의 초기화 명령
```csharp
private void CreateAchievementList()
{
    // 업적 시스템에서 모든 업적 정보를 가져옵니다
    var allAchievements = _achievementSystem.Achievements;
    // 컨텐츠 컨테이너의 크기를 업적 개수에 맞게 조정합니다
    UpdateContentsContextRect(allAchievements.Count);

    // 모든 업적 정보를 순회하며 UI를 업데이트합니다
    foreach (var achievement in allAchievements)
    {
        // 이미 존재하는 업적 항목을 찾습니다
        var matchedItem = _achievementPopupItems.FirstOrDefault(item => item.AchievementID == achievement.Id);
        if (matchedItem != null)
        {
            // 기존 항목이 있으면 정보만 업데이트합니다
            matchedItem.InitializeAchievementInfo(achievement);
        }
        else
        {
            // 새로운 항목을 생성합니다
            var item = Instantiate(_achievementItem, _itemListContext.transform);
            var achievementItem = item.GetComponent<AchievementPopupItem>();
            achievementItem.InitializeAchievementInfo(achievement);
            // 새로 생성된 항목을 목록에 추가합니다
            _achievementPopupItems.Add(achievementItem);
        }
    }

    // 업적 목록을 정렬합니다
    SortAchievementList();
}
```

## 관련 클래스
- [`Achievement`](/docs/projects/SlimeRush/AchievementSystem/Achievement)
- [`AchievementPopup`](/docs/projects/SlimeRush/AchievementSystem/AchievementPopup)
- [`AchievementSystem`](/docs/projects/SlimeRush/AchievementSystem/AchievementSystem)