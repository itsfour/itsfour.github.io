---
title: "AimHub Script"
description: "Script Roblox Aim Universal"
category: "ROBLOX SCRIPT"
date: "2026-11-05"
tags: [SCRIPT, ROBLOX, AIMHUB, ITSFOUR]
---


<!-- HEADER SECTION -->
<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:00aaff,100:0055ff&height=180&section=header&text=AIM%20HUB&fontSize=40&fontColor=ffffff&fontAlignY=35&desc=Universal%20Aimbot%20&%20ESP%20Module%20for%20Roblox&descSize=15&descAlignY=60" width="100%"/>
    <br>

  ![Release](https://img.shields.io/badge/Release-v3.0-00aaff?style=for-the-badge&logo=github)
  ![Roblox](https://img.shields.io/badge/Roblox-Script-00A2FF?style=for-the-badge&logo=roblox&logoColor=white)
  [![License](https://img.shields.io/badge/License-check%20LICENSE-blue?style=for-the-badge)](LICENSE)
  ![Lua](https://img.shields.io/badge/Language-Lua-000080?style=for-the-badge&logo=lua&logoColor=white)
</div>

<div align="center">
<img src="https://github.com/itsfour/itsfour/blob/main/generated/itsfour.svg" width="250"  alt="itsfour animated name">

· **`UI CONFIG`** **`Aimbot`** **`Triggerbot`** **`FOV`** **`TRACERS`** **`ESP`** **`DOT`** **`other features`** ·
<br>· *This project is currently in beta testing. Feel free to create pull requests (you will be credited), report issues, or contact me through any of my linked platforms.*

---
**⚙️Language**
<details><summary><a id="tieng-viet"></a> <img src="https://flagcdn.com/w40/vn.png" width="20" alt="Vietnam flag"/> Tiếng Việt</summary>

## ✨ Tính năng

### 🎯 Aimbot
 Bật/tắt Aimbot và chọn bộ phận khóa mục tiêu: `Head`, `HumanoidRootPart` hoặc `Torso`.
 Tùy chọn kiểm tra team, trạng thái còn sống và vật cản.
 Điều chỉnh độ mượt khi khóa mục tiêu và độ nhạy điều khiển chuột.
 Tùy chọn bù hướng di chuyển (`OffsetToMoveDirection`) và điều chỉnh mức bù.
 Hỗ trợ các chế độ điều khiển camera/chuột được triển khai trong mã nguồn.

### 🔫 Triggerbot
 Bật/tắt Triggerbot.
 Tùy chọn kiểm tra team, trạng thái còn sống và chỉ kích hoạt khi đã khóa mục tiêu.
 Điều chỉnh độ trễ trước khi kích hoạt.
 Cần executor hỗ trợ các hàm mô phỏng chuột tương ứng; nếu thiếu, Triggerbot có thể không hoạt động.

### 👁️ Visuals: FOV, Tracer và ESP
 **FOV:** bật/tắt vòng FOV, điều chỉnh bán kính và màu sắc.
 **Tracer:** hiển thị đường đến mục tiêu gần nhất, tùy chỉnh màu và vị trí xuất phát.
 **ESP:** tùy chọn chấm trên đầu, tên hiển thị, khoảng cách, kích thước chữ và màu sắc.
 Tùy chọn lọc đồng đội cho ESP.

### 🎨 Giao diện và tiện ích
 Giao diện Glass UI có thể kéo thả.
 Nhấn **RightShift** để ẩn/hiện menu.
 Nút **EN/VN** chuyển đổi ngôn ngữ ngay trong GUI.
 Tự lưu một số thiết lập vào `itsfour_auto_config.json` nếu executor hỗ trợ các hàm đọc/ghi file.
 Các thiết lập được lưu không bao gồm mọi thuộc tính giao diện; một số thay đổi có thể không được khôi phục.

## 🚀 Cài đặt / Khởi chạy

Trước hết, để triển khai mô-đun trong môi trường kịch bản của bạn, bạn phải sử dụng hàm loadstring như sau:

```lua
loadstring(game:HttpGet("https://raw.githubusercontent.com/itsfour/AimHub/main/scr/Aimbot.lua"))()
```


## ⌨️ Điều khiển mặc định

| Phím / mục | Tác dụng |
|---|---|
| `RightShift` | Ẩn/hiện giao diện |
| Chuột phải (`MouseButton2`) | Phím kích hoạt mặc định của Aimbot |
| Nút `EN` / `VN` | Đổi ngôn ngữ giao diện |

Aimbot mặc định dùng chế độ giữ phím (`Toggle = false`). Các thiết lập có thể được thay đổi trong bảng cấu hình của script; không phải mọi tùy chọn đều có nút riêng trong GUI.

## ⚙️ Yêu cầu môi trường

Khả năng hoạt động phụ thuộc vào executor và API mà môi trường đó cung cấp. Mã nguồn sử dụng hoặc tùy chọn sử dụng một số API sau:

 `Drawing.new` để vẽ FOV, Tracer và thành phần ESP.
 `getgenv` để lưu bảng cấu hình trong môi trường thực thi.
 `getrawmetatable` cùng các hàm thao tác thuộc tính tương ứng.
 `mousemoverel` hoặc `Input.MouseMove` cho một chế độ điều khiển chuột.
 `mousemoveabs` cho chế độ di chuyển chuột tuyệt đối (nếu có).
 `mouse1press`, `mouse1release`, `mouse1click` cho Triggerbot.
 `readfile`, `writefile`, `isfile` để lưu/đọc cấu hình (tùy chọn).

Nếu executor thiếu API cần thiết, một số tính năng có thể không chạy hoặc script có thể gặp lỗi. Khả năng tương thích chưa được xác nhận trên mọi executor.

## 💾 Tệp cấu hình

Khi executor hỗ trợ thao tác file, script lưu cấu hình tại:

```text
itsfour_auto_config.json
```

Cấu hình có thể bao gồm các nhóm Aimbot, Triggerbot, Tracer, ESP, một phần thiết lập FOV và ngôn ngữ. Nên sao lưu hoặc xóa tệp này nếu cấu hình cũ gây ra hành vi không mong muốn.

## 🐛 Báo lỗi và đóng góp

Nếu gặp lỗi, hãy gửi:
 Tên executor và nền tảng đang sử dụng.
 Thông báo lỗi đầy đủ.
 Các bước tái hiện lỗi.
 Tính năng và thiết lập đang bật khi lỗi xảy ra.

Chỉ gửi thông tin cần thiết; không đính kèm cookie, token hoặc dữ liệu tài khoản cá nhân.

</details>
<details> <summary> <a id="english"></a> <img src="https://flagcdn.com/w40/gb.png" width="20" alt="UK flag"/> English</summary>

## 📖 Introduction

**ITSFOUR HUB** is a Lua script for Roblox developed by **itsfour**. It provides a configurable interface for Aimbot, Triggerbot, and visual features such as FOV, Tracer, and ESP.

> **Scope note:** In the current source, ESP iterates through Roblox's `Players` list. NPC support should not be advertised until NPC functionality is actually implemented and tested.

## ✨ Features

### 🎯 Aimbot
 Enable or disable Aimbot and choose a target part: `Head`, `HumanoidRootPart`, or `Torso`.
 Optional team, alive-state, and visibility/wall checks.
 Adjust target-lock smoothing and mouse-control sensitivity.
 Optional movement-direction offset with an adjustable offset amount.
 Supports the camera/mouse control modes implemented in the source.

### 🔫 Triggerbot
 Enable or disable Triggerbot.
 Optional team check, alive check, and aim-locked-only condition.
 Configurable activation delay.
 Requires an executor that supports the relevant mouse simulation functions; without them, Triggerbot may not work.

### 👁️ Visuals: FOV, Tracer, and ESP
 **FOV:** enable/disable the FOV circle and adjust its radius and color.
 **Tracer:** draw a line to the closest target and customize its color and origin.
 **ESP:** configure head dots, display names, distances, text sizes, and colors.
 Optional teammate filtering for ESP.

### 🎨 Interface and utilities
 Draggable Glass UI.
 Press **RightShift** to show or hide the menu.
 The **EN/VN** button switches the interface language in-place.
 Saves some settings to `itsfour_auto_config.json` if the executor supports file read/write APIs.
 Not every interface property is persisted, so some changes may not be restored.

## 🚀 Setup / Launch

First of all, to implement the module in your script's environment you must use the function loadstring like below:

```lua
loadstring(game:HttpGet("https://raw.githubusercontent.com/itsfour/AimHub/main/scr/Aimbot.lua"))()
```


## ⌨️ Default controls

| Key / control | Action |
|---|---|
| `RightShift` | Show/hide the interface |
| Right mouse button (`MouseButton2`) | Default Aimbot activation input |
| `EN` / `VN` button | Switch interface language |

Aimbot uses hold-to-activate by default (`Toggle = false`). Settings can be changed in the script's configuration table; not every option has a dedicated GUI control.

## ⚙️ Environment requirements

Compatibility depends on the executor and the APIs it provides. The source uses or optionally uses APIs including:

- `Drawing.new` for the FOV, Tracer, and ESP drawings.
- `getgenv` for storing configuration in the execution environment.
- `getrawmetatable` and corresponding property access helpers.
- `mousemoverel` or `Input.MouseMove` for one mouse-control mode.
- `mousemoveabs` for absolute mouse movement, if available.
- `mouse1press`, `mouse1release`, and `mouse1click` for Triggerbot.
- `readfile`, `writefile`, and `isfile` for optional configuration persistence.

If required APIs are unavailable, some features may not work or the script may error. Compatibility has not been verified for every executor.

## 💾 Configuration file

When file APIs are available, the script saves configuration to:

```text
itsfour_auto_config.json
```

Saved data may include Aimbot, Triggerbot, Tracer, ESP, some FOV settings, and the selected language. Back up or remove this file if an old configuration causes unexpected behavior.

## 🐛 Issues and contributions

When reporting a problem, include:
- Executor name and platform.
- The full error message.
- Steps to reproduce the issue.
- The feature and settings enabled when the issue occurred.

Share only relevant diagnostic information. Do not attach cookies, tokens, or personal account data.
　</details>
 
---

**Developer:** [itsfour](https://github.com/itsfour)

Copyright © 2026 itsfour. All rights reserved.

See the repository's [`LICENSE`](LICENSE) file for the applicable terms. Avoid claiming both MIT and CC0 unless the repository clearly defines its official licensing.

