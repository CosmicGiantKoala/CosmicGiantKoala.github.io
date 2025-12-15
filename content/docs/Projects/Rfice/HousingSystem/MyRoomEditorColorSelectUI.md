+++
title = "MyRoomEditorColorSelectUI"
description = "색상 선택 UI를 처리하는 클래스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 430
+++
#### **(본 문서는 AI로 작성된 프로토타입 문서입니다.)**
## 개요

`MyRoomEditorColorSelectUI`는 색상 선택 UI를 처리하는 클래스입니다. 사용할 수 있는 색상 옵션을 표시하고 선택 이벤트 처리합니다.

## 주요 메서드

```csharp
public void OnDrawColorList(List<MyRoomPropColor> colorList, int currentColorIndex)
```

색상 리스트를 받아 UI에 표시하고 현재 선택된 색상을 하이라이트합니다.
