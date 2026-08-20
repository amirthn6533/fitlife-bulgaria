# 📱 راهنمای جامع انتشار FitLife Bulgaria در App Store (iOS)

این راهنما مراحل خروجی گرفتن و انتشار اپلیکیشن در **App Store Connect** و **TestFlight** را به زبان ساده توضیح می‌دهد.

---

## 🛠️ پیش‌نیازها
1. یک سیستم دارای **macOS** (یا سرویس ابری مک مثل MacInCloud / GitHub Actions)
2. برنامه **Xcode** (قابل دانلود رایگان از Mac App Store)
3. حساب **Apple Developer** (برای انتشار عمومی در App Store)

---

## 🚀 مراحل ساخت خروجی iOS (۳ دستور ساده)

روی مک یا هر سیستمی که Node.js دارد، داخل پوشه پروژه این دستورات را در ترمینال اجرا کنید:

### ۱. نصب پکیج‌های پل ارتباطی iOS:
```bash
npm install
```

### ۲. ساخت پروژه Xcode به صورت خودکار:
```bash
npx cap add ios
```

### ۳. همگام‌سازی و باز کردن در Xcode:
```bash
npx cap sync ios
npx cap open ios
```

با اجرای دستور سوم، برنامه **Xcode** باز می‌شود و پروژه کامل iOS شما را نمایش می‌دهد!

---

## 🔐 دسترسی‌های لازم در `Info.plist` (Permissions)

در داخل Xcode، دسترسی‌های زیر برای تایید اپل از قبل آماده شده‌اند:

```xml
<key>NSCameraUsageDescription</key>
<string>FitLife uses your camera to scan food plates and analyze nutrition with AI.</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>FitLife allows you to pick photos for your profile and social posts.</string>

<key>NSHealthShareUsageDescription</key>
<string>FitLife syncs your daily step count and heart rate with Apple HealthKit.</string>

<key>NSLocationWhenInUseUsageDescription</key>
<string>FitLife tracks your running routes and discovers nearby gyms in Sofia.</string>
```

---

## 📤 انتشار در TestFlight و App Store

1. در Xcode از منوی بالا دستگاه را روی **Any iOS Device (arm64)** بگذارید.
2. از منوی **Product** گزینه **Archive** را بزنید.
3. پس از پایان ساخت، پنجره **Organizer** باز می‌شود. روی دکمه آبی **Distribute App** کلیک کنید.
4. گزینه **App Store Connect** را انتخاب کنید و **Upload** را بزنید.
5. اپلیکیشن شما ظرف چند دقیقه در پنل **App Store Connect** و بخش **TestFlight** آماده تست و انتشار نهایی خواهد بود! 🎉
