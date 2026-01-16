# AchievementPopup

## 개요

`AchievementPopup` 클래스는 SlimeRush 게임의 업적 시스템에서 업적 팝업 UI를 관리하는 컴포넌트입니다. 이 클래스는 업적 목록을 표시하고, 업적 상태 변경 시 자동으로 UI를 업데이트하며, 업적 아이템의 정렬 및 레이아웃 관리를 담당합니다. 플레이어의 업적 진행 상황을 시각적으로 표시하여 게임 내 성취도를 확인할 수 있도록 합니다.

## 역할

- 업적 목록 UI 관리
- 업적 아이템 생성 및 초기화
- 업적 상태 변경 감지 및 UI 업데이트
- 업적 아이템 정렬
- 레이아웃 동적 조정

## 멤버

### 의존성 주입

```csharp
/// <summary>
/// 업적 시스템 (의존성 주입)
/// </summary>
[Inject]
private AchievementSystem _achievementSystem;
```

### 직렬화 필드

```csharp
/// <summary>
/// 아이템 목록 컨텍스트
/// </summary>
[SerializeField]
private GameObject _itemListContext;

/// <summary>
/// 업적 아이템 프리팹
/// </summary>
[SerializeField]
private GameObject _achievementItem;
```

### 내부 필드

```csharp
/// <summary>
/// 업적 팝업 아이템 목록
/// </summary>
private readonly List<AchievementPopupItem> _achievementPopupItems = new List<AchievementPopupItem>();
```

### 메서드

```csharp
/// <summary>
/// 팝업 활성화 시 호출 (Unity OnEnable)
/// </summary>
private void OnEnable()

/// <summary>
/// 팝업 비활성화 시 호출 (Unity OnDisable)
/// </summary>
private void OnDisable()

/// <summary>
/// 업적 목록 생성
/// </summary>
private void CreateAchievementList()

/// <summary>
/// 업적 목록 정렬
/// </summary>
private void SortAchievementList()

/// <summary>
/// 컨텐츠 영역 크기 업데이트
/// </summary>
/// <param name="count">업적 개수</param>
private void UpdateContentsContextRect(int count)
```

## 주요 코드 스니펫

### 이벤트 구독 관리

```csharp
private void OnEnable()
{
    CreateAchievementList();
    _achievementSystem.OnChangedAchievementState += CreateAchievementList;
}

private void OnDisable()
{
    _achievementSystem.OnChangedAchievementState -= CreateAchievementList;
}
```

### 업적 목록 생성

```csharp
private void CreateAchievementList()
{
    var allAchievements = _achievementSystem.Achievements;
    UpdateContentsContextRect(allAchievements.Count);

    foreach (var achievement in allAchievements)
    {
        var matchedItem = _achievementPopupItems.FirstOrDefault(item => item.AchievementID == achievement.Id);
        if (matchedItem != null)
        {
            matchedItem.InitializeAchievementInfo(achievement);
        }
        else
        {
            var item = Instantiate(_achievementItem, _itemListContext.transform);
            var achievementItem = item.GetComponent<AchievementPopupItem>();
            achievementItem.InitializeAchievementInfo(achievement);
            _achievementPopupItems.Add(achievementItem);
        }
    }

    SortAchievementList();
}
```

### 업적 목록 정렬

```csharp
private void SortAchievementList()
{
    _achievementPopupItems.Sort((a,b)=> a.CompareTo(b));

    for (int i = 0; i < _achievementPopupItems.Count; i++)
    {
        _achievementPopupItems[i].transform.SetSiblingIndex(i);
    }
}
```

### 레이아웃 동적 조정

```csharp
private void UpdateContentsContextRect(int count)
{
    if (count <= 0) return;
    var spacing = _itemListContext.GetComponent<HorizontalOrVerticalLayoutGroup>().spacing;
    var itemHeight = _achievementItem.GetComponent<RectTransform>().rect.height;
    var contextRectTrans = _itemListContext.GetComponent<RectTransform>();

    var calculatedHeight = (itemHeight * count) + (spacing * (count));
    var changedScale = new Vector2(contextRectTrans.sizeDelta.x, calculatedHeight);

    contextRectTrans.sizeDelta = changedScale;
}
```

## 기능 설명

### 업적 목록 관리

- 업적 시스템에서 업적 목록 가져오기
- 아이템 생성 및 초기화
- 기존 아이템 업데이트

### 이벤트 기반 업데이트

- 업적 상태 변경 이벤트 구독
- 자동 UI 갱신
- 실시간 업적 진행 상황 반영

### 동적 레이아웃 관리

- 아이템 개수에 따른 높이 계산
- 레이아웃 그룹 설정 반영
- 스크롤 영역 동적 조정

### 정렬 기능

- 완료 상태에 따른 우선 정렬
- ID에 따른 보조 정렬
- 시각적 순서 조정

## 의존성/상속 관계

- `MonoBehaviour`를 상속받음 (Unity 컴포넌트)
- `AchievementSystem` 클래스에 의존 (의존성 주입)
- `AchievementPopupItem` 클래스에 의존
- `Zenject` DI 프레임워크 사용
- `UnityEngine.UI` 네임스페이스 사용

## 사용 예시

### 팝업 표시

```csharp
// 팝업 활성화
achievementPopup.SetActive(true);

// 자동으로 업적 목록 생성 및 표시
```

### 업적 상태 변경 시 자동 업데이트

```csharp
// 업적 시스템에서 상태 변경 시
_achievementSystem.OnChangedAchievementState?.Invoke();

// 팝업이 활성화되어 있으면 자동으로 UI 업데이트
```

## 관련 클래스

- [`AchievementSystem`](/docs/projects/rfice/SlimeRush/AchievementSystem/AchievementSystem): 업적 시스템 관리자
- [`AchievementPopupItem`](/docs/projects/rfice/SlimeRush/AchievementSystem/AchievementPopupItem): 업적 아이템 UI
- [`Achievement`](/docs/projects/rfice/SlimeRush/AchievementSystem/Achievement): 업적 데이터 모델

## 전체 코드

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using Reward;
using Common;
using UnityEngine;
using UnityEngine.UI;
using Zenject;

namespace UI.PopupUI.Achievement
{
    public class AchievementPopup : MonoBehaviour
    {
        [Inject]
        private AchievementSystem _achievementSystem;

        [SerializeField]
        private GameObject _itemListContext;

        [SerializeField]
        private GameObject _achievementItem;

        private readonly List<AchievementPopupItem> _achievementPopupItems = new List<AchievementPopupItem>();

        private void OnEnable()
        {
            CreateAchievementList();
            _achievementSystem.OnChangedAchievementState += CreateAchievementList;
        }

        private void OnDisable()
        {
            _achievementSystem.OnChangedAchievementState -= CreateAchievementList;
        }

        private void CreateAchievementList()
        {
            var allAchievements = _achievementSystem.Achievements;
            UpdateContentsContextRect(allAchievements.Count);

            foreach (var achievement in allAchievements)
            {
                var matchedItem = _achievementPopupItems.FirstOrDefault(item => item.AchievementID == achievement.Id);
                if (matchedItem != null)
                {
                    matchedItem.InitializeAchievementInfo(achievement);
                }
                else
                {
                    var item = Instantiate(_achievementItem, _itemListContext.transform);
                    var achievementItem = item.GetComponent<AchievementPopupItem>();
                    achievementItem.InitializeAchievementInfo(achievement);
                    _achievementPopupItems.Add(achievementItem);
                }
            }

            SortAchievementList();
        }

        private void SortAchievementList()
        {
            _achievementPopupItems.Sort((a,b)=> a.CompareTo(b));

            for (int i = 0; i < _achievementPopupItems.Count; i++)
            {
                _achievementPopupItems[i].transform.SetSiblingIndex(i);
            }
        }

        private void UpdateContentsContextRect(int count)
        {
            if (count <= 0) return;
            var spacing = _itemListContext.GetComponent<HorizontalOrVerticalLayoutGroup>().spacing;
            var itemHeight = _achievementItem.GetComponent<RectTransform>().rect.height;
            var contextRectTrans = _itemListContext.GetComponent<RectTransform>();

            var calculatedHeight = (itemHeight * count) + (spacing * (count));
            var changedScale = new Vector2(contextRectTrans.sizeDelta.x, calculatedHeight);

            contextRectTrans.sizeDelta = changedScale;
        }

    }
}
