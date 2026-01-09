+++
title = "IScreenProp"
description = "실시간 파일 공유 모듈 정의"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 425
+++
## 개요

`IScreenProp`는 실시간 파일 공유 모듈을 정의하는 인터페이스.

실시간 파일 공유 기능이 있는 스크린 오브젝트를 위한 마커 인터페이스.

## 상속 관계 및 구현체

- [`IInteractableProp`](/docs/projects/rfice/housingsystem/iinteractableprop/)를 확장
- [`SpawnableScreenProp`](/docs/projects/rfice/housingsystem/spawnablescreenprop/): 실시간 파일 공유가 가능한 스크린 오브젝트들에서 구현
